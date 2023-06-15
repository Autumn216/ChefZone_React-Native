import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Fonts from '../theme/Fonts'

export default class Button extends React.Component {
  	render() {
		const { underline, bold, color } = this.props;
    	return (
		   	<TouchableOpacity style={[this.props.style, styles.buttonContainer]} onPress={() => this.props.onPress()}>
		   		<Text style={[
		   				styles.textLabel, 
		   				underline ? styles.underlineText : '',
						color ? {color: color} : '',
						bold ? { fontFamily: Fonts.bold } : {},
		   			]}
				>{this.props.title}</Text>
	   		</TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
	buttonContainer: {
		alignItems: 'center',
	},

	textLabel: {
		fontFamily: Fonts.regular,
		fontSize: 16,
		color: 'white',
	},

	underlineText: {
		textDecorationLine: 'underline',
	},
});