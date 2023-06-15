import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  Alert,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import TopNavBar from '../../components/TopNavBar'
import NavImage from '../../components/NavImage'
import LoadingOverlay from '../../components/LoadingOverlay'
import ConfirmOrderModal from '../../components/Modal/ConfirmOrderModal'
import CustomerBox from '../../components/CustomerBox';
import MealBox from '../../components/MealBox';
import ShippingAddressBox from '../../components/ShippingAddressBox';
import PaymentCardBox from '../../components/PaymentCardBox';
import ReceiptBox from '../../components/ReceiptBox';
import RoundButton from '../../components/RoundButton';
import { getOrderStatusText } from '../../functions'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'
import Fonts from '../../theme/Fonts'

import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

class ChefOrderDetailScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      order: null,
      isShowConfirmDialog: false,
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
    
    // Pick up.
    if (prevProps.pickupOrderStatus != this.props.pickupOrderStatus) {
      if (this.props.pickupOrderStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        const { selectedOrder } = this.props;
        this.onPickupSuccess(selectedOrder);
      } 
      else if (this.props.pickupOrderStatus == Status.FAILURE) {
        this.onFailure(this.props.errorOrderMessage);
      }
    }

    // Complete.
    if (prevProps.completeOrderStatus != this.props.completeOrderStatus) {
      if (this.props.completeOrderStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.onCompleteSuccess();
      } 
      else if (this.props.completeOrderStatus == Status.FAILURE) {
        this.onFailure(this.props.errorOrderMessage);
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

  onConfirmOrder() {
    this.setState({isShowConfirmDialog: true});
  }

  onPickup=(selectedTime)=> {
    if (selectedTime) {
      const { order } = this.state;
      this.setState({ isShowConfirmDialog: false, isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.PICKUP_ORDER,
          order_id: order._id,
          delivery_time: selectedTime,
        });
      });
    }
  }

  onPickupSuccess(order) {
    Alert.alert(
      '',
      Messages.AlertPickup,
      [
        {text: 'OK', onPress: () => {
          this.onBack();
        }},
      ],
      {cancelable: false},
    );
  }  

  onCompleteSuccess() {
    Alert.alert(
      '',
      Messages.AlertOrderComplete,
      [
        {text: 'OK', onPress: () => {
          this.onBack();
        }},
      ],
      {cancelable: false},
    );
  }

  onConfirmDelivery=()=> {
    Alert.alert(
      'Confirm Delivery',
      Messages.AlertConfirmDelivery,
      [
        {text: 'Yes', onPress: () => {
          const { order } = this.state;
          this.setState({ isLoading: true}, () => {
            this.props.dispatch({
              type: actionTypes.COMPLETE_ORDER,
              order_id: order._id,
            });
          });
        }},
        {text: 'No', onPress: () => {
        }},
      ],
      {cancelable: false},
    );
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
    const today = new Date();
    const { isLoading, order, isShowConfirmDialog } = this.state;

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
                      user={order.creator} 
                      title="Customer"
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
                    />
                    <ReceiptBox 
                      meal={order.meal}
                      amount={order.amount}
                      size={order.size}
                      extra={order.extra}
                    />
                    <View style={{paddingHorizontal: 20, marginTop: 20, marginBottom: 20}}>
                      {
                        order.status == 0
                        ? <RoundButton title="Confirm Order" theme="main" onPress={() => this.onConfirmOrder()}/>
                        : null
                      }
                      {
                        order.status == 1
                        ? <RoundButton title="Confirm Delivery" theme="main" onPress={this.onConfirmDelivery}/>
                        : null
                      }           
                    </View>                
                </View>
                : null
              }
              </ScrollView>
            </View>
          </View>
        }
        </SafeAreaInsetsContext.Consumer>
        {
          Platform.OS == "ios"
          ? <ConfirmOrderModal 
              isVisible={isShowConfirmDialog}
              onConfirmDelivery={(selectedTime) => this.onPickup(selectedTime)}
              onClose={() => this.setState({isShowConfirmDialog: false})}
            />
          : isShowConfirmDialog && <DateTimePicker
              value={today}
              display={Platform.OS == "ios" ? "spinner" : "default"}
              mode={"time"}
              is24Hour={true}
              onChange={(event, selectedDate) => this.onPickup(selectedDate)}
              minimumDate={today}
              textColor="black"
          />
        }
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
    overflow: 'hidden',
  },

  mapView: {
    width: '100%',
    height: 300,
    marginTop: -10,
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
    currentUser: state.user.currentUser,

    selectedOrder: state.orders.selectedOrder,
    errorOrderMessage: state.orders.errorMessage,
    pickupOrderStatus: state.orders.pickupOrderStatus,
    completeOrderStatus: state.orders.completeOrderStatus,
    getOrderStatus: state.orders.getOrderStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ChefOrderDetailScreen);
