import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import AuthStack from './authStack/AuthStack';
import { navigationRef } from '../config/constants';
import AuthStack from './authStack/AuthStack';
import BottomStack from './bottomStack/BottomStack';
import CancelBooking from '../screens/Ride/cancelBooking/CancelBooking';
import MyVehicle from '../screens/Ride/myVehicle/MyVehicle';
import Documents from '../screens/Ride/documents/Documents';
import TotalEarnings from '../screens/Ride/totalEarnings/TotalEarnings';
import ManagePlans from '../screens/Ride/managePlans/ManagePlans';
import RideBookingLogs from '../screens/Ride/rideBookingLogs/RideBookingLogs';
import UpcomingRides from '../screens/Ride/upcomingRides/UpcomingRides';
import Earning from '../screens/Restaurant/earning/Earning';
import CurrentOrders from '../screens/Restaurant/currentOrders/CurrentOrders';
import DriverRegistration from '../screens/Ride/driverRegistration/DriverRegistration';
import DriverDocuments from '../screens/Ride/driverDocuments/DriverDocuments';
import VehicleDocuments from '../screens/Ride/vehicleDocuments/VehicleDocuments';
import VehicleRegistration from '../screens/Ride/vehicleRegistration/VehicleRegistration';
import SubscriptionPlans from '../screens/Ride/subscriptionPlans/SubscriptionPlans';
import ManagePlan from '../screens/Restaurant/managePlans/ManagePlan';
import RestaurantProfile from '../screens/Restaurant/restaurantProfile/RestaurantProfile';
import Offline from '../screens/Ride/offline/Offline';
import RideNumber from '../screens/Ride/rideNumber/RideNumber';
import Pickup from '../screens/Ride/pickup/Pickup';
import Reviews from '../screens/Restaurant/reviews/Reviews';
import Menu from '../screens/Restaurant/menu/Menu';
import RideDetails from '../screens/Restaurant/rideDetails/RideDetails';
import Orders from '../screens/Restaurant/orders/Orders';
import RestaurantHome from '../screens/Restaurant/restaurantHome/RestaurantHome';
// import AppStack from './appStack/AppStack';
// import BottomStack from './bottomStack/BottomStack';
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
