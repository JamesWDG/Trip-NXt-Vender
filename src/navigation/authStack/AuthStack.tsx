import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Signin from '../../screens/signin/Signin';
import Splash from '../../screens/splash/Splash';
import GetStarted from '../../screens/getStarted/GetStarted';
import Signup from '../../screens/signup/Signup';
import DashboardTabs from '../../screens/dashboardTabs/DashboardTabs';
import OtpVerify from '../../screens/Restaurant/otpVerify/OtpVerify';

export type NavigationPropType = NativeStackNavigationProp<any>;

const Stack = createNativeStackNavigator();

const AuthStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="OtpVerify" component={OtpVerify} />
      <Stack.Screen name="DashboardTabs" component={DashboardTabs} />
    </Stack.Navigator>
  );
};

export default AuthStack;
