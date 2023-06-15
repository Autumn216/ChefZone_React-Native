import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import RoundButton from '../RoundButton'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'
import Messages from '../../theme/Messages';

export default class ConfirmOrderModal extends React.Component {
    constructor() {
        super();
        this.selectedTime = null;
        this.state = {
            selectedTimeError: '',
        }
    }

    onChange=(event, selectedDate)=> {
        this.selectedTime = selectedDate;
    }

    onConfirm() {
        const { onConfirmDelivery } = this.props;
        if (this.selectedTime == null) {
            this.setState({selectedTimeError: Messages.InvalidDeliveryTime});
            return;
        } else {
            this.setState({selectedTimeError: ''});
        }

        onConfirmDelivery(this.selectedTime);
    }
    
  	render() {
        const today = new Date();
        const { selectedTimeError } = this.state;
        const { isVisible, onClose } = this.props;
    	return (
	   		<Modal isVisible={isVisible}>
                <View style={styles.contentView}>
                    <View style={styles.header}>
                        <Text style={styles.titleText}>Pick Delivey Time</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => onClose()}>
                            <Image source={Images.icon_close_circle} style={{width: 25, height: 25, resizeMode: 'contain'}}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        <DateTimePicker
                            value={today}
                            display="spinner"
                            mode={"time"}
                            is24Hour={true}
                            onChange={this.onChange}
                            minimumDate={today}
                            textColor="black"
                        />
                        <RoundButton 
                            title="Confirm" 
                            theme="main"
                            style={{marginTop: 20}}
                            onPress={() => this.onConfirm()}
                        />
                        {
                            (selectedTimeError && selectedTimeError.length > 0)
                            ? <Text style={styles.errorText}>{selectedTimeError}</Text>
                            : null
                        }
                    </View>                    
                </View>
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