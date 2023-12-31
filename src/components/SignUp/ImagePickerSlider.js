import React from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import Fonts from '../../theme/Fonts'

export default class ImagePickerSlider extends React.Component {
  	render() {
    	return (
    		<ScrollView horizontal={true}> 
		   		
	   		</ScrollView>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 10,
		paddingTop: 20,
	},

	textLabel: {
		fontFamily: Fonts.regular,
		fontSize: 15,
		color: '#acacac',
		textAlign: 'center',
		position: 'absolute',
		bottom: 10,
	},

	boxView: {
		borderWidth: 1,
		borderColor: '#e5e5e5',
		borderRadius: 10,
		width: 160,
		height: 130,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 15,
	},

	takePictureIcon: {
		width: 70,
		height: 55,
		marginTop: -15,
	},

	photoImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
		borderRadius: 10,
	},

	removeButton: {
		position: 'absolute',
		top: -10,
		right: 5,
		zIndex: 2,

	},
	closeIcon: {
		width: 30,
		height: 30,
	},
});