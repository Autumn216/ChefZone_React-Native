import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Colors from '../theme/Colors';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import { ifIphoneX } from 'react-native-iphone-x-helper'

const screenWidth = Dimensions.get('window').width;

export default class TopNavBar extends React.Component {
  render() {
	const { 
		title,
		theme, 
		fontSize,
		leftButton,
		rightButton, 
		onBack, 
		onRight,
	} = this.props;

	var textColor = Colors.appColor;
	var backIcon = Images.back_arrow;
	var titleFontSize = fontSize ? fontSize : 22;
	if (theme == "black") {
		textColor = 'black';
	}
	
    return (
	    <View style={[styles.container]}>
	    	<View style={{ position: 'relative', width: screenWidth }}>
				{
					leftButton == "back" &&
					<TouchableOpacity style={styles.closeButton} onPress={() => onBack()}>
						<Image
							style={styles.closeButtonIcon}
							source={backIcon}
						/>
					</TouchableOpacity>
				}
				<Text 
					numberOfLines={1} 
					style={[
						styles.titleText, 
						{color: textColor},
						{fontSize: titleFontSize}
					]}>
						{title}
				</Text>	 
				{
					rightButton == "search" && 
					<TouchableOpacity style={styles.rightBtn} onPress={() => onRight()}>
						<Image
							style={styles.rightIcon}
							source={Images.search_icon_black}
						/>
					</TouchableOpacity>
				}   
				{
					rightButton == "withdraw" && 
					<TouchableOpacity style={styles.rightBtn} onPress={() => onRight()}>
						<Image
							style={styles.rightIcon}
							source={Images.icon_withdrawal}
						/>
					</TouchableOpacity>
				}   
					
	    	</View>
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		zIndex: 3,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		...ifIphoneX({
			paddingVertical: 20,
		 }, {
			paddingVertical: 15,
		}),
	},

	titleText: {
		textAlign: 'center',
		fontFamily: Fonts.bold,
		color: 'black',
		marginHorizontal: 50, 
	},

	closeButton: {
		position: 'absolute',
		width: 25,
		height: 25,
		left: 15,
		top: Platform.OS == "android" ? 4 : 0,
		zIndex: 2
	},

	closeButtonIcon: {
		width: '100%',
		height: '100%',
	},

	rightBtn: {
		position: 'absolute',
		right: 15,
		top: Platform.OS == "android" ? 3 : 3,
	},

	rightIcon: {
		width: 23,
		height: 23,
		resizeMode: 'contain',
	},
});