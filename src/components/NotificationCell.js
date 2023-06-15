import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Moment from 'moment';
import FastImage from 'react-native-fast-image'
import { NOTIFICATION_TYPE } from '../constants'
import { calcDeliveryTime } from '../functions'
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

const screenWidth = Dimensions.get('window').width;
class NotificationCell extends Component {
    
    getName(firstName, lastName) {
        var name = "";

        if (firstName) {
            name = firstName + " ";

            if (lastName && lastName.length > 0) {
                name += lastName + " ";
            }
        }

        return name;
    }

    render() {
        const { data } = this.props;
        var name = this.getName(data.creator.firstName, data.creator.lastName);
        var avatar = (data && data.creator && data.creator.avatar) ? {uri: data.creator.avatar} : Images.account_icon;
        var message = (data && data.message) ? data.message : "";
        const time = Moment(data.createdAt).fromNow(true);
        const type = (data && data.type) ? data.type : 0;
        const mealName = (data && data.meal) ? data.meal.title : "[Removed Meal]";

        if (type == NOTIFICATION_TYPE.PICKUP_ORDER) {
            // const deliveryTime = (data && data.order && data.order.deliveryTime) ? calcDeliveryTime(data.order.deliveryTime) : "";
            name = mealName;
            message += ".";
        }
        else if (type == NOTIFICATION_TYPE.CREATE_ORDER) {
            message += `${mealName}`;
        }
        else if (type == NOTIFICATION_TYPE.COMPLETE_DELIVERY) {
            name = mealName;
        }
        else if (type == NOTIFICATION_TYPE.WRITE_REVIEW_FOR_MEAL) {
            name = mealName;
        }

        return (
            <TouchableOpacity style={[this.props.style, styles.container]} onPress={() => this.props.onSelectNotification(this.props.data)}>
                <View style={styles.contentView}>
                    <FastImage
                      style={styles.image}
                      source={avatar}
                    />
                    <View style={{ flex: 1}}>
                        <Text style={styles.reviewText}>
                            <Text style={{fontFamily: Fonts.bold}}>{name}</Text>
                            {message}
                        </Text>
                        <Text style={styles.timeText}>{time} ago</Text>
                    </View>
                </View>
                {
                    !data.isRead
                    ? <View style={styles.unReadContainer}>
                        <View style={styles.unReadView} />
                      </View>
                    : null
                }                
            </TouchableOpacity>
        );
    }
}

export default NotificationCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
        backgroundColor: 'white',
    },

    contentView: {
        width: screenWidth - 50,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,        
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: 'lightgray',
    },

    titleText: {
        fontFamily: Fonts.avenirBlack,
        fontSize: 16,
        justifyContent: 'center',
    },

    reviewText: {
        marginTop: 5,
        fontFamily: Fonts.avenirRoman,
        fontSize: 16,
    },

    timeText: {
        fontFamily: Fonts.avenirBook,
        fontSize: 14,
        color: Colors.subTextColor,
        marginTop: 3,
    },

    unReadContainer: {
        flex: 1,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },

    unReadView: {
        backgroundColor: 'red',
        width: 10,
        height: 10,
        borderRadius: 5,
    }

});