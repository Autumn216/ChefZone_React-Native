import React, { Component } from 'react';
import { 
    View, 
    StyleSheet, 
    Dimensions,
    Text
} from 'react-native';

import { calcReceipt } from '../functions'
import Fonts from '../theme/Fonts'

export default  class ReceiptBox extends Component {
    render() {
        const { meal, amount, size, extra } = this.props;
        const receipt = calcReceipt(meal, amount, size, extra);
        const subtotal = (receipt && receipt.subtotal) ? receipt.subtotal : 0;
        const deliveryFee = (receipt && receipt.deliveryFee) ? receipt.deliveryFee : 0;
        const tax = (receipt && receipt.tax) ? receipt.tax : 0;
        const total = (receipt && receipt.total) ? receipt.total : 0;

        return (
        <View style={styles.sectionBox}>
            <View style={styles.receiptBox}>
                <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Subtotal:</Text>
                    <Text style={styles.receiptValue}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Delivery Fee:</Text>
                    <Text style={styles.receiptValue}>${deliveryFee.toFixed(2)}</Text>
                </View>
                <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Tax:</Text>
                    <Text style={styles.receiptValue}>${tax.toFixed(2)}</Text>
                </View>
                <View style={styles.receiptRow}>
                    <Text style={[styles.receiptLabel, styles.largeText]}>Total:</Text>
                    <Text style={[styles.receiptValue, styles.largeText]}>${total.toFixed(2)}</Text>
                </View>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    sectionBox: {
        padding: 5,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 20,
    },
    
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },

    receiptLabel: {
        fontFamily: Fonts.bold,
        color: 'rgba(0, 0, 0, 0.5)',
        fontSize: 16,
    },

    receiptValue: {
        fontFamily: Fonts.bold,
        color: 'rgba(0, 0, 0, 0.5)',
        fontSize: 16,
    },

    largeText: {
        color: '#333',
        fontSize: 18,
        marginTop: 3,
    }

});