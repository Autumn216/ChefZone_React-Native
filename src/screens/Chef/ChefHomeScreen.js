import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import NavImage from '../../components/NavImage'
import TopNavBar from '../../components/TopNavBar'
import TopTabBar from '../../components/TopTabBar'
import LoadingOverlay from '../../components/LoadingOverlay'
import OrderCell from '../../components/Cells/OrderCell'
import EmptyView from '../../components/EmptyView'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

class ChefHomeScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isFirst: true,

      currentPage: 0,
      activeOrders: [],
      pastOrders: [],
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
    if (orders) {
      var activeOrders = [];
      var pastOrders = [];

      orders.forEach(item => {
        if (item.status <= 1) {
          activeOrders.push(item);
        } else {
          pastOrders.push(item);
        }
      });

      this.setState({activeOrders, pastOrders});
    }
  }

  onSelectPage(index) {
    this.setState({currentPage: index});
  }

  onSelectOrder(order) {
    this.props.navigation.navigate('ChefOrderDetail', {order: order});
  }

  _renderActiveOrders() {
    const { currentUser } = this.props;
    const { activeOrders } = this.state;

    return (
      <View style={styles.pageView}>
        {
          (activeOrders && activeOrders.length > 0)
          ? <FlatList
              style={styles.listView}
              data={activeOrders}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => (<View style={{height: 40}}/>)}
              renderItem={({item, i}) => (
                <OrderCell 
                  data={item} 
                  key={i} 
                  isShowStatus={true}
                  userType={currentUser.type}
                  onSelect={(data) => this.onSelectOrder(data)} 
                />
              )}
            />
          : <EmptyView title="No active orders." />
        }
      </View>
    )
  }

  _renderOrderHistory() {
    const { currentUser } = this.props;
    const { pastOrders } = this.state;
    return (
      <View style={styles.pageView}>
        {
          (pastOrders && pastOrders.length > 0)
          ? <FlatList
              style={styles.listView}
              data={pastOrders}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => (<View style={{height: 40}}/>)}
              renderItem={({item, i}) => (
                <OrderCell 
                  data={item} 
                  key={i} 
                  userType={currentUser.type}
                  onSelect={(data) => this.onSelectOrder(data)} 
                />
              )}
            />
          : <EmptyView title="No order history." />
        }
      </View>
    )
  }

  render() {
    const { isLoading, currentPage } = this.state;
    return (
        <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage theme="green"/>
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
                <TopNavBar title="Home" theme="black" onBack={() => this.onBack()}/>
                <View style={styles.container}>
                    <TopTabBar 
                    titles={["Active Orders", "Order History"]} 
                    currentPage={currentPage} 
                    onSelectPage={(index) => this.onSelectPage(index)} 
                    style={{backgroundColor: 'white'}}
                    />
                    <View style={styles.container}>
                    {
                        currentPage == 0
                        ? this._renderActiveOrders()
                        : this._renderOrderHistory()
                    }
                    </View>
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

  pageView: {
    flex: 1,
  },

  listView: {

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

export default connect(mapStateToProps,mapDispatchToProps)(ChefHomeScreen);
