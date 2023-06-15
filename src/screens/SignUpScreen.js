import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TopNavBar from '../components/TopNavBar'
import BackgroundImage from '../components/BackgroundImage'
import RegisterPage from '../components/SignUp/RegisterPage'
import CheckBox from '../components/CheckBox'
import Button from '../components/Button'
import Label from '../components/Label'
import RoundButton from '../components/RoundButton'
import LoadingOverlay from '../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status, PASSWORD_MIN_LENGTH, WEB_PAGE_TYPE } from '../constants.js'
import { validateEmail, getOnlyAlphabetLetters } from '../functions'
import actionTypes from '../actions/actionTypes';
import * as Storage from '../services/Storage'
import Messages from '../theme/Messages'
import Fonts from '../theme/Fonts'
import Colors from '../theme/Colors'

class SignUpScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor() {
    super()
    this.state = {
      currentPage: 0,
      agreeTerms: false,
      isLoading: false,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        locationText: '',
        password: '',
        confirmPassword: '',
        currentLat: 0,
        currentLng: 0,

        firstNameError: null,
        lastNameError: null,
        emailError: null,
        phoneError: null,
        locationError: null,
        passwordError: null,
        confirmPasswordError: null,
        termsError: null,
      }
    }
  }

  componentDidMount() {
    var { type, user } = this.props.route.params;
    if (user) {
      type = user.type;
      const existingUser = this.state.user;      
      if (user.socialId) {
        existingUser.socialId = user.socialId;
      }

      if (user.socialType) {
        existingUser.socialType = user.socialType;
      }

      if (user.firstName) {
        existingUser.firstName = user.firstName;
      }

      if (user.lastName) {
        existingUser.lastName = user.lastName;
      }

      if (user.email) {
        existingUser.email = user.email;
      }

      if (user.avatar) {
        existingUser.avatar = user.avatar;
      }

      this.setState({user: existingUser});
    }

    if (type === "customer") {
      this.setState({currentPage: 1})
    } else {
      this.setState({currentPage: 0})
    }
  }

  componentWillUnmount() {

  }

  componentDidUpdate(prevProps, prevState) {
    // Get Geo Data.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        const { user } = this.state;
        user.currentLat = this.props.geoData.lat;
        user.currentLng = this.props.geoData.lng;
        this.setState({
          user: user, 
        }, () => {
          if (this.state.currentPage == 0) {
            // Checking Email For Chef.
            this.setState({isLoading: true}, () => { 
              this.props.dispatch({
                type: actionTypes.CHECK_EMAIL,
                email: user.email,
              });
            }); 
          } else {
            // Register Customer.
            this.registerCustomer();
          }          
        });        
      } else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
      }      
    }

    // Register Customer.
    if (prevProps.registerCustomerStatus != this.props.registerCustomerStatus) {
      if (this.props.registerCustomerStatus == Status.SUCCESS) {
        this.registerCustomerSuccess();
      } 
      else if (this.props.registerCustomerStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }

    // Check Email.
    if (prevProps.checkEmailStatus != this.props.checkEmailStatus) {
      if (this.props.checkEmailStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.moveNextPage();
      } else if (this.props.checkEmailStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }
  }


  onBack() {
    this.props.navigation.goBack();
  }

  onSelectPage(index) {
    this.setState({currentPage: index});
  }

  onTerms() {
    Keyboard.dismiss();
    this.props.navigation.navigate('Terms', {page: WEB_PAGE_TYPE.TERMS});
  }

  onMoveHome() {
    this.props.navigation.navigate("CustomerTab");
  }

  onChangeLocation(address) {
    var user = this.state.user;
    user.location = address;
    user.locationText = address;
    user.locationError = null;
    this.setState({user});
  }


  onChangeUser(key, value) {
    var user = this.state.user;
    if (key == "avatar") {
      user.avatar = value;
    }
    else if (key == "avatarFile") {
      user.avatarFile = value;
    }
    else if (key == "firstName") {
      user.firstName = getOnlyAlphabetLetters(value);
      user.firstNameError = "";
    } else if (key == "lastName") {
      user.lastName = getOnlyAlphabetLetters(value);
      user.lastNameError = "";
    } else if (key == "email") {
      user.email = value;
      if (value && value != "" && validateEmail(value)) {
        user.emailError = "";
      }      
    } else if (key == "phone") {
      user.phone = value;
      user.phoneError = "";
    } else if (key == "location") {
      user.locationText = value;
      user.locationError = "";
    } else if (key == "password") {
      user.password = value;
      user.passwordError = "";
    } else if (key == "confirmPassword") {
      user.confirmPassword = value;
      user.confirmPasswordError = "";
    } else if (key == "gender") {
      user.gender = value;
    }

    this.setState({user: user});
  }

  onRegister() {
    Keyboard.dismiss();

    var isValid = true;
    const user = this.state.user;
    if (user.firstName == null || user.firstName.length == 0) {
      user.firstNameError = Messages.InvalidFirstname;
      isValid = false;
    }

    if (user.lastName == null || user.lastName.length == 0) {
      user.lastNameError = Messages.InvalidLastname;
      isValid = false;
    }

    if (user.email == null || user.email.length == 0 || !validateEmail(user.email)) {
      user.emailError = Messages.InvalidEmail;
      isValid = false;
    }

    if (user.phone == null || user.phone.length == 0) {
      user.phoneError = Messages.InvalidPhone;
      isValid = false;
    }

    if (user.location == null || user.location.length == 0 || user.location != user.locationText) {
      user.locationError = Messages.InvalidAddress;
      isValid = false;
    }

    if (user.socialId == null) {
      if (user.password == null || user.password.length == 0) {
        user.passwordError = Messages.InvalidPassword;
        isValid = false;
      } 
      else if (user.password.length < PASSWORD_MIN_LENGTH) {
        user.passwordError = Messages.ShortPasswordError;
        isValid = false;
      }

      if (user.confirmPassword == null || user.confirmPassword.length == 0) {
        user.confirmPasswordError = Messages.InvalidConfirmPassword;
        isValid = false;
      } else if (user.confirmPassword != user.password) {
        user.confirmPasswordError = Messages.InvalidPasswordNotMatch;
        isValid = false;
      }
    }

    if (!this.state.agreeTerms) {
      this.setState({termsError: Messages.InvalidTerms});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.GET_GEODATA,
          address: user.location,
        });
      });      
    } else {
      this.setState({user: user});
    }    
  }

  registerCustomer() {
    var { user } = this.state;
    user.player_id = this.props.playerId;

    if (this.state.currentPage == 1) {
      this.props.dispatch({
        type: actionTypes.REGISTER_CUSTOMER,
        user: user,
      });
    }
  }

  async registerCustomerSuccess() {
    this.setState({isLoading: false});
    Storage.USERID.set(this.props.currentUser._id);
    this.onMoveHome();
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

  moveNextPage() {
    this.setState({isLoading: false});
    const user = this.state.user;
    this.props.navigation.navigate("IDVerification", {user: user});
  }

  render() {
    const {
      user,
      currentPage,
      termsError,
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <BackgroundImage/>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.container}>
            <TopNavBar 
              title="Sign Up" 
              theme="green" 
              leftButton="back"
              onBack={() => this.onBack()}
            />
            <KeyboardAwareScrollView>
              <View style={{flex: 1}}>
                <RegisterPage 
                  user={user} 
                  type={currentPage}
                  onChangeUser={(key, value) => this.onChangeUser(key, value)} 
                  onChangeLocation={(address) => this.onChangeLocation(address)}
                  onTerms={() => this.onTerms()}
                  onRegister={() => this.onRegister()}
                />
                <View style={styles.viewBottom}>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <CheckBox 
                      value={this.state.agreeTerms} 
                      onChange={(selected) => this.setState({agreeTerms: selected, termsError: ''})} 
                    />
                    <Label title="I agree to the " color="black" style={{marginLeft: 10}}/>
                    <Button title="Terms and Conditions" bold={true} color={Colors.textColor} onPress={() => this.onTerms()}/>
                  </View>          
                  {
                    (termsError && termsError.length > 0) 
                    ? <Text style={styles.errorText}>{termsError}</Text>
                    : null
                  }
                  <RoundButton 
                    title="Register" 
                    theme="main" 
                    style={styles.registerButton} 
                    onPress={() => this.onRegister()} />
                </View>
              </View>
            </KeyboardAwareScrollView>
            <Toast ref={ref => (this.toast = ref)}/>
            {
              this.state.isLoading
              ? <LoadingOverlay />
              : null
            }

          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  viewBottom: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },

  registerButton: {
    marginTop: 20,
    width: '90%'
  },

  errorText: {
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
    color: '#cf0000',
    fontSize: 11,
    marginTop: 5,
    marginBottom: 10,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    geoData: state.globals.geoData,
    errorGlobalMessage: state.globals.errorMessage,
    getGeoDataStatus: state.globals.getGeoDataStatus,

    currentUser: state.user.currentUser,
    playerId: state.user.playerId,    
    errorMessage: state.user.errorMessage,
    registerCustomerStatus: state.user.registerCustomerStatus,
    checkEmailStatus: state.user.checkEmailStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUpScreen);