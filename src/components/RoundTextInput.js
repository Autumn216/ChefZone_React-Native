import React, { Component } from 'react';
import { 
    View, 
    StyleSheet, 
    TextInput, 
    Image, 
    Text, 
    ScrollView, 
    TouchableOpacity 
} from 'react-native';
import Colors from '../theme/Colors'
import RNPickerSelect from 'react-native-picker-select';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from './LocationItem';
import { GOOGLE_API_KEY } from '../constants.js'
import Fonts from '../theme/Fonts'
import Images from '../theme/Images'

class RoundTextInput extends Component {

    constructor() {
        super()
        this.state = {
          displayPassword: false,
          showAddressList: false
        }
    }

    onChangeDatePicker= (event, selectedValue) => {
        console.log("event: ", event);
        console.log("selectedValue: ", selectedValue);
    }

    render() {
        const { 
            type,
            icon, 
            value, 
            align, 
            autoFocus,
            label, 
            editable,
            onRefInput, 
            placeholder, 
            onCloseModal,
            maxLength,
            onChangeText,
            onSubmitEditing,
            onSelect,
            returnKeyType
        } = this.props;
        return (
            <View style={[this.props.style, styles.container]}>
                {
                    (label && label.length > 0) 
                    ? <Text style={styles.labelText}>{label}</Text>
                    : null
                }

                <View style={[styles.content, icon ? {paddingRight: 35} : {}]}>
                    {
                        (type === "text")
                        ? <TextInput
                            style={[styles.textInput, align == "center" ? styles.centerText : null]}
                            underlineColorAndroid='transparent'
                            placeholder={placeholder}
                            placeholderTextColor={Colors.roundTextInputPlaceColor}
                            onChangeText={this.props.onChangeText}
                            value={value}
                            autoFocus={autoFocus}
                            editable={editable}
                            maxLength={maxLength}
                            ref={onRefInput}
                            returnKeyType={returnKeyType}
                            onSubmitEditing={onSubmitEditing}
                        />
                        : null
                    }
                    {
                        (type === "button")
                        ? <TouchableOpacity onPress={onSelect}>
                            <View pointerEvents="none">
                            <TextInput
                                editable={false}
                                selectTextOnFocus={false}
                                style={[styles.textInput, align == "center" ? styles.centerText : null]}
                                underlineColorAndroid='transparent'
                                placeholder={placeholder}
                                autoFocus={autoFocus}
                                maxLength={maxLength}
                                placeholderTextColor={Colors.roundTextInputPlaceColor}
                                value={value}
                                ref={onRefInput}
                            />
                            </View>
                         </TouchableOpacity>
                        : null
                    }
                    {
                        (type === "number")
                        ? <TextInput
                            style={[styles.textInput, align == "center" ? styles.centerText : null]}
                            underlineColorAndroid='transparent'
                            keyboardType={'numeric'}
                            placeholderTextColor={Colors.roundTextInputPlaceColor}
                            onChangeText={onChangeText}
                            editable={editable}
                            autoFocus={autoFocus}
                            value={value}
                            maxLength={maxLength}
                            placeholder={placeholder}
                            ref={onRefInput}
                            returnKeyType={returnKeyType}
                            onSubmitEditing={onSubmitEditing}
                        />
                        : null
                    }
                    {
                        (type === "phone")
                        ? <TextInput
                            style={[styles.textInput, align == "center" ? styles.centerText : null]}
                            underlineColorAndroid='transparent'
                            keyboardType='phone-pad'
                            placeholderTextColor={Colors.roundTextInputPlaceColor}
                            onChangeText={onChangeText}
                            value={value}
                            autoFocus={autoFocus}
                            editable={editable}
                            maxLength={maxLength}
                            placeholder={placeholder}
                            ref={onRefInput}
                            returnKeyType={returnKeyType}
                            onSubmitEditing={onSubmitEditing}
                        />
                        : null
                    }

                    {
                        (this.props.type === "email")
                        ? <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={styles.textInput}
                            keyboardType='email-address'
                            placeholderTextColor={Colors.roundTextInputPlaceColor}
                            underlineColorAndroid='transparent'
                            onChangeText={onChangeText}
                            value={value}
                            autoFocus={autoFocus}
                            maxLength={maxLength}
                            editable={editable}
                            placeholder={placeholder}
                            ref={onRefInput}
                            returnKeyType={returnKeyType}
                            onSubmitEditing={onSubmitEditing}
                        />
                        : null
                    }

                    {
                        (type === "password")
                        ? <TextInput
                            textContentType="none"
                            secureTextEntry={!this.state.displayPassword}
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={styles.textInput}
                            maxLength={maxLength}
                            autoFocus={autoFocus}
                            placeholderTextColor={Colors.roundTextInputPlaceColor}
                            underlineColorAndroid='transparent'
                            onChangeText={onChangeText}
                            value={value}
                            editable={editable}
                            placeholder={placeholder}
                            ref={onRefInput}
                            returnKeyType={returnKeyType}
                            onSubmitEditing={onSubmitEditing}
                        />
                        : null
                    }
                    {
                        (type === "textview")
                        ? <TextInput
                            style={styles.textView}
                            placeholderTextColor={Colors.roundTextInputPlaceColor}
                            underlineColorAndroid='transparent'
                            numberOfLines={6}
                            multiline={true}
                            maxLength={maxLength}
                            autoFocus={autoFocus}
                            onChangeText={onChangeText}
                            value={value}
                            editable={editable}
                            placeholder={placeholder}
                            ref={onRefInput}
                            returnKeyType={returnKeyType}
                            onSubmitEditing={onSubmitEditing}
                        />
                        : null
                    }
                    {
                        (type === "address")
                        ? <GoogleAutoComplete apiKey={GOOGLE_API_KEY} debounce={300} queryTypes="address">
                            {({ inputValue, handleTextChange, locationResults, fetchDetails }) => {
                                return (
                                    <React.Fragment>
                                    <TextInput
                                        value={value}
                                        onChangeText={(text) => {
                                            handleTextChange(text);
                                            onChangeText(text);
                                        }}
                                        placeholder={placeholder}
                                        autoFocus={autoFocus}
                                        maxLength={maxLength}
                                        placeholderTextColor={Colors.roundTextInputPlaceColor}
                                        returnKeyType={returnKeyType}
                                        onFocus={ () => this.setState({showAddressList: true}) }
                                        ref={onRefInput}
                                        style={styles.textInput}
                                        onSubmitEditing={onSubmitEditing}
                                    />
                                    {
                                        this.state.showAddressList && this.props.value.length > 0
                                        ? <ScrollView style={{ maxHeight: 150 }}>
                                            {locationResults.map((el, i) => (
                                            <LocationItem
                                                {...el}
                                                fetchDetails={fetchDetails}
                                                key={String(i)}
                                                onSelectAddress={(address) => {
                                                    this.setState({showAddressList: false});
                                                    this.props.onChangeText(address)
                                                    this.props.onSelectAddress(address)
                                                }}
                                            />
                                            ))}
                                        </ScrollView>  
                                        : null
                                    }
                                
                                    </React.Fragment>
                                )
                            }}
                            </GoogleAutoComplete>
                        : null
                    }

                    {
                        (type === "dropdown")
                        ? <View style={[styles.boxContainer, Platform.OS === 'ios' ? { paddingVertical: 10 } : { }]}>
                            <RNPickerSelect
                                style={{
                                    ...pickerSelectStyles,
                                    iconContainer: {
                                        top: Platform.OS === 'ios' ? 6 : 20,
                                        right: 5,
                                    },
                                }}
                                value={value}
                                ref={onRefInput}
                                placeholder={{
                                    label: placeholder,
                                    value: null,
                                    color: Colors.placeholderColor,
                                }}
                                onValueChange={(value) => this.props.onChangeText(value)}
                                items={this.props.data}
                                Icon={() => {
                                return <Image
                                        style={styles.dropdownIcon}
                                        source={Images.dropdown_icon}
                                        />;
                                }}
                                onClose={() => {
                                    if (onCloseModal) {
                                        onCloseModal()
                                    }                            
                                }}
                            />
                        </View>
                        : null
                    }
                </View>              
                {
                    icon &&
                    <Image source={icon} style={styles.iconImage}/>
                }
                {
                    this.props.errorMessage
                    ? <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
                    : null
                }
            </View>
        );
    }
}

export default RoundTextInput;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },

    content: {
        borderWidth: 0.5,
        borderColor: '#e6e6e6',
        paddingVertical: 2,
        borderRadius: 25,
        paddingHorizontal: 17,
        backgroundColor: '#f9f9f9',
        shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.07,
		shadowRadius: 2,
        elevation: 2,
        margin: 5,
    },

    labelText: {
        fontFamily: Fonts.bold,
        color: 'black',
        fontSize: 16,
        marginBottom: 10,
    },
    
    textInput: {
        fontFamily: Fonts.regular,
        fontSize: 15,
        height: '100%',
        height: 50,
        color: Colors.textColor,
    },

    hasShowButtonTextInput: {
        fontSize: 16,
        height: '100%',
        marginRight: 30,
        height: 42,
    },

    whiteText: {
        color: 'white',
        fontFamily: Fonts.regular,        
    },

    grayText: {
        color: 'black',
        fontFamily: Fonts.regular,
    },

    forgotTextInput: {
        color: '#474747',
        paddingLeft: 5,
        fontSize: 17,
        paddingRight: 70,
        position: 'relative',
    },

    forgotButton: {
        position: 'absolute',
        right: 0,
    },

    forgotButtonText: {
        fontSize: 11,
        backgroundColor: '#0d4e6c',
        textTransform: 'uppercase',
        color: 'white',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
    },

    formField: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    eye_icon: {
        width: 21,
        height: 15,
        resizeMode: 'cover',
    },

    textView: {
        height: 105,
        color: Colors.textColor,
        textAlignVertical: "top",
        fontSize: 16,
        fontFamily: Fonts.regular,
    },

    iconView: {
        left: 0,
        top: 7,
        position: 'absolute',
    },

    iconImage: {
        width: 25,
        height: 25,
        resizeMode: 'cover',
    },

    showPasswordButton: {
        position: 'absolute',
        right: 0,
        top: 12,
    },

    errorMessage: {
        fontFamily: Fonts.regular,
        fontStyle: 'italic',
        color: '#cf0000',
        fontSize: 11,
        marginLeft: 20,
        marginTop: 5,
    },

    centerText: {
        textAlign: 'center'
    },

    dropdownIcon: {
        width: 17,
        height: 10,
        resizeMode: 'contain',
    },

    iconImage: {
        width: 18,
        height: 18,
        position: 'absolute',
        right: 20,
        top: 15,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: 'black',
      zIndex: 10,
      paddingRight: 15,
    },
    inputAndroid: {
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: 'black',
      zIndex: 10,
    },
  });