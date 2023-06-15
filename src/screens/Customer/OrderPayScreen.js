import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../../components/TopNavBar'
import NavImage from '../../components/NavImage'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import MealBox from '../../components/MealBox'
import ShippingAddressBox from '../../components/ShippingAddressBox'
import PaymentCardBox from '../../components/PaymentCardBox'
import ReceiptBox from '../../components/ReceiptBox'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import { calcReceipt } from '../../functions'
import actionTypes from '../../actions/actionTypes';
import RoundButton from '../../components/RoundButton';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Messages from '../../theme/Messages'

class OrderPayScreen extends Component {
  constructor() {
    super()
    this.state = {
      shippingAddress: null,
      payment: null,
      isLoading: false,

      meal: null,
      size: null,
      amount: null,
      extra: [],

      errorMessage: null,
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.meal) {
      const { meal, size, amount, extra } = this.props.route.params;
      this.setState({
        meal, size, amount, extra
      });
    }

    const { currentUser } = this.props;
    
    // Get Shipping address.
    if (currentUser.shippingAddresses && currentUser.shippingAddresses.length > 0) {
      currentUser.shippingAddresses.forEach(item => {
        if (item.isActive) {
          this.setState({shippingAddress: item});
          return;
        }
      });
    }

    // Get Payment.
    if (currentUser.payments && currentUser.payments.length > 0) {
      this.setState({payment: currentUser.payments[0]});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.createOrderStatus != this.props.createOrderStatus) {
      if (this.props.createOrderStatus == Status.SUCCESS) {
        this.setState({isLoading: false});  
        this.props.navigation.navigate("ResultSubmitOrder", {order: this.props.createdOrder});
      } 
      else if (this.props.createOrderStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
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

  onEditShippingAddress=()=> {
    this.props.navigation.navigate(
      'ShippingAddress', 
      {
        isEdit: true,
        onSelectAddress: (address) => this.onSelectAddress(address)
      }
    );
  }

  onSelectAddress(address) {
    this.setState({shippingAddress: address, errorMessage: null});
  }

  onChoosePayment=()=> {
    const { payment } = this.state;
    this.props.navigation.navigate('PaymentList', {
      isEdit: true, 
      payment: payment,
      onSelectPayment: (payment) => this.onSelectPayment(payment)
    });
  }

  onSelectPayment(payment) {
    this.setState({payment: payment, errorMessage: null});
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

  onPay() {
    const { shippingAddress, payment, meal, size, amount, extra } = this.state;
    const { currentUser } = this.props;
    const receipt = calcReceipt(meal, amount, size, extra);
    
    if (!(shippingAddress && shippingAddress._id)) {
      this.setState({ errorMessage: Messages.InvalidShippigAddress});
      return;
    }

    if (!(payment && payment._id)) {
      this.setState({ errorMessage: Messages.InvalidPayment});
      return;
    }

    const data = {
      user_id: currentUser._id,
      chef_id: meal.creator._id,
      stripeCustomerId: payment.stripeCustomerId,
      token: payment.token,
      brand: payment.brand,
      last4: payment.last4,
      expYear: payment.expYear,
      expMonth: payment.expMonth,

      address: shippingAddress.address,
      apt: shippingAddress.apt,
      zipcode: shippingAddress.zipcode,
      lat: shippingAddress.lat,
      lng: shippingAddress.lng,

      meal,
      size,
      amount,
      extra,

      subtotal: receipt.subtotal,
      deliveryFee: receipt.deliveryFee,
      tax: receipt.tax,
      total: receipt.total,
    };

    this.setState({isLoading: true}, () => {
      this.props.dispatch({
        type: actionTypes.CREATE_ORDER,
        data: data,
      })
    });
  }

  render() {
    const { isLoading, meal, amount, size, extra, shippingAddress, payment, errorMessage } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage theme="green"/>
        <SafeAreaInsetsContext.Consumer>
        {insets => 
          <View style={{flex: 1, paddingTop: insets.top }} >
          <TopNavBar 
              title="Review Order" 
              leftButton="back" 
              theme="black" 
              onBack={() => this.onBack()}
          />
            <View style={styles.container}>
              <ScrollView style={{flex: 1}}>
                <MealBox 
                  meal={meal}
                  amount={amount}
                  size={size}
                  extra={extra}
                  onMoveMeal={this.onMoveMeal}
                />
                <ShippingAddressBox 
                  data={shippingAddress} 
                  isShowEdit={true}
                  onEdit={this.onEditShippingAddress}
                />
                <PaymentCardBox 
                  data={payment} 
                  isShowEdit={true}
                  onEdit={this.onChoosePayment}
                />
                
                <ReceiptBox 
                  meal={meal}
                  amount={amount}
                  size={size}
                  extra={extra}
                />

                <View style={{ paddingTop: 20, paddingBottom: 40, paddingHorizontal: 20 }}>
                  <RoundButton 
                      title="Submit Order" 
                      theme="main" 
                      onPress={() => this.onPay()} 
                  />
                  {
                    (errorMessage && errorMessage.length > 0)
                    ? <Text style={styles.errorText}>{errorMessage}</Text>
                    : null
                  }
                </View>
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
    paddingTop: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: 'white',
  },

  sectionBox: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 20,
    shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.3,
		shadowRadius: 5,
    elevation: 5,
  },

  shippingInfo: {
    paddingHorizontal: 38,
    paddingTop: 18,
    paddingBottom: 10,
  },

  prefixIcon: {
    position: 'absolute',
    width: 35,
    height: 35,
    resizeMode: 'contain',
    left: 2,
    top: 17,
  },

  labelText: {
    fontFamily: Fonts.regular,
    textTransform: 'uppercase',
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 14,
    marginTop: 3,
  },

  valueText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  },

  subText: {
    fontFamily: Fonts.regular,
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 14,
  },

  editBtn: {
    position: 'absolute',
    right: 15,
    top: 20,
  },

  editIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  receiptLabelText: {
    fontFamily: Fonts.regular,
    color: 'rgba(0, 0, 0, 0.7)',
  },

  receiptValueText: {
    fontFamily: Fonts.regular,
    color: 'rgba(0, 0, 0, 0.7)',
  },

  boldText: {
    marginTop: 5,
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: 'black',
  },

  errorText: {
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
    color: '#cf0000',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
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
    createdOrder: state.orders.createdOrder,
    errorMessage: state.orders.errorMessage,
    createOrderStatus: state.orders.createOrderStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(OrderPayScreen);
