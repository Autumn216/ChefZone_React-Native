import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
  id: null,
  currentUser: null,
  needToSignUp: false,
  cartBadge: 0,
  user: {},
  playerId: null,
  errorMessage: '',
  resultMessage: '',
  lat: 0,
  lng: 0,
  currentZipcode: '',
  unreadMessages: 0,
  nearbyData: [],

  selectedUser: {},
  selectedMeals: [],

  loginUserStatus: Status.NONE,
  loginWithSocialStatus: Status.NONE,
  checkEmailStatus: Status.NONE,
  registerCustomerStatus: Status.NONE,
  registerChefStatus: Status.NONE,
  forgotPasswordStatus: Status.NONE,
  verifyCodePasswordStatus: Status.NONE,
  resetPasswordStatus: Status.NONE,
  changePasswordStatus: Status.NONE,
  getUserStatus: Status.NONE,
  restoreUserStatus: Status.NONE,
  updateProfileStatus: Status.NONE,
  getCurrentUserStatus: Status.NONE,

  getChefStatus: Status.NONE,
  nearbyChefsStatus: Status.NONE,
  writeReviewUserStatus: Status.NONE,

  addShippingAddressStatus: Status.NONE,
  editShippingAddressStatus: Status.NONE,
  removeShippingAddressStatus: Status.NONE,
  changeActiveShippingAddressStatus: Status.NONE,

  addPaymentStatus: Status.NONE,
  editPaymentStatus: Status.NONE,
  removePaymentStatus: Status.NONE,

  withdrawWithPaypalStatus: Status.NONE,
  withdrawWithBankStatus: Status.NONE,
};

/////////////////////////////////////////////////////
/////////////////////// Login ///////////////////////
/////////////////////////////////////////////////////
const loginUserRequest = (state) => ({
  ...state,
  loginUserStatus: Status.REQUEST,
});

const loginUserSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  loginUserStatus: Status.SUCCESS,
});

const loginUserFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
 loginUserStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
//////////////// Login With Social //////////////////
/////////////////////////////////////////////////////
const loginWithSocialRequest = (state) => ({
  ...state,
  loginWithSocialStatus: Status.REQUEST,
});

const loginWithSocialSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload.user,
  needToSignUp: action.payload.needToSignUp ? action.payload.needToSignUp : false,  
  loginWithSocialStatus: Status.SUCCESS,
});

const loginWithSocialFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
 loginWithSocialStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
////////////////// Restore User /////////////////////
/////////////////////////////////////////////////////
const restoreUserRequest = (state) => ({
  ...state,
  restoreUserStatus: Status.REQUEST,
});

const restoreUserSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  restoreUserStatus: Status.SUCCESS,
});

const restoreUserFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  restoreUserStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
////////////////// Check Email //////////////////////
/////////////////////////////////////////////////////
const checkEmailRequest = (state) => ({
  ...state,
  checkEmailStatus: Status.REQUEST,
});

const checkEmailSuccess = (state, action) => ({
  ...state,
  checkEmailStatus: Status.SUCCESS,
});

const checkEmailFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  checkEmailStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
//////////////// Register Customer //////////////////
/////////////////////////////////////////////////////
const registerCustomerRequest = (state) => ({
  ...state,
  registerCustomerStatus: Status.REQUEST,
});

const registerCustomerSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  registerCustomerStatus: Status.SUCCESS,
});

const registerCustomerFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  registerCustomerStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
/////////////////// Register Chef ///////////////////
/////////////////////////////////////////////////////
const registerChefRequest = (state) => ({
  ...state,
  registerChefStatus: Status.REQUEST,
});

const registerChefSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  registerChefStatus: Status.SUCCESS,
});

const registerChefFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  registerChefStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
///////////////// Forgot Password ///////////////////
/////////////////////////////////////////////////////
const forgotPasswordRequest = (state) => ({
  ...state,
  forgotPasswordStatus: Status.REQUEST,
});

const forgotPasswordSuccess = (state, action) => ({
  ...state,
  resultMessage: action.payload,
  forgotPasswordStatus: Status.SUCCESS,
});

const forgotPasswordFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  forgotPasswordStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
/////////////// Verify Code Password ////////////////
/////////////////////////////////////////////////////
const verifyCodePasswordRequest = (state) => ({
  ...state,
  verifyCodePasswordStatus: Status.REQUEST,
});

const verifyCodePasswordSuccess = (state, action) => ({
  ...state,
  resultMessage: action.payload,
  verifyCodePasswordStatus: Status.SUCCESS,
});

const verifyCodePasswordFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  verifyCodePasswordStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
/////////////////// Reset Password //////////////////
/////////////////////////////////////////////////////
const resetPasswordRequest = (state) => ({
  ...state,
  resetPasswordStatus: Status.REQUEST,
});

const resetPasswordSuccess = (state, action) => ({
  ...state,
  resultMessage: action.payload,
  resetPasswordStatus: Status.SUCCESS,
});

const resetPasswordFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  resetPasswordStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
///////////////// Change Password ///////////////////
/////////////////////////////////////////////////////
const changePasswordRequest = (state) => ({
  ...state,
  changePasswordStatus: Status.REQUEST,
});

const changePasswordSuccess = (state, action) => ({
  ...state,
  resultMessage: action.payload,
  changePasswordStatus: Status.SUCCESS,
});

const changePasswordFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  changePasswordStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
////////////////// Get User /////////////////////////
/////////////////////////////////////////////////////
const getUserRequest = (state) => ({
  ...state,
  getUserStatus: Status.REQUEST,
});

const getUserSuccess = (state, action) => {
  state.getUserStatus = Status.SUCCESS;
  const { user} = action.payload;
  if (action.is_update) {
    state.currentUser = user;
  }
  state.user = user;
  return {
    ...state,
  };
};

const getUserFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getUserStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
///////////////// Nearby Chefs //////////////////////
/////////////////////////////////////////////////////
const nearbyChefsRequest = (state) => ({
  ...state,
  nearbyChefsStatus: Status.REQUEST,
});

const nearbyChefsSuccess = (state, action) => ({
  ...state,
  nearbyData: action.payload,
  nearbyChefsStatus: Status.SUCCESS,
});

const nearbyChefsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  nearbyChefsStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
//////////// Write Review For User //////////////////
/////////////////////////////////////////////////////
const writeReviewForUserRequest = (state) => ({
  ...state,
  writeReviewUserStatus: Status.REQUEST,
});

const writeReviewForUserSuccess = (state, action) => {
  state.writeReviewUserStatus = Status.SUCCESS;
  const { nearbyData } = state;
  const user = action.payload;
  var data = {...nearbyData};
  if (data && data.chefs) {
    data.chefs.forEach((item, index) => {
      if (item._id == user._id) {
        data.chefs[index] = user;
        return;
      }
    });
  }
  state.nearbyData = data;  
  state.selectedUser = user;
  return {
    ...state,
  };
};

const writeReviewForUserFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  writeReviewUserStatus: Status.FAILURE,
});

/* 
***** Update Customer. *****
*/

const updateProfileRequest = (state) => ({
  ...state,
  updateProfileStatus: Status.REQUEST,
});

const updateProfileSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  updateProfileStatus: Status.SUCCESS,
});

const updateProfileFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  updateProfileStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
/////////////// Get Current User ////////////////////
/////////////////////////////////////////////////////
const getCurrentUserRequest = (state) => ({
  ...state,
  getCurrentUserStatus: Status.REQUEST,
});

const getCurrentUserSuccess = (state, action) => ({
  ...state,
  getCurrentUserStatus: Status.SUCCESS,
});

const getCurrentUserFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  getCurrentUserStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////
///////////////////// Get Chef //////////////////////
/////////////////////////////////////////////////////
const getChefRequest = (state) => ({
  ...state,
  getChefStatus: Status.REQUEST,
});

const getChefSuccess = (state, action) => ({
  ...state,
  selectedUser: action.payload.user,
  selectedMeals: action.payload.meals,
  getChefStatus: Status.SUCCESS,
});

const getChefFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getChefStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
///////////////////// Shipping Address ///////////////////////////
//////////////////////////////////////////////////////////////////

/* 
***** Add Shipping Address. *****
*/
const addShippingAddressRequest = (state) => ({
  ...state,
  addShippingAddressStatus: Status.REQUEST,
});

const addShippingAddressSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  addShippingAddressStatus: Status.SUCCESS,
});

const addShippingAddressFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  addShippingAddressStatus: Status.FAILURE,
});

/* 
***** Edit Shipping Address. *****
*/
const editShippingAddressRequest = (state) => ({
  ...state,
  editShippingAddressStatus: Status.REQUEST,
});

const editShippingAddressSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  editShippingAddressStatus: Status.SUCCESS,
});

const editShippingAddressFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  editShippingAddressStatus: Status.FAILURE,
});

/* 
***** Remove Shipping Address. *****
*/
const removeShippingAddressRequest = (state) => ({
  ...state,
  removeShippingAddressStatus: Status.REQUEST,
});

const removeShippingAddressSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  removeShippingAddressStatus: Status.SUCCESS,
});

const removeShippingAddressFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  removeShippingAddressStatus: Status.FAILURE,
});

/* 
***** Change Active Shipping Address. *****
*/
const changeActiveAddressRequest = (state) => ({
  ...state,
  changeActiveShippingAddressStatus: Status.REQUEST,
});

const changeActiveAddressSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  changeActiveShippingAddressStatus: Status.SUCCESS,
});

const changeActiveAddressFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  changeActiveShippingAddressStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
//////////////////////// Payments ////////////////////////////////
//////////////////////////////////////////////////////////////////

/* 
***** Add Payment. *****
*/
const addPaymentRequest = (state) => ({
  ...state,
  addPaymentStatus: Status.REQUEST,
});

const addPaymentSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  addPaymentStatus: Status.SUCCESS,
});

const addPaymentFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  addPaymentStatus: Status.FAILURE,
});

/* 
***** Edit Payment. *****
*/
const editPaymentRequest = (state) => ({
  ...state,
  editPaymentStatus: Status.REQUEST,
});

const editPaymentSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  editPaymentStatus: Status.SUCCESS,
});

const editPaymentFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  editPaymentStatus: Status.FAILURE,
});

/* 
***** Remove Payment. *****
*/
const removePaymentRequest = (state) => ({
  ...state,
  removePaymentStatus: Status.REQUEST,
});

const removePaymentSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  removePaymentStatus: Status.SUCCESS,
});

const removePaymentFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  removePaymentStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////
/////////////////// Withdraw with Paypal ////////////////////
/////////////////////////////////////////////////////////////
const withdrawWithPaypalRequest = (state) => ({
  ...state,
  withdrawWithPaypalStatus: Status.REQUEST,
});

const withdrawWithPaypalSuccess = (state, action) => {
  state.currentUser.balance = state.currentUser.balance - action.amount
  return {
    ...state,
    withdrawWithPaypalStatus: Status.SUCCESS,
  }
};

const withdrawWithPaypalFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  withdrawWithPaypalStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////
//////////////////// Withdraw with Bank /////////////////////
/////////////////////////////////////////////////////////////
const withdrawWithBankRequest = (state) => ({
  ...state,
  withdrawWithBankStatus: Status.REQUEST,
});

const withdrawWithBankSuccess = (state, action) => {
  state.currentUser.balance = state.currentUser.balance - action.amount
  return {
    ...state,
    withdrawWithBankStatus: Status.SUCCESS,
  }
};

const withdrawWithBankFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  withdrawWithBankStatus: Status.FAILURE,
});

/* 
***** Set Current User. *****
*/

const setCurrentUser = (state, action) => ({
  ...state,
  currentUser: action.user,
});

/* 
***** Set Onesignal Player Id. *****
*/

const setPlayerId = (state, action) => ({
  ...state,
  playerId: action.payload,
});

/* 
***** Set Geo Location. *****
*/

const setGeoLocation = (state, action) => ({
  ...state,
  lat: action.lat,
  lng: action.lng,
});

/* 
***** Set Zip Code. *****
*/

const setZipcode = (state, action) => ({
  ...state,
  currentZipcode: action.zipcode,
});

const updateNearbyMeal = (state, action) => {
  const meal = action.payload;
  var tempData = {...state.nearbyData};
  if (tempData && tempData.meals) {
    tempData.meals.forEach((item, index) => {
      if (item._id == meal._id) {
        tempData.meals[index] = meal;
        return;
      }
    });
  }
  state.nearbyData = tempData;  
  return {
    ...state,
  };
};

