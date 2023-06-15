import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import FastImage from 'react-native-fast-image';

class EditAvatar extends Component {
    render() {
        return (
            <TouchableOpacity style={[this.props.style, styles.container]} onPress={() => this.props.onTakePhoto()}>
                <FastImage
                    style={styles.avatarImage}
                    source={this.props.avatar ? {uri: this.props.avatar} : Images.upload_photo_icon}
                />
            </TouchableOpacity>
        );
    }
}

export default EditAvatar;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarImage: {
        width: 125,
        height: 125,
        borderRadius: 62.5,
        resizeMode: 'cover',
        backgroundColor: 'lightgray'
    },
});