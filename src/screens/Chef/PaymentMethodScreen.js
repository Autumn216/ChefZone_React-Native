import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import NavImage from '../../components/NavImage'
import TopNavBar from '../../components/TopNavBar'
import PaymentCell from '../../components/Cells/PaymentCell'
import Colors from '../../theme/Colors'

class PaymentMethodScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      user: null
    }    
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', this.willFocusPage);
  }

  componentWillUnmount() {
    this.focusListener();
  }

  resetData() {
    let currentUser = this.props.currentUser;
    this.setState({user: currentUser});
  }

  willFocusPage = () => {
    this.resetData();
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSelectPaypal() {
    this.props.navigation.navigate('PaypalWithdraw');
  }

  onSelectCard() {
    this.props.navigation.navigate('CardWithdraw');
  }

  getBalance() {
    if (this.state.user) {
      return "$" + this.state.user.balance.toFixed(2);  
    }
    
    return "$0.00";  
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage />
        <SafeAreaInsetsContext.Consumer>
        {
          insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title="WITHDRAW TO"
                leftButton="back"
                rightLabel="Balance"
                rightValue={this.getBalance()}
                theme="black"
                onBack={() => this.onBack()}
              />
              <View style={styles.container}>
                <View style={styles.contentView}>
                  <PaymentCell method="card" label="Card" onPress={() => this.onSelectCard()} />
                  <PaymentCell method="paypal" label="Paypal" onPress={() => this.onSelectPaypal()} />
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
    backgroundColor: Colors.pageColor,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden'
  },

  contentView: {
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
    errorMessage: state.user.errorMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(PaymentMethodScreen);