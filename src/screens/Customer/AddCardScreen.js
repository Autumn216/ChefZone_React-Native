import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import stripe from 'tipsi-stripe'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { CreditCardInput } from "react-native-input-credit-card";
import TopNavBar from '../../components/TopNavBar'
import NavImage from '../../components/NavImage'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status, STRIPE_KEY } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import RoundButton from '../../components/RoundButton';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Messages from '../../theme/Messages'

class AddCardScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      cardForm: null,
      cardError: null,
      isEditing: false,
    }
  }

  componentDidMount() {
    stripe.setOptions({
        publishableKey: STRIPE_KEY,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Add Payment.
    if (prevProps.addPaymentStatus != this.props.addPaymentStatus) {
      if (this.props.addPaymentStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.onBack();
      } 
      else if (this.props.addPaymentStatus == Status.FAILURE) {
          this.onFailure(this.props.errorUserMessage);
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

  _onPaymentChange=(form)=> {
    this.setState({cardForm: form, cardError: null});
  }  

  onSave=()=> {
    const { currentUser } = this.props;
    const { cardForm, isLoading } = this.state;
     
    Keyboard.dismiss();
    if (isLoading) return;

    var isValid = true;
    if (!cardForm || !cardForm.valid) {
      this.setState({cardError: Messages.InvalidCard});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        const cardNumber = cardForm.values.number;
        const expiry = cardForm.values.expiry;
        const cvc = cardForm.values.cvc;
        const result = expiry.split('/');

        const expMonth = parseInt(result[0]);
        const expYear = parseInt(result[1]);

        const params = {
          number: cardNumber,
          expMonth: expMonth,
          expYear: expYear,
          cvc: cvc,
        }

        stripe.createTokenWithCard(params)
        .then(response => {
          const token = response.tokenId;
          const brand = response.card.brand;
          const expYear = response.card.expYear;
          const expMonth = response.card.expMonth;
          const last4 = response.card.last4;

          this.setState({isLoading: true}, () => {
            this.props.dispatch({
              type: actionTypes.ADD_PAYMENT,
              user_id: currentUser._id,
              card: {
                token,
                brand,
                expYear,
                expMonth,
                last4
              }
            });
          });
        })
        .catch(error => {
          console.log("error: ", error);
          this.setState({isLoading: false});
          if (error.code == "apiConnection" || error.message === "A server with the specified hostname could not be found.") {
            this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
          } else {
            this.toast.show(error.message, TOAST_SHOW_TIME);
          }
        });
      });      
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

  _renderPayment() {
    const { 
        cardError,
    } = this.state;

    return (
      <View style={styles.paymentView}>
        <CreditCardInput 
          labelStyle={{fontFamily: Fonts.regular}}
          inputStyle={{fontFamily: Fonts.regular}}
          labels={{number: "CARD NUMBER", expiry: "EXPIRY", cvc: "CVV/CVC"}}
          onChange={this._onPaymentChange} 
        />
        {
          (cardError && cardError.length > 0) 
          ? <Text style={styles.errorText}>{cardError}</Text>
          : null
        }
      </View>
    )
    }

  _renderFooter() {
    return (
      <View style={styles.footer}>
        <TouchableOpacity>
          <RoundButton 
            title="Save" 
            theme="main" 
            onPress={this.onSave}
        />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { isLoading } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage theme="green"/>
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={{flex: 1, paddingTop: insets.top }} >
                  <TopNavBar 
                    title="Add Card" 
                    leftButton="back" 
                    rightButton="plus"
                    theme="black" 
                    onBack={() => this.onBack()}
                  />
                  <View style={styles.container}>
                    { this._renderPayment() }
                    { this._renderFooter() }
                  </View>
              </View>
            </TouchableWithoutFeedback>
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
    paddingTop: 50,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  listContainer: {
    flex: 1,
  },

  footer: {
    paddingVertical: 20,
    paddingHorizontal: 35,
  },

  errorText: {
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
    color: 'red',
    fontSize: 11,
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
    errorUserMessage: state.user.errorMessage,
    addPaymentStatus: state.user.addPaymentStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(AddCardScreen);
