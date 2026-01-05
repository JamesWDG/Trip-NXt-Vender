import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../screens/Accomodation/home/Home'; // Placeholder - replace with Car home screen

const Stack = createNativeStackNavigator();

const CarStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="RideHome" component={Home} />
    </Stack.Navigator>
  );
};

export default CarStack;
