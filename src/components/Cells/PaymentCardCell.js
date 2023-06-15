import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { getPaymentIcon } from '../../functions';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts';

const win = Dimensions.get('window');

export default class PaymentCardCell extends Component {
    render() {
        const { data, isSelected, onSelect } = this.props;
        var icon = getPaymentIcon(data.brand);

        return (
            <View style={[this.props.style, styles.container]}>
                <TouchableWithoutFeedback onPress={() => onSelect(data)}>
                    <View style={styles.contentView}>
                        <View style={styles.leftView}>
                            <Icon name={icon} size={30} color={Colors.appColor} style={styles.brandIcon}/>
                            <View>
                                <Text style={[styles.addressText, isSelected ? {color: Colors.appColor} : {}]}>**** **** **** {data.last4}</Text>
                                <Text style={[styles.subText, isSelected ? {color: Colors.appColor} : {}]}>{data.expMonth} / {data.expYear}</Text>
                            </View>                            
                        </View>    
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
        paddingLeft: 60,
    },

    brandIcon: {
        position: 'absolute',
        left: 5,
    },

    addressText: {
        fontFamily: Fonts.bold,
        color: 'black',        
        fontSize: 16,
        marginTop: 3,
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