import { url } from '../constants';
import { Platform } from 'react-native';
import { filterFileUri, filterFileName } from '../functions';

////////////////////////////////////////////////////////////////////////////
//////////////////////////// Login User ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

export const loginUser = (email, password, player_id, lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/user/login`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email, 
    password, 
    device_token: player_id, 
    lat: lat,
    lng: lng,
    os: Platform.OS,    
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////////
//////////////////////// Login With Social /////////////////////////////////
////////////////////////////////////////////////////////////////////////////

export const loginWithSocial = (user, player_id, lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/user/login_with_social`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user: user,
    device_token: player_id,
    os: Platform.OS,
    lat: lat,
    lng: lng,
    os: Platform.OS,    
  });

  return fetch(request_url, { method, body, headers})
    .then(res => res.json())
    .then(res => {
        if (res.needToSignUp) {
          res.result = true;
          res.user = user;
        }
        return res;
      }
    );
};

////////////////////////////////////////////////////////////////////////////
/////////////////////// Register Customer //////////////////////////////////
////////////////////////////////////////////////////////////////////////////

export const registerCustomer = (user, player_id) => {
  const formData = new FormData();
  if (user.avatarFile) {
    var filename = filterFileName(user.avatarFile, Platform.OS);
    var filetype = user.avatarFile.type ? user.avatarFile.type : 'image/jpeg';
    const fileUri = filterFileUri(user.avatarFile.uri, Platform.OS);
    const params = {
      name: filename,
      type: filetype,
      uri: fileUri
    };
    formData.append("avatar", params);        
  }

  formData.append("firstName", user.firstName);
  formData.append("lastName", user.lastName);
  formData.append("password", user.password);
  formData.append("email", user.email);
  formData.append("phone", user.phone);
  formData.append("location", user.location);
  formData.append("lat", user.currentLat);
  formData.append("lng", user.currentLng);
  formData.append("device_token", player_id);
  formData.append("os", Platform.OS);

  if (user.socialId) {
    formData.append("socialId", user.socialId);
  }

  if (user.socialType) {
    formData.append("socialType", user.socialType);
  }

  if (user.avatar) {
    formData.append("avatar", user.avatar);
  }

  const request_url = `${url}/user/register_customer`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

////////////////////////////////////////////////////////////////////////////
///////////////////////// Register Chef ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

export const registerChef = (user) => {
  const formData = new FormData();
  
  // ID Card Images.
  for (var i = 0; i < user.idCards.length; i++) {
    var card = user.idCards[i];
    var filename = filterFileName(card, Platform.OS);
    var filetype = card.type ? card.type : 'image/jpeg';
    const fileUri = filterFileUri(card.uri, Platform.OS);
    formData.append("id_card_" + i, {
        name: filename,
        type: filetype,
        uri: fileUri
    });    
  }

  // Avatar File.
  if (user.avatarFile) {
    var filename = filterFileName(user.avatarFile, Platform.OS);
    var filetype = user.avatarFile.type ? user.avatarFile.type : 'image/jpeg';
    const fileUri = filterFileUri(user.avatarFile.uri, Platform.OS);
    const params = {
      name: filename,
      type: filetype,
      uri: fileUri
    };
    formData.append("avatar", params);        
  }

  var socialId = '';
  var socialType = '';
  var avatar = '';

  if (user.socialId) {
      socialId = user.socialId; 
  }

  if (user.socialType) {
      socialType = user.socialType; 
  }

  if (user.avatar) {
      avatar = user.avatar; 
  }

  formData.append("firstName", user.firstName);
  formData.append("lastName", user.lastName);
  formData.append("email", user.email);
  formData.append("phone", user.phone);
  formData.append("location", user.location);
  formData.append("zipcode", user.zipcode);
  formData.append("socialId", socialId);
  formData.append("socialType", socialType);
  formData.append("avatar", avatar);
  formData.append("password", user.password);
  formData.append("idNumber", user.idNumber);
  formData.append("idNote", user.idNote);
  formData.append("device_token", user.player_id);
  formData.append("os", Platform.OS);
  formData.append("lat", user.currentLat);
  formData.append("lng", user.currentLng);

  const request_url = `${url}/user/register_chef`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

////////////////////////////////////////////////////////////////////////////
/////////////////////////// Nearby Chefs ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////
export const nearbyChefs = (lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/user/nearby_chefs`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    lat,
    lng
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////////
/////////////////////// Write Review For User //////////////////////////////
////////////////////////////////////////////////////////////////////////////
export const writeReviewForUser = (data) => {
  const method = 'POST';
  const request_url = `${url}/user/write_review`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////////
//////////////////////// Forgot Password ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////
export const forgotPassword = (email) => {
  const method = 'POST';
  const request_url = `${url}/user/forgot_password`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////////
////////////////////////// Verify Code /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
export const verifyCodePassword = (email, code) => {
  const method = 'POST';
  const request_url = `${url}/user/verify_resetcode`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
    code: code,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////////
///////////////////////// Reset Password ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////
export const resetPassword = (email, password) => {
  const method = 'POST';
  const request_url = `${url}/user/reset_newpassword`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
    password: password
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////////
//////////////////////// Change Password ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////
export const changePassword = (user_id, old_password, new_password) => {
  const method = 'POST';
  const request_url = `${url}/user/change_password`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    id: user_id,
    old_password: old_password,
    new_password: new_password
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////////
////////////////////////// Get User ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
export const getUser = (user_id, is_update) => {
  const method = 'POST';
  const request_url = `${url}/user/get_user`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: user_id,                
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////////
////////////////////////// Update Profile /////////////////////////////////
////////////////////////////////////////////////////////////////////////////
export const updateProfile = (user) => {
  const formData = new FormData();
  if (user.avatarFile) {
    var filename = filterFileName(user.avatarFile, Platform.OS);
    var filetype = user.avatarFile.type ? user.avatarFile.type : 'image/jpeg';
    const fileUri = filterFileUri(user.avatarFile.uri, Platform.OS);
    const params = {
      name: filename,
      type: filetype,
      uri: fileUri
    };
    formData.append("avatar", params);        
  }

  formData.append("id", user.id);
  formData.append("firstName", user.firstName);
  formData.append("lastName", user.lastName);
  formData.append("email", user.email);
  formData.append("phone", user.phone);
  formData.append("location", user.location);
  formData.append("lat", user.currentLat);
  formData.append("lng", user.currentLng);

  if (user.deliveryFee && user.deliveryFee.length >= 0) {
    formData.append("deliveryFee", parseFloat(user.deliveryFee));
  }
  if (user.taxRate && user.taxRate.length > 0) {
    formData.append("taxRate", parseFloat(user.taxRate));
  }

  const request_url = `${url}/user/update_profile`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

////////////////////////////////////////////////////////////////////////////
/////////////////////////// Check Email ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
export const checkEmail = (email) => {
  const method = 'POST';
  const request_url = `${url}/user/check_email`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
  });

  return fetch(request_url, { method, body, headers})
    .then(res => res.json())
    .then(res => {
        return res;
      }
    );
};

////////////////////////////////////////////////////////////////////////////
//////////////////////// Shipping Address //////////////////////////////////
////////////////////////////////////////////////////////////////////////////
export const addShippingAddress = (user_id, address, apt, zipcode, lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/user/add_shipping_address`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id,
    address,
    apt,
    zipcode,
    lat,
    lng,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const editShippingAddress = (id, user_id, address, apt, zipcode, lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/user/edit_shipping_address`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    id,
    user_id,
    address,
    apt,
    zipcode,
    lat,
    lng,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const removeShippingAddress = (id, user_id) => {
  const method = 'POST';
  const request_url = `${url}/user/remove_shipping_address`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    id,
    user_id,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const changeActiveShippingAddress = (id, user_id) => {
  const method = 'POST';
  const request_url = `${url}/user/change_active_shipping_address`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    id,
    user_id,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////////
//////////////////////////// Payments //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

export const addPayment = (user_id, card) => {
  const method = 'POST';
  const request_url = `${url}/user/add_payment`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id,
    token: card.token,
    brand: card.brand,
    last4: card.last4,
    expYear: card.expYear,
    expMonth: card.expMonth,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const editPayment = (user_id, card) => {
  const method = 'POST';
  const request_url = `${url}/user/edit_payment`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id,
    id: card.id,
    token: card.token,
    brand: card.brand,
    last4: card.last4,
    expYear: card.expYear,
    expMonth: card.expMonth,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const removePayment = (user_id, id) => {
  const method = 'POST';
  const request_url = `${url}/user/remove_payment`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id,
    id,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////////
//////////////////////////// Get Chef //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
export const getChef = (user_id) => {
  const method = 'POST';
  const request_url = `${url}/user/get_chef`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id,                
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
////////////////////// Withdraw Paypal //////////////////////
/////////////////////////////////////////////////////////////
export const withdrawWithPaypal = (user_id, paypal, amount) => {
  const method = 'POST';
  const request_url = `${url}/withdraw/request_withdraw`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: user_id,
    amount: amount,
    payment_type: 'paypal',
    paypal: paypal
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
////////////////////// Withdraw Bank ////////////////////////
/////////////////////////////////////////////////////////////
export const withdrawWithBank = (user_id, routing_number, account_number, card_number, expire_date, cvc, amount) => {
  const method = 'POST';
  const request_url = `${url}/withdraw/request_withdraw`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: user_id,
    amount: amount,
    payment_type: 'bank',
    routing_number: routing_number,
    account_number: account_number,
    card_number: card_number,
    expire_date: expire_date,
    cvc: cvc,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};
