import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import RoundTextInput from '../RoundTextInput'
import EditAvatar from '../EditAvatar'
import Colors from '../../theme/Colors'
import ImagePicker from 'react-native-image-picker';

export default class RegisterPage extends React.Component {
	onTakePicture() {
		const { onChangeUser } = this.props;
		const options = {
			title: 'Select Photo',
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};

		ImagePicker.showImagePicker(options, (response) => {
			if (response.didCancel) {
			console.log('User cancelled image picker');
			} else if (response.error) {
			console.log('ImagePicker Error: ', response.error);
			} else {
				onChangeUser("avatar", response.uri);
				onChangeUser("avatarFile", response);
			}
		});
	  }
	  
	render() {
		const { user, onChangeUser, onChangeLocation, onRegister } = this.props;
		return (
			<View style={styles.container}>
				<View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 20,}}>
					<EditAvatar avatar={user.avatar} onTakePhoto={() => this.onTakePicture()} />
				</View>

				<RoundTextInput
					placeholder="First name" 
					type="text"
					placeholderTextColor={Colors.placeholderColor}
					value={user.firstName} 
					errorMessage={user.firstNameError}		               
					returnKeyType="next"
					onSubmitEditing={() => { this.lastNameInput.focus() }}
					onChangeText={(text) => onChangeUser("firstName", text)} 
				/>

				<RoundTextInput
					placeholder="Last name" 
					type="text"
					placeholderTextColor={Colors.placeholderColor}
					value={user.lastName} 
					errorMessage={user.lastNameError}
					returnKeyType="next"
					onSubmitEditing={() => { this.emailInput.focus() }}
					onRefInput={(input) => { this.lastNameInput = input }}
					onChangeText={(text) => onChangeUser("lastName", text)} 
				/>

				<RoundTextInput
					placeholder="Email" 
					type="email"
					placeholderTextColor={Colors.placeholderColor}
					value={user.email} 
					errorMessage={user.emailError}
					returnKeyType="next"
					onSubmitEditing={() => { this.phoneInput.focus() }}
					onRefInput={(input) => { this.emailInput = input }}
					onChangeText={(text) => onChangeUser("email", text)} />

				<RoundTextInput
					placeholder="Phone" 
					type="phone"
					placeholderTextColor={Colors.placeholderColor}
					value={user.phone} 
					errorMessage={user.phoneError}
					returnKeyType="next"
					onSubmitEditing={() => { this.locationInput.focus() }}
					onRefInput={(input) => { this.phoneInput = input }}
					onChangeText={(text) => onChangeUser("phone", text)} />

				<RoundTextInput
					placeholder="Address" 
					type="address"
					placeholderTextColor={Colors.placeholderColor}
					value={user.locationText} 
					errorMessage={user.locationError}
					returnKeyType="next"
					onFocus={() => {this.scroll.props.scrollToPosition(0, 110)}}
					onSubmitEditing={() => { 
						if (user.socialId == null || user.socialId == "" || user.socialId == "undefined") {
							this.passwordInput.focus()
						} else {
							Keyboard.dismiss()
						}
					}}
					onRefInput={(input) => { this.locationInput = input }}
					onSelectAddress={(address) => onChangeLocation(address)}      
					onChangeText={(text) => onChangeUser("location", text)} 
				/>

				{
					user.socialId == null
					? <View>
							<RoundTextInput
								placeholder="Password" 
								type="password"
								placeholderTextColor={Colors.placeholderColor}
								value={user.password}
								errorMessage={user.passwordError} 
								returnKeyType="next"
								onSubmitEditing={() => { this.confirmPasswordInput.focus() }}
								onRefInput={(input) => { this.passwordInput = input }}
								onChangeText={(text) => onChangeUser("password", text)} />

							<RoundTextInput
								placeholder="Confirm Password" 
								type="password"
								returnKeyType="done"
								placeholderTextColor={Colors.placeholderColor}
								value={user.confirmPassword} 
								errorMessage={user.confirmPasswordError} 
								returnKeyType="done"
								onRefInput={(input) => { this.confirmPasswordInput = input }}
								onChangeText={(text) => onChangeUser("confirmPassword", text)} 
								onSubmitEditing={() => onRegister()}
							/>
						</View>

					: null
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 25, 
		paddingRight: 25, 
		paddingBottom: 20,
	},

	rowView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	}

});