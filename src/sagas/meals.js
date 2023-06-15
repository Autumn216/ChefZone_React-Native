import {
  put, call, takeLatest
} from 'redux-saga/effects';
import Types from '../actions/actionTypes';
import api from '../api';
import Messages from '../theme/Messages';

const {
  createMeal,
  removeMeal,
  getMyMeals,
  writeReviewForMeal,
  getMeal,
} = api;

function* CreateMeal(action) {
  yield put({ type: Types.CREATE_MEAL_REQUEST });
  try {
      const res = yield call(createMeal, action.data);
      if (res.result) {
          yield put({ type: Types.CREATE_MEAL_SUCCESS, payload: res.meal });
      } else {
          yield put({ type: Types.CREATE_MEAL_FAILURE, error: res.error });      
      }
  } catch (error) {
      yield put({ type: Types.CREATE_MEAL_FAILURE, error: Messages.NetWorkError });
      console.log(error);
  }
}

function* RemoveMeal(action) {
  yield put({ type: Types.REMOVE_MEAL_REQUEST });
  try {
      const res = yield call(removeMeal, action.meal_id);
      if (res.result) {
          yield put({ type: Types.REMOVE_MEAL_SUCCESS, payload: res.meal });
      } else {
          yield put({ type: Types.REMOVE_MEAL_FAILURE, error: res.error });      
      }
  } catch (error) {
      yield put({ type: Types.REMOVE_MEAL_FAILURE, error: Messages.NetWorkError });
      console.log(error);
  }
}

function* GetMyMeals(action) {
  yield put({ type: Types.GET_MY_MEALS_REQUEST });
  try {
      const res = yield call(getMyMeals, action.user_id);
      if (res.result) {
          yield put({ type: Types.GET_MY_MEALS_SUCCESS, payload: res.meals });
      } else {
          yield put({ type: Types.GET_MY_MEALS_FAILURE, error: res.error });      
      }
  } catch (error) {
      yield put({ type: Types.GET_MY_MEALS_FAILURE, error: Messages.NetWorkError });
      console.log(error);
  }
}

function* WriteReviewForMeal(action) {
  yield put({ type: Types.WRITE_REVIEW_MEAL_REQUEST });
  try {
      const res = yield call(writeReviewForMeal, action.data);
      if (res.result) {
          yield put({ type: Types.WRITE_REVIEW_MEAL_SUCCESS, payload: res.meal });
      } else {
          yield put({ type: Types.WRITE_REVIEW_MEAL_FAILURE, error: res.error });      
      }
  } catch (error) {
      yield put({ type: Types.WRITE_REVIEW_MEAL_FAILURE, error: Messages.NetWorkError });
      console.log(error);
  }
}

function* GetMeal(action) {
    yield put({ type: Types.GET_MEAL_REQUEST });
    try {
        const res = yield call(getMeal, action.meal_id, action.user_id);
        if (res.result) {
            yield put({ type: Types.GET_MEAL_SUCCESS, payload: res });
        } else {
            yield put({ type: Types.GET_MEAL_FAILURE, error: res.error });      
        }
    } catch (error) {
        yield put({ type: Types.GET_MEAL_FAILURE, error: Messages.NetWorkError });
        console.log(error);
    }
  }

export default [
  takeLatest(Types.CREATE_MEAL, CreateMeal),
  takeLatest(Types.REMOVE_MEAL, RemoveMeal),
  takeLatest(Types.GET_MY_MEALS, GetMyMeals),
  takeLatest(Types.WRITE_REVIEW_MEAL, WriteReviewForMeal),
  takeLatest(Types.GET_MEAL, GetMeal),
];
