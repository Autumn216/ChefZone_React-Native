import globals from './globals';
import meals from './meals';
import notifications from './notifications';
import user from './user';
import orders from './orders';

export default {
  ...globals,
  ...meals,
  ...notifications,
  ...user,
  ...orders,
};
