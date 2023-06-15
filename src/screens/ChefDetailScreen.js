import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import FastImage from 'react-native-fast-image'
import LoadingOverlay from '../components/LoadingOverlay'
import MealCell from '../components/Cells/MealCell';
import ReviewCell from '../components/Cells/ReviewCell';
import EmptyView from '../components/EmptyView';
import TopTabBar from '../components/TopTabBar';
import WriteReviewModal from '../components/Modal/WriteReviewModal';
import { TOAST_SHOW_TIME, Status } from '../constants.js'
import { calcDistance } from '../functions'
import actionTypes from '../actions/actionTypes';
import Colors from '../theme/Colors'
import Images from '../theme/Images'
import Fonts from '../theme/Fonts'
import Messages from '../theme/Messages'

const win = Dimensions.get('window');

class ChefDetailScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isWriteDialog: false,
      chef: null,
      currentPage: 0,
      meals: [],
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.chef) {
      const { chef } = this.props.route.params;
      this.setState({ chef });  
      
      this.setState({isLoading: true}, () => [
        this.props.dispatch({
          type: actionTypes.GET_CHEF,
          user_id: chef._id,
        })
      ]);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getChefStatus != this.props.getChefStatus) {
      if (this.props.getChefStatus == Status.SUCCESS) {
        this.setState({isLoading: false, chef: this.props.selectedUser, meals: this.props.selectedMeals});
      } 
      else if (this.props.getChefStatus == Status.FAILURE) {
        this.onFailure(this.props.errorUserMessage);
      }
    }

    // Write Review For user.
    if (prevProps.writeReviewUserStatus != this.props.writeReviewUserStatus) {
      if (this.props.writeReviewUserStatus == Status.SUCCESS) {
        this.setState({isLoading: false, chef: this.props.selectedUser});
      } 
      else if (this.props.writeReviewUserStatus == Status.FAILURE) {
        this.onFailure(this.props.errorUserMessage);
      }
    }
  }

  onBack() {
    this.props.navigation.goBack();
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

  onDirection() {
    const { chef } = this.state;
    const destLat = chef.geolocation.coordinates[1];
    const destLng = chef.geolocation.coordinates[0];
    const { lat, lng } = this.props;
    
    if (Platform.OS == "ios") {
      Linking.openURL(`maps://app?saddr=${lat},${lng}&daddr=${destLat},${destLng}`)
    }
    else if (Platform.OS == "android") {
      const link = `google.navigation:q=${destLat},${destLng}`;
      Linking.canOpenURL(link).then((supported) => {
        if (supported) {
          Linking.openURL(link);
        }
        else {
          Linking.openURL(`https://www.google.com/maps/search/?saddr=${lat},${lng}&daddr=${destLat},${destLng}`)
        }
      }).catch(err => {
        Linking.openURL(`https://www.google.com/maps/search/?saddr=${lat},${lng}&daddr=${destLat},${destLng}`)
      });
    }
    
  }

  onSelectMeal(meal) {
    this.props.navigation.navigate('MealDetail', {meal});
  }
  
  _renderHeader() {
    const { chef } = this.state;
    const avatar = (chef && chef.avatar) ? {uri: chef.avatar} : null;
    return (
      <View style={styles.header}>
        {
          avatar && <FastImage source={avatar} style={{width: '100%', height: '100%', resizeMode: 'cover', backgroundColor: 'lightgray'}} />
        }        
        <TouchableOpacity style={styles.backBtn} onPress={() => this.onBack()}>
          <Image source={Images.back_arrow_white} style={{width: 25, height: 25,}}/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderContentBar() {
    const { chef, meals } = this.state;
    const { lat, lng } = this.props;

    const name = (chef) ? chef.firstName + " " + chef.lastName : "";
    const address = (chef && chef.location) ? chef.location : "";
    const deliveryFee = (chef && chef.deliveryFee) ? chef.deliveryFee : 0;

    const destLat = (chef && chef.geolocation) ? chef.geolocation.coordinates[1] : 0;
    const destLng = (chef && chef.geolocation) ? chef.geolocation.coordinates[0] : 0;
    const distance = calcDistance(lat, lng, destLat, destLng, "N");
    const mealCount = (meals) ? meals.length : 0;
    const reviews = (chef && chef.reviews) ? chef.reviews : [];
    var ratings = 0;
    if (reviews && reviews.length > 0) {
      reviews.forEach(item => {
        ratings += item.score;
      });

      ratings = ratings / reviews.length;
    }
    
    var deliveryText = "Delivery Fee: $" + deliveryFee;
    if (deliveryFee == 0) {
      deliveryText = "Free delivery";
    }
    return (
      <View style={styles.barView}>
        <Text style={styles.nameText}>{name}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center', width: '65%'}}>
            <Image source={Images.icon_pin} style={styles.pinIcon} />
            <Text style={styles.addressText}>{address}</Text>
        </View>
        <Text style={styles.deliveryFeeText}>{deliveryText}</Text>
        <TouchableOpacity style={styles.directionBtn} onPress={() => this.onDirection()}>
            <Image source={Images.icon_direction} style={{width: 30, height: 30}} />
        </TouchableOpacity>
        <View style={styles.infoBar}>
            <View style={styles.infoCell}>
                <Text style={styles.infoValueText}>{ratings.toFixed(1)}</Text>
                <Text style={styles.infoLabelText}>Ratings</Text>
            </View>
            <View style={styles.separatorLine} />
            <View style={styles.infoCell}>
                <Text style={styles.infoValueText}>{distance.toFixed(1)} miles</Text>
                <Text style={styles.infoLabelText}>Distance</Text>
            </View>
            <View style={styles.separatorLine} />
            <View style={styles.infoCell}>
                <Text style={styles.infoValueText}>{mealCount}</Text>
                <Text style={styles.infoLabelText}>Meals</Text>
            </View>
        </View>
      </View>
    )
  }

  _renderMeals() {
    const { meals } = this.state;
    return (
        <View style={styles.pageView}>
          {
            (meals && meals.length > 0)
            ? <FlatList
                style={styles.listContainer}
                data={meals}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={() => (<View style={{height: 75}}/>)}
                renderItem={({item, i}) => (
                  <MealCell 
                    data={item} 
                    key={i} 
                    showAddress={true}
                    onSelect={(data) => this.onSelectMeal(data)} 
                  />
                )}
              />
            : <EmptyView title="No meals yet." />
          }
        </View>
    )
  }

  _renderReviews() {
    const { chef } = this.state;
    var reviews = (chef && chef.reviews) ? chef.reviews : [];
    if (reviews && reviews.length > 0) {
      reviews.sort((a, b) => {
        return (a.createdAt < b.createdAt) ? 1 : -1;
      });
    }
    return (
      <View style={styles.pageView}>
        {
          (reviews && reviews.length > 0)
          ? <FlatList
              style={styles.listContainer}
              data={reviews}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => (<View style={{height: 75}}/>)}
              renderItem={({item, i}) => (
                <ReviewCell 
                  data={item} 
                  key={i} 
                />
              )}
            />
          : <EmptyView title="No reviews yet." />
        }
      </View>
    )
  }

  submitReview=(score, review)=> {
    const { chef } = this.state;
    const { currentUser } = this.props;
    this.setState({isLoading: true, isWriteDialog: false}, () => [
      this.props.dispatch({
        type: actionTypes.WRITE_REVIEW_USER,
        data: {
          score,
          review,
          chef_id: chef._id,
          creator: currentUser._id,
        }
      })
    ]);
  }

  render() {
    const { currentUser } = this.props;
    const { isLoading, currentPage, isWriteDialog } = this.state;
    var isWriteAlready = false;
    const { chef } = this.state;
    var reviews = (chef && chef.reviews) ? chef.reviews : [];

    if (chef && (currentUser._id == chef._id)) {
      isWriteAlready = true;
    }
    else if (reviews && reviews.length > 0) {
      reviews.forEach(item => {
        if (item.creator._id == currentUser._id) {
          isWriteAlready = true;
          return;
        }
      });
    }

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        { this._renderHeader() }
        <View style={styles.container}>
          { this._renderContentBar() }
          <TopTabBar 
            titles={["Overview", "Reviews"]} 
            currentPage={currentPage} 
            onSelectPage={(index) => this.setState({currentPage: index})} 
            style={{backgroundColor: 'white'}}
          />
          {
            currentPage == 0
            ? this._renderMeals()
            : this._renderReviews()
          }
          {
            !isWriteAlready
            ? <View style={styles.footer}>
                <TouchableOpacity style={styles.bottomBtn} onPress={() => this.setState({isWriteDialog: true})}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.bottomBtnText}>Write a Review</Text>
                    <Image source={Images.forward_arrow} style={{width: 25, height: 25, marginLeft: 10}} />
                  </View>
                </TouchableOpacity>
              </View>
            : null 
          }
        </View>
        <WriteReviewModal 
          isVisible={isWriteDialog} 
          onClose={() => this.setState({isWriteDialog: false})}
          onWrite={this.submitReview}
        />
        <Toast ref={ref => (this.toast = ref)}/>
        { isLoading && <LoadingOverlay /> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    width: '100%',
    height: 270,
  },

  curtain: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },

  backBtn: {
    position: 'absolute',
    left: 15,
    top: 40,
    zIndex: 3,
  },

  container: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    width: '100%',
    height: win.height - 250,
  },

  barView: {
    alignItems: 'center',
  },

  nameText: {
    textAlign: 'center',
    fontFamily: Fonts.avenirRoman,
    color: Colors.textColor,
    fontSize: 26,
    marginTop: 5,
    marginLeft: 3,
    marginBottom: 5,
  },

  pinIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

  addressText: {
    fontFamily: Fonts.avenirRoman,
    color: '#B8BBC6',
    fontSize: 12,
    marginLeft: 5,
    textAlign: 'center',
    lineHeight: 17,
  },

  deliveryFeeText: {
    fontFamily: Fonts.avenirBook,
    color: 'white',
    backgroundColor: '#2CC2DC',
    fontSize: 11,
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },

  directionBtn: {
    position: 'absolute',
    right: 15,
  },

  infoBar: {
    marginTop: 15,
    paddingVertical: 10,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#DFDFDF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DFDFDF',
  },

  infoCell: {
    alignItems: 'center',
    width: '33%',
  },

  separatorLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#DFDFDF',
  },

  infoValueText: {
    fontFamily: Fonts.avenirRoman,
    color: Colors.textColor,
    fontSize: 18,
  },

  infoLabelText: {
    marginTop: 5,
    fontFamily: Fonts.avenirRoman,
    color: '#B8BBC6',
    fontSize: 14,
  },

  pageView: {
    flex: 1,
    backgroundColor: Colors.pageColor,
  },

  listContainer: {
    flex: 1,
    padding: 15,
  },

  footer: {
    position: 'absolute',
    right: 0,
    bottom: 30,  
  },

  bottomBtn: {
    backgroundColor: Colors.appColor,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },

  bottomBtnText: {
    fontFamily: Fonts.regular,
    marginLeft: 25,
    fontSize: 16,
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
    errorUserMessage: state.user.errorMessage,
    currentUser: state.user.currentUser,
    selectedMeals: state.user.selectedMeals,
    selectedUser: state.user.selectedUser,
    getChefStatus: state.user.getChefStatus,
    writeReviewUserStatus: state.user.writeReviewUserStatus,

    selectedOrder: state.orders.selectedOrder,
    errorOrderMessage: state.orders.errorMessage,
    pickupOrderStatus: state.orders.pickupOrderStatus,
    completeOrderStatus: state.orders.completeOrderStatus,
    getOrderStatus: state.orders.getOrderStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ChefDetailScreen);
