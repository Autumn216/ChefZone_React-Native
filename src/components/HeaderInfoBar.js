import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../theme/Colors';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import FastImage from 'react-native-fast-image'

export default class HeaderInfoBar extends React.Component {
  render() {
	const { 
		title, 
		rightButton,
		onMenu,
		onRightButton, 
	} = this.props;

    return (
	    <View style={styles.container}>
			<View style={styles.leftView}>
				<TouchableOpacity onPress={onMenu}>
					<Image source={Images.icon_menu} style={styles.menuIcon} />
				</TouchableOpacity>
				<Text style={styles.titleText}>{title}</Text>
			</View>
	    	<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				{
					rightButton == "plus_circle"	
					? <TouchableOpacity style={styles.rightButton} onPress={onRightButton}>
 						<Image source={Images.ico_circle_plus} style={styles.circlePlusIcon} />
					</TouchableOpacity>
					: null
				}
				{
					rightButton == "map"	
					? <TouchableOpacity style={styles.rightButton} onPress={onRightButton}>
 						<Image source={Images.ico_map} style={styles.circlePlusIcon} />
					</TouchableOpacity>
					: null
				}
				{
					rightButton == "list"	
					? <TouchableOpacity style={styles.rightButton} onPress={onRightButton}>
 						<Image source={Images.ico_list} style={styles.circlePlusIcon} />
					</TouchableOpacity>
					: null
				}
	    	</View>
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 20,
		paddingBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: Colors.appColor,
	},

	leftView: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	menuIcon: {
		width: 35,
		height: 35,
		resizeMode: 'contain',
	},

	titleText: {
		textAlign: 'left',
		fontFamily: Fonts.bold,
		fontSize: 26,
		color: 'white',
		letterSpacing: 1,
		marginLeft: 15,
	},

	rightButton: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	editIcon: {
		width: 20,
		height: 20,
		resizeMode: 'contain',
		marginRight: 5,
	},

	circlePlusIcon: {
		width: 30,
		height: 30,
		resizeMode: 'contain',
	},

	buttonText: {
		fontFamily: Fonts.bold,
		color: 'white',
		textTransform: 'uppercase',
	},
});