import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import SelectUserTypeScreen from '../screens/SelectUserTypeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import TermsScreen from '../screens/TermsScreen';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import ResetNewPasswordScreen from '../screens/ResetNewPasswordScreen';
import IDVerificationScreen from '../screens/IDVerificationScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

import PostMealScreen from '../screens/Chef/PostMealScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import ChefDetailScreen from '../screens/ChefDetailScreen';
import ShippingAddressScreen from '../screens/Customer/ShippingAddressScreen';
import PaymentListScreen from '../screens/Customer/PaymentListScreen';
import AddCardScreen from '../screens/Customer/AddCardScreen';
import OrderPayScreen from '../screens/Customer/OrderPayScreen';
import ResultSubmitOrderScreen from '../screens/Customer/ResultSubmitOrderScreen';
import OrderDetailScreen from '../screens/Customer/OrderDetailScreen';
import ChefOrderDetailScreen from '../screens/Chef/ChefOrderDetailScreen';
import RevenueScreen from '../screens/Chef/RevenueScreen';
import PaymentMethodScreen from '../screens/Chef/PaymentMethodScreen';
import CardWithdrawScreen from '../screens/Chef/CardWithdrawScreen';
import PaypalWithdrawScreen from '../screens/Chef/PaypalWithdrawScreen';

import CustomerTab from './CustomerTab';
import ChefTab from './ChefTab';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="SelectUserType" component={SelectUserTypeScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false, gestureEnabled: false }}/>        
        <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ResetNewPassword" component={ResetNewPasswordScreen} options={{ headerShown: false, gestureEnabled: false }}/>                
        <Stack.Screen name="Terms" component={TermsScreen} options={{ headerShown: false, gestureEnabled: false }}/>        
        <Stack.Screen name="IDVerification" component={IDVerificationScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ShippingAddress" component={ShippingAddressScreen} options={{ headerShown: false, gestureEnabled: false }}/>        
        <Stack.Screen name="PaymentList" component={PaymentListScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="AddCard" component={AddCardScreen} options={{ headerShown: false, gestureEnabled: false }}/>        
        <Stack.Screen name="OrderPay" component={OrderPayScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ResultSubmitOrder" component={ResultSubmitOrderScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ChefOrderDetail" component={ChefOrderDetailScreen} options={{ headerShown: false, gestureEnabled: false }}/>

        <Stack.Screen name="PostMealScreen" component={PostMealScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="MealDetail" component={MealDetailScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ChefDetail" component={ChefDetailScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="Revenue" component={RevenueScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="CardWithdraw" component={CardWithdrawScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="PaypalWithdraw" component={PaypalWithdrawScreen} options={{ headerShown: false, gestureEnabled: false }}/>

        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="CustomerTab" component={CustomerTab} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ChefTab" component={ChefTab} options={{ headerShown: false, gestureEnabled: false }}/>
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

export default AppNavigator;

