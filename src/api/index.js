import * as globals from './globals';
import * as meals from './meals';
import * as notifications from './notifications';
import * as user from './user';
import * as orders from './orders';

export default {
  ...globals,
  ...meals,
  ...notifications,
  ...user,
  ...orders,
};
