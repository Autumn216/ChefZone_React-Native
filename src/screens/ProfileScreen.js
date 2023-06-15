import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import HeaderInfoBar from '../components/HeaderInfoBar'
import Colors from '../theme/Colors'
import FastImage from 'react-native-fast-image'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

class ProfileScreen extends Component {
  constructor() {
    super()
    this.state = {
    }
  }

  onMenu =()=> {
    this.props.navigation.toggleDrawer();
  }

  onRight=()=> {
    this.props.navigation.navigate("EditProfile");
  }

  _renderProfile() {
    const { currentUser } = this.props;
    const avatar = (currentUser && currentUser.avatar) ? {uri: currentUser.avatar} : Images.account_icon;
    const name = currentUser ? currentUser.firstName + " " + currentUser.lastName : "";
    var sport = (currentUser && currentUser.sport)  ? currentUser.sport : "";
    if (sport.toLowerCase() == "both") {
      sport = "Baseball & Softball";
    }

    var type = "Game Assigner";
    // if (currentUser.type == "umpire") {
    //   type = "Umpire";
    // }

    return (
      <View style={styles.profileView}>
        <FastImage source={avatar} style={styles.avatarImage}/>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.typeText}>{type}</Text>
        <View style={styles.infoRow}>
          <View style={styles.colView}>
            <Image source={Images.ico_phone} style={styles.infoIcon}/>
            <Text style={styles.infoText}>{currentUser.phone}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.colView}>
            <Image source={Images.icon_gender} style={styles.infoIcon}/>
            <Text style={styles.infoText}>{currentUser.gender.toUpperCase()}</Text>
          </View>
        </View>        
        {
          (currentUser.type == "umpire") &&
          <View>
              <View style={styles.infoRow}>
                <View style={styles.colView}>
                  <Image source={Images.icon_softball} style={styles.infoIcon}/>
                  <Text style={styles.infoText}>{sport}</Text>
                </View>
                <View style={styles.colView}>
                  <Image source={Images.icon_ribbon} style={styles.infoIcon}/>
                  <Text style={styles.infoText}>{currentUser.experience} years of experience</Text>
                </View>
              </View>
          </View>
        }
      </View>
    )
  }

  render() {
    return (
        <View style={{flex: 1, backgroundColor: Colors.appColor}}>
            <SafeAreaInsetsContext.Consumer>
            {
                insets => 
                    <View style={{flex: 1, paddingTop: insets.top }} >
                        <View style={styles.container}>
                        <HeaderInfoBar 
                            title="PROFILE" 
                            rightButton="edit_profile"
                            onMenu={this.onMenu}
                            onRightButton={this.onRight}
                        />
                        <ScrollView>
                        <View style={styles.contentView}>
                          { this._renderProfile() }
                        </View>
                        </ScrollView>
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
    backgroundColor: Colors.pageColor,
  },

  contentView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },

  profileView: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 30,
  },

  avatarImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'lightgray',
  },

  nameText: {
    fontFamily: Fonts.bold,
    fontSize: 30,
    marginTop: 15,
    textAlign: 'center',
  },

  typeText: {
    fontFamily: Fonts.bold,
    textTransform: 'uppercase',
    fontSize: 16,
    marginTop: -5,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    marginBottom: 15,
  },

  colView: {
    width: '50%',
    flexDirection: 'row',
  },

  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 7,
    resizeMode: 'contain',
  },

  infoText: {
    fontFamily: Fonts.light,
    fontSize: 15,
    width: '81%',
  },

  otherText: {
    fontFamily: Fonts.light,
    fontSize: 15,
    width: '90%',
    lineHeight: 21,

  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ProfileScreen);