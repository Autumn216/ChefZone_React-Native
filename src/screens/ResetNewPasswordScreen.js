import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import BackgroundImage from '../components/BackgroundImage'
import LabelFormInput from '../components/LabelFormInput'
import { TOAST_SHOW_TIME, Status, PASSWORD_MIN_LENGTH } from '../constants.js'
import LoadingOverlay from '../components/LoadingOverlay'
import Messages from '../theme/Messages'
import Toast from 'react-native-easy-toast'
import actionTypes from '../actions/actionTypes';

class ResetNewPasswordScreen extends Component {
  constructor() {
    super()
    this.state = {
      newPassword: '',
      newPasswordConfirm: '',
      passwordError: '',
      passwordConfirmError: '',
      isLoading: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.resetPasswordStatus != this.props.resetPasswordStatus) {
      if (this.props.resetPasswordStatus == Status.SUCCESS) {
        this.resetPasswordSuccess();
      } else if (this.props.resetPasswordStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onResetPassword() {
    Keyboard.dismiss();

    const { email } = this.props.route.params;
    let newPassword = this.state.newPassword;
    let newPasswordConfirm = this.state.newPasswordConfirm;

    var isValid = true;
    if (newPassword == null || newPassword.length <= 0) {
      this.setState({passwordError: Messages.InvalidPassword});
      isValid = false;
    } else if (newPassword.length < PASSWORD_MIN_LENGTH) {
      this.setState({passwordError: Messages.ShortPasswordError});
      isValid = false;
    }

    if (newPasswordConfirm == null || newPasswordConfirm.length <= 0) {
      this.setState({passwordConfirmError: Messages.InvalidConfirmPassword});
      isValid = false;
    } else if (newPassword != newPasswordConfirm) {
      this.setState({passwordConfirmError: Messages.InvalidPasswordNotMatch});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.RESET_PASSWORD,
          email: email,
          password: newPassword
        });        
      });      
    }
  }

  resetPasswordSuccess() {
    this.setState({isLoading: false});
    this.showResultMessage(Messages.AlertResetPassword);
  }

  showResultMessage(message) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          this.props.navigation.popToTop();
        }},
      ]
    );  
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
                title="Reset Password" 
                theme="green" 
                leftButton="back"
                onBack={() => this.onBack()}
              />
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={styles.contentView}>
                      <LabelFormInput
                        autoFocus={true}
                        label="New Password" 
                        type="password"
                        placeholderTextColor="#939393"
                        errorMessage={this.state.passwordError}
                        value={this.state.newPassword} 
                        returnKeyType="next"
                        onSubmitEditing={() => { this.confirmPasswordInput.focus() }}
                        onChangeText={(text) => this.setState({newPassword: text, passwordError: null})} />

                      <LabelFormInput
                        label="Confirm New Password" 
                        type="password"
                        placeholderTextColor="#939393"
                        errorMessage={this.state.passwordConfirmError}
                        value={this.state.newPasswordConfirm} 
                        returnKeyType="done"
                        onRefInput={(input) => { this.confirmPasswordInput = input }}
                        onChangeText={(text) => this.setState({newPasswordConfirm: text, passwordConfirmError: null})}
                        onSubmitEditing={() => { 
                        this.onResetPassword() 
                      }}
                      />
                      <View style={styles.viewBottom}>
                        <RoundButton 
                          title="RESET PASSWORD" 
                          theme="main" 
                          style={styles.registerButton} 
                          onPress={() => this.onResetPassword()} />
                      </View>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </View>
          }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)}/>
        {
          this.state.isLoading && <LoadingOverlay />
        }
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
    padding: 35,
  },

  viewBottom: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  registerButton: {
    marginTop: 20,
    width: '100%'
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
    resetPasswordStatus: state.user.resetPasswordStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ResetNewPasswordScreen);