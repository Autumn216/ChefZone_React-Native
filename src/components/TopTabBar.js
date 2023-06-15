import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Colors from "../theme/Colors";
import Fonts from "../theme/Fonts";

export default class TopTabBar extends React.Component {
	render() {
		const { titles } = this.props;
		return (
			<View style={[this.props.style, styles.container]}>
				{
					titles.map((title, i) =>
    		    	<TouchableOpacity 
					style={[styles.tabButton, {width: (100 / titles.length) + "%"}, this.props.currentPage == i ? styles.selectButton : null]} 
    		    		onPress={() => this.props.onSelectPage(i)} 
    		    		key={i} >
						<Text style={this.props.currentPage == i ? styles.buttonSelectText : styles.buttonText}>{title}</Text>
					</TouchableOpacity>	  
    				)
				}
	    	</View>
	    );
  	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 55,
		zIndex: 2,
	},

	tabButton: {
		width: '50%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',		
	},

	selectButton: {

	},

	buttonText: {
		textAlign: 'center',
		fontFamily: Fonts.avenirBook,
		color: '#b1b1b1',
		fontSize: 16,
	},

	buttonSelectText: {
		textAlign: 'center',
		fontSize: 16,
		color: 'white',		
		backgroundColor: Colors.appColor,
		paddingVertical: 5,
		paddingHorizontal: 15,
		borderRadius: 15,
		overflow: 'hidden',
	},
});