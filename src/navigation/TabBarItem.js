import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Fonts from '../theme/Fonts'
import Colors from '../theme/Colors'

function TabBarItem({cartBadge, unreadNumber, icon, selectedIcon, focused, page}) {
    return (
        <View style={{position: 'relative'}, page == "PostMeal" ? { marginBottom: 40 } : { }}>
            {
                focused
                ? <Image
                    style={[page == "PostMeal" ? styles.iconPlusImage : styles.iconImage]}
                    source={selectedIcon} 
                  />
                : <Image
                    style={[page == "PostMeal" ? styles.iconPlusImage : styles.iconImage]}
                    source={icon} 
                />
            }
            {
                (page == "NotificationStack" && unreadNumber > 0) &&
                <View style={styles.selectedBadgeText}>
                    <Text style={styles.numberText}>
                        {unreadNumber}
                    </Text>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    focusedBox: {
        backgroundColor: Colors.appColor2,
        width: 90,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginTop: -15,
    },
    
    iconImage: {
        width: 50,
        height: 50
    },
    
    iconPlusImage: {
        width: 75,
        height: 75
    },

    inactiveIcon: {
        opacity: 0.3,
    },

    badgeText: {
        fontFamily: Fonts.regular,
        color: 'white',
        backgroundColor: 'red',
        position: 'absolute',
        fontSize: 10,
        width: 17,
        height: 17,
        borderRadius: 8,
        textAlign: 'center',
        top: 0,
        right: 0,
        overflow: 'hidden',
    },

    selectedBadgeText: {
        backgroundColor: 'red',
        position: 'absolute',
        width: 17,
        height: 17,
        borderRadius: 8,
        top: 7,
        right: 6,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },

    numberText: {
        fontFamily: Fonts.avenirRoman,
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
    },
});

const mapStateToProps = state => ({
    cartBadge: state.user.cartBadge,
    unreadNumber: state.notifications.unreadNumber,
});

export default connect(mapStateToProps)(TabBarItem);
