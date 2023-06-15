import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Image, Dimensions } from 'react-native';
import Colors from '../../theme/Colors'
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';

const win = Dimensions.get('window');

export default class ShippingAddressCell extends Component {
    render() {
        const { data, onEdit, onSelect } = this.props;
        var subText = "";
        if (data.apt && data.apt.length > 0) {
            subText += data.apt + " ";
        }

        if (data.zipcode && data.zipcode.length > 0) {
            subText += data.zipcode + " ";
        }

        return (
            <View style={[this.props.style, styles.container]}>
                <TouchableWithoutFeedback onPress={() => onSelect(data)}>
                    <View style={styles.contentView}>
                        <View style={styles.leftView}>
                            <Text style={[styles.addressText, data.isActive ? {color: Colors.appColor} : {} ]}>{data.address}</Text>
                            <Text style={[styles.subText, data.isActive ? {color: Colors.appColor} : {}]}>{subText}</Text>
                        </View>    
                        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(data)}>
                            <Image source={Images.icon_edit} style={styles.editIcon} />
                        </TouchableOpacity>  
                    </View>
                </TouchableWithoutFeedback>                
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    contentView: {
        backgroundColor: 'white',
        flex: 1,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
    },

    leftView: {
        width: win.width - 130,
    },

    addressText: {
        fontFamily: Fonts.bold,
        color: 'black',        
        fontSize: 16,
    },

    subText: {
        fontFamily: Fonts.regular,
        color: 'black',  
        fontSize: 14,    
        opacity: 0.8,  
        marginTop: 2,
    },

    editBtn: {
        
    },

    editIcon: {
        width: 17,
        height: 17,
        resizeMode: 'contain',
    }
});