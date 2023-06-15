import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker';
import Toast, {DURATION} from 'react-native-easy-toast'
import BackgroundImage from '../components/BackgroundImage'
import LoadingOverlay from './../components/LoadingOverlay'
import RoundTextInput from './../components/RoundTextInput'
import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import ImagePickerSlider from '../components/ImagePickerSlider'
import { TOAST_SHOW_TIME, Status } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import { makeRandomText } from '../functions';
import Fonts from '../theme/Fonts'
import Images from '../theme/Images'
import Messages from '../theme/Messages'

class IDVerificationScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor() {
    super()
    this.state = {
      isLoading: false,
      idCards: [],      
      idNumber: '',
      idNote: '',

      idCardsError: '',
      idNumberError: '',
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.registerChefStatus != this.props.registerChefStatus) {
      if (this.props.registerChefStatus == Status.SUCCESS) {
        this.registerChefSuccess();
      } else if (this.props.registerChefStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  onMoveHome() {
    Alert.alert(
      '',
      Messages.AlertRegisterCompleted,
      [
        {text: 'OK', onPress: () => {
          this.setState({isLoading: false}, () => { 
            this.props.navigation.popToTop();
          });           
        }},
      ],
      {cancelable: false},
    );    
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onNext() {
    Keyboard.dismiss();
    
    const {
      idCards,
      idNumber,
      idNote,
    } = this.state;

    var isValid = true;
    if (idCards == null || idCards.length <= 0) {
      this.setState({idCardsError: Messages.InvalidIDCard});
      isValid = false;
    }

    if (idNumber == null || idNumber.length <= 0) {
      this.setState({idNumberError: Messages.InvalidIDNumber});
      isValid = false;
    }

    if (isValid) {
      var { user } = this.props.route.params;
      user.idCards = idCards;
      user.idNumber = idNumber;
      user.idNote = idNote;
      user.player_id = this.props.playerId;

      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.REGISTER_CHEF,
          user: user,
        });
      });   
    }    
  }

  onTakePicture() {
    const options = {
      title: 'Upload your License ID',
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
        var fileName = "";
        if (response.fileName && response.fileName.length > 0) {
          fileName = response.fileName;
        } else {
          fileName = makeRandomText(20);
        }
        const photo = {
          fileName: fileName,
          type: response.type,
          uri: response.uri 
        };
        this.state.idCards.push(photo);
        this.setState({
          idCards: this.state.idCards,
          idCardsError: '',
        });
      }
    });
  }

  onRemovePhoto(index) {
    console.log(index);
    this.state.idCards.splice(index, 1);
    this.setState({
      idCards: this.state.idCards,
    });
  } 

  registerChefSuccess() {
    this.setState({isLoading: false});
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

  render() {
    const { 
      idCards,
      idNumber,
      idNote,

      idCardsError,
      idNumberError,
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <BackgroundImage />
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar title="License" leftButton="back" theme="green" onBack={() => this.onBack()}/>
              <View style={styles.container}>
                <KeyboardAwareScrollView style={{padding: 20}}>
                  <View style={styles.contentView}>
                    <ImagePickerSlider
                      placeholderImage={Images.id_card_icon}
                      placeholderText="Upload your license"
                      photos={idCards} 
                      errorMessage={idCardsError}
                      onTakePhoto={() => this.onTakePicture()} 
                      onRemovePhoto={(index) => this.onRemovePhoto(index)}
                    />

                    <RoundTextInput
                      type="text"
                      label="License No:"
                      style={{marginTop: 15}}
                      value={idNumber} 
                      errorMessage={idNumberError}
                      returnKeyType="next"
                      onSubmitEditing={(input) => { this.otherInput.focus() }}
                      onChangeText={(text) => this.setState({idNumber: text, idNumberError: null})} 
                      />

                    <RoundTextInput
                      label="Note:" 
                      type="textview"
                      value={idNote} 
                      onRefInput={(input) => { this.otherInput = input }}
                      onChangeText={(text) => this.setState({idNote: text})} />

                  </View>
                  <RoundButton 
                    title="Done" 
                    theme="main" 
                    style={styles.nextButton} 
                    onPress={() => this.onNext()} 
                  />
                </KeyboardAwareScrollView>
              </View>
            </View>
          }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)}/>
        {
          this.state.isLoading
          ? <LoadingOverlay />
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentView: {
    
  },

  nextButton: {
    
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  descriptionText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: Fonts.regular,
    fontSize: 13,
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
    playerId: state.user.playerId,
    registerChefStatus: state.user.registerChefStatus,
    errorMessage: state.user.errorMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(IDVerificationScreen);