import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import TopNavBar from '../../components/TopNavBar'
import EmptyView from '../../components/EmptyView'
import TopTabBar from '../../components/TopTabBar'
import NavImage from '../../components/NavImage'
import OrderCell from '../../components/Cells/OrderCell'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

class CustomerOrderScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isFirst: true,
      confirmingOrders: [],
      comingOrders: [],
      historyOrders: [],

      currentPage: 0,
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
    var confirmingOrders = [];
    var comingOrders = [];
    var historyOrders = [];

    if (orders) {
      orders.forEach(item => {
        if (item.status == 0) {
          confirmingOrders.push(item); 
        }
        else if (item.status == 1) {
          comingOrders.push(item); 
        }
        else {
          historyOrders.push(item); 
        }
      });
    }

    this.setState({
      confirmingOrders,
      comingOrders,
      historyOrders
    });
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSelectOrder(order) {
    this.props.navigation.navigate('OrderDetail', {order: order}); 
  }

  _renderConfirmingOrders () {
    const { currentUser } = this.props;
    const { confirmingOrders, isFirst } = this.state;
    return (
      <View style={{flex: 1}}>
      {
        (confirmingOrders && confirmingOrders.length > 0) 
        ? <FlatList
            style={styles.listContainer}
            data={confirmingOrders}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={() => (<View style={{height: 40}}/>)}
            renderItem={({item, i}) => (
              <OrderCell 
                data={item} 
                key={i} 
                userType={currentUser.type}
                onSelect={(data) => this.onSelectOrder(data)} />
            )}
          />
        : !isFirst && <EmptyView title="You have no pending orders." />
      }
      </View>
    )
  }
  
  _renderComingOrders () {
    const { currentUser } = this.props;
    const { comingOrders, isFirst } = this.state;

    return (
      <View style={{flex: 1}}>
      {
        (comingOrders && comingOrders.length > 0) 
        ? <FlatList
            style={styles.listContainer}
            data={comingOrders}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={() => (<View style={{height: 40}}/>)}
            renderItem={({item, i}) => (
              <OrderCell 
                data={item} 
                key={i} 
                userType={currentUser.type}
                onSelect={(data) => this.onSelectOrder(data)} />
            )}
          />
        : !isFirst && <EmptyView title="You have no incoming orders." />
      }
      </View>
    )
  }

  _renderHistoryOrders () {
    const { currentUser } = this.props;
    const { historyOrders, isFirst } = this.state;

    return (
      <View style={{flex: 1}}>
      {
        (historyOrders && historyOrders.length > 0) 
        ? <FlatList
            style={styles.listContainer}
            data={historyOrders}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={() => (<View style={{height: 40}}/>)}
            renderItem={({item, i}) => (
              <OrderCell 
                data={item} 
                key={i} 
                userType={currentUser.type}
                onSelect={(data) => this.onSelectOrder(data)} />
            )}
          />
        : !isFirst && <EmptyView title="You have no order history." />
      }
      </View>
    )
  }

  onSelectPage(index) {
    this.setState({currentPage: index});
  }

  render() {
    const { currentUser } = this.props;
    const { isLoading, isFirst, orders, currentPage } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage theme="green"/>
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title="My Orders" 
                theme="black" 
              />
              <View style={styles.container}>
              <TopTabBar 
                titles={["Pending", "Incoming", "History"]} 
                currentPage={currentPage} 
                onSelectPage={(index) => this.onSelectPage(index)} 
              />
              { currentPage == 0 && this._renderConfirmingOrders() }
              { currentPage == 1 && this._renderComingOrders() }
              { currentPage == 2 && this._renderHistoryOrders() }
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

  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 35,
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
    myOrders: state.orders.myOrders,
    errorOrderMessage: state.orders.errorMessage,
    getMyOrdersStatus: state.orders.getMyOrdersStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomerOrderScreen);
