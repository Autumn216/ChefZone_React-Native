import React, { Component } from 'react';
import { Text, View, StyleSheet, Switch, Image, TouchableOpacity } from 'react-native';
import Colors from '../../theme/Colors';
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';

class SettingsInfoCell extends Component {
    render() {
        const { type, icon, value, label, onPress } = this.props;
        
        return (
            <View style={[this.props.style]}>
                {
                    type == "submenu" 
                    ? <TouchableOpacity style={styles.container} onPress={() => onPress()}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={icon} style={styles.iconImage} />
                            <Text style={styles.labelText}>{label}</Text>
                        </View>                        
                        <Image
                           style={styles.arrowIcon}
                           source={Images.arrow_right}
                        />   
                      </TouchableOpacity>

                    : null
                }

                {
                    type == "switch"
                    ? <View style={styles.container}>
                        <Text style={styles.labelText}>{label}</Text>
                        <Switch trackColor={{true: Colors.appColor, false: null}} value={value} onValueChange={(value) => this.props.onChange(value)}/>
                      </View>
                    : null
                }

                {
                    type == "red"
                    ? <TouchableOpacity style={styles.container} onPress={() => onPress()}>
                        <Text style={styles.redText}>{label}</Text>
                      </TouchableOpacity>
                    : null
                }

            </View>
        );
    }
}

export default SettingsInfoCell;

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        marginHorizontal: 15,
        flexDirection: 'row',
        paddingLeft: 14,
        paddingRight: 14,
        paddingVertical: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 15,
        shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.1,
		shadowRadius: 5,
        elevation: 5,
    },

    labelText: {
        fontFamily: Fonts.avenirBlack,
        color: '#13326D',
        fontSize: 17
    },

    redText: {
        textAlign: 'center',
        fontFamily: Fonts.avenirBlack,
        color: Colors.redColor,
        width: '100%',
        fontSize: 18,
        textTransform: 'uppercase',
    },

    arrowIcon: {
        width: 10,
        height: 20,
    },

    iconImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginTop: 10,
    },
});