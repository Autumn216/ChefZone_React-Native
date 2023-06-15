import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Images from '../theme/Images'

import ChefHomeScreen from '../screens/Chef/ChefHomeScreen'
import NotificationScreen from '../screens/NotificationScreen';
import PostMealScreen from '../screens/Chef/PostMealScreen';
import MealsListScreen from '../screens/Chef/MealsListScreen';
import MyAccountScreen from '../screens/MyAccountScreen'

import TabBarItem from './TabBarItem';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChefHome" component={ChefHomeScreen} options={{ headerShown: false, gestureEnabled: false }}/>
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
function MealsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MealsList" component={MealsListScreen} options={{ headerShown: false, gestureEnabled: false }}/>
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

class ChefTab extends React.Component {
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
                  else if (route.name === 'PostMeal') {
                    icon = Images.tab_add;
                    selectedIcon = Images.tab_add;
                  }
                  else if (route.name === 'MealsStack') {
                    icon = Images.tab_menu_inactive;
                    selectedIcon = Images.tab_menu_active;
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
              <Tab.Screen 
                name="PostMeal" 
                component={PostMealScreen} 
                listeners={({ navigation, route }) => ({
                  tabPress: e => {
                    e.preventDefault();
                    navigation.navigate('PostMealScreen');
                  },
                })}
              />
              <Tab.Screen name="MealsStack" component={MealsStack} />
              <Tab.Screen name="MyAccountStack" component={MyAccountStack} />
            </Tab.Navigator>
      );      
  }
}

export default ChefTab;