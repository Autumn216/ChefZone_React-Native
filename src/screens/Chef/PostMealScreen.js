import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Keyboard,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-easy-toast'
import Colors from '../../theme/Colors'
import RoundButton from '../../components/RoundButton'
import RoundTextInput from '../../components/RoundTextInput'
import TopNavBar from '../../components/TopNavBar'
import AddExtraModal from '../../components/Modal/AddExtraModal'
import ImagePickerSlider from '../../components/ImagePickerSlider'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import Images from '../../theme/Images'
import Messages from '../../theme/Messages'
import Fonts from '../../theme/Fonts';

const win = Dimensions.get('window');

class PostMealScreen extends Component {
  constructor() {
    super()
    this.state = {
      isShowAddExtra: false,
      
      title: '',
      description: '',
      inside: '',
      price: '',
      photos: [],
      extra: [],

      titleError: '',
      descriptionError: '',
      insideError: '',
      priceError: '',
      photoError: '',

      isLoading: false,
    }    
  }

  componentDidUpdate(prevProps, prevState) {

    // Create Meal.
    if (prevProps.createMealStatus != this.props.createMealStatus) {
      if (this.props.createMealStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.onCompletedCreateMeal();
      } 
      else if (this.props.createMealStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  onCompletedCreateMeal() {
    Alert.alert(
      '',
      Messages.AlertMealCreated,
      [
        {text: 'OK', onPress: () => {
          this.props.navigation.pop(1);
          this.props.navigation.navigate('MealsStack');
        }},
      ],
      { cancelable: false }
    );   
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onPostJob() {
    Keyboard.dismiss();
    var isValid = true;

    const { 
      title,
      description,
      inside,
      photos,
      price,
      extra
    } = this.state;

    // Photos.
    if (photos == null || photos.length == 0) {
      this.setState({photoError: Messages.InvalidMealPhoto});
      isValid = false;
    }

    // Title.
    if (title == null || title.length == 0) {
      this.setState({titleError: Messages.InvalidMealTitle});
      isValid = false;
    }

    // Description
    if (description == null || description.length == 0) {
      this.setState({descriptionError: Messages.InvalidMealDescription});
      isValid = false;
    }

    // Inside
    if (inside == null || inside.length == 0) {
      this.setState({insideError: Messages.InvalidMealInside});
      isValid = false;
    }

    // Price
    if (price == null || price.length == 0 || isNaN(price) || parseFloat(price) < 0) {
      this.setState({priceError: Messages.InvalidMealPrice});
      isValid = false;
    }

    if (isValid) {
      const { currentUser } = this.props;
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.CREATE_MEAL,
          data: {
            title,
            description,
            inside,
            photos,
            price,
            extra,
            creator: currentUser._id 
          },
        });
      });       
    }
  }

  onTakePicture() {
    const options = {
      title: 'Select Image',
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

        var { photos } = this.state;
        photos.push(response);
        this.setState({photos, photoError: ''});
      }
    });
  }

  onRemovePhoto(index) {
    var { photos } = this.state;
    photos.splice(index, 1);
    this.setState({ photos });
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

  onAddExtra(name, price) {
    const { extra } = this.state;
    extra.push({
      name, 
      price
    });
    this.setState({extra, isShowAddExtra: false});
  }

  onRemoveExtra(index) {
    var { extra } = this.state;
    extra.splice(index, 1);
    this.setState({extra});
  }

  _renderInputForm() {
    const { 
      title, 
      description, 
      inside, 
      price, 
      photos, 
      titleError,
      descriptionError,
      insideError,
      priceError,
      photoError,
    } = this.state;
    return (
      <View>
        <ImagePickerSlider
          placeholderImage={Images.placeholder_image}
          placeholderText="Upload Image"
          errorMessage={photoError}
          photos={photos} 
          onTakePhoto={() => this.onTakePicture()} 
          onRemovePhoto={(index) => this.onRemovePhoto(index)}
        />

        <RoundTextInput
          placeholder="Title" 
          type="text"
          value={title} 
          errorMessage={titleError}
          returnKeyType="next"
          maxLength={100}
          style={{marginTop: 20}}
          onChangeText={(text) => this.setState({title: text, titleError: ''})}
          onSubmitEditing={() => { this.descriptionInput.focus() }}
        />

        <RoundTextInput
          placeholder="Description" 
          type="textview"
          value={description} 
          errorMessage={descriptionError}
          onRefInput={(input) => { this.descriptionInput = input }}
          onChangeText={(text) => this.setState({description: text, descriptionError: ''})}
        />

        <RoundTextInput
          placeholder="What's inside" 
          type="textview"
          value={inside} 
          errorMessage={insideError}
          onRefInput={(input) => { this.insideInput = input }}
          onChangeText={(text) => this.setState({inside: text, insideError: ''})}
        />

        <RoundTextInput
          placeholder="Meal Price" 
          type="number"
          value={price} 
          errorMessage={priceError}
          returnKeyType="done"
          maxLength={15}
          onChangeText={(text) => this.setState({price: text, priceError: ''})}
        />
        <View style={styles.extraContainer}>
          <View style={styles.extraHeader}>
            <Text style={styles.sectionTitle}>Extra Items</Text>
            <TouchableOpacity onPress={() => this.setState({isShowAddExtra: true})}>
              <Image source={Images.circle_plus_icon} style={{width: 27, height: 27, resizeMode: 'contain'}}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
  _renderExtra(extra) {
    return (
      <View>
        {
            extra.map((item, i) =>
              <View 
                style={styles.extraItem} 
                rightOpenValue={-50}
                key={i.toString()}
              >
                <View>
                  <Text style={styles.extraItemNameText}>{item.name}</Text>
                  <Text style={styles.extraItemPriceText}>${item.price.toFixed(2)}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity 
                    style={{marginLeft: 10}}
                    onPress={() => {
                      this.onRemoveExtra(i)
                    }}
                  >
                    <Image source={Images.icon_trash}  style={{width: 25, height: 25, resizeMode: 'contain'}} />
                  </TouchableOpacity>
                </View>
              </View>
	    				)
					}
      </View>
    )
  }

  _renderFooter() {
    return (
      <View style={{paddingBottom: 40}}>
        <RoundButton 
          title="Post" 
          theme="main" 
          onPress={() => this.onPostJob()} 
        />
      </View>
    )
  }

  render() {
    const { 
      extra,
      isShowAddExtra
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title="Add New Meal" 
                theme="black" 
                leftButton="back"
                onBack={() => this.onBack()}
              />
                <View style={styles.container}>
                  <KeyboardAwareScrollView style={{padding: 20}}>
                    { this._renderInputForm() }
                    { this._renderExtra(extra) }
                    { this._renderFooter() }
                  </KeyboardAwareScrollView>
                </View>
            </View>
        }
        </SafeAreaInsetsContext.Consumer>
        <AddExtraModal 
          isVisible={isShowAddExtra}
          onClose={() => this.setState({isShowAddExtra: false})}
          onAdd={(name, price) => this.onAddExtra(name, price)}
        />
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
    overflow: 'hidden',
  },

  extraContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    marginTop: 15,
    marginBottom: 20,
  },

  extraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },

  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.textColor,
  },

  extraItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.borderColor,
    backgroundColor: 'white',
    shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
    elevation: 3,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  extraItemNameText: {
    fontFamily: Fonts.medium,
    color: Colors.textColor,
    fontSize: 17,
    width: win.width - 100,
  },

  extraItemPriceText: {
    fontFamily: Fonts.regular,
    color: Colors.appColor,
    width: win.width - 100,
    fontSize: 14,
    marginTop: 2,
  },

  rowBack: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  trashBtn: {
    marginTop: 13,
    marginRight: 15,
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

    errorMessage: state.meals.errorMessage,    
    createMealStatus: state.meals.createMealStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(PostMealScreen);