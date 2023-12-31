import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'

export default class BlueBar extends React.Component {
  	render() {
    	return (
	   		<Text style={[this.props.style, styles.textLabel]}>{this.props.title}</Text>
    );
  }
}

const styles = StyleSheet.create({
	textLabel: {
		fontFamily: Fonts.regular,
		fontSize: 13,
		color: 'black',
		paddingVertical: 10,
		paddingHorizontal: 20,
		textAlign: 'center',
		zIndex: 2,
	}
});