import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Colors from '../../theme/Colors'
import Images from '../../theme/Images';
import FastImage from 'react-native-fast-image';

export default class OrderPin extends Component {

    render() {
        const { data } = this.props;
        const avatar = (data && data.creator && data.creator.avatar) ? {uri: data.creator.avatar}: Images.account_icon; 

        return (
            <View>  
              <Image source={Images.pin_profile} style={styles.pinImage}/>
              { avatar && <FastImage source={avatar} style={styles.avatarImage}/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pinImage: {
        width: 68,
        height: 68,
      },

    avatarImage: {
        width: 49,
        height: 49,
        borderRadius: 24,
        position: 'absolute',
        top: 5,
        left: 9,
    },
});