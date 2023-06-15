import { put, call, takeLatest } from 'redux-saga/effects';
import Types from '../actions/actionTypes';
import api from '../api';
import * as Storage from '../services/Storage';
import Messages from '../theme/Messages'

const {
  getGlobalInfo,
  getGeoData,
  getGeoAddress,
  uploadFile,
} = api;

function* GetGlobalInfo(action) {
  yield put({ type: Types.GET_GLOBAL_INFO_REQUEST });
  try {
    const res = yield call(getGlobalInfo);
    if (res.result) {
      yield put({ type: Types.GET_GLOBAL_INFO_SUCCESS, payload: res.data });
    } else {
      yield put({ type: Types.GET_GLOBAL_INFO_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_GLOBAL_INFO_FAILURE, error: error.message });
    console.log(error);
  }
}

function* GetGeoData(action) {
  yield put({ type: Types.GET_GEODATA_REQUEST });
  try {
    const res = yield call(getGeoData, action.address);
    if (res.result) {
      yield put({ type: Types.GET_GEODATA_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.GET_GEODATA_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_GEODATA_FAILURE, error: Messages.NetWorkError });
  }
}

function* GetGeoAddress(action) {
  yield put({ type: Types.GET_GEO_ADDRESS_REQUEST });
  try {
    const res = yield call(getGeoAddress, action.lat, action.lng);
    if (res.result) {
      yield put({ type: Types.GET_GEO_ADDRESS_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.GET_GEO_ADDRESS_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_GEO_ADDRESS_FAILURE, error: Messages.NetWorkError });
  }
}

function* UploadFile(action) {
  yield put({ type: Types.UPLOAD_ATTACH_FILE_REQUEST });
  try {
    const res = yield call(uploadFile, action.file);
    if (res.result) {
      yield put({ type: Types.UPLOAD_ATTACH_FILE_SUCCESS, payload: res});
    } else {
      yield put({ type: Types.UPLOAD_ATTACH_FILE_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.UPLOAD_ATTACH_FILE_FAILURE, error: Messages.NetWorkError });
  }
}

function* LogOut() {
  yield Promise.all([
	Storage.CurrentUser.remove(),
  ]).catch(() => {});

  // yield put({ type: Types.SET_NAVIGATOR, nav: action.nav });
}


export default [
  takeLatest(Types.GET_GLOBAL_INFO, GetGlobalInfo),
  takeLatest(Types.GET_GEODATA, GetGeoData),
  takeLatest(Types.GET_GEO_ADDRESS, GetGeoAddress),
  takeLatest(Types.UPLOAD_ATTACH_FILE, UploadFile),
  takeLatest(Types.LOG_OUT, LogOut),
];
