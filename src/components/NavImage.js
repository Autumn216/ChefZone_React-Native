import React, { Component } from 'react';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { StyleSheet, Image, Dimensions } from 'react-native';
import Images from '../theme/Images'

const width = Dimensions.get('window').width;
export default class NavImage extends Component {
    render() {
        return (
            <Image
              style={[this.props.style, styles.navImage, {width: 441, height: 273}]}
              source={Images.top_bg}
            />
        );
    }
}
 
const styles = StyleSheet.create({
    navImage: {
        position: 'absolute', 
        right: -200,
        top: -150,
        resizeMode: 'contain',
    },
});