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
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from './LocationItem';
import { GOOGLE_API_KEY } from '../constants.js'
import Fonts from '../theme/Fonts'
import Images from '../theme/Images'
import Colors from '../theme/Colors'
export default  class SearchBox extends Component {

    constructor() {
        super()
        this.state = {
          showAddressList: false
        }
    }

    render() {
        const { 
            value, 
            placeholder, 
            onChangeText,
            returnKeyType,
            autoFocus,
            onReset
        } = this.props;

        return (
            <View style={[styles.container, this.props.style]}>
                <Image source={Images.search_icon} style={styles.searchIcon} />
                <GoogleAutoComplete apiKey={GOOGLE_API_KEY} debounce={300} queryTypes="address">
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
                                placeholderTextColor={Colors.roundTextInputPlaceColor}
                                returnKeyType={returnKeyType}
                                onFocus={ () => this.setState({showAddressList: true}) }
                                style={styles.textInput}
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
                {
                    (value && value.length > 0)
                    ? <TouchableOpacity style={styles.removeBtn} onPress={onReset}>
                        <Image source={Images.icon_close_circle} style={styles.closeIcon} />
                    </TouchableOpacity>
                    : null
                }                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        paddingVertical: 2,
        borderRadius: 25,
        paddingHorizontal: 50,
        backgroundColor: 'white',
    },

    searchIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginRight: 10,
        position: 'absolute',
        top: 10,
        left: 15,
    },

    removeBtn: {
        position: 'absolute',
        right: 15,
        top: 9,
    },

    closeIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        opacity: 0.3
    },

    textInput: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        height: '100%',
        height: 42,
        color: 'black',
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

    iconImage: {
        width: 18,
        height: 18,
        position: 'absolute',
        right: 20,
        top: 15,
    },
});