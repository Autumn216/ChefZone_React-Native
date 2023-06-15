import React, { Component } from 'react';
import Moment from 'moment'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { DATE_TIME_FORMAT } from '../../constants'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts';
import Images from '../../theme/Images';

const win = Dimensions.get('window');

export default class RevenueCell extends Component {
    render() {
        const { data, onSelect } = this.props;
        const chefName = (data && data.chef) ? data.chef.firstName + " " + data.chef.lastName : "";
        const customerName = (data && data.creator) ? data.creator.firstName + " " + data.creator.lastName : "";
        const meal = (data && data.meal) ? data.meal.title : "";
        const amount = (data && data.amount) ? data.amount : 0;
        const total = (data && data.total) ? data.total : 0;
        const orderAt = (data && data.createdAt) ? Moment(data.createdAt).format(DATE_TIME_FORMAT)  : "";
        const completedAt = (data && data.completedAt) ? Moment(data.completedAt).format(DATE_TIME_FORMAT)  : "";

        return (
            <View style={[this.props.style, styles.container]}>
                <TouchableOpacity onPress={() => onSelect(data)}>
                    <Text style={styles.infoText}>Order: {data._id}</Text>
                    <Text style={styles.infoText}>Chef: {chefName}</Text>
                    <Text style={styles.infoText}>Customer: {customerName}</Text>
                    <Text style={styles.infoText}>Meal: {meal} x {amount}</Text>
                    <Text style={styles.infoText}>Order at: {orderAt}</Text>
                    <Text style={styles.infoText}>Completed at: {completedAt}</Text>
                </TouchableOpacity>
                <Text style={styles.priceText}>${total.toFixed(2)}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        marginVertical: 10,
        paddingVertical: 10,
        paddingLeft: 14,
        paddingRight: 14,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.1,
		shadowRadius: 5,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    infoText: {
        fontFamily: Fonts.avenirRoman,
        fontSize: 14,
        color: Colors.textColor,
        marginBottom: 5,
        width: win.width - 150,
    },

    priceText: {
        fontFamily: Fonts.avenirBlack,
        color: Colors.appColor,
        fontSize: 18,
        marginTop: 5,
    },
});