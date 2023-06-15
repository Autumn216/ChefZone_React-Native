import React, { Component } from 'react';
import { 
    View, 
    StyleSheet, 
    Image, 
    Text, 
    TouchableOpacity 
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { getPaymentIcon } from '../functions'
import Fonts from '../theme/Fonts'
import Images from '../theme/Images'
import Colors from '../theme/Colors'

export default  class PaymentCardBox extends Component {
    render() {
        const { data, isShowEdit, onEdit } = this.props;
        const brand = (data && data.brand) ? data.brand : '';
        const last4 = (data && data.last4) ? data.last4 : '';
        const expMonth = (data && data.expMonth) ? data.expMonth : '';
        const expYear = (data && data.expYear) ? data.expYear : '';
        const paymentIcon = getPaymentIcon(brand);

        return (
        <View style={styles.sectionBox}>
            <View style={styles.shippingInfo}>
                <Text style={styles.labelText}>Payment</Text>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                <Icon name={paymentIcon} size={30} color={Colors.appColor} style={styles.brandIcon}/>
                <View>
                    <Text style={styles.cardNumberText}>**** **** **** {last4}</Text>
                    <Text style={styles.cardExpText}>{expMonth} / {expYear} </Text>
                </View>
                </View>
                {
                    isShowEdit &&
                    <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(data)}>
                        <Image source={Images.icon_edit} style={styles.editIcon}/>
                    </TouchableOpacity>
                }                
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sectionBox: {
        padding: 5,
        marginHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: Colors.borderColor,
        paddingBottom: 20,
    },
    
    shippingInfo: {
        paddingTop: 10,
        paddingBottom: 10,
    },

    labelText: {
        fontFamily: Fonts.avenirBlack,
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },

    editBtn: {
        position: 'absolute',
        right: 0,
        top: 8,
    },

    editIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },

    brandIcon: {
        marginRight: 10,
    },

    cardNumberText: {
        fontFamily: Fonts.avenirBlack,
        fontSize: 16,
        color: 'black',
    },

    cardExpText: {
        fontFamily: Fonts.avenirRoman,
        color: 'black',  
        fontSize: 14,    
        opacity: 0.8,  
        marginTop: 2,
    },
});