import React from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import Colors from '../theme/Colors';

export default class ImagePickerSlider extends React.Component {
  	render() {
		const { photos, onTakePhoto, placeholderImage, placeholderText, errorMessage } = this.props;

    	return (
			<View>
    		<ScrollView horizontal={true}> 
		   		<View style={styles.container}>
		   			<TouchableOpacity style={styles.boxView} onPress={() => onTakePhoto()}>
		   				<Image
				          style={styles.takePictureIcon}
				          source={placeholderImage}
					    />

					    <Text style={styles.textLabel}>{placeholderText}</Text>
		   			</TouchableOpacity>

		   			{
						photos.map((photo, i) =>
							<View key={i.toString()}>
								<View style={styles.boxView}>
		    		    			<Image source={{uri: photo.uri}} style={styles.photoImage} />
		    		    		</View>
		    		    		<TouchableOpacity style={styles.removeButton} onPress={() => this.props.onRemovePhoto(i)}>
	    		    				<Image
							          style={styles.closeIcon}
							          source={Images.red_close_button}
								    />
	    		    			</TouchableOpacity>
							</View>	    		    		
	    				)
					}
		   		</View>
	   		</ScrollView>
			{
				(errorMessage && errorMessage.length > 0)
				? <Text style={styles.errorText}>{errorMessage}</Text>
				: null
			}
			</View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 10,
		paddingTop: 10,
	},

	textLabel: {
		fontFamily: Fonts.regular,
		fontSize: 15,
		color: '#acacac',
		textAlign: 'center',
		position: 'absolute',
		bottom: 20,
	},

	boxView: {
		borderWidth: 2,
		borderColor: Colors.borderColor,
		borderRadius: 20,
		width: 180,
		height: 140,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 15,
	},

	takePictureIcon: {
		width: 70,
		height: 55,
		marginTop: -25,
		resizeMode: 'contain',
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

	errorText: {
		fontFamily: Fonts.regular,
        fontStyle: 'italic',
        color: '#cf0000',
        fontSize: 11,
        marginLeft: 20,
	}
});