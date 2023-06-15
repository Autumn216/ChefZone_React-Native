import React, { Component } from 'react';
import FastImage from 'react-native-fast-image';
import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts';
import Images from '../../theme/Images';

const win = Dimensions.get('window');

export default class MealCell extends Component {
    render() {
        const { data, showAddress, onSelect } = this.props;
        const photo = (data && data.photos && data.photos.length > 0) ? {uri: data.photos[0]} : null;
        const address = (data && data.creator && data.creator.location) ? data.creator.location : "";
        const reviews = (data && data.reviews) ? data.reviews : [];
        var reviewCount = reviews.length;
        var score = 0;
        if (reviewCount > 0) {
            reviews.forEach(review => {
                score += review.score;
            });
            score = score / reviewCount;
        }

        return (
            <View style={[this.props.style, styles.container]}>
                <TouchableOpacity onPress={() => onSelect(data)}>
                    <View style={styles.contentView}>
                        <View>
                            {
                                photo &&
                                <FastImage source={photo} style={styles.photoImage}/>
                            }
                        </View>
                        <View style={styles.rightView}>
                            <Text style={styles.titleText}>{data.title.trim()}</Text>
                            <Text style={styles.priceText}>${data.price.toFixed(2)}</Text> 
                            {
                                showAddress &&
                                <View style={styles.addressBox}>
                                    <Image source={Images.icon_pin} style={styles.pinIcon} />
                                    <Text style={styles.addressText}>{address}</Text>
                                </View>
                            }                   
                            
                            <View style={styles.ratingView}>
                                <Image source={Images.star_selected} style={{width: 12, height: 12, resizeMode: 'contain'}} />
                                <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
                                <Text style={styles.ratingsText}>({reviewCount} ratings)</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
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
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
        borderRadius: 10,
    },

    photoImage: {
        width: 90,
        height: 90,
        backgroundColor: 'lightgray',
        borderRadius: 10,
    },

    rightView: {
        marginLeft: 15,
        width: win.width - 150,
    },

    titleText: {
        fontFamily: Fonts.avenirRoman,
        color: Colors.textColor,
        fontSize: 20,
        marginTop: 5,
    },

    priceText: {
        marginTop: 7,
        fontFamily: Fonts.avenirRoman,
        color: Colors.appColor,
        fontSize: 16,
    },

    ratingView: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },

    scoreText: {
        fontFamily: Fonts.avenirRoman,
        marginLeft: 3,
        marginRight: 3,
        fontSize: 14,
    },

    ratingsText: {
        fontFamily: Fonts.avenirRoman,
        color: '#B8BBC6',
        fontSize: 14,
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
        marginTop: 2,
    },

    addressText: {
        fontFamily: Fonts.avenirRoman,
        color: '#B8BBC6',
        fontSize: 13,
        width: win.width - 170,
        lineHeight: 18,
    },
});