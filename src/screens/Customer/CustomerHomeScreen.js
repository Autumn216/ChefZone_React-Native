import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import TopNavBar from '../../components/TopNavBar'
import TopTabBar from '../../components/TopTabBar'
import NavImage from '../../components/NavImage'
import LoadingOverlay from '../../components/LoadingOverlay'
import MealCell from '../../components/Cells/MealCell'
import ChefCell from '../../components/Cells/ChefCell'
import SearchBox from '../../components/SearchBox'
import EmptyView from '../../components/EmptyView'
import * as Storage from '../../services/Storage'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'
import Messages from '../../theme/Messages'

import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

class CustomerHomeScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isFirst: true,
      isShowSearch: false,
      keyword: '',

      meals: [],
      chefs: [],

      currentPage: 0,
      currentLat: 0,
      currentLng: 0,
      currentAddress: '',
    }
  }

  componentWillUnmount(){
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustResize();
    }
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustPan();
    }    
    
    const { lat, lng } = this.props;
    const data = await Storage.SEARCH_ADDRESS.get();
    if (data) {
      this.setState({
        currentLat: data.lat,
        currentLng: data.lng,
        currentAddress: data.address
      }, () => {
        this.fetchNearbyData(data.lat, data.lng);
      });
    }
    else {
      this.setState({
        currentLat: lat,
        currentLng: lng,
      }, () => {
        this.fetchNearbyData(lat, lng);
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Get nearby chefs
    if (prevProps.nearbyChefsStatus != this.props.nearbyChefsStatus) {
      if (this.props.nearbyChefsStatus == Status.SUCCESS) {
        this.setNearbyData();
      } 
      else if (this.props.nearbyChefsStatus == Status.FAILURE) {
        this.onFailure(this.props.errorUserMessage);
      }      
    }

    if (prevProps.nearbyData != this.props.nearbyData) {
      this.setNearbyData();
    }

    // Get GEO Data By address.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        const { geoData } = this.props;
        this.setState({
            currentLat: geoData.lat, 
            currentLng: geoData.lng, 
            currentAddress: this.state.keyword,
            isLoading: false
        }, () => {
          Storage.SEARCH_ADDRESS.set({
            lat: geoData.lat,
            lng: geoData.lng,
            address: this.state.keyword
          });
          this.fetchNearbyData(geoData.lat, geoData.lng);
        });
      } 
      else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
      }      
    }
  }

  setNearbyData() {
    const chefs = this.props.nearbyData.chefs;
    const meals = this.props.nearbyData.meals;

    this.setState({
      isFirst: false,
      isLoading: false,
      chefs,
      meals
    });  
  }
  fetchNearbyData(lat, lng) {
    this.setState({isLoading: true}, () => [
      this.props.dispatch({
        type: actionTypes.NEARBY_CHEFS,
        lat: lat,
        lng: lng,
      })
    ]);
  }

  onFailure(message) {
    this.setState({isLoading: false, isFirst: false});
    if (message && message.length > 0) {
      this.toast.show(message, TOAST_SHOW_TIME);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }    
  }

  onSearch() {
    var { isShowSearch } = this.state;
    this.setState({isShowSearch: !isShowSearch});
  }

  onChangeLocation(address) {
    this.setState({isLoading: true, keyword: address, currentAddress: address}, () => {
        this.props.dispatch({
            type: actionTypes.GET_GEODATA,
            address: address,
        })
    });
  }

  onSelectMeal(data) {
    this.props.navigation.navigate('MealDetail', {meal: data});
  }

  onSelectChef(data) {
    this.props.navigation.navigate('ChefDetail', {chef: data});
  }

  _renderMeals() {
    const { meals, isFirst } = this.state;
    return (
      <View style={{flex: 1}}>
        {
          (meals && meals.length > 0) 
          ? <FlatList
              style={styles.listContainer}
              data={meals}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, i}) => (
                <MealCell 
                  data={item} 
                  key={i} 
                  showAddress={true}
                  onSelect={(data) => this.onSelectMeal(data)} 
                />
              )}
            />
          : !isFirst && <EmptyView title="No meals." />
        }
      </View>
    )
  }

  _renderChefs() {
    const { chefs, isFirst } = this.state;
    return (
      <View style={{flex: 1}}>
        {
          (chefs && chefs.length > 0) 
          ? <FlatList
              style={styles.listContainer}
              data={chefs}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, i}) => (
                <ChefCell 
                  data={item} 
                  key={i} 
                  onSelect={(data) => this.onSelectChef(data)} 
                />
              )}
            />
          : !isFirst && <EmptyView title="No chefs." />
        }
      </View>
    )
  }

  _renderSearchBox() {
    const { keyword } = this.state;
    return (
      <View style={{paddingHorizontal: 15, paddingVertical: 10}}>
        <SearchBox
          style={{marginBottom: 0}}
          placeholder="Search location..." 
          type="address"
          value={keyword}
          autoFocus={true}
          icon={Images.search_icon} 
          returnKeyType="search"
          onChangeText={(text) => this.setState({keyword: text})} 
          onSelectAddress={(address) => this.onChangeLocation(address)}
          onReset={() => this.setState({keyword: ''})}
        />
      </View>
    )
  }

  render() {
    const { isLoading, currentPage, isShowSearch, currentAddress } = this.state;
    var infoText = "";
    if (currentAddress && currentAddress.length > 0) {
      infoText = currentAddress;
    }
    else {
      if (currentPage == 0) {
        infoText = "Nearby Meals";
      } else {
        infoText = "Nearby Chefs";
      }
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage theme="green"/>
        <TopNavBar 
          title="Home" 
          theme="black" 
          rightButton="search"
          onBack={() => this.onBack()}
          onRight={() => this.onSearch()}
        />
        <View style={styles.container}>
          <TopTabBar 
            titles={["Meals", "Chefs"]} 
            currentPage={currentPage} 
            onSelectPage={(index) => this.setState({currentPage: index})} 
            style={{backgroundColor: 'white'}}
          />
          <View style={styles.contentView}>
          { isShowSearch 
            ? this._renderSearchBox() 
            :  <View style={styles.infoBox}>
                <Image source={Images.icon_pin} style={styles.pinIcon} />
                <Text style={styles.infoText}>{infoText}</Text>
              </View>
          }
          {
            (currentPage == 0)
            ? this._renderMeals()
            : this._renderChefs()
          }
          </View>
        </View>
        <Toast ref={ref => (this.toast = ref)}/>
        {
          isLoading && <LoadingOverlay />
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },

  contentView: {
    backgroundColor: Colors.pageColor,
    flex: 1,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  pinIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 5,
  },

  infoText: {
    fontFamily: Fonts.avenirBook,
    color: Colors.textColor,
    fontSize: 14,
  },

  listContainer: {
    paddingHorizontal: 15,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    lat: state.user.lat,
    lng: state.user.lng,

    errorGlobalMessage: state.globals.errorMessage,
    geoData: state.globals.geoData,
    getGeoDataStatus: state.globals.getGeoDataStatus,

    errorUserMessage: state.user.errorMessage,
    nearbyData: state.user.nearbyData,
    nearbyChefsStatus: state.user.nearbyChefsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomerHomeScreen);
