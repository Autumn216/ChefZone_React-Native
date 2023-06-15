import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SwipeListView } from 'react-native-swipe-list-view';
import TopNavBar from '../../components/TopNavBar'
import NavImage from '../../components/NavImage'
import LoadingOverlay from '../../components/LoadingOverlay'
import CartCell from '../../components/Cells/CartCell'
import * as Storage from '../../services/Storage'
import actionTypes from '../../actions/actionTypes';
import RoundButton from '../../components/RoundButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'

class CustomerCartScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      carts: [],
    }
  }

  componentDidMount() {
    this.getMyCarts();
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getMyCarts();    
    });   
  }

  componentWillUnmount() {
    this.focusListener();
  }

  async getMyCarts() {
    var products = await Storage.MY_CARTS.get();
    this.filterCarts(products);
  }

  filterCarts(products) {
    var list = [];
    if (products) {
      products.forEach(p => {
        if (p.dispensary) {
          var isExisting = false;
          list.forEach(item => {
            if (p.dispensary._id == item.dispensary._id) {
              item.data.push(p);
              isExisting = true;
              return;
            }
          });

          if (!isExisting) {
            list.push({
              title: p.dispensary.name,
              dispensary: p.dispensary,
              data: [p],
            });
          }
        }
      });
    }
    this.setState({carts: list});    
  }

  componentDidUpdate(prevProps, prevState) {
    
  }

  onChangeQty=(product, qty)=> {
    var qtyValue = qty;
    if (qty < 1) {
      qtyValue = 1;
    }

    const { carts } = this.state;
    carts.forEach((item, i) => {
      if (item.data) {
        item.data.forEach((p, j) => {
          if (p._id == product._id) {
            item.data[j].qty = qtyValue;
            return;
          }
        });
      }
    });

    this.setState({carts});
  }

  async onTrash(data) {
    var products = await Storage.MY_CARTS.get();
    var badge = 0;
    if (products) {
      var isExisting = false;
      products.forEach((item, index) => {
        if (item._id == data.item._id) {
          products.splice(index, 1);
          isExisting = true;
          return;
        }
      })
      badge = products.length;
    }

    Storage.MY_CARTS.set(products);
    this.props.dispatch({
      type: actionTypes.SET_CART_BADGE,
      badge: badge,
    });

    this.filterCarts(products);
  }
  
  onProcessPayment() {
    const { carts } = this.state;
    const result = this.calcTotal(carts);
    this.props.navigation.navigate("OrderPay", {
      receipt: result,
      carts: carts
    });
  }
  
  calcTotal(carts) {
    const taxPercent = 0.1;
    const deliveryFee = 0.5;
    var subtotal = 0;
    if (carts) {
      carts.forEach(item => {
        if (item.data) {
          item.data.forEach(c => {
            if (c.price) {
              subtotal += c.price * c.qty;
            }
          });
        }        
      });
    }

    const tax = (subtotal + deliveryFee) * taxPercent;
    const total = subtotal + deliveryFee + tax;
    return {
      subtotal,
      deliveryFee,
      tax,
      total
    }
  }

  _renderReceipt() {
    const { carts } = this.state;
    const result = this.calcTotal(carts);

    return (
      <View style={styles.receiptView}>
        <View style={styles.rowView}>
          <Text style={styles.labelText}>Items subtotal: </Text>
          <Text style={styles.valueText}>${result.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.rowView}>
          <Text style={styles.labelText}>Delivery fee: </Text>
          <Text style={styles.valueText}>${result.deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.rowView}>
          <Text style={styles.labelText}>Tax: </Text>
          <Text style={styles.valueText}>${result.tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.rowView, {marginTop: 3}]}>
          <Text style={[styles.labelText, {fontFamily: Fonts.bold, fontSize: 17}]}>Total: </Text>
          <Text style={[styles.valueText, {fontFamily: Fonts.bold, fontSize: 17}]}>${result.total.toFixed(2)}</Text>
        </View>
        <View style={{ paddingTop: 20, paddingBottom: 40, paddingHorizontal: 20 }}>
          <RoundButton 
            title="PROCEED TO CHECKOUT" 
            theme="main" 
            onPress={() => this.onProcessPayment()} 
          />
        </View>
      </View>
    )
  }

  _renderEmptyPage() {
    return (
      <View style={styles.emptyPage}>
        <Image source={Images.empty_cart} style={styles.emptyCartIcon} />
        <Text style={styles.emptyMainText}>OH!</Text>
        <Text style={styles.emptySubText}>You have no item in the shopping cart.</Text>
      </View>
    )
  }

  render() {
    const { isLoading, carts } = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <NavImage theme="green"/>
        <View style={styles.container}>
            <TopNavBar title="My Cart" onBack={() => this.onBack()}/>
            {
              (carts && carts.length > 0)
              ? <SwipeListView
                  useSectionList={true}
                  sections={carts}
                  keyExtractor={(item, index) => item._id}
                  renderItem={({ item }) => 
                    <CartCell data={item} onChangeQty={this.onChangeQty} />
                  }
                  renderHiddenItem={ (data, rowMap) => (
                    <View style={styles.rowBack}>
                        <TouchableOpacity style={styles.trashBtn} 
                          onPress={ () => {
                            rowMap[data.item._id].closeRow() ;
                            this.onTrash(data);
                          }}
                        >
                          <Image source={Images.icon_trash} style={styles.trashIcon} />
                        </TouchableOpacity>
                    </View>
                  )}
                  rightOpenValue={-60}
                  renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.headerText}>{title}</Text>
                  )}
                  ListFooterComponent={() => this._renderReceipt() }
                />
              : this._renderEmptyPage()
            }
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
  },

  contentView: {
    flex: 1,
    backgroundColor: '#f2f2f5',
  },

  headerText: {
    fontFamily: Fonts.bold,
    textAlign: 'center',
    fontSize: 18,
    paddingTop: 25,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },

  receiptView: {
    paddingVertical: 10,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  labelText: {
    fontFamily: Fonts.regular,
  },

  valueText: {
    fontFamily: Fonts.regular,
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

  emptyPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },

  emptyCartIcon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },

  emptyMainText: {
    fontFamily: Fonts.bold,
    marginTop: 20,
    fontSize: 30,
    color: '#333',
  },

  emptySubText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)'
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomerCartScreen);
