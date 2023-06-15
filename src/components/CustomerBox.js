import React, { Component } from 'react';
import { 
    View, 
    StyleSheet, 
    Image, 
    Text, 
    TouchableOpacity 
} from 'react-native';

import FastImage from 'react-native-fast-image';
import Fonts from '../theme/Fonts'
import Images from '../theme/Images'
import Colors from '../theme/Colors'

export default  class CustomerBox extends Component {
    onMoveProfile(user) {
        const { onProfile } = this.props;
        if (onProfile) {
            onProfile(user);
        }
    }

    render() {
        const { user, title } = this.props;

        const firstName = (user && user.firstName) ? user.firstName : "";
        const lastName = (user && user.lastName) ? user.lastName : "";
        const name = firstName + " " + lastName;
        const avatar = (user && user.avatar) ? {uri: user.avatar} : Images.account_icon ;
        const phone = (user && user.phone) ? user.phone : "";
        const email = (user && user.email) ? user.email : "";

        return (
            <View style={styles.sectionBox}>
                <Text style={styles.labelText}>{title}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => this.onMoveProfile(user)}>
                        <FastImage source={avatar} style={styles.avatarImage}/>
                    </TouchableOpacity>
                    <View style={styles.infoView}>
                        <TouchableOpacity onPress={() => this.onMoveProfile(user)}>
                            <Text style={styles.nameText} >{name}</Text>
                        </TouchableOpacity>                        
                        <View style={styles.rowView}>
                            <Image source={Images.icon_phone} style={styles.infoIcon} />
                            <Text style={styles.infoText}>{phone}</Text>
                        </View>
                        <View style={styles.rowView}>
                            <Image source={Images.icon_email} style={styles.infoIcon} />
                            <Text style={styles.infoText}>{email}</Text>
                        </View>
                    </View>     
                </View>           
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sectionBox: {
        paddingTop: 20,
        marginHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: Colors.borderColor,
        paddingBottom: 20,
    },

    labelText: {
        fontFamily: Fonts.avenirBlack,
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },

    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: 'lightgray',
    },

    nameText: {
        fontFamily: Fonts.avenirBlack,
        fontSize: 18,
        color: Colors.textColor,
        marginBottom: 7,
    },

    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    infoIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 5,
    },

    infoText: {
        fontFamily: Fonts.avenirRoman,
        color: 'gray',
        marginTop: 3,
        fontSize: 14,
    },
});