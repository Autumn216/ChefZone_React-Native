import React, { Component } from 'react';
import {
  Alert,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../components/TopNavBar'
import NavImage from '../components/NavImage'
import RoundButton from '../components/RoundButton'
import LabelFormInput from '../components/LabelFormInput'
import LoadingOverlay from '../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status, PASSWORD_MIN_LENGTH } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import Messages from '../theme/Messages'
import Colors from '../theme/Colors'

class ChangePasswordScreen extends Component {
  constructor() {
    super()
    this.state = {
      password: '',
      newPassword: '',
      confirmPassword: '',

      passwordError: '',
      newPasswordError: '',
      confirmPasswordError: '',
      isLoading: false,
    }    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.changePasswordStatus != this.props.changePasswordStatus) {
      if (this.props.changePasswordStatus == Status.SUCCESS) {
        this.changePasswordSuccess();
      } else if (this.props.changePasswordStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onChangePassword=()=> {
    Keyboard.dismiss();
    var isValid = true;

    if (this.state.password == null || this.state.password.length == 0) {
      this.setState({passwordError: Messages.InvalidCurrentPassword});
      isValid = false;
    }

    if (this.state.newPassword == null || this.state.newPassword.length == 0) {
      this.setState({newPasswordError: Messages.InvalidNewPassword});
      isValid = false;
    } else if (this.state.newPassword.length < PASSWORD_MIN_LENGTH) {
      this.setState({newPasswordError: Messages.ShortPasswordError});
      isValid = false;
    }

    if (this.state.confirmPassword === null || this.state.confirmPassword.length === 0) {
      this.setState({confirmPasswordError: Messages.InvalidConfirmPassword});
      isValid = false;
    } else if(this.state.newPassword != this.state.confirmPassword) {
      this.setState({confirmPasswordError: Messages.InvalidPasswordNotMatch});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.CHANGE_PASSWORD,
          user_id: this.props.currentUser._id,
          old_password: this.state.password,
          new_password: this.state.newPassword,
        });
      });  
    }
  }

  changePasswordSuccess() {
    this.setState({isLoading: false});
    Alert.alert(
      '',
      Messages.PasswordUpdated,
      [
        {text: 'OK', onPress: () => {
          this.setState({
            password: null,
            newPassword: null,
            confirmPassword: null,

            passwordError: null,
            newPasswordError: null,
            confirmPasswordError: null
          });
          this.onBack();
        }},
      ],
      {cancelable: false},
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
    const { 
      password, 
      newPassword, 
      confirmPassword, 
      passwordError, 
      newPasswordError, 
      confirmPasswordError 
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage theme="green"/>
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title="CHANGE PASSWORD" 
                leftButton="back" 
                theme="black"
                onBack={() => this.onBack()}
              />
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.container}>
                <View style={styles.contentView}>
                  <LabelFormInput
                    label="Current Password" 
                    type="password"
                    placeholderTextColor="#939393"
                    value={password} 
                    errorMessage={passwordError}
                    returnKeyType="next"                                       
                    onSubmitEditing={() => { this.newPasswordInput.focus() }}
                    onChangeText={(text) => this.setState({password: text, passwordError: null})} />

                  <LabelFormInput
                    label="New Password" 
                    type="password"
                    placeholderTextColor="#939393"
                    value={newPassword} 
                    errorMessage={newPasswordError} 
                    returnKeyType="next"                                       
                    onRefInput={(input) => { this.newPasswordInput = input }}
                    onChangeText={(text) => this.setState({newPassword: text, newPasswordError: null})} 
                    onSubmitEditing={() => { this.confirmPasswordInput.focus() }}
                  />

                  <LabelFormInput
                    label="Confirm Password" 
                    type="password"
                    placeholderTextColor="#939393"
                    value={confirmPassword} 
                    errorMessage={confirmPasswordError}
                    returnKeyType="done"                                       
                    onRefInput={(input) => { this.confirmPasswordInput = input }}
                    onChangeText={(text) => this.setState({confirmPassword: text, confirmPasswordError: null})} 
                    onSubmitEditing={this.onChangePassword}
                  />
                </View>

                <View style={styles.viewBottom}>
                  <RoundButton 
                    title="CHANGE PASSWORD" 
                    theme="main" 
                    style={styles.registerButton} 
                    onPress={this.onChangePassword} 
                  />
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
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  contentView: {
    paddingTop: 30,
    paddingHorizontal: 30,
  },

  viewBottom: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 20,
  },

  registerButton: {
    marginTop: 20,
    width: '90%'
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
    errorMessage: state.user.errorMessage,
    changePasswordStatus: state.user.changePasswordStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ChangePasswordScreen);