import { put, call, takeLatest } from 'redux-saga/effects';
import Types from '../actions/actionTypes';
import api from '../api';
import Messages from '../theme/Messages'

const {
  createOrder,
  getMyOrders,
  getNearbyOrders,
  pickupOrder,
  getOrder,
  completeOrder,
} = api;

function* CreateOrder(action) {
    yield put({ type: Types.CREATE_ORDER_REQUEST });
    try {
        const res = yield call(createOrder, action.data);
        if (res.result) {
            yield put({ type: Types.CREATE_ORDER_SUCCESS, payload: res });
        } else {
            yield put({ type: Types.CREATE_ORDER_FAILURE, error: res.error });      
        }
    } catch (error) {
        yield put({ type: Types.CREATE_ORDER_FAILURE, error: Messages.NetWorkError });
        console.log(error);
    }
}

function* GetMyOrders(action) {
    yield put({ type: Types.GET_MY_ORDERS_REQUEST });
    try {
        const res = yield call(getMyOrders, action.user_id, action.user_type);
        if (res.result) {
            yield put({ type: Types.GET_MY_ORDERS_SUCCESS, payload: res.orders });
        } else {
            yield put({ type: Types.GET_MY_ORDERS_FAILURE, error: res.error });      
        }
    } catch (error) {
        yield put({ type: Types.GET_MY_ORDERS_FAILURE, error: Messages.NetWorkError });
        console.log(error);
    }
}

function* GetOrder(action) {
    yield put({ type: Types.GET_ORDER_REQUEST });
    try {
        const res = yield call(getOrder, action.order_id);
        if (res.result) {
            yield put({ type: Types.GET_ORDER_SUCCESS, payload: res.order });
        } else {
            yield put({ type: Types.GET_ORDER_FAILURE, error: res.error });      
        }
    } catch (error) {
        yield put({ type: Types.GET_ORDER_FAILURE, error: Messages.NetWorkError });
        console.log(error);
    }
}

function* GetNearbyOrders(action) {
    yield put({ type: Types.GET_NEARBY_ORDERS_REQUEST });
    try {
        const res = yield call(getNearbyOrders, action.lat, action.lng);
        if (res.result) {
            yield put({ type: Types.GET_NEARBY_ORDERS_SUCCESS, payload: res.orders });
        } else {
            yield put({ type: Types.GET_NEARBY_ORDERS_FAILURE, error: res.error });      
        }
    } catch (error) {
        yield put({ type: Types.GET_NEARBY_ORDERS_FAILURE, error: Messages.NetWorkError });
        console.log(error);
    }
}

function* PickupOrder(action) {
    yield put({ type: Types.PICKUP_ORDER_REQUEST });
    try {
        const res = yield call(pickupOrder, action.order_id, action.delivery_time);
        if (res.result) {
            yield put({ type: Types.PICKUP_ORDER_SUCCESS, payload: res.order });
        } else {
            yield put({ type: Types.PICKUP_ORDER_FAILURE, error: res.error });      
        }
    } catch (error) {
        yield put({ type: Types.PICKUP_ORDER_FAILURE, error: Messages.NetWorkError });
        console.log(error);
    }
}

function* CompleteOrder(action) {
    yield put({ type: Types.COMPLETE_ORDER_REQUEST });
    try {
        const res = yield call(completeOrder, action.order_id);
        if (res.result) {
            yield put({ type: Types.COMPLETE_ORDER_SUCCESS, payload: res.order });
        } else {
            yield put({ type: Types.COMPLETE_ORDER_FAILURE, error: res.error });      
        }
    } catch (error) {
        yield put({ type: Types.COMPLETE_ORDER_FAILURE, error: Messages.NetWorkError });
        console.log(error);
    }
}

export default [
  takeLatest(Types.CREATE_ORDER, CreateOrder),
  takeLatest(Types.GET_MY_ORDERS, GetMyOrders),
  takeLatest(Types.GET_ORDER, GetOrder),
  takeLatest(Types.GET_NEARBY_ORDERS, GetNearbyOrders),
  takeLatest(Types.PICKUP_ORDER, PickupOrder),
  takeLatest(Types.COMPLETE_ORDER, CompleteOrder),
];
