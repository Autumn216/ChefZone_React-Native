import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { SwipeListView } from 'react-native-swipe-list-view';
import TopNavBar from '../../components/TopNavBar'
import EmptyView from '../../components/EmptyView'
import NavImage from '../../components/NavImage'
import PaymentCardCell from '../../components/Cells/PaymentCardCell'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import RoundButton from '../../components/RoundButton';
import Colors from '../../theme/Colors'
import Images from '../../theme/Images'
import Messages from '../../theme/Messages'

class PaymentListScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isEditing: false,
      selectedPayment: null,
      list: [],
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.isEdit) {
      const { isEdit, payment } = this.props.route.params;
      this.setState({isEdit, selectedPayment: payment});    
    }

    this.fetchPayments(false);
  }

  componentDidUpdate(prevProps, prevState) {
    // Add Payment
    if (prevProps.addPaymentStatus != this.props.addPaymentStatus) {
      if (this.props.addPaymentStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.fetchPayments(true);
      } 
      else if (this.props.addPaymentStatus == Status.FAILURE) {
          this.onFailure(this.props.errorUserMessage);
      }      
    }    

    // Remove Payment.
    if (prevProps.removePaymentStatus != this.props.removePaymentStatus) {
      if (this.props.removePaymentStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.fetchPayments(true);
      } 
      else if (this.props.removePaymentStatus == Status.FAILURE) {
          this.onFailure(this.props.errorUserMessage);
      }      
    }      
  }

  fetchPayments(isSelect) {
    const { currentUser } = this.props;
    if (currentUser.payments) {
      this.setState({list: currentUser.payments});
    }

    if (isSelect) {
      if (this.props.route.params && this.props.route.params.onSelectPayment) {
        const { onSelectPayment } = this.props.route.params;
        if (currentUser.payments.length > 0) {
          onSelectPayment(currentUser.payments[0]);
        }
        else {
          onSelectPayment(null);
        }
        
      }
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

  onBack() {
    this.props.navigation.goBack();
  }

  onChangeLocation(address) {
    this.setState({
      isLoading: true, 
      location: address, 
    }, () => {
      this.props.dispatch({
          type: actionTypes.GET_GEODATA,
          address: address,
      })
    });
  }

  onTrash(id) {
    const { currentUser } = this.props;
    this.setState({isLoading: true}, () => {
      this.props.dispatch({
        type: actionTypes.REMOVE_PAYMENT,
        user_id: currentUser._id,
        id: id,
      });
    });
  }

  addNewAddress() {
    const { currentUser } = this.props;
    const { selectedAddress, apt, lat, lng, zipcode, location } = this.state;
    this.setState({isLoading: true}, () => {
      if (selectedAddress) {
        this.props.dispatch({
          type: actionTypes.EDIT_SHIPPING_ADDRESS,
          user_id: currentUser._id,
          id: selectedAddress._id,
          address: location,
          apt: apt,
          zipcode: zipcode,
          lat: lat,
          lng: lng
        });
      } 
      else {
        this.props.dispatch({
          type: actionTypes.ADD_SHIPPING_ADDRESS,
          user_id: currentUser._id,
          address: location,
          apt: apt,
          zipcode: zipcode,
          lat: lat,
          lng: lng
        });
      }
    });
  }

  hideAddPage() {
    this.setState({
      isShowAddPage: false,
      selectedAddress: null,
      location: '',
      apt: '',
      zipcode: '',
      lat: 0,
      lng: 0,
    });
  }

  onMoveAddCard=()=> {
    this.props.navigation.navigate('AddCard');
  }

  _renderFooter() {
    return (
      <View style={styles.footer}>
        <TouchableOpacity>
          <RoundButton 
            title="Add New Card" 
            theme="main" 
            onPress={this.onMoveAddCard}
          />
        </TouchableOpacity>
      </View>
    )
  }

  onChangeActive(data) {
    const { isEdit } = this.state;
    if (isEdit) {
      if (this.props.route.params && this.props.route.params.onSelectPayment) {
        const { onSelectPayment } = this.props.route.params;
        onSelectPayment(data);
        this.onBack();
      }
    }
  }

  _renderList() {
    const { list, selectedPayment } = this.state;
    return (
      list.length > 0
      ? <SwipeListView
          style={styles.listContainer}
          data={list}
          keyExtractor={(item, index) => item._id}
          renderItem={({ item, index }) => 
            <PaymentCardCell 
              data={item} 
              key={index.toString()} 
              isSelected={(selectedPayment && selectedPayment._id == item._id)}
              onSelect={(data) => this.onChangeActive(data)}
            />
          }
          renderHiddenItem={ (data, rowMap) => (
            <View style={styles.rowBack}>
                <TouchableOpacity style={styles.trashBtn} 
                  onPress={ () => {
                    rowMap[data.item._id].closeRow() ;
                    this.onTrash(data.item._id);
                  }}
                >
                  <Image source={Images.icon_trash_white} style={styles.trashIcon} />
                </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-60}
        />
      : <EmptyView title="No payments." />
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
                    title="Payments" 
                    leftButton="back" 
                    rightButton="plus"
                    theme="black" 
                    onBack={() => this.onBack()}
                />
                <View style={styles.container}>
                  { this._renderList() }
                  { this._renderFooter() }
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
  },

  footer: {
    backgroundColor: 'white',
    position: 'absolute',
    paddingHorizontal: 20,
    bottom: 30,
    width: '100%',
  },

  rowBack: {
    width: '100%',
    alignItems: 'flex-end',
  },

  trashBtn: {
    backgroundColor: '#ff0000',
    width: 60,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  trashIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
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

    geoData: state.globals.geoData,
    errorGlobalMessage: state.globals.errorMessage,
    getGeoDataStatus: state.globals.getGeoDataStatus,
    
    errorUserMessage: state.user.errorMessage,
    addPaymentStatus: state.user.addPaymentStatus,
    editPaymentStatus: state.user.editPaymentStatus,
    removePaymentStatus: state.user.removePaymentStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(PaymentListScreen);
