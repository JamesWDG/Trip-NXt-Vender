import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AccomodationStack from '../accomodationStack/AccomodationStack';
import RestaurantStack from '../restaurantStack/RestaurantStack';
import Notification from '../../screens/notification/Notification';
import PrivacyPolicy from '../../screens/privacyPolicy/PrivacyPolicy';
import BottomStack from '../bottomStack/BottomStack';

export type NavigationPropType = NativeStackNavigationProp<any>;

const Stack = createNativeStackNavigator();

const AppStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="MyTabs" component={BottomStack} />
      <Stack.Screen name="AccomodationStack" component={AccomodationStack} />
      <Stack.Screen name="RestaurantStack" component={RestaurantStack} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    </Stack.Navigator>
  );
};

export default AppStack;
