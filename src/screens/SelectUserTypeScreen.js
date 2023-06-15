import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import BackgroundImage from '../components/BackgroundImage'
import Images from '../theme/Images'

const win = Dimensions.get('window');

class SelectUserTypeScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor() {
    super()
    this.state = {
      type: 'customer',
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onContinue =()=> {
    const { type } = this.state;
    if (this.props.route.params && this.props.route.params.user) {
      const { user } = this.props.route.params;
      if (user) {
        user.type = type;
        this.props.navigation.navigate('SignUp', {user: user});
      } 
    } else {
      this.props.navigation.navigate('SignUp', {type: type});
    }
  }

  render() {
    const { type } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
        <BackgroundImage />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.container}>
            <TopNavBar 
              title="Who Are You?"
              fontSize={25}
              leftButton="back"
              onBack={() => this.onBack()}
            />
            <ScrollView>
              <View style={styles.contentView}>
                <TouchableOpacity onPress={() => this.setState({type: 'customer'})}>
                  <Image source={type == "customer" ? Images.type_customer_selected : Images.type_customer} style={styles.typeImage} />
                </TouchableOpacity>                

                <TouchableOpacity onPress={() => this.setState({type: 'driver'})}>
                  <Image source={type == "driver" ? Images.type_chef_selected : Images.type_chef} style={styles.typeImage} />
                </TouchableOpacity>                
              </View>
            </ScrollView>
            <View style={{alignItems: 'center', paddingBottom: 20}}>
              <RoundButton title="NEXT" theme="main" style={{width: '90%'}} onPress={this.onContinue}/>
            </View>            
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topBarImage: {
    width: '100%',
    height: 120,
    position: 'absolute', 
    top: 0,
    left: 0,
    resizeMode: 'contain',
  },

  contentView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 30,
  },

  typeImage: {
    width: win.width * 0.85,
    height: (win.width * 0.85) * 0.66,
    resizeMode: 'contain',
  },

})

export default SelectUserTypeScreen;
