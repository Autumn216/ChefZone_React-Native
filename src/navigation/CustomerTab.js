import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Images from '../theme/Images'

import CustomerHomeScreen from '../screens/Customer/CustomerHomeScreen'
import NotificationScreen from '../screens/NotificationScreen';
import CustomerOrderScreen from '../screens/Customer/CustomerOrderScreen'
import MyAccountScreen from '../screens/MyAccountScreen'

import TabBarItem from './TabBarItem';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

function NotificationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}
function OrderStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CustomerOrder" component={CustomerOrderScreen} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

function MyAccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyAccount" component={MyAccountScreen} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

class CustomerTab extends React.Component {
  render() {
      return (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  var icon;
                  var selectedIcon;

                  if (route.name === 'HomeStack') {
                    icon = Images.tab_home_inactive;
                    selectedIcon = Images.tab_home_active;
                  }
                  else if (route.name === 'NotificationStack') {
                    icon = Images.tab_notification_inactive;
                    selectedIcon = Images.tab_notification_active;
                  }
                  else if (route.name === 'OrderStack') {
                    icon = Images.tab_order_inactive;
                    selectedIcon = Images.tab_order_active;
                  }
                  else if (route.name === 'MyAccountStack') {
                    icon = Images.tab_profile_inactive;
                    selectedIcon = Images.tab_profile_active;
                  }

                  return <TabBarItem 
                    page={route.name}
                    icon={icon} 
                    selectedIcon={selectedIcon}
                    focused={focused} 
                  />;
                  
                },
              })}
              tabBarOptions={{
                showLabel: false,
              }}
            >
              <Tab.Screen name="HomeStack" component={HomeStack} />
              <Tab.Screen name="NotificationStack" component={NotificationStack} />
              <Tab.Screen name="OrderStack" component={OrderStack} />
              <Tab.Screen name="MyAccountStack" component={MyAccountStack} />
            </Tab.Navigator>
      );      
  }
}

export default CustomerTab;