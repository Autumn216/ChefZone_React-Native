import React, { Component } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import Images from '../../theme/Images';

export default class UserPin extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Image source={Images.pin_user} style={styles.pinImage}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pinImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
});