import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import Moment from 'moment';
import { DATE_TIME_FORMAT } from '../../constants'
import LoadingOverlay from '../../components/LoadingOverlay'
import RoundButton from '../../components/RoundButton';
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'

class ResultSubmitOrderScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      order: null,
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.order) {
        const { order } = this.props.route.params;
        this.setState({order});    
    }
  }

  onViewOrder() {
    this.props.navigation.pop(2);
    this.props.navigation.navigate('OrderStack');
  }

  onGoHome() {
    this.props.navigation.pop(2);
    this.props.navigation.navigate('HomeStack');
  }

  render() {
    const { isLoading, order } = this.state;
    const orderId = (order && order._id) ? order._id : "";
    const orderDate = (order && order.createdAt) ? Moment(order.createdAt).format(DATE_TIME_FORMAT)  : "";

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.container}>
            <Image source={Images.thankyou_smile} style={styles.thankyouIcon} />
            <Text style={styles.mainTitleText}>Thank you</Text>
            <Text style={styles.subText}>For your Order</Text>
            <Text style={styles.orderText}>Order Number: {orderId}</Text>
            <Text style={styles.orderText}>Order Date: {orderDate}</Text>
            <View style={{width: '80%', marginTop: 40}}>
                <RoundButton 
                    title="View Orders" 
                    theme="main" 
                    onPress={() => this.onViewOrder()} 
                />
                <RoundButton 
                    title="Go to Home" 
                    theme="outline" 
                    onPress={() => this.onGoHome()} 
                />
            </View>
        </View>
        <Toast ref={ref => (this.toast = ref)}/>
        { isLoading && <LoadingOverlay /> }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thankyouIcon: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },

  mainTitleText: {
    fontFamily: Fonts.bold,
    color: '#42465f',
    textTransform: 'uppercase',
    fontSize: 40,
    marginTop: 20,
  },

  subText: {
    fontFamily: Fonts.regular,
    textTransform: 'uppercase',
    color: '#333',
    fontSize: 20,
    marginBottom: 20,
  },

  orderText: {
    fontFamily: Fonts.regular,
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 14,
    marginTop: 5,
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

export default connect(mapStateToProps,mapDispatchToProps)(ResultSubmitOrderScreen);
