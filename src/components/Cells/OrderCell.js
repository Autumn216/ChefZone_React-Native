import React, { Component } from 'react';
import Moment from 'moment';
import FastImage from 'react-native-fast-image';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Dimensions, Image} from 'react-native';
import { DATE_TIME_FORMAT } from '../../constants';
import { getOrderStatusText, calcDeliveryTime } from '../../functions';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts';
import Images from '../../theme/Images'

const win = Dimensions.get('window');

export default class OrderCell extends Component {
    constructor() {
        super()
        this.state = {
            currentDate: new Date(),
        }
        this.timer = null;
    }
    
    componentDidMount() {
        const { data } = this.props;
        const status = (data && data.status) ? data.status: 0;
        if (status == 1) {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.timer = setInterval(() => {
                this.updateTimer();
            }, 60000);
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimer() {
        this.setState({currentDate: new Date()});
    }

    _renderCustomerInfo() {
        const { data } = this.props;
        const chefName = (data && data.chef) ? data.chef.firstName + " " + data.chef.lastName : "";
        const address = (data && data.chef) ? data.chef.location : "";
        var time = Moment(data.createdAt).format(DATE_TIME_FORMAT);
        if (data.status == 1) {
            time = Moment(data.pickupAt).format(DATE_TIME_FORMAT);
        }
        else if(data.status == 2) {
            time = Moment(data.completedAt).format(DATE_TIME_FORMAT);
        }
        return (
            <View>
                <View style={styles.addressBox}>
                    <Image source={Images.icon_chef} style={styles.pinIcon} />
                    <Text style={styles.addressText}>{chefName}</Text>
                </View>
                <View style={styles.addressBox}>
                    <Image source={Images.icon_pin} style={styles.pinIcon} />
                    <Text style={styles.addressText}>{address}</Text>
                </View>
                <View style={styles.addressBox}>
                    <Image source={Images.icon_time} style={styles.pinIcon} />
                    <Text style={styles.addressText}>{time}</Text>
                </View>
            </View>
        )
    }

    _renderChefInfo() {
        const { data } = this.props;
        const customerName = (data && data.creator) ? data.creator.firstName + " " + data.creator.lastName : "";
        var address = (data && data.shippingAddress) ? data.shippingAddress.address : "";
        var apt = (data && data.apt) ? data.shippingAddress.apt : "";
        var zipcode = (data && data.zipcode) ? data.shippingAddress.zipcode : "";
        var time = Moment(data.createdAt).format(DATE_TIME_FORMAT);
        if (data.status == 1) {
            time = Moment(data.pickupAt).format(DATE_TIME_FORMAT);
        }
        else if(data.status == 2) {
            time = Moment(data.completedAt).format(DATE_TIME_FORMAT);
        }

        var shippingAddress = address;
        if (apt && apt.length > 0) {
            shippingAddress += apt + " ";
        }

        if (zipcode && zipcode.length > 0) {
            shippingAddress += zipcode + " ";
        }
        return (
            <View>
                <View style={styles.addressBox}>
                    <Image source={Images.icon_customer} style={styles.pinIcon} />
                    <Text style={styles.addressText}>{customerName}</Text>
                </View>
                <View style={styles.addressBox}>
                    <Image source={Images.icon_pin} style={styles.pinIcon} />
                    <Text style={styles.addressText}>{shippingAddress}</Text>
                </View>
                <View style={styles.addressBox}>
                    <Image source={Images.icon_time} style={styles.pinIcon} />
                    <Text style={styles.addressText}>{time}</Text>
                </View>
            </View>
        )
    }

    render() {
        const { data, isShowStatus, userType, onSelect, currentDate } = this.props;
        const photo = (data && data.meal && data.meal.photos && data.meal.photos.length > 0) ? {uri: data.meal.photos[0]} : null;
        const mealName = (data && data.meal) ? data.meal.title.trim() : "";
        const amount = (data && data.amount) ? data.amount : 0;
        
        var deliveryTime = "";
        const status = getOrderStatusText(data.status);
        var statusStyle = styles.confirmStatus;
        if (data.status == 1) {
            statusStyle = styles.comingStatus;
            deliveryTime = calcDeliveryTime(data.deliveryTime, currentDate);
        }
        else if(data.status == 2) {
            statusStyle = styles.completedStatus;
        }

        return (
            <View style={[this.props.style, styles.container]}>
                <TouchableWithoutFeedback onPress={() => onSelect(data)}>
                    <View style={styles.contentView}>
                        {
                            isShowStatus && <Text style={[styles.tikcet, statusStyle]}>{status}</Text>
                        }
                        <View style={styles.leftView}>
                            <FastImage source={photo} style={styles.photoImage} />
                            <Text style={styles.amountText}>x {amount}</Text>
                        </View>    
                        <View style={styles.rightView}>
                            <Text style={styles.mealText}>
                                {mealName}
                            </Text>
                            {
                                userType == "customer"
                                ? this._renderCustomerInfo()
                                : this._renderChefInfo()
                            }
                            {
                                (deliveryTime && deliveryTime.length > 0)
                                ? <Text style={styles.deliveryTimeText}>Coming {deliveryTime}</Text>
                                : null
                            }
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
        marginTop: 30,
        marginBottom: 10,
        paddingHorizontal: 15,
    },

    contentView: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        borderRadius: 10,
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
        shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.1,
		shadowRadius: 7,
        elevation: 7,
    },

    leftView: {
        width: 100,
    },

    photoImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 50,
        backgroundColor: 'lightgray',
        marginTop: -40
    },

    amountText: {
        fontFamily: Fonts.avenirRoman,
        textAlign: 'center',
        marginTop: 10,
        fontSize: 17,
        color: Colors.textColor
    },

    mealText: {
        fontFamily: Fonts.avenirRoman,
        fontSize: 20,
        color: 'black',
        marginBottom: 5,
        marginTop: 20,
    },

    rightView: {
        width: win.width - 180,
    },

    mainText: {
        fontFamily: Fonts.bold,
        color: '#333',
        fontSize: 17,
        marginBottom: 3,
    },

    addressBox: {
        marginTop: 5,
        flexDirection: 'row',
    },

    pinIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 5,
    },

    addressText: {
        fontFamily: Fonts.avenirRoman,
        color: Colors.textColor,
        fontSize: 13,
        width: win.width - 195,
        lineHeight: 18,
    },

    tikcet: {
        fontFamily: Fonts.avenirRoman,
        fontSize: 11,
        paddingHorizontal: 12,
        paddingTop: 5,
        paddingBottom: 3,
        position: 'absolute',
        right: 10,
        top: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },
    confirmStatus: {
        backgroundColor: Colors.appColor,
        color: 'white',
    },
    
    comingStatus: {
        backgroundColor: '#2CC2DC',
        color: 'white',
    },
        
    completedStatus: {
        backgroundColor: '#24EC46',
        color: 'white',
    },

    deliveryTimeText: {
        fontFamily: Fonts.avenirRoman,
        marginTop: 5,
        color: '#2CC2DC',
        fontSize: 13,
    }
});