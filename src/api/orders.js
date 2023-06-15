import { url } from '../constants';
import Moment from 'moment';

//////////////////////////////////////////////////////////////
/////////////////////// Create Order /////////////////////////
//////////////////////////////////////////////////////////////
export const createOrder = (data) => {
  const method = 'POST';
  const request_url = `${url}/order/create_order`
  const headers = {
    'Content-Type': 'application/json',
  }

  const body = JSON.stringify({ 
    user_id: data.user_id,
    chef_id: data.chef_id,
    stripeCustomerId: data.stripeCustomerId,
    token: data.token,
    brand: data.brand,
    last4: data.last4,
    expYear: data.expYear,
    expMonth: data.expMonth,
    address: data.address,
    apt: data.apt,
    zipcode: data.zipcode,
    lat: data.lat,
    lng: data.lng,
    
    subtotal: data.subtotal,
    deliveryFee: data.deliveryFee,
    tax: data.tax,
    total: data.total,

    meal: data.meal._id,
    size: data.size,
    amount: data.amount,
    extra: JSON.stringify(data.extra)
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////
////////////////////// Get My Orders /////////////////////////
//////////////////////////////////////////////////////////////
export const getMyOrders = (user_id, user_type) => {
  const method = 'POST';
  const request_url = `${url}/order/get_my_orders`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id,
    user_type
  });
  return fetch(request_url, { method, body, headers})
  .then((response) => response.json())
};

//////////////////////////////////////////////////////////////
//////////////////////// Get Order ///////////////////////////
//////////////////////////////////////////////////////////////
export const getOrder = (order_id) => {
  const method = 'POST';
  const request_url = `${url}/order/get_order`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    order_id,
 });
  return fetch(request_url, { method, body, headers})
  .then((response) => response.json())
};

//////////////////////////////////////////////////////////////
//////////////////// Get Nearby Orders ///////////////////////
//////////////////////////////////////////////////////////////
export const getNearbyOrders = (lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/order/get_nearby_orders`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    lat,
    lng
  });
  return fetch(request_url, { method, body, headers})
  .then((response) => response.json())
};

//////////////////////////////////////////////////////////////
////////////////////// Pick Up ///////////////////////////////
//////////////////////////////////////////////////////////////
export const pickupOrder = (order_id, delivery_time) => {
  const method = 'POST';
  const request_url = `${url}/order/pickup_order`
  const headers = {
    'Content-Type': 'application/json',
  }


  const body = JSON.stringify({ 
    order_id,
    delivery_time: Moment(delivery_time).unix()
  });
  return fetch(request_url, { method, body, headers})
  .then((response) => response.json())
};

//////////////////////////////////////////////////////////////
/////////////////// Complete Order ///////////////////////////
//////////////////////////////////////////////////////////////
export const completeOrder = (order_id) => {
  const method = 'POST';
  const request_url = `${url}/order/complete_order`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    order_id
  });

  return fetch(request_url, { method, body, headers})
  .then((response) => response.json())
};