import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import TopNavBar from '../../components/TopNavBar'
import NavImage from '../../components/NavImage'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import { getOrderStatusText } from '../../functions'
import actionTypes from '../../actions/actionTypes';
import MealBox from '../../components/MealBox';
import CustomerBox from '../../components/CustomerBox';
import ShippingAddressBox from '../../components/ShippingAddressBox';
import PaymentCardBox from '../../components/PaymentCardBox';
import ReceiptBox from '../../components/ReceiptBox';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Messages from '../../theme/Messages'

class OrderDetailScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.order) {
      const { order } = this.props.route.params;
      this.setState({ order, isLoading: true }, () => {
        this.props.dispatch({
          type: actionTypes.GET_ORDER,
          order_id: order._id,
        });
      });    
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Get Order.
    if (prevProps.getOrderStatus != this.props.getOrderStatus) {
      if (this.props.getOrderStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        var { selectedOrder } = this.props;
        selectedOrder.meal.chef = selectedOrder.chef;
        this.setState({order: selectedOrder});
      } 
      else if (this.props.getOrderStatus == Status.FAILURE) {
        this.onFailure(this.props.errorOrderMessage);
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

  onMoveChef=(chef)=> {
    this.props.navigation.navigate('ChefDetail', {chef});
  }

  onMoveMeal=(meal)=> {
    if (meal.deleted) {
      this.showMessage(Messages.AlertMealHasRemoved);
    }
    else {
      this.props.navigation.navigate('MealDetail', {meal});
    }
  }

  showMessage(message) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
        }},
      ],
      {cancelable: false},
    ); 
  }

  render() {
    const { lat, lng } = this.props; 
    const { isLoading, order } = this.state;
    var status = "";
    if (order) {
      status = getOrderStatusText(order.status);
      var statusStyle = styles.confirmStatus;
  
      if (order.status == 1) {
          statusStyle = styles.comingStatus;
      }
      else if(order.status == 2) {
          statusStyle = styles.completedStatus;
      }
    }

    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage theme="green"/>
        <SafeAreaInsetsContext.Consumer>
        {insets => 
          <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar 
              title="Order Details" 
              leftButton="back" 
              theme="black" 
              onBack={() => this.onBack()}
            />
            <View style={styles.container}>
              <ScrollView>
              {
                  order 
                  ? <View style={styles.container}>
                      <Text style={[styles.ticket, statusStyle]}>{status}</Text>
                      <CustomerBox 
                        user={order.chef} 
                        title="Chef"
                        onProfile={this.onMoveChef}
                      />
                      <MealBox 
                        meal={order.meal}
                        amount={order.amount}
                        size={order.size}
                        extra={order.extra}
                        onMoveMeal={this.onMoveMeal}
                      />
                      <PaymentCardBox data={order.payment} />
                      <ShippingAddressBox 
                        ref={ref => (this.shippingAddressBox = ref)}
                        data={order.shippingAddress} 
                        status={order.status}
                        currentLat={lat}
                        currentLng={lng}
                      />
                      <ReceiptBox 
                        meal={order.meal}
                        amount={order.amount}
                        size={order.size}
                        extra={order.extra}
                      />
                  </View>
                  : null
              }
              </ScrollView>
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

  contentView: {
    flex: 1,
    backgroundColor: '#f2f2f5',
  },

  headerText: {
    fontFamily: Fonts.bold,
    textAlign: 'center',
    fontSize: 18,
    paddingTop: 25,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },

  receiptView: {
    paddingVertical: 10,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  labelText: {
    fontFamily: Fonts.regular,
  },

  valueText: {
    fontFamily: Fonts.regular,
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

  emptyPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },

  emptyCartIcon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },

  emptyMainText: {
    fontFamily: Fonts.bold,
    marginTop: 20,
    fontSize: 30,
    color: '#333',
  },

  emptySubText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)'
  },

  ticket: {
    fontFamily: Fonts.avenirRoman,
    fontSize: 11,
    paddingHorizontal: 12,
    paddingTop: 5,
    paddingBottom: 3,
    position: 'absolute',
    right: 10,
    top: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },

  confirmStatus: {
    backgroundColor: Colors.appColor,
    color: 'white',
  },

  comingStatus: {
      backgroundColor: '#2CC2DC',
      color: 'white',
  },
      
  completedStatus: {
      backgroundColor: '#24EC46',
      color: 'white',
  }
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

    selectedOrder: state.orders.selectedOrder,
    errorOrderMessage: state.orders.errorMessage,
    getOrderStatus: state.orders.getOrderStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(OrderDetailScreen);