///////////////////////////////////////////////////////
///////////////// Set Cart Badge //////////////////////
///////////////////////////////////////////////////////

const setCartBadge = (state, action) => {
  state.cartBadge = action.badge;
  return {
    ...state,
  };
};

/***************************************
**************** RESET *****************
***************************************/

const resetUser = (state, action) => {
  state.id = null;
  state.currentUser = null;
  state.needToSignUp = false;
  state.user = {};
  state.playerId = null;
  state.errorMessage = '';
  state.resultMessage = '';
  state.currentZipcode = '';
  state.unreadMessages = 0;
  state.selectedUser = null;
  state.selectedMeals = [];
  
  return {
    ...state,
  };
};


const actionHandlers = {
  [Types.LOGIN_REQUEST]: loginUserRequest,
  [Types.LOGIN_SUCCESS]: loginUserSuccess,
  [Types.LOGIN_FAILURE]: loginUserFailure,

  [Types.LOGIN_WITH_SOCIAL_REQUEST]: loginWithSocialRequest,
  [Types.LOGIN_WITH_SOCIAL_SUCCESS]: loginWithSocialSuccess,
  [Types.LOGIN_WITH_SOCIAL_FAILURE]: loginWithSocialFailure,

  [Types.RESTORE_USER_REQUEST]: restoreUserRequest,
  [Types.RESTORE_USER_SUCCESS]: restoreUserSuccess,
  [Types.RESTORE_USER_FAILURE]: restoreUserFailure,

  [Types.REGISTER_CUSTOMER_REQUEST]: registerCustomerRequest,
  [Types.REGISTER_CUSTOMER_SUCCESS]: registerCustomerSuccess,
  [Types.REGISTER_CUSTOMER_FAILURE]: registerCustomerFailure,

  [Types.REGISTER_CHEF_REQUEST]: registerChefRequest,
  [Types.REGISTER_CHEF_SUCCESS]: registerChefSuccess,
  [Types.REGISTER_CHEF_FAILURE]: registerChefFailure,

  [Types.FORGOT_PASSWORD_REQUEST]: forgotPasswordRequest,
  [Types.FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
  [Types.FORGOT_PASSWORD_FAILURE]: forgotPasswordFailure,

  [Types.VERIFY_CODE_PASSWORD_REQUEST]: verifyCodePasswordRequest,
  [Types.VERIFY_CODE_PASSWORD_SUCCESS]: verifyCodePasswordSuccess,
  [Types.VERIFY_CODE_PASSWORD_FAILURE]: verifyCodePasswordFailure,

  [Types.RESET_PASSWORD_REQUEST]: resetPasswordRequest,
  [Types.RESET_PASSWORD_SUCCESS]: resetPasswordSuccess,
  [Types.RESET_PASSWORD_FAILURE]: resetPasswordFailure,

  [Types.CHANGE_PASSWORD_REQUEST]: changePasswordRequest,
  [Types.CHANGE_PASSWORD_SUCCESS]: changePasswordSuccess,
  [Types.CHANGE_PASSWORD_FAILURE]: changePasswordFailure,

  [Types.NEARBY_CHEFS_REQUEST]: nearbyChefsRequest,
  [Types.NEARBY_CHEFS_SUCCESS]: nearbyChefsSuccess,
  [Types.NEARBY_CHEFS_FAILURE]: nearbyChefsFailure,

  [Types.GET_CHEF_REQUEST]: getChefRequest,
  [Types.GET_CHEF_SUCCESS]: getChefSuccess,
  [Types.GET_CHEF_FAILURE]: getChefFailure,

  [Types.GET_USER_REQUEST]: getUserRequest,
  [Types.GET_USER_SUCCESS]: getUserSuccess,
  [Types.GET_USER_FAILURE]: getUserFailure,

  [Types.UPDATE_PROFILE_REQUEST]: updateProfileRequest,
  [Types.UPDATE_PROFILE_SUCCESS]: updateProfileSuccess,
  [Types.UPDATE_PROFILE_FAILURE]: updateProfileFailure,

  [Types.GET_CURRENT_USER_REQUEST]: getCurrentUserRequest,
  [Types.GET_CURRENT_USER_SUCCESS]: getCurrentUserSuccess,
  [Types.GET_CURRENT_USER_FAILURE]: getCurrentUserFailure,

  [Types.CHECK_EMAIL_REQUEST]: checkEmailRequest,
  [Types.CHECK_EMAIL_SUCCESS]: checkEmailSuccess,
  [Types.CHECK_EMAIL_FAILURE]: checkEmailFailure,

  [Types.ADD_SHIPPING_ADDRESS_REQUEST]: addShippingAddressRequest,
  [Types.ADD_SHIPPING_ADDRESS_SUCCESS]: addShippingAddressSuccess,
  [Types.ADD_SHIPPING_ADDRESS_FAILURE]: addShippingAddressFailure,

  [Types.EDIT_SHIPPING_ADDRESS_REQUEST]: editShippingAddressRequest,
  [Types.EDIT_SHIPPING_ADDRESS_SUCCESS]: editShippingAddressSuccess,
  [Types.EDIT_SHIPPING_ADDRESS_FAILURE]: editShippingAddressFailure,

  [Types.REMOVE_SHIPPING_ADDRESS_REQUEST]: removeShippingAddressRequest,
  [Types.REMOVE_SHIPPING_ADDRESS_SUCCESS]: removeShippingAddressSuccess,
  [Types.REMOVE_SHIPPING_ADDRESS_FAILURE]: removeShippingAddressFailure,

  [Types.CHANGE_ACTIVE_SHIPPING_ADDRESS_REQUEST]: changeActiveAddressRequest,
  [Types.CHANGE_ACTIVE_SHIPPING_ADDRESS_SUCCESS]: changeActiveAddressSuccess,
  [Types.CHANGE_ACTIVE_SHIPPING_ADDRESS_FAILURE]: changeActiveAddressFailure,

  [Types.ADD_PAYMENT_REQUEST]: addPaymentRequest,
  [Types.ADD_PAYMENT_SUCCESS]: addPaymentSuccess,
  [Types.ADD_PAYMENT_FAILURE]: addPaymentFailure,

  [Types.EDIT_PAYMENT_REQUEST]: editPaymentRequest,
  [Types.EDIT_PAYMENT_SUCCESS]: editPaymentSuccess,
  [Types.EDIT_PAYMENT_FAILURE]: editPaymentFailure,

  [Types.REMOVE_PAYMENT_REQUEST]: removePaymentRequest,
  [Types.REMOVE_PAYMENT_SUCCESS]: removePaymentSuccess,
  [Types.REMOVE_PAYMENT_FAILURE]: removePaymentFailure,

  [Types.WRITE_REVIEW_USER_REQUEST]: writeReviewForUserRequest,
  [Types.WRITE_REVIEW_USER_SUCCESS]: writeReviewForUserSuccess,
  [Types.WRITE_REVIEW_USER_FAILURE]: writeReviewForUserFailure,

  [Types.WITHDRAW_WITH_PAYPAL_REQUEST]: withdrawWithPaypalRequest,
  [Types.WITHDRAW_WITH_PAYPAL_SUCCESS]: withdrawWithPaypalSuccess,
  [Types.WITHDRAW_WITH_PAYPAL_FAILURE]: withdrawWithPaypalFailure,

  [Types.WITHDRAW_WITH_BANK_REQUEST]: withdrawWithBankRequest,
  [Types.WITHDRAW_WITH_BANK_SUCCESS]: withdrawWithBankSuccess,
  [Types.WITHDRAW_WITH_BANK_FAILURE]: withdrawWithBankFailure,
  
  [Types.SET_CURRENT_USER]: setCurrentUser,
  [Types.SET_PLAYER_ID]: setPlayerId, 
  [Types.SET_GEO_LOCATION]: setGeoLocation, 
  [Types.SET_ZIPCODE]: setZipcode, 
  [Types.SET_CART_BADGE]: setCartBadge,
  [Types.UPDATE_NEARBY_MEAL]: updateNearbyMeal,
  [Types.RESET_USER]: resetUser,
};

export default createReducer(initialState, actionHandlers);
