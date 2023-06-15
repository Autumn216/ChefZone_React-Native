import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import Modal from 'react-native-modal';
import RoundTextInput from '../RoundTextInput'
import RoundButton from '../RoundButton'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'
import Messages from '../../theme/Messages'

export default class AddExtraModal extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            price: '',

            nameError: '',
            priceError: '',
        }
    }

    onAdd() {
        var isValid = true;
        const { onAdd } = this.props;
        const { name, price } = this.state;

        if (name == null || name.length == 0) {
            this.setState({nameError: Messages.InvalidExtraName});
            isValid = false;
        }

        if (price == null || price.length == 0 || isNaN(price) || parseFloat(price) < 0) {
            this.setState({priceError: Messages.InvalidExtraPrice});
            isValid = false;
        }

        if (isValid) {
            onAdd(name, parseFloat(price));
            this.setState({name: '', price: ''});
        }
    }

  	render() {
        const { isVisible, onClose } = this.props;
        const { name, price, nameError, priceError } = this.state; 
    	return (
	   		<Modal isVisible={isVisible}>
                <View style={styles.contentView}>
                    <View style={styles.header}>
                        <Text style={styles.titleText}>Add Extra</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => onClose()}>
                            <Image source={Images.icon_close_circle} style={{width: 25, height: 25, resizeMode: 'contain'}}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        <RoundTextInput
                            placeholder="Item Name" 
                            type="text"
                            value={name} 
                            errorMessage={nameError}
                            returnKeyType="next"
                            maxLength={100}
                            style={{marginTop: 20}}
                            onChangeText={(text) => this.setState({name: text, nameError: ''})}
                            onSubmitEditing={() => { this.priceInput.focus() }}
                        />

                        <RoundTextInput
                            placeholder="Price" 
                            type="number"
                            value={price} 
                            maxLength={15}
                            errorMessage={priceError}
                            returnKeyType="done"
                            onRefInput={(input) => { this.priceInput = input }}
                            onSubmitEditing={() => { this.onAdd() }}
                            onChangeText={(text) => this.setState({price: text, priceError: ''})}
                        />

                        <RoundButton 
                            title="Add" 
                            theme="main"
                            onPress={() => this.onAdd()}
                        />
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
    },

});