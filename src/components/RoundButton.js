import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from "../theme/Colors"
import Fonts from "../theme/Fonts"

export default class RoundButton extends React.Component {
  render() {
    return (
	    <TouchableOpacity style={this.props.style} onPress={() => this.props.onPress()}>
	    	{
	    		this.props.theme == "main" 
	    		? <View style={[styles.buttonContainer, styles.mainButton]}>
					<Text style={[styles.buttonText, styles.blackText]}>{this.props.title}</Text>
	    		  </View>
	    		: null
	    	}
			{
	    		this.props.theme == "green" 
	    		? <View style={[styles.buttonContainer, styles.greenButton]}>
					<Text style={[styles.buttonText, styles.whiteText]}>{this.props.title}</Text>
	    		  </View>
	    		: null
	    	}
	    	{	
	    		this.props.theme == "red" 
	    		? <View style={[styles.buttonContainer, styles.redButton]}>
					<Text style={[styles.buttonText, styles.whiteText]}>{this.props.title}</Text>
	    		  </View>
	    		: null
	    	}
	    	{
	    		this.props.theme == "outline" 
	    		? <View style={[styles.buttonContainer, styles.outlineButton]}>
					<Text style={[styles.buttonText, styles.outlineText]}>{this.props.title}</Text>
	    		  </View>
	    		: null	
	    	}

	    	{
	    		this.props.theme == "white" 
	    		? <View style={[styles.buttonContainer, styles.whiteButton]}>
					<Text style={[styles.buttonText, styles.whiteText]}>{this.props.title}</Text>
	    		  </View>
	    		: null
	    	}

	    	{ 
	    		this.props.theme == "orange"
	    		? <View style={[styles.buttonContainer, styles.orangeButton]}>
					<Text style={[styles.buttonText, styles.blackText]}>{this.props.title}</Text>
	    		  </View>
	    		: null
	    	}

	    	{ 
	    		this.props.theme == "black"
	    		? <View style={[styles.buttonContainer, styles.blackButton]}>
					<Text style={[styles.buttonText, styles.whiteText]}>{this.props.title}</Text>
	    		  </View>
	    		: null
	    	}

	    	{
	    		this.props.theme == "no-border"
	    		? <View style={[styles.buttonContainer, styles.noBorderButton]}>
					<Text style={[styles.buttonText, styles.whiteText]}>{this.props.title}</Text>
	    		  </View>
	    		: null
	    	}

	    	{
	    		this.props.theme == "no-border-gray"
	    		? <View style={[styles.buttonContainer, styles.noBorderButton]}>
					<Text style={[styles.buttonText, styles.grayText]}>{this.props.title}</Text>
	    		  </View>
	    		: null
	    	}
    		
	    </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({

	buttonContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 25,
		height: 52,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.15,
		shadowRadius: 10,
		elevation: 5,
		margin: 10,
	}, 

	outlineButton: {
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.2)',
	},

	mainButton: {
		backgroundColor: Colors.appColor,
		borderWidth: 2,
		borderColor: Colors.appColor,
	},

	greenButton: {
		backgroundColor: Colors.appColor2,
		borderWidth: 2,
		borderColor: Colors.appColor2,
	},

	blueButton: {
		backgroundColor: '#2357f7',
		borderWidth: 2,
		borderColor: '#2357f7',
	},

	redButton: {
		backgroundColor: Colors.redColor,
		borderWidth: 2,
		borderColor: Colors.redColor,	
	},

	whiteButton: {
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: 'white',
	},

	orangeButton: {
		backgroundColor: '#F5C723',
		borderWidth: 2,
		borderColor: '#F5C723',
	},

	blackButton: {
		backgroundColor: '#000',
		borderWidth: 2,
		borderColor: '#000',
	},

	noBorderButton: {

	},

	buttonText: {
		fontFamily: Fonts.semibold,
		fontSize: 16,
		textTransform: 'uppercase',
	},

	outlineText: {
		color: '#333',
	},

	whiteText: {
		color: 'white',
	},

	blackText: {
		color: '#101010',	
	},

	grayText: {
		color: '#939393',
	},
});