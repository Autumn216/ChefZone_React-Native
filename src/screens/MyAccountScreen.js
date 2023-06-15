import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import actionTypes from '../actions/actionTypes';
import TopNavBar from '../components/TopNavBar'
import NavImage from '../components/NavImage'
import Avatar from '../components/Avatar'
import SettingsCell from '../components/Cells/SettingsInfoCell';
import { WEB_PAGE_TYPE } from '../constants';
import Colors from '../theme/Colors'
import Fonts from '../theme/Fonts';
import Images from '../theme/Images';

class MyAccountScreen extends Component {
  constructor() {
    super()
    this.state = {

    }
  }

  componentDidMount() {
  }

  onMoveEditProfile=()=> {
    this.props.navigation.navigate('EditProfile');
  }

  onMoveChangePassword=()=> {
    this.props.navigation.navigate('ChangePassword');
  }

  onMoveShipping=() => {
    this.props.navigation.navigate('ShippingAddress');
  }

  onMovePayments=()=> {
    this.props.navigation.navigate('PaymentList');
  }

  onMoveManageOrders=()=> {
    this.props.navigation.navigate('ManageOrders');
  }

  onMoveRevenue=()=> {
    this.props.navigation.navigate('Revenue');
  }

  onMoveTerms=()=> {
    this.props.navigation.navigate('Terms', {page: WEB_PAGE_TYPE.TERMS});
  }

  onMovePrivacy=()=> {
    this.props.navigation.navigate('Terms', {page: WEB_PAGE_TYPE.PRIVACY});
  }

  onLogout=()=> {
    AsyncStorage.clear();
    this.props.navigation.popToTop();
    
    // Reset Reducer.
    setTimeout(() => {
      this.props.dispatch({
        type: actionTypes.RESET_USER,
      });   

      this.props.dispatch({
        type: actionTypes.RESET_MEAL,
      });   

      this.props.dispatch({
        type: actionTypes.RESET_ORDER,
      });   

      this.props.dispatch({
        type: actionTypes.RESET_NOTIFICATION,
      });   
    }, 1000);
  }

  render() {
    const { currentUser } = this.props;
    const firstName = currentUser?.firstName;
    const lastName = currentUser?.lastName; 
    const avatar = currentUser?.avatar;
    const type = currentUser?.type;

    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage />
        <SafeAreaInsetsContext.Consumer>
          {
            insets => 
              <View style={{flex: 1, paddingTop: insets.top }} >
                <TopNavBar 
                  title="My Account" 
                  theme="black"
                />
                <View style={styles.container}>
                  <Avatar avatar={avatar} style={{marginTop: -50}}/>
                    <View style={styles.contentView}>
                      <Text style={styles.nameText}>{firstName} {lastName}</Text>
                      <Text style={styles.emailText}>{type}</Text>
                      <View style={styles.menuView}>
                        <ScrollView style={{paddingTop: 25}}>
                          <SettingsCell 
                            type="submenu" 
                            label="Edit Profile" 
                            icon={Images.icon_profile}
                            onPress={this.onMoveEditProfile}
                          />

                          <SettingsCell 
                            type="submenu" 
                            label="Change Password" 
                            icon={Images.icon_password}
                            onPress={this.onMoveChangePassword}
                          />

                          {
                            (currentUser && currentUser.type) == "customer"
                            ? <View>
                              <SettingsCell 
                                type="submenu" 
                                label="Shipping Addresses" 
                                icon={Images.icon_menu_pin}
                                onPress={this.onMoveShipping}
                              />

                              <SettingsCell 
                                type="submenu" 
                                label="Payments" 
                                icon={Images.icon_payments}
                                onPress={this.onMovePayments}
                              />
                              </View>
                            : <SettingsCell 
                                type="submenu" 
                                label="Revenue" 
                                icon={Images.icon_payments}
                                onPress={this.onMoveRevenue}
                              />
                          }
                          
                          <SettingsCell 
                            type="submenu" 
                            label="Terms and Conditions" 
                            icon={Images.icon_tos}
                            onPress={this.onMoveTerms}
                          />

                          <SettingsCell 
                            type="submenu" 
                            label="Privacy Policy" 
                            icon={Images.icon_privacy_policy}
                            onPress={this.onMovePrivacy}
                          />
                          
                          <TouchableOpacity style={styles.logoutBtn} onPress={this.onLogout}>
                            <Text style={styles.logoutText}>Logout</Text>
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                    </View>
                </View>
              </View>
          }
          </SafeAreaInsetsContext.Consumer>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 60,
  },

  contentView: {
    paddingTop: 20,
    flex: 1,
    alignItems: 'center',
  },

  nameText: {
    fontFamily: Fonts.avenirBlack,
    color: 'black',
    fontSize: 24,
  },

  emailText: {
    fontFamily: Fonts.avenirBlack,
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 16,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 5,
  },

  menuView: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.pageColor,
  },

  logoutBtn: {
    marginTop: 10,
    marginBottom: 50
  },

  logoutText: {
    fontFamily: Fonts.avenirBlack,
    fontSize: 17,
    color: '#FC5A5A',
    textAlign: 'center',
    paddingVertical: 10,
    textTransform: 'uppercase',
  }
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
    errorMessage: state.user.errorMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(MyAccountScreen);