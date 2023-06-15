import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { SwipeListView } from 'react-native-swipe-list-view';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import TopNavBar from '../../components/TopNavBar'
import NavImage from '../../components/NavImage'
import ShippingAddressCell from '../../components/Cells/ShippingAddressCell'
import LabelFormInput from '../../components/LabelFormInput'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status, generatedMapStyle } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import RoundButton from '../../components/RoundButton';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'
import Messages from '../../theme/Messages'

class ShippingAddressScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isEdit: false,
      list: [],
      isShowAddPage: false,
      keyword: '',
      location: '',
      lat: 0,
      lng: 0,
      zipcode: '',
      apt: '',
      selectedAddress: null,
    }
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser.shippingAddresses && currentUser.shippingAddresses.length > 0) {
      this.setState({list: currentUser.shippingAddresses});
    }

    if (this.props.route.params && this.props.route.params.isEdit) {
      const { isEdit } = this.props.route.params;
      this.setState({isEdit});    
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Get GeoData
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        const { geoData } = this.props;
        this.setState({
          isLoading: false,
          lat: geoData.lat,
          lng: geoData.lng,
          zipcode: geoData.zipcode,
          isShowAddPage: true
        });
      } 
      else if (this.props.getGeoDataStatus == Status.FAILURE) {
          this.onFailure(this.props.errorGlobalMessage);
      }      
    }

    // Add Shipping Address
    if (prevProps.addShippingAddressStatus != this.props.addShippingAddressStatus) {
      if (this.props.addShippingAddressStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.hideAddPage();
        this.fetchAddresses(true);
      } 
      else if (this.props.addShippingAddressStatus == Status.FAILURE) {
          this.onFailure(this.props.errorUserMessage);
      }      
    }

    // Edit Shipping Address.
    if (prevProps.editShippingAddressStatus != this.props.editShippingAddressStatus) {
      if (this.props.editShippingAddressStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.hideAddPage();
        this.fetchAddresses(false);
      } 
      else if (this.props.editShippingAddressStatus == Status.FAILURE) {
          this.onFailure(this.props.errorUserMessage);
      }      
    }

    // Remove Shipping Address.
    if (prevProps.removeShippingAddressStatus != this.props.removeShippingAddressStatus) {
      if (this.props.removeShippingAddressStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.fetchAddresses(false);
        const { isEdit } = this.state;
        if (isEdit) {
          if (this.props.route.params && this.props.route.params.onSelectAddress) {
            const { onSelectAddress } = this.props.route.params;
            if (onSelectAddress) {
              onSelectAddress(null);
            }
          }
        }
      } 
      else if (this.props.removeShippingAddressStatus == Status.FAILURE) {
          this.onFailure(this.props.errorUserMessage);
      }      
    }

    // Change Active Shipping Address.
    if (prevProps.changeActiveShippingAddressStatus != this.props.changeActiveShippingAddressStatus) {
      if (this.props.changeActiveShippingAddressStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.fetchAddresses(false);
      } 
      else if (this.props.changeActiveShippingAddressStatus == Status.FAILURE) {
          this.onFailure(this.props.errorUserMessage);
      }      
    }
    
  }

  fetchAddresses(isSelect) {
    const { currentUser } = this.props;
    var list = [];
    if (currentUser.shippingAddresses) {
      list = [...currentUser.shippingAddresses];
    }    
    this.setState({list: list});

    if (isSelect) {
      if (this.props.route.params && this.props.route.params.onSelectAddress && list.length > 0) {
        const { onSelectAddress } = this.props.route.params;
        onSelectAddress(list[0]);
      }
    }
  }

  onFailure(message) {
    this.setState({isLoading: false});
    if (message && message.length > 0) {
      this.toast.show(message, TOAST_SHOW_TIME);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }    
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onChangeLocation(address) {
    this.setState({
      isLoading: true, 
      location: address, 
    }, () => {
      this.props.dispatch({
          type: actionTypes.GET_GEODATA,
          address: address,
      })
    });
  }

  onTrash(id) {
    const { currentUser } = this.props;
    this.setState({isLoading: true}, () => {
      this.props.dispatch({
        type: actionTypes.REMOVE_SHIPPING_ADDRESS,
        user_id: currentUser._id,
        id: id,
      });
    });
  }

  addNewAddress() {
    const { currentUser } = this.props;
    const { selectedAddress, apt, lat, lng, zipcode, location } = this.state;
    this.setState({isLoading: true}, () => {
      if (selectedAddress) {
        this.props.dispatch({
          type: actionTypes.EDIT_SHIPPING_ADDRESS,
          user_id: currentUser._id,
          id: selectedAddress._id,
          address: location,
          apt: apt,
          zipcode: zipcode,
          lat: lat,
          lng: lng
        });
      } 
      else {
        this.props.dispatch({
          type: actionTypes.ADD_SHIPPING_ADDRESS,
          user_id: currentUser._id,
          address: location,
          apt: apt,
          zipcode: zipcode,
          lat: lat,
          lng: lng
        });
      }
    });
  }

  hideAddPage() {
    this.setState({
      isShowAddPage: false,
      selectedAddress: null,
      location: '',
      apt: '',
      zipcode: '',
      lat: 0,
      lng: 0,
    });
  }

  onChangeActive(item) {
    const { isEdit } = this.state;
    if (isEdit) {
      if (this.props.route.params && this.props.route.params.onSelectAddress) {
        const { onSelectAddress } = this.props.route.params;
        onSelectAddress(item);
        this.onBack();
      }
    }

    const { currentUser } = this.props;
    this.setState({isLoading: true}, () => {
      this.props.dispatch({
        type: actionTypes.CHANGE_ACTIVE_SHIPPING_ADDRESS,
        user_id: currentUser._id,
        id: item._id,
      });
    });
  }

  onEditItem(item) {
    this.setState({
      isShowAddPage: true,
      selectedAddress: item,
      lat: item.lat,
      lng: item.lng,
      location: item.address,
      apt: item.apt,
      zipcode: item.zipcode,
    })
  }

  _renderHeader() {
    const { keyword } = this.state;

    return (
      <View style={styles.header}>
        <LabelFormInput
          type="address"
          placeholder="Search address here..."
          prefixIcon={Images.search_icon}
          returnKeyType="search"
          value={keyword}
          onRefInput={(input) => { this.locationInput = input }}
          onSelectAddress={(address) => this.onChangeLocation(address)}     
          onChangeText={(text) => this.setState({keyword: text})} 
        />
      </View>
    )
  }

  _renderAddPage() {
    const { lat, lng, location, apt, zipcode } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.addPageView}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
          }}
          customMapStyle = { generatedMapStyle }
      >
          <Marker
              coordinate={{
              latitude: lat,
              longitude: lng,
              }}
          /> 
        </MapView>
        <View style={styles.addressBox}>
          <Text style={styles.locationText}>{location}</Text>
          <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
            <Text style={styles.labelText}>Apt/Suite</Text>
            <TextInput 
              placeholder="Apt123"
              placeholderTextColor={Colors.placeholderColor}
              underlineColorAndroid='transparent'
              onChangeText={(text) => this.setState({apt: text})}
              value={apt}
              returnKeyType="next"
              onSubmitEditing={() => this.zipcodeInput.focus()}
              style={styles.aptTextInput}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.labelText}>Zip code</Text>
            <TextInput 
              placeholder="10025"
              placeholderTextColor={Colors.placeholderColor}
              underlineColorAndroid='transparent'
              onChangeText={(text) => this.setState({zipcode: text})}
              value={zipcode}
              returnKeyType="done"
              ref={(input) => { this.zipcodeInput = input }}
              onSubmitEditing={() => this.addNewAddress()}
              style={styles.aptTextInput}
            />
          </View>
        </View>  
        <View style={{paddingHorizontal: 20}}>
          <RoundButton 
            theme="main" 
            title="Save Address"
            onPress={() => this.addNewAddress()}
          />        
          <RoundButton 
            theme="red" 
            title="Cancel"
            onPress={() => this.hideAddPage()}
          />
        </View>
      </View>
      </TouchableWithoutFeedback>
    )
  }

  _renderList() {
    const { list } = this.state;
    return (
      <SwipeListView
        style={styles.listContainer}
        data={list}
        keyExtractor={(item, index) => item._id}
        renderItem={({ item, index }) => 
          <ShippingAddressCell 
            data={item} 
            key={index.toString()} 
            onSelect={(data) => this.onChangeActive(data)}
            onEdit={(data) => this.onEditItem(data)} 
          />
        }
        renderHiddenItem={ (data, rowMap) => (
          <View style={styles.rowBack}>
              <TouchableOpacity style={styles.trashBtn} 
                onPress={ () => {
                  rowMap[data.item._id].closeRow() ;
                  this.onTrash(data.item._id);
                }}
              >
                <Image source={Images.icon_trash_white} style={styles.trashIcon} />
              </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-60}
      />
    )
  }

  render() {
    const { isLoading, isShowAddPage } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage theme="green"/>
        <SafeAreaInsetsContext.Consumer>
        {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                  title="Add Addresses" 
                  leftButton="back" 
                  theme="black" 
                  onBack={() => this.onBack()}
              />
              <View style={styles.container}>
                { this._renderHeader() }
                {
                  isShowAddPage 
                  ? this._renderAddPage()
                  : this._renderList()
                }
              </View>
          </View>
        }
          </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)}/>
        { isLoading && <LoadingOverlay /> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  header: {
    paddingHorizontal: 20,
  },

  addPageView: {
    position: 'absolute',
    width: '100%',
    ...ifIphoneX({
      bottom: -30,
      paddingBottom: 40,
		 }, {
      bottom: 0,
      paddingBottom: 10,
		}),
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    shadowColor: 'black',
		shadowOffset: {
			width: -5,
		},
		shadowOpacity: 0.3,
		shadowRadius: 5,
    elevation: 5,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },

  listContainer: {
    flex: 1,
  },

  map: {
    width: '100%',
    height: 200,
  },

  addressBox: {
    padding: 15,
  },

  locationText: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    marginBottom: 15,
  },

  labelText: {
    fontFamily: Fonts.regular,
    width: '30%',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.8)',
  },

  aptTextInput: {
    fontFamily: Fonts.bold,
    width: '70%',
    fontSize: 14,
    color: 'black',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 40,
  },

  rowBack: {
    width: '100%',
    alignItems: 'flex-end',
  },

  trashBtn: {
    backgroundColor: '#ff0000',
    width: 60,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  trashIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,

    geoData: state.globals.geoData,
    errorGlobalMessage: state.globals.errorMessage,
    getGeoDataStatus: state.globals.getGeoDataStatus,
    
    errorUserMessage: state.user.errorMessage,
    addShippingAddressStatus: state.user.addShippingAddressStatus,
    editShippingAddressStatus: state.user.editShippingAddressStatus,
    removeShippingAddressStatus: state.user.removeShippingAddressStatus,
    changeActiveShippingAddressStatus: state.user.changeActiveShippingAddressStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ShippingAddressScreen);
