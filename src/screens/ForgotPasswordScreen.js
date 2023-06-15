import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import BlueBar from '../components/SignUp/BlueBar'
import BackgroundImage from '../components/BackgroundImage'
import LabelFormInput from '../components/LabelFormInput'
import { TOAST_SHOW_TIME, Status } from '../constants.js'
import LoadingOverlay from '../components/LoadingOverlay'
import Toast from 'react-native-easy-toast'
import actionTypes from '../actions/actionTypes';
import { isValidEmail } from '../functions'
import Messages from '../theme/Messages'

class ForgotPasswordScreen extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      emailError: '',
      isLoading: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.forgotPasswordStatus != this.props.forgotPasswordStatus) {
      if (this.props.forgotPasswordStatus == Status.SUCCESS) {
        this.forgotPasswordSuccess();
      } else if (this.props.forgotPasswordStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  showResultMessage(message) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          this.props.navigation.navigate('VerificationCode', {email: this.state.email});
        }},
      ]
    );  
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onResetPassword() {
    Keyboard.dismiss();

    let email = this.state.email;

    var isValid = true;
    if (email == null || email.length <= 0 || !isValidEmail(email)) {
      this.setState({emailError: Messages.InvalidEmail});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.FORGOT_PASSWORD,
          email: email,
        });
      });      
    }
  }

  forgotPasswordSuccess() {
    this.setState({isLoading: false});
    let message = this.props.resultMessage;
    this.showResultMessage(message);
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

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title="Forgot Password" 
                theme="green" 
                leftButton="back"
                onBack={() => this.onBack()}
              />
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                  <BlueBar 
                    title="Enter your email address and we will send you a verification code to reset your password." 
                    style={{marginTop: 15}}
                  />
                  <View style={styles.contentView}>
                    <LabelFormInput
                      placeholder="Email Address" 
                      type="email"
                      autoFocus={true}
                      placeholderTextColor="#939393"
                      errorMessage={this.state.emailError}
                      value={this.state.email} 
                      returnKeyType="done"
                      onChangeText={(text) => this.setState({email: text, emailError: null})} 
                      onSubmitEditing={() => { 
                      this.onResetPassword() 
                    }}
                  />
                  <View style={styles.viewBottom}>
                    <RoundButton 
                      title="RESET PASSWORD" 
                      theme="main" 
                      style={styles.registerButton} 
                      onPress={() => this.onResetPassword()} 
                    />
                  </View>
                </View>
                </View>
              </TouchableWithoutFeedback>
             </View>
            }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)}/>
        { this.state.isLoading && <LoadingOverlay /> }  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },

  contentView: {
    paddingHorizontal: 30,
  },

  viewBottom: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerButton: {
    width: '100%', 
    marginTop: 10,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    resultMessage: state.user.resultMessage,
    errorMessage: state.user.errorMessage,
    forgotPasswordStatus: state.user.forgotPasswordStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ForgotPasswordScreen);