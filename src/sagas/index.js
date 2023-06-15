import { all } from 'redux-saga/effects';
import globalsSagas from './globals';
import mealsSagas from './meals';
import notificationsSagas from './notifications';
import userSagas from './user';
import orderSagas from './orders';

export default function* sagas() {
  yield all([
    ...globalsSagas,
    ...mealsSagas,
    ...notificationsSagas,
    ...userSagas,
    ...orderSagas,
  ]);
}
