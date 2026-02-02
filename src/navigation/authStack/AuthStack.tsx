import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Signin from '../../screens/signin/Signin';
import Splash from '../../screens/splash/Splash';
import GetStarted from '../../screens/getStarted/GetStarted';
import Signup from '../../screens/signup/Signup';
import DashboardTabs from '../../screens/dashboardTabs/DashboardTabs';
import OtpVerify from '../../screens/Restaurant/otpVerify/OtpVerify';
import Login from '../../screens/login/Login';
import ForgotPassword from '../../screens/ForgotPassword/ForgotPassword';
import ResetPassword from '../../screens/Password/ResetPassword';
import ScheduleAndBank from '../../screens/Restaurant/scheduleAndBank/ScheduleAndBank';

export type NavigationPropType = NativeStackNavigationProp<any>;

const Stack = createNativeStackNavigator();

const AuthStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="DashboardTabs" component={DashboardTabs} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="OtpVerify" component={OtpVerify} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
