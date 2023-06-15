import React, { Component } from 'react';
import { 
    View, 
    StyleSheet, 
    Text, 
    TouchableOpacity,
    Dimensions
} from 'react-native';

import FastImage from 'react-native-fast-image';
import Fonts from '../theme/Fonts'
import Colors from '../theme/Colors'

const win = Dimensions.get('window');

export default  class MealBox extends Component {
    render() {
        const { meal, size, amount, extra, onMoveMeal } = this.props;
        const photo = (meal && meal.photos && meal.photos.length > 0) ? {uri: meal.photos[0]} : null; 
        const title = (meal && meal.title) ? meal.title.trim() : "";
        var extraNames = "";
        if (extra && extra.length > 0) {
            var list = [];
            extra.forEach(item => {
                list.push(item.name);
            });
            extraNames = list.join(", ");
        } 
        return (
        <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Meal</Text>
            <View style={styles.sectionContent}>
                <TouchableOpacity onPress={() => onMoveMeal(meal)}>
                    <FastImage source={photo}  style={styles.photoImage} />
                </TouchableOpacity>                
                <View>
                    <TouchableOpacity onPress={() => onMoveMeal(meal)}>
                        <Text style={styles.nameText}>{title}</Text>
                    </TouchableOpacity>
                    <Text style={styles.sizeText}>Size: {size}</Text>
                    <Text style={styles.qtyText}>Qty: {amount}</Text>
                    {
                        (extraNames && extraNames.length > 0) 
                        ? <Text style={styles.qtyText}>Extras: {extraNames}</Text>
                        : null
                    }
                </View>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    sectionBox: {
        padding: 5,
        marginVertical: 10,
        marginHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: Colors.borderColor,
        paddingBottom: 20,
    },
    
    sectionTitle: {
        fontFamily: Fonts.avenirBlack,
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },

    sectionContent: {
        flexDirection: 'row',
    },

    photoImage: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        backgroundColor: 'lightgray',
        borderRadius: 10,
        marginRight: 10,
    },

    nameText: {
        fontFamily: Fonts.avenirRoman,
        color: 'black',
        fontSize: 18,
        marginTop: 5,
        marginBottom: 7,
        width: win.width - 135,
    },

    sizeText: {
        fontFamily: Fonts.avenirBook,
        color: Colors.textColor,
        fontSize: 14,
    },

    qtyText: {
        fontFamily: Fonts.avenirBook,
        marginTop: 5,
        color: Colors.textColor,
        fontSize: 14,
    }
});