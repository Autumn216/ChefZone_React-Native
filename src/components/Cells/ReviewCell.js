import React, { Component } from 'react';
import FastImage from 'react-native-fast-image';
import { Rating } from 'react-native-ratings';
import Moment from 'moment';
import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts';
import Images from '../../theme/Images';

const win = Dimensions.get('window');

export default class ReviewCell extends Component {
    render() {
        const { data } = this.props;
        const avatar = (data && data.creator && data.creator.avatar) ? {uri: data.creator.avatar} : Images.account_icon;
        const name = (data && data.creator) ? data.creator.firstName + " " + data.creator.lastName : "";
        const createdAt = (data && data.createdAt) ? Moment(data.createdAt).fromNow(true) : '';

        return (
            <View style={[this.props.style, styles.container]}>
                <View style={styles.contentView}>
                    <View style={styles.header}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FastImage source={avatar} style={styles.avatarImage}/>
                                <View>
                                    <Text style={styles.nameText}>{name}</Text>
                                    <Text style={styles.timeText}>{createdAt} ago</Text>
                                </View>
                            </View>
                            <Rating
                                type="custom"
                                count={5}
                                startingValue={data.score}
                                size={10}
                                showRating={false}
                                readonly={true}
                                ratingColor={Colors.appColor}
                                imageSize={18}
                            />

                        </View>
                    </View> 
                    <Text style={styles.reviewText}>{data.text}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
    },

    contentView: {
        backgroundColor: 'white',
        flex: 1,
        overflow: 'hidden',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
        borderRadius: 10,
    },

    avatarImage: {
        width: 40,
        height: 40,
        backgroundColor: 'lightgray',
        borderRadius: 20,
        resizeMode: 'cover',
        marginRight: 7,
    },

    nameText: {
        fontFamily: Fonts.avenirRoman,
        color: Colors.textColor,
        fontSize: 17,
    },

    timeText: {
        marginTop: 2,
        fontFamily: Fonts.avenirBook,
        color: Colors.textGrayColor,
        fontSize: 14,
    },

    reviewText: {
        fontFamily: Fonts.regular,
        fontSize: 17,
        color: '#6A6A6A',
        marginTop: 10,
    },
});