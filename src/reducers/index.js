import { combineReducers } from 'redux';
import globals from './globals';
import meals from './meals';
import notifications from './notifications';
import user from './user';
import orders from './orders';

const applicationReducers = {
  globals,
  notifications,
  meals,
  user,
  orders,
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
