import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { navigationRef } from '../config/constants';
import AuthStack from './authStack/AuthStack';
import BottomStack from './bottomStack/BottomStack';
import RestaurantInfo from '../screens/Restaurant/restaurantInfo/RestaurantInfo';

export interface RootParamList {
  auth: undefined;
  [key: string]: undefined;
}

const RootNavigator = createNativeStackNavigator<RootParamList>();
const RootNavigation: FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer ref={navigationRef} onReady={() => {}}>
          <RootNavigator.Navigator screenOptions={{ headerShown: false }}>
           <RootNavigator.Screen name="auth" component={AuthStack} />
            <RootNavigator.Screen name="app" component={BottomStack} />
          </RootNavigator.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default RootNavigation;
