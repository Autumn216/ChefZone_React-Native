import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import FastImage from 'react-native-fast-image'
import LoadingOverlay from '../components/LoadingOverlay'
import PhotoViewer from '../components/PhotoViewer';
import TopTabBar from '../components/TopTabBar';
import ReviewCell from '../components/Cells/ReviewCell';
import WriteReviewModal from '../components/Modal/WriteReviewModal';
import ExtraItemCell from '../components/Cells/ExtraItemCell';
import EmptyView from '../components/EmptyView';
import { TOAST_SHOW_TIME, Status, SIZE_LIST } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import Colors from '../theme/Colors'
import Images from '../theme/Images'
import Fonts from '../theme/Fonts'
import Messages from '../theme/Messages'

const win = Dimensions.get('window');

class MealDetailScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isWriteDialog: false,
      meal: null,
      currentPage: 0,
      selectedSize: SIZE_LIST[1],
      amount: 1, 
      selectedExtra: [],
      hasOrder: false,
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.meal) {
      const { meal } = this.props.route.params;
      const { currentUser } = this.props;

      this.setState({ meal, isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.GET_MEAL,
          meal_id: meal._id,
          user_id: currentUser._id
        });
      });    

      if (this.props.route.params.page) {
        this.setState({currentPage: this.props.route.params.page});
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Get Meal.
    if (prevProps.getMealStatus != this.props.getMealStatus) {
      if (this.props.getMealStatus == Status.SUCCESS) {
        if (this.props.selectedMeal.deleted) {
          this.showMessage(Messages.AlertMealHasRemoved);
        }
        else {
          this.setState({ 
            isLoading: false, 
            meal: this.props.selectedMeal,
            hasOrder: this.props.hasOrder,
          });
        }
      } 
      else if (this.props.getMealStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMealMessage);
      }
    }

    // Remove Meal.
    if (prevProps.removeMealStatus != this.props.removeMealStatus) {
      if (this.props.removeMealStatus == Status.SUCCESS) {
        this.setState({ isLoading: false });
        this.showMessage(Messages.AlertMealRemoved);
      } 
      else if (this.props.removeMealStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMealMessage);
      }
    }

    // Write Review For Meal.
    if (prevProps.writeReviewMealStatus != this.props.writeReviewMealStatus) {
      if (this.props.writeReviewMealStatus == Status.SUCCESS) {
        this.setState({isLoading: false, meal: this.props.selectedMeal});
        this.props.dispatch({
          type: actionTypes.UPDATE_NEARBY_MEAL,
          payload: this.props.selectedMeal
        });
      } 
      else if (this.props.writeReviewMealStatus == Status.FAILURE) {
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

  showMessage(message) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          this.onBack();
        }},
      ],
      {cancelable: false},
    ); 
  }

  onDecreaseAmount=()=> {
    const { amount } = this.state;
    if (amount > 1) {
      this.setState({amount: amount - 1});
    }
  }

  onIncreaseAmount=()=> {
    const { amount } = this.state;
    this.setState({amount: amount + 1});
  }

  onSelectExtra=(extra, index, isAdd)=> {
    var { selectedExtra } = this.state;
    if (isAdd) {
      selectedExtra.push(extra);
      this.setState({selectedExtra});
    }
    else {
      selectedExtra.splice(index, 1);
      this.setState({selectedExtra});
    }
  }

  onMoveChef=(meal)=> {
    if (meal.creator) {
      this.props.navigation.navigate('ChefDetail', {chef: meal.creator});
    }
  }

  submitReview=(score, review)=> {
    const { meal } = this.state;
    const { currentUser } = this.props;
    this.setState({isLoading: true, isWriteDialog: false}, () => [
      this.props.dispatch({
        type: actionTypes.WRITE_REVIEW_MEAL,
        data: {
          score,
          review,
          meal_id: meal._id,
          creator: currentUser._id,
        }
      })
    ]);
  }

  onRemoveMeal() {
    Alert.alert(
      '',
      Messages.AskRemoveMeal,
      [
        {text: 'Yes', onPress: () => {
          const { meal } = this.state;
          this.setState({isLoading: true}, () => [
            this.props.dispatch({
              type: actionTypes.REMOVE_MEAL,
              meal_id: meal._id
            })
          ]);
        }},
        {text: 'No', onPress: () => {
          
        }},
      ],
      {cancelable: false},
    ); 
  }

  onOrderNow() {
    const { meal, selectedSize, amount, selectedExtra } = this.state;
    this.props.navigation.navigate('OrderPay', {
      meal,
      size: selectedSize,
      amount,
      extra: selectedExtra
    });
  }

  _renderHeader() {
    const { meal } = this.state;
    const photos = (meal && meal.photos) ? meal.photos : [];

    return (
      <View style={styles.header}>
        <PhotoViewer photos={photos} />
        <TouchableOpacity style={styles.backBtn} onPress={() => this.onBack()}>
          <Image source={Images.back_arrow_white} style={{width: 25, height: 25,}}/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderContentBar() {
    const { meal } = this.state;
    const title = (meal && meal.title) ? meal.title : "";
    const chefAvatar = (meal && meal.creator && meal.creator.avatar) ? {uri: meal.creator.avatar} : Images.account_icon;
    const address = (meal && meal.creator && meal.creator.location) ? meal.creator.location : '';
    const firstname = (meal && meal.creator && meal.creator.firstName) ? meal.creator.firstName : '';
    const lastname = (meal && meal.creator && meal.creator.lastName) ? meal.creator.lastName : '';
    const price = (meal && meal.price) ? meal.price : "";

    return (
      <View style={styles.barView}>
        <View style={{width: win.width - 100}}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.priceText}>${price}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <Image source={Images.icon_pin} style={{width: 15, height: 15, resizeMode: 'contain'}}/>
            <Text style={styles.addressText}>{address}</Text>
          </View>
        </View>
        <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => this.onMoveChef(meal)}>
          <FastImage source={chefAvatar} style={styles.avatarImage}/>
          <Text style={styles.chefNameText}>{firstname} {lastname}</Text>
        </TouchableOpacity>        
      </View>
    )
  }

  _renderOverview() {
    const { currentUser } = this.props;
    const { meal, selectedSize, amount, selectedExtra } = this.state;
    const description = (meal && meal.description) ? meal.description : "";
    const inside = (meal && meal.inside) ? meal.inside : "";
    const extra = (meal && meal.extra) ? meal.extra : [];
    
    return (
      <ScrollView style={styles.pageView}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.sectionBody}>
            <Text style={styles.sectionBodyText}>{description}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Inside</Text>
          <View style={styles.sectionBody}>
            <Text style={styles.sectionBodyText}>{inside}</Text>
          </View>
        </View>

        {
          currentUser.type == "customer" 
          ? <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose Size</Text>
              <View style={[styles.sectionBody, {paddingVertical: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
              {
                SIZE_LIST.map((item, i) =>
                  <TouchableOpacity 
                    key={i.toString()} 
                    style={[styles.sizeBtn, selectedSize == item ? styles.sizeSelectedBtn : {}]}
                    onPress={() => this.setState({selectedSize: item})}
                  >
                    <Text style={[styles.sizeBtnText, selectedSize == item ? styles.sizeSelectedBtnText : {}]}>{item}</Text>
                  </TouchableOpacity>
                )
              }
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={[styles.sectionBody, {paddingVertical: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
                <TouchableOpacity onPress={this.onDecreaseAmount}>
                  <Image source={Images.circle_minus} style={{width: 40, height: 40}} />
                </TouchableOpacity>
                <Text style={styles.amountText}>{amount}</Text>
                <TouchableOpacity onPress={this.onIncreaseAmount}>
                  <Image source={Images.circle_plus_icon} style={{width: 40, height: 40}} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          : null
        }

        <View style={[styles.section, {marginBottom: 70}]}>
          <Text style={styles.sectionTitle}>Extra</Text>
          <View style={styles.sectionBody}>
          {
            extra.map((item, i) =>
              <ExtraItemCell 
                data={item} 
                key={i.toString()} 
                isSelectable={currentUser.type == "customer" ? true : false}
                selectedList={selectedExtra}
                onSelect={this.onSelectExtra}
              />
	    			)
					}
          </View>
        </View>
      </ScrollView>
    )
  }

  _renderReviews() {
    const { meal } = this.state;
    var reviews = (meal && meal.reviews) ? meal.reviews : [];
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
              ListFooterComponent={() => (<View style={{height: 80}}/>)}
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

  _renderFooter() {
    const { currentUser } = this.props; 
    const { meal, amount, selectedExtra, currentPage, hasOrder } = this.state;
    var price = (meal && meal.price) ? meal.price : 0;
    selectedExtra.forEach(item => {
      price += item.price;
    });
    var total = price * amount;
    var creatorId = null;
    if (meal && meal.creator) {
      if (meal.creator._id) {
        creatorId = meal.creator._id;
      } else {
        creatorId = meal.creator;
      }
    }

    return (
      <View style={styles.footer}>
        {
          currentUser.type == "customer"
          ? <View>
              {
                (currentPage == 0)
                ? <View style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center'}}>
                    <View style={styles.totalBox}>
                      <Text style={styles.totalText}>${total.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity style={styles.bottomBtn} onPress={() => this.onOrderNow()}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.bottomBtnText}>Order Now</Text>
                        <Image source={Images.forward_arrow} style={{width: 25, height: 25, marginLeft: 10}} />
                      </View>
                    </TouchableOpacity>
                  </View>
                : hasOrder
                  ? <View style={{alignItems: 'flex-end'}}>
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
          : <View>
              {
                creatorId == currentUser._id
                ? <View style={{alignItems: 'flex-end'}}>
                    <TouchableOpacity style={styles.bottomBtn} onPress={() => this.onRemoveMeal()}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.bottomBtnText}>Remove Meal</Text>
                        <Image source={Images.forward_arrow} style={{width: 25, height: 25, marginLeft: 10}} />
                      </View>
                    </TouchableOpacity>
                  </View>
                : null
              }
            </View>
        }
      </View>
    )
  }

  render() {
    const { isLoading, isWriteDialog, currentPage } = this.state;

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
            ? this._renderOverview()
            : this._renderReviews()
          }
          { this._renderFooter() }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,

  },

  avatarImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
    backgroundColor: 'lightgray',
  },

  chefNameText: {
    fontFamily: Fonts.avenirBook,
    fontSize: 11,
    width: 80,
    textAlign: 'center',
    marginTop: 3,
  },

  titleText: {
    fontFamily: Fonts.avenirBlack,
    color: Colors.textColor,
    fontSize: 20,
    marginTop: 5,
    marginLeft: 3,
  },

  addressText: {
    fontFamily: Fonts.avenirBook,
    color: '#B8BBC6',
    fontSize: 12,
    marginLeft: 5,
  },

  priceText: {
    fontFamily: Fonts.avenirBlack,
    color: Colors.appColor,
    marginTop: 10,
    marginLeft: 3,
    fontSize: 18,
  },

  pageView: {
    flex: 1,
    backgroundColor: Colors.pageColor,
  },

  sectionTitle: {
    textAlign: 'center',
    fontFamily: Fonts.avenirRoman,
    color: Colors.textColor,
    fontSize: 13,
    paddingVertical: 10,
  },

  sectionBody: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  sectionBodyText: {
    fontFamily: Fonts.avenirRoman,
    color: Colors.textColor,
    fontSize: 17,
    lineHeight: 20,
  },

  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 30,  
  },

  totalBox: {
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingRight: 20,
    paddingLeft: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  totalText: {
    fontFamily: Fonts.avenirBlack,
    fontFamily: Fonts.regular,
    fontSize: 20,
    color: Colors.textColor,
  },

  bottomBtn: {
    backgroundColor: Colors.appColor,
    paddingHorizontal: 15,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomBtnText: {
    fontFamily: Fonts.regular,
    marginLeft: 25,
    fontSize: 16,
  },

  sizeBtn: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },

  sizeSelectedBtn: {
    backgroundColor: '#080040',
  },

  sizeBtnText: {
    color: '#080040',
    fontFamily: Fonts.avenirRoman,
    fontSize: 17,
  },

  sizeSelectedBtnText: {
    color: 'white',
  },

  amountText: {
    fontFamily: Fonts.avenirRoman,
    color: '#080040',
    fontSize: 24,
    marginHorizontal: 20,
  },

  listContainer: {
    flex: 1,
    padding: 15,
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
    currentUser: state.user.currentUser,

    selectedMeal: state.meals.selectedMeal,
    hasOrder: state.meals.hasOrder,
    errorMealMessage: state.meals.errorMessage,
    writeReviewMealStatus: state.meals.writeReviewMealStatus,
    removeMealStatus: state.meals.removeMealStatus,
    getMealStatus: state.meals.getMealStatus,

    selectedOrder: state.orders.selectedOrder,
    errorOrderMessage: state.orders.errorMessage,
    pickupOrderStatus: state.orders.pickupOrderStatus,
    completeOrderStatus: state.orders.completeOrderStatus,
    getOrderStatus: state.orders.getOrderStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(MealDetailScreen);
