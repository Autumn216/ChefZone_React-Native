import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
  myOrders: [],
  nearbyOrders: [],
  selectedOrder: null,
  createdOrder: null,
  errorMessage: null,

  createOrderStatus: Status.NONE,
  getMyOrdersStatus: Status.NONE,
  getOrderStatus: Status.NONE,
  getNearbyOrdersStatus: Status.NONE,
  pickupOrderStatus: Status.NONE,
  completeOrderStatus: Status.NONE,
};

//////////////////////////////////////////////////////////////
//////////////////// Create Order ////////////////////////////
//////////////////////////////////////////////////////////////
const createOrderRequest = (state) => ({
  ...state,
  createOrderStatus: Status.REQUEST,
});

const createOrderSuccess = (state, action) => {
  state.createOrderStatus = Status.SUCCESS;
  const { myOrders } = state;
  var list = [...myOrders];
  const { order } = action.payload; 
  if (order) {
    list.push(order);
  }
  state.createdOrder = order;
  state.myOrders = list;  
  return {
    ...state,
  };
};

const createOrderFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  createOrderStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////
//////////////////// Get My Orders ///////////////////////////
//////////////////////////////////////////////////////////////
const getMyOrdersRequest = (state) => ({
  ...state,
  getMyOrdersStatus: Status.REQUEST,
});

const getMyOrdersSuccess = (state, action) => ({
  ...state,
  myOrders: action.payload,
  getMyOrdersStatus: Status.SUCCESS,
});

const getMyOrdersFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getMyOrdersStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////
////////////////// Get Nearby Orders /////////////////////////
//////////////////////////////////////////////////////////////
const getNearbyOrdersRequest = (state) => ({
  ...state,
  getNearbyOrdersStatus: Status.REQUEST,
});

const getNearbyOrdersSuccess = (state, action) => ({
  ...state,
  nearbyOrders: action.payload,
  getNearbyOrdersStatus: Status.SUCCESS,
});

const getNearbyOrdersFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getNearbyOrdersStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////
//////////////////// Get Order ///////////////////////////////
//////////////////////////////////////////////////////////////
const getOrderRequest = (state) => ({
  ...state,
  getOrderStatus: Status.REQUEST,
});

const getOrderSuccess = (state, action) => ({
  ...state,
  selectedOrder: action.payload,
  getOrderStatus: Status.SUCCESS,
});

const getOrderFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getOrderStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////
//////////////////// Pickup Order ////////////////////////////
//////////////////////////////////////////////////////////////
const pickupOrderRequest = (state) => ({
  ...state,
  pickupOrderStatus: Status.REQUEST,
});

const pickupOrderSuccess = (state, action) => {
  state.pickupOrderStatus = Status.SUCCESS;
  var { myOrders } = state;
  var list = [];

  const order = action.payload;
  if (myOrders) {
    myOrders.forEach((item, index) => {
      if (item._id == order._id) {
        list.push(order);
      } else {
        list.push(item);
      }
    })
  }

  state.selectedOrder = order;
  state.myOrders = list;
  
  return {
    ...state,
  };
};

const pickupOrderFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  pickupOrderStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////
////////////////// Complete Order ////////////////////////////
//////////////////////////////////////////////////////////////
const completeOrderRequest = (state) => ({
  ...state,
  completeOrderStatus: Status.REQUEST,
});

const completeOrderSuccess = (state, action) => {
  state.completeOrderStatus = Status.SUCCESS;
  var list = [];
  const { myOrders } = state;
  const order = action.payload; 
  if (myOrders) {
    myOrders.forEach(item => {
      if (item._id == order._id) {
        list.push(order);
      } else {
        list.push(item);
      }
    });
  }

  state.selectedOrder = order;
  state.myOrders = list;
  
  return {
    ...state,
  };
};

const completeOrderFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  completeOrderStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////
/////////////////////// Reset ////////////////////////////////
//////////////////////////////////////////////////////////////
const resetOrder = (state, action) => {
  state.myOrders = [];
  state.nearbyOrders = [];
  state.errorMessage = null;
  state.selectedOrder = null;

  state.createOrderStatus = Status.NONE;
  state.getMyOrdersStatus = Status.NONE;
  state.getNearbyOrdersStatus = Status.NONE;
  state.pickupOrderStatus = Status.NONE;
  
  return {
    ...state,
  };
};

const actionHandlers = {
  [Types.CREATE_ORDER_REQUEST]: createOrderRequest,
  [Types.CREATE_ORDER_SUCCESS]: createOrderSuccess,
  [Types.CREATE_ORDER_FAILURE]: createOrderFailure,

  [Types.GET_MY_ORDERS_REQUEST]: getMyOrdersRequest,
  [Types.GET_MY_ORDERS_SUCCESS]: getMyOrdersSuccess,
  [Types.GET_MY_ORDERS_FAILURE]: getMyOrdersFailure,

  [Types.GET_ORDER_REQUEST]: getOrderRequest,
  [Types.GET_ORDER_SUCCESS]: getOrderSuccess,
  [Types.GET_ORDER_FAILURE]: getOrderFailure,

  [Types.GET_NEARBY_ORDERS_REQUEST]: getNearbyOrdersRequest,
  [Types.GET_NEARBY_ORDERS_SUCCESS]: getNearbyOrdersSuccess,
  [Types.GET_NEARBY_ORDERS_FAILURE]: getNearbyOrdersFailure,

  [Types.PICKUP_ORDER_REQUEST]: pickupOrderRequest,
  [Types.PICKUP_ORDER_SUCCESS]: pickupOrderSuccess,
  [Types.PICKUP_ORDER_FAILURE]: pickupOrderFailure,

  [Types.COMPLETE_ORDER_REQUEST]: completeOrderRequest,
  [Types.COMPLETE_ORDER_SUCCESS]: completeOrderSuccess,
  [Types.COMPLETE_ORDER_FAILURE]: completeOrderFailure,

  [Types.RESET_ORDER]: resetOrder,
};

export default createReducer(initialState, actionHandlers);
