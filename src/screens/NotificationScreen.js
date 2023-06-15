import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import TopNavBar from '../components/TopNavBar'
import NavImage from '../components/NavImage'
import NotificationCell from '../components/NotificationCell'
import LoadingOverlay from '../components/LoadingOverlay'
import EmptyView from '../components/EmptyView'
import Toast from 'react-native-easy-toast'
import { TOAST_SHOW_TIME, NOTIFICATION_TYPE, Status } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import Colors from '../theme/Colors'
import Messages from '../theme/Messages'

class NotificationScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isFirst: true,
      refreshing: false,
      notifications: [],
    }
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', this.updateTimer);

    const { currentUser } = this.props;
    this.setState({isLoading: true}, () => {
      this.props.dispatch({
        type: actionTypes.GET_MY_NOTIFICATIONS,
        user_id: currentUser._id,
      });  
    });
  }

  componentWillUnmount() {
    this.focusListener();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getMyNotificationsStatus != this.props.getMyNotificationsStatus) {
      if (this.props.getMyNotificationsStatus == Status.SUCCESS) {
        this.getMyNotifications();
      } else if (this.props.getMyNotificationsStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  updateTimer=()=> {
    this.getMyNotifications();
  }

  onSelectNotification(n) {
    var new_list = [];
    var notifications = this.state.notifications;
    for (var i = 0; i < notifications.length; i++) {
      var item = notifications[i];
      if (item._id == n._id) {
        item.isRead = true;
      }

      new_list.push(item);
    }

    this.setState({notifications: new_list});

    // Mark Read Notification.
    this.props.dispatch({
      type: actionTypes.MARK_READ_NOTIFICATION,
      notification_id: n._id,
    });
    
    const order = n.order;
    const meal = n.meal;
    const { currentUser } = this.props;

    if (n.type == NOTIFICATION_TYPE.CREATE_ORDER) {
      if (currentUser.type == "chef") {
        this.props.navigation.navigate('ChefOrderDetail', {order: order});
      }      
    }
    else if (n.type == NOTIFICATION_TYPE.PICKUP_ORDER) {
      this.props.navigation.navigate('OrderDetail', {order: order});
    }
    else if (n.type == NOTIFICATION_TYPE.COMPLETE_DELIVERY) {
      this.props.navigation.navigate('OrderDetail', {order: order});
    }
    else if (n.type == NOTIFICATION_TYPE.WRITE_REVIEW_FOR_MEAL) {
      this.props.navigation.navigate('MealDetail', {meal: meal, page: 1});
    }
  }

  getMyNotifications() {
    this.setState({isLoading: false, refreshing: false, isFirst: false, notifications: this.props.notifications}); 
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

  onRefresh=()=>{
    this.setState({refreshing: true});
    const { currentUser } = this.props;
    this.props.dispatch({
      type: actionTypes.GET_MY_NOTIFICATIONS,
      user_id: currentUser._id,
    });
  }

  onMenu =()=> {
    this.props.navigation.toggleDrawer();
  }

  render() {
    const { notifications, isFirst } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage theme="green"/>
        <SafeAreaInsetsContext.Consumer>
          {
            insets => 
              <View style={{flex: 1, paddingTop: insets.top }} >
                <TopNavBar 
                  title="Notifications" 
                  theme="black"
                  onMenu={this.onMenu}
                />
                <View style={styles.contentView}>
                  {
                    (notifications && notifications.length > 0) 
                    ? <FlatList
                        style={styles.listView}
                        data={notifications}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={() => (<View style={{height: 40}}/>)}
                        renderItem={({item, i}) => (
                          <NotificationCell 
                            data={item} 
                            key={i} 
                            onSelectNotification={(data) => this.onSelectNotification(data)} />
                        )}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                      />
                    : !isFirst && <EmptyView title="No notifications." />
                  }
                </View>
              </View>
          }
          </SafeAreaInsetsContext.Consumer>
          <Toast ref={ref => (this.toast = ref)}/>
          { this.state.isLoading && <LoadingOverlay /> }
        </View>
    );
  }
}



const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
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
    notifications: state.notifications.notifications,
    errorMessage: state.notifications.errorMessage,
    getMyNotificationsStatus: state.notifications.getMyNotificationsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(NotificationScreen);