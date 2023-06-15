import {
  put, call, takeLatest
} from 'redux-saga/effects';
import Types from '../actions/actionTypes';
import api from '../api';
import Messages from '../theme/Messages'

const {
  loginUser,
  loginWithSocial,
  registerCustomer,
  registerChef,
  checkEmail,
  forgotPassword,
  verifyCodePassword,
  resetPassword,
  changePassword,
  getUser,
  updateProfile,

  getChef,
  nearbyChefs,
  writeReviewForUser,

  addShippingAddress,
  editShippingAddress,
  removeShippingAddress,
  changeActiveShippingAddress,

  addPayment,
  editPayment,
  removePayment,

  withdrawWithPaypal,
  withdrawWithBank,
} = api;

function* GetCurrentUser(action) {
  yield put({ type: Types.GET_CURRENT_USER_REQUEST });
  try {
    yield put({ type: Types.GET_CURRENT_USER_SUCCESS });
  } catch (error) {
    yield put({ type: Types.GET_CURRENT_USER_FAILURE, error: Messages.NetWorkError });
  }
}

function* LoginUser(action) {
  yield put({ type: Types.LOGIN_REQUEST });
  try {
    const res = yield call(loginUser, action.email, action.password, action.player_id, action.lat, action.lng);
    if (res.result) {
      yield put({ type: Types.LOGIN_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.LOGIN_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.LOGIN_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* LoginWithSocial(action) {
  yield put({ type: Types.LOGIN_WITH_SOCIAL_REQUEST });
  try {
    const res = yield call(loginWithSocial, action.user, action.player_id, action.lat, action.lng);
    if (res.result) {
      yield put({ type: Types.LOGIN_WITH_SOCIAL_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.LOGIN_WITH_SOCIAL_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.LOGIN_WITH_SOCIAL_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* RestoreUser(action) {
  yield put({ type: Types.RESTORE_USER_REQUEST });
  try {
    const res = yield call(getUser, action.user_id);
    if (res.result) {
      yield put({ type: Types.RESTORE_USER_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.RESTORE_USER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.RESTORE_USER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* CheckEmail(action) {
  yield put({ type: Types.CHECK_EMAIL_REQUEST });
  try {
    const res = yield call(checkEmail, action.email);
    if (res.result) {
      yield put({ type: Types.CHECK_EMAIL_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.CHECK_EMAIL_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.CHECK_EMAIL_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* GetChef(action) {
  yield put({ type: Types.GET_CHEF_REQUEST });
  try {
    const res = yield call(getChef, action.user_id);
    if (res.result) {
      yield put({ type: Types.GET_CHEF_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.GET_CHEF_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_CHEF_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* NearbyChefs(action) {
  yield put({ type: Types.NEARBY_CHEFS_REQUEST });
  try {
    const res = yield call(nearbyChefs, action.lat, action.lng);
    if (res.result) {
      yield put({ type: Types.NEARBY_CHEFS_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.NEARBY_CHEFS_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.NEARBY_CHEFS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* WriteReviewForUser(action) {
  yield put({ type: Types.WRITE_REVIEW_USER_REQUEST });
  try {
    const res = yield call(writeReviewForUser, action.data);
    if (res.result) {
      yield put({ type: Types.WRITE_REVIEW_USER_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.WRITE_REVIEW_USER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.WRITE_REVIEW_USER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* RegisterCustomer(action) {
  yield put({ type: Types.REGISTER_CUSTOMER_REQUEST });
  try {
    const res = yield call(registerCustomer, action.user, action.player_id);
    if (res.result) {
      yield put({ type: Types.REGISTER_CUSTOMER_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.REGISTER_CUSTOMER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.REGISTER_CUSTOMER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* RegisterChef(action) {
  yield put({ type: Types.REGISTER_CHEF_REQUEST });
  try {
    const res = yield call(registerChef, action.user);
    if (res.result) {
      yield put({ type: Types.REGISTER_CHEF_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.REGISTER_CHEF_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.REGISTER_CHEF_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* ForgotPassword(action) {
  yield put({ type: Types.FORGOT_PASSWORD_REQUEST });
  try {
    const res = yield call(forgotPassword, action.email);
    if (res.result) {
      yield put({ type: Types.FORGOT_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.FORGOT_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.FORGOT_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* VerifyCodePassword(action) {
  yield put({ type: Types.VERIFY_CODE_PASSWORD_REQUEST });
  try {
    const res = yield call(verifyCodePassword, action.email, action.code);
    if (res.result) {
      yield put({ type: Types.VERIFY_CODE_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.VERIFY_CODE_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.VERIFY_CODE_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* ResetPassword(action) {
  yield put({ type: Types.RESET_PASSWORD_REQUEST });
  try {
    const res = yield call(resetPassword, action.email, action.password);
    if (res.result) {
      yield put({ type: Types.RESET_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.RESET_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.RESET_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* ChangePassword(action) {
  yield put({ type: Types.CHANGE_PASSWORD_REQUEST });
  try {
    const res = yield call(changePassword, action.user_id, action.old_password, action.new_password);
    if (res.result) {
      yield put({ type: Types.CHANGE_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.CHANGE_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.CHANGE_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* GetUser(action) {
  yield put({ type: Types.GET_USER_REQUEST });
  try {
    const res = yield call(getUser, action.user_id, action.is_update);
    if (res.result) {
      yield put({ type: Types.GET_USER_SUCCESS, payload: res, is_update: action.is_update});
    } else {
      yield put({ type: Types.GET_USER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_USER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* UpdateProfile(action) {
  yield put({ type: Types.UPDATE_PROFILE_REQUEST });
  try {
    const res = yield call(updateProfile, action.user);
    if (res.result) {
      yield put({ type: Types.UPDATE_PROFILE_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.UPDATE_PROFILE_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.UPDATE_PROFILE_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* AddShippingAddress(action) {
  yield put({ type: Types.ADD_SHIPPING_ADDRESS_REQUEST });
  try {
    const res = yield call(
      addShippingAddress, 
      action.user_id,
      action.address,
      action.apt,
      action.zipcode,
      action.lat,
      action.lng,
    );
    if (res.result) {
      yield put({ type: Types.ADD_SHIPPING_ADDRESS_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.ADD_SHIPPING_ADDRESS_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.ADD_SHIPPING_ADDRESS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* EditShippingAddress(action) {
  yield put({ type: Types.EDIT_SHIPPING_ADDRESS_REQUEST });
  try {
    const res = yield call(
      editShippingAddress, 
      action.id,
      action.user_id,
      action.address,
      action.apt,
      action.zipcode,
      action.lat,
      action.lng,
    );
    if (res.result) {
      yield put({ type: Types.EDIT_SHIPPING_ADDRESS_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.EDIT_SHIPPING_ADDRESS_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.EDIT_SHIPPING_ADDRESS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* RemoveShippingAddress(action) {
  yield put({ type: Types.REMOVE_SHIPPING_ADDRESS_REQUEST });
  try {
    const res = yield call(
      removeShippingAddress, 
      action.id,
      action.user_id
    );

    if (res.result) {
      yield put({ type: Types.REMOVE_SHIPPING_ADDRESS_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.REMOVE_SHIPPING_ADDRESS_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.REMOVE_SHIPPING_ADDRESS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* ChangeActiveShippingAddress(action) {
  yield put({ type: Types.CHANGE_ACTIVE_SHIPPING_ADDRESS_REQUEST });
  try {
    const res = yield call(
      changeActiveShippingAddress, 
      action.id,
      action.user_id
    );

    if (res.result) {
      yield put({ type: Types.CHANGE_ACTIVE_SHIPPING_ADDRESS_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.CHANGE_ACTIVE_SHIPPING_ADDRESS_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.CHANGE_ACTIVE_SHIPPING_ADDRESS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* AddPayment(action) {
  yield put({ type: Types.ADD_PAYMENT_REQUEST });
  try {
    const res = yield call(
      addPayment, 
      action.user_id,
      action.card,
    );

    if (res.result) {
      yield put({ type: Types.ADD_PAYMENT_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.ADD_PAYMENT_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.ADD_PAYMENT_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* EditPayment(action) {
  yield put({ type: Types.EDIT_PAYMENT_REQUEST });
  try {
    const res = yield call(
      editPayment, 
      action.user_id,
      action.card,
    );

    if (res.result) {
      yield put({ type: Types.EDIT_PAYMENT_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.EDIT_PAYMENT_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.EDIT_PAYMENT_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* RemovePayment(action) {
  yield put({ type: Types.REMOVE_PAYMENT_REQUEST });
  try {
    const res = yield call(
      removePayment, 
      action.user_id,
      action.id,
    );

    if (res.result) {
      yield put({ type: Types.REMOVE_PAYMENT_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.REMOVE_PAYMENT_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.REMOVE_PAYMENT_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* WithdrawWithPaypal(action) {
  yield put({ type: Types.WITHDRAW_WITH_PAYPAL_REQUEST });
  try {
    const res = yield call(
      withdrawWithPaypal, 
      action.user_id,
      action.paypal,
      action.amount,
    );

    if (res.result) {
      yield put({ type: Types.WITHDRAW_WITH_PAYPAL_SUCCESS, payload: res, amount: action.amount });
    } else {
      yield put({ type: Types.WITHDRAW_WITH_PAYPAL_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.WITHDRAW_WITH_PAYPAL_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  };
}

function* WithdrawWithBank(action) {
  yield put({ type: Types.WITHDRAW_WITH_BANK_REQUEST });
  try {
    const res = yield call(
      withdrawWithBank, 
      action.user_id,
      action.routing_number,
      action.account_number,
      action.card_number,
      action.expire_date,
      action.cvc,
      action.amount,
    );

    if (res.result) {
      yield put({ type: Types.WITHDRAW_WITH_BANK_SUCCESS, payload: res, amount: action.amount});
    } else {
      yield put({ type: Types.WITHDRAW_WITH_BANK_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.WITHDRAW_WITH_BANK_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  };
}

export default [
  takeLatest(Types.GET_CURRENT_USER, GetCurrentUser),
  takeLatest(Types.LOGIN_USER, LoginUser),
  takeLatest(Types.LOGIN_WITH_SOCIAL, LoginWithSocial),
  takeLatest(Types.RESTORE_USER, RestoreUser),
  takeLatest(Types.CHECK_EMAIL, CheckEmail),  
  takeLatest(Types.REGISTER_CUSTOMER, RegisterCustomer),  
  takeLatest(Types.REGISTER_CHEF, RegisterChef),
  takeLatest(Types.FORGOT_PASSWORD, ForgotPassword),
  takeLatest(Types.VERIFY_CODE_PASSWORD, VerifyCodePassword),
  takeLatest(Types.RESET_PASSWORD, ResetPassword),
  takeLatest(Types.CHANGE_PASSWORD, ChangePassword),
  takeLatest(Types.GET_USER, GetUser),
  takeLatest(Types.UPDATE_PROFILE, UpdateProfile),

  takeLatest(Types.GET_CHEF, GetChef),
  takeLatest(Types.NEARBY_CHEFS, NearbyChefs),
  takeLatest(Types.WRITE_REVIEW_USER, WriteReviewForUser),

  takeLatest(Types.ADD_SHIPPING_ADDRESS, AddShippingAddress),
  takeLatest(Types.EDIT_SHIPPING_ADDRESS, EditShippingAddress),
  takeLatest(Types.REMOVE_SHIPPING_ADDRESS, RemoveShippingAddress),
  takeLatest(Types.CHANGE_ACTIVE_SHIPPING_ADDRESS, ChangeActiveShippingAddress),

  takeLatest(Types.ADD_PAYMENT, AddPayment),
  takeLatest(Types.EDIT_PAYMENT, EditPayment),
  takeLatest(Types.REMOVE_PAYMENT, RemovePayment),

  takeLatest(Types.WITHDRAW_WITH_PAYPAL, WithdrawWithPaypal),
  takeLatest(Types.WITHDRAW_WITH_BANK, WithdrawWithBank),
];
