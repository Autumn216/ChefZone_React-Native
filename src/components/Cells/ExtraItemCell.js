import React, { Component } from 'react';
import FastImage from 'react-native-fast-image';
import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts';
import Images from '../../theme/Images';

const win = Dimensions.get('window');

export default class ExtraItemCell extends Component {
    render() {
        const { data, isSelectable, selectedList, onSelect } = this.props;
        var selected = false;
        var selectedIndex = -1;
        if (isSelectable && selectedList) {
            selectedList.forEach((item, index) => {
                if (item._id == data._id) {
                    selected = true;
                    selectedIndex = index;
                    return;
                }
            });
        }
        return (
            <View style={[this.props.style, styles.container]}>
                {
                    isSelectable &&
                    <TouchableOpacity onPress={() => onSelect(data, selectedIndex, !selected)}>
                        <Image source={selected ? Images.checkbox_selected : Images.checkbox_normal} style={{width: 27, height: 27}} />
                    </TouchableOpacity>
                }
                <Text style={styles.nameText}>{data.name}</Text>
                <Text style={styles.priceText}>${data.price}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },

    nameText: {
        fontFamily: Fonts.avenirRoman,
        fontSize: 17,
        color: Colors.textColor,
        width: win.width - 100,
    },

    priceText: {
        fontFamily: Fonts.avenirBlack,
        color: Colors.appColor,
        fontSize: 17,
    },
});