import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { AirbnbRating } from 'react-native-ratings';
import RoundTextInput from '../RoundTextInput'
import RoundButton from '../RoundButton'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'
import Messages from '../../theme/Messages'

export default class WriteReviewModal extends React.Component {
    constructor() {
        super()
        this.state = {
            score: '',
            review: '',

            scoreError: '',
            reviewError: '',
        }
    }

    onWrite() {
        var isValid = true;
        const { onWrite } = this.props;
        const { score, review } = this.state;

        if (score == null || score.length == 0 || isNaN(score) || parseInt(score) <= 0) {
            this.setState({scoreError: Messages.InvalidReviewScore});
            isValid = false;
        }

        if (review == null || review.length == 0) {
            this.setState({reviewError: Messages.InvalidReviewText});
            isValid = false;
        }

        if (isValid) {
            onWrite(score, review);
            this.setState({score: '', review: ''});
        }
    }

  	render() {
        const { isVisible, onClose } = this.props;
        const { score, review, scoreError, reviewError } = this.state; 
    	return (
	   		<Modal isVisible={isVisible}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.contentView}>
                    <View style={styles.header}>
                        <Text style={styles.titleText}>Write a Review</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => onClose()}>
                            <Image source={Images.icon_close_circle} style={{width: 25, height: 25, resizeMode: 'contain'}}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        <AirbnbRating
                            count={5}
                            defaultRating={score}
                            showRating={false}
                            selectedColor={Colors.appColor}
                            size={40}
                            onFinishRating={(rating) => this.setState({score: rating, scoreError: null})}
                        />
                        {
                            (scoreError && scoreError.length > 0)
                            ? <Text style={styles.errorText}>{scoreError}</Text>
                            : null
                        }
                        <RoundTextInput
                            placeholder="Write your review here..." 
                            type="textview"
                            value={review} 
                            autoFocus={true}
                            errorMessage={reviewError}
                            style={{marginTop: 20}}
                            onChangeText={(text) => this.setState({review: text, reviewError: ''})}
                        />

                        <RoundButton 
                            title="Submit Review" 
                            theme="main"
                            style={{marginTop: 20}}
                            onPress={() => this.onWrite()}
                        />
                    </View>                    
                </View>
                </TouchableWithoutFeedback>
            </Modal>
    );
  }
}

const styles = StyleSheet.create({
    contentView: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },

    header: {
        
    },

    closeBtn: {
        position: 'absolute',
        right: 5,
    },

    titleText: {
        fontFamily: Fonts.bold,
        textAlign: 'center',
        fontSize: 20,
        color: Colors.textColor,
        marginTop: 5,
    },

	textLabel: {
		fontFamily: Fonts.regular,
		fontSize: 13,
		color: 'black',
		paddingVertical: 10,
		paddingHorizontal: 20,
		textAlign: 'center',
		zIndex: 2,
    },
    
    body: {
        paddingHorizontal: 10,
        paddingBottom: 15,
        paddingTop: 15,
    },

    errorText: {
        fontFamily: Fonts.regular,
        fontStyle: 'italic',
        color: '#cf0000',
        fontSize: 11,
        marginLeft: 20,
        marginTop: 5,
        textAlign: 'center',
    }
});