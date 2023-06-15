import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import TopNavBar from '../../components/TopNavBar'
import NavImage from '../../components/NavImage'
import EmptyView from '../../components/EmptyView'
import RevenueCell from '../../components/Cells/RevenueCell'
import LoadingOverlay from '../../components/LoadingOverlay'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'
import Fonts from '../../theme/Fonts'

import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

class RevenueScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isFirst: true,
      orders: [],
      currentUser: null,
    }
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.setState({isLoading: true}, () => [
      this.props.dispatch({
        type: actionTypes.GET_MY_ORDERS,
        user_id: currentUser._id,
        user_type: currentUser.type,
      })
    ]);

    this.focusListener = this.props.navigation.addListener('focus', this.willFocusPage);
  }

  willFocusPage =()=> {
    const { currentUser } = this.props;
    this.setState({currentUser: currentUser});
    this.props.dispatch({
      type: actionTypes.GET_CHEF,
      user_id: currentUser._id,
    })
  }

  componentWillUnmount() {
    this.focusListener();
  }

  componentDidUpdate(prevProps, prevState) {
    // Get My Orders.
    if (prevProps.getMyOrdersStatus != this.props.getMyOrdersStatus) {
        if (this.props.getMyOrdersStatus == Status.SUCCESS) {
          this.setState({isLoading: false, isFirst: false});
          this.filterOrders(this.props.myOrders);
        } 
        else if (this.props.getMyOrdersStatus == Status.FAILURE) {
            this.onFailure(this.props.errorOrderMessage);
        }      
      }
  
      if (prevProps.myOrders != this.props.myOrders) {
        this.filterOrders(this.props.myOrders);
    }

    // Get Chef.
    if (prevProps.getChefStatus != this.props.getChefStatus) {
      if (this.props.getChefStatus == Status.SUCCESS) {
        this.setState({isLoading: false, currentUser: this.props.selectedUser});
      } 
      else if (this.props.getChefStatus == Status.FAILURE) {
        this.onFailure(this.props.errorUserMessage);
      }
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onFailure(message) {
    this.setState({isLoading: false});
    if (message && message.length > 0) {
      this.toast.show(message, TOAST_SHOW_TIME);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }    
  }

  filterOrders(orders) {
    if (orders) {
      var list = [];

      orders.forEach(item => {
        if (item.status > 1) {
            list.push(item);
        }
      });

      this.setState({orders: list});
    }
  }

  onSelect=(order)=> {
    this.props.navigation.navigate('ChefOrderDetail', {order});
  }

  onMoveWithdraw() {
    this.props.navigation.navigate('PaymentMethod');
  }

  _renderHeader() {
    const { orders, currentUser } = this.state;
    const balance = currentUser ? currentUser.balance : 0;
    var customers = [];
    if (orders) {
        orders.forEach(item => {
            if (item && item.creator) {

                var isExisting = false;
                customers.forEach(c => {
                    if (item.creator._id == c) {
                        isExisting = true;
                        return;
                    }
                });

                if (!isExisting) {
                    customers.push(item.creator._id);
                }
            }
        });
    }

    return (
        <View style={styles.header}>
            <View style={styles.cellView}>
                <Text style={styles.valueText}>{orders.length}</Text>
                <Text style={styles.labelText}>Total Orders</Text>
            </View>
            <View style={styles.cellView}>
                <Text style={styles.valueText}>${balance.toFixed(2)}</Text>
                <Text style={styles.labelText}>Balance</Text>
            </View>
            <View style={styles.cellView}>
                <Text style={styles.valueText}>{customers.length}</Text>
                <Text style={styles.labelText}>Total Customers</Text>
            </View>
        </View>
    )
  }

  _renderList() {
    const { orders } = this.state;
    return (
        <View style={{flex: 1}}>
            {
                (orders && orders.length > 0)
                ? <FlatList
                    style={styles.listContainer}
                    data={orders}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, i}) => (
                        <RevenueCell 
                            data={item} 
                            key={i} 
                            onSelect={this.onSelect}
                        />
                    )}
                />
                : <EmptyView title="No history." />
            }
        </View>
    )
  }

  render() {
    const { isLoading } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage theme="green"/>
        <SafeAreaInsetsContext.Consumer>
        {insets => 
          <View style={{flex: 1, paddingTop: insets.top }} >
            <TopNavBar 
              title="Revenue"
              leftButton="back" 
              rightButton="withdraw"
              theme="black" 
              onBack={() => this.onBack()}
              onRight={() => this.onMoveWithdraw()}
            />
            <View style={styles.container}>
              { this._renderHeader() }
              { this._renderList() }
            </View>
          </View>
        }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)}/>
        { isLoading && <LoadingOverlay /> }
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
    overflow: 'hidden',
  },

  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },

  valueText: {
    fontFamily: Fonts.avenirBlack,
    textAlign: 'center',
    fontSize: 20,
    color: Colors.textColor,
  },

  labelText: {
    fontFamily: Fonts.avenirRoman,
    textAlign: 'center',
    color: 'gray',
    marginTop: 3,
  },

  listContainer: {
    paddingTop: 10,
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
    selectedUser: state.user.selectedUser,
    getChefStatus: state.user.getChefStatus,

    myOrders: state.orders.myOrders,
    errorOrderMessage: state.orders.errorMessage,
    getMyOrdersStatus: state.orders.getMyOrdersStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(RevenueScreen);
