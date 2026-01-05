import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../../screens/profile/Profile';

const Stack = createNativeStackNavigator();

const ProfileStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
