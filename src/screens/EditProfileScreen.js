import React, { Component } from 'react';
import {
  View,
  Alert,
  Text,
  StyleSheet,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../components/TopNavBar'
import NavImage from '../components/NavImage'
import RoundButton from '../components/RoundButton'
import LabelFormInput from '../components/LabelFormInput'
import EditAvatar from '../components/EditAvatar'
import LoadingOverlay from '../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import {validateEmail, getOnlyAlphabetLetters, filterPickerData} from '../functions'
import Colors from '../theme/Colors'
import Messages from '../theme/Messages'

class EditProfile extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor() {
    super()
    this.state = {
      type: '',
      id: '',
      avatar: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      locationText: '',
      currentLat: 0,
      currentLng: 0,

      deliveryFee: '',
      taxRate: '',

      firstNameError: '',
      lastNameError: '',
      emailError: '',
      phoneError: '',
      locationError: '',
      deliveryFeeError: '',
      taxRateError: '',

      isLoading: false,
    }
  }

  componentDidMount() {
    if (this.props.currentUser) {
      const { currentUser } = this.props;
      this.setState({
        id: currentUser._id,
        type: currentUser.type,
        avatar: currentUser.avatar,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        location: currentUser.location,
        locationText: currentUser.location,
        currentLat: currentUser.geolocation.coordinates[1],
        currentLng: currentUser.geolocation.coordinates[0],
      });

      if (currentUser.type == "chef") {
        const deliveryFee = currentUser.deliveryFee ? currentUser.deliveryFee : 0;
        const taxRate = currentUser.taxRate ? currentUser.taxRate : 0;

        this.setState({
          deliveryFee: deliveryFee + "",
          taxRate: taxRate + ""
        })
      }
    }      
  }

  componentDidUpdate(prevProps, prevState) {
    // Get Geo Data.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        this.setState({
          zipcode: this.props.geoData.zipcode,
          currentLat: this.props.geoData.lat, 
          currentLng: this.props.geoData.lng
        }, () => {
          this.updateProfileData();
        });        
      } else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
      }      
    }

    if (prevProps.updateProfileStatus != this.props.updateProfileStatus) {
      if (this.props.updateProfileStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showMessage(Messages.ProfileUpdated, true);
      } else if (this.props.updateProfileStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }    
  }

  showMessage(message, isBack) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          if (isBack) this.onBack();
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

  onSelectedItemsChange = selectedItems => {
    this.setState({ services: selectedItems, servicesError: null });
  };

  onBack() {
    this.props.navigation.goBack();
  }

  onChangeLocation(address) {
    this.setState({location: address, locationText: address});
  }

  onMakeChanges() {
    Keyboard.dismiss();
    const { currentUser } = this.props;
    var isValid = true;
    const {
      firstName, 
      lastName, 
      email, 
      phone, 
      location, 
      locationText,
      avatarFile,

      deliveryFee,
      taxRate
    } = this.state;

    if (firstName == null || firstName.length == 0) {
      this.setState({firstNameError: Messages.InvalidFirstname});
      isValid = false;
    }

    if (lastName == null || lastName.length == 0) {
      this.setState({lastNameError: Messages.InvalidLastname});
      isValid = false;
    }

    if (email == null || email.length == 0 || !validateEmail(email)) {
      this.setState({emailError: Messages.InvalidEmail});
      isValid = false;
    }

    if (phone == null || phone.length == 0) {
      this.setState({phoneError: Messages.InvalidPhone});
      isValid = false;
    }

    if (location == null || location.length == 0 || location != locationText) {
      this.setState({locationError: Messages.InvalidAddress});
      isValid = false;
    }

    if (currentUser.type == "chef") {
      if (deliveryFee == null || isNaN(deliveryFee) || parseFloat(deliveryFee) < 0) {
        this.setState({deliveryFee: Messages.InvalidDeliveryFee});
        isValid = false;
      }

      if (taxRate == null || isNaN(taxRate) || parseFloat(taxRate) < 0 || parseFloat(taxRate) > 100) {
        this.setState({taxRateError: Messages.InvalidTaxRate});
        isValid = false;
      }
    }    
    

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.GET_GEODATA,
          address: location,
        });
      });  
    }
  }

  updateProfileData() {
    const {
      id,
      firstName,
      lastName,
      email,
      phone,
      location,
      avatarFile,
      currentLat,
      currentLng,

      deliveryFee,
      taxRate,
    } = this.state;

    let user = {
      id,
      firstName,
      lastName,
      email,
      phone,
      location,
      avatarFile,
      currentLat,
      currentLng,
      
      deliveryFee,
      taxRate,
    };

    this.props.dispatch({
      type: actionTypes.UPDATE_PROFILE,
      user: user,
    });
  }
  
  onTakePicture() {
    const options = {
      title: 'Select Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        this.setState({
          avatar: response.uri,
          avatarFile: response
        });
      }
    });
  }

  filterData(data) {
    var response = [];
    for (var i = 0; i < data.length; i++) {
      const item = data[i];
      response.push({
        id: item._id, 
        label: item.name, 
        value: item.name
      });
    }

    return response;
  }

  onChangeFirstName =(text)=> {
    const name = getOnlyAlphabetLetters(text);
    this.setState({firstName: name, firstNameError: null});
  }

  onChangeLastName =(text)=> {
    const name = getOnlyAlphabetLetters(text);
    this.setState({lastName: name, lastNameError: null});
  }

  onChangeEmail =(text)=> {
    if (validateEmail(text)) {
      this.setState({email: text, emailError: null})
    } else {
      this.setState({email: text})
    }
  }

  render() {
    const { currentUser } = this.props;
    const { 
      type,
      avatar,
      firstName,
      lastName,
      email,
      phone,
      location,
      locationText,
      deliveryFee,
      taxRate,

      firstNameError,
      lastNameError,
      emailError,
      phoneError,
      locationError,
      deliveryFeeError,
      taxRateError,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage theme="green"/>
        <SafeAreaInsetsContext.Consumer>
          {
            insets => 
              <View style={{flex: 1, paddingTop: insets.top }} >
                <TopNavBar 
                  title="EDIT PROFILE" 
                  leftButton="back" 
                  theme="black"  
                  onBack={() => this.onBack()}
                />
                  <View style={styles.container}>
                    <KeyboardAwareScrollView>
                      <View>
                        <View style={styles.profileBox}>
                          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <EditAvatar avatar={avatar} onTakePhoto={() => this.onTakePicture()} />
                          </View>              
                          <View style={styles.rowView}>
                            <LabelFormInput
                              label="First name" 
                              type="text"
                              placeholderTextColor={Colors.placeholderTextColor}
                              value={firstName} 
                              errorMessage={firstNameError}
                              style={{width: '45%'}}
                              returnKeyType="next"                                       
                              onSubmitEditing={() => { this.lastNameInput.focus() }}
                              onChangeText={this.onChangeFirstName} 
                            />

                            <LabelFormInput
                              label="Last name" 
                              type="text"
                              placeholderTextColor={Colors.placeholderTextColor}
                              value={lastName} 
                              errorMessage={lastNameError}
                              style={{width: '45%'}}
                              returnKeyType="next"                                       
                              onRefInput={(input) => { this.lastNameInput = input }}
                              onSubmitEditing={() => { this.emailInput.focus() }}
                              onChangeText={this.onChangeLastName} 
                              />
                          </View>

                          <LabelFormInput
                            label="Email" 
                            type="email"
                            placeholderTextColor={Colors.placeholderTextColor}
                            value={email} 
                            errorMessage={emailError}
                            returnKeyType="next"                                       
                            onRefInput={(input) => { this.emailInput = input }}
                            onSubmitEditing={() => { this.phoneInput.focus() }}
                            onChangeText={this.onChangeEmail} 
                          />

                          <LabelFormInput
                            label="Phone" 
                            type="phone"
                            placeholderTextColor={Colors.placeholderTextColor}
                            value={phone} 
                            errorMessage={phoneError}
                            returnKeyType="next"                                       
                            onRefInput={(input) => { this.phoneInput = input }}
                            onSubmitEditing={() => { this.locationInput.focus() }}
                            onChangeText={(text) => this.setState({phone: text, phoneError: null})} 
                          />

                          <LabelFormInput
                            label="Address" 
                            type="address"
                            returnKeyType="next"
                            placeholderTextColor={Colors.placeholderTextColor}
                            value={locationText}
                            errorMessage={locationError} 
                            onRefInput={(input) => { this.locationInput = input }}
                            onSelectAddress={(address) => this.onChangeLocation(address)}     
                            onChangeText={(text) => this.setState({locationText: text, locationError: null})} 
                          />

                          {
                            (currentUser && currentUser.type == "chef")
                            ? <View style={{borderTopWidth: 1, borderTopColor: Colors.borderColor, paddingTop: 20}}>
                                <LabelFormInput
                                  label="Delivery Fee ($)" 
                                  type="number"
                                  placeholderTextColor={Colors.placeholderTextColor}
                                  value={deliveryFee} 
                                  errorMessage={deliveryFeeError}
                                  returnKeyType="next"                                       
                                  onRefInput={(input) => { this.deliveryFeeInput = input }}
                                  onSubmitEditing={() => { this.taxRateInput.focus() }}
                                  onChangeText={(text) => this.setState({deliveryFee: text, deliveryFeeError: ''})} 
                                />
                                <LabelFormInput
                                  label="Tax Rate (%)" 
                                  type="number"
                                  placeholderTextColor={Colors.placeholderTextColor}
                                  value={taxRate} 
                                  errorMessage={taxRateError}
                                  returnKeyType="done"                                       
                                  onRefInput={(input) => { this.taxRateInput = input }}
                                  onChangeText={(text) => this.setState({taxRate: text, taxRateError: ''})} 
                                />
                              </View>
                            : null
                          }
                        </View>

                        <View style={styles.centerView}>
                          <RoundButton 
                            title="Save Changes" 
                            theme="main" 
                            style={styles.blueButton} 
                            onPress={() => this.onMakeChanges()} />
                        </View>
                      </View>
                    </KeyboardAwareScrollView>
                  </View>
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

  centerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },

  blueButton: {
    width: '90%'
  },

  profileBox: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 20,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 10,
    borderRadius: 10,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 30,
  }
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    availabilities: state.globals.availabilities,
    rates: state.globals.rates,
    services: state.globals.services,
    geoData: state.globals.geoData,
    getGeoDataStatus: state.globals.getGeoDataStatus,
    errorGlobalMessage: state.globals.errorMessage,
      
    currentUser: state.user.currentUser,
    updateProfileStatus: state.user.updateProfileStatus,
    errorMessage: state.user.errorMessage,    
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(EditProfile);