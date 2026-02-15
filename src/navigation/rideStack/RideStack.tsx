import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all Ride screens
import SubscriptionPlans from '../../screens/Ride/subscriptionPlans/SubscriptionPlans';
import Pickup from '../../screens/Ride/pickup/Pickup';
import RideNumber from '../../screens/Ride/rideNumber/RideNumber';
import TripEnd from '../../screens/Ride/tripEnded/TripEnded';
import DropOff from '../../screens/Ride/dropOff/DropOff';
import Offline from '../../screens/Ride/offline/Offline';
import ManagePlans from '../../screens/Ride/managePlans/ManagePlans';
import VehicleRegistration from '../../screens/Ride/vehicleRegistration/VehicleRegistration';
import VehicleDocuments from '../../screens/Ride/vehicleDocuments/VehicleDocuments';
import DriverRegistration from '../../screens/Ride/driverRegistration/DriverRegistration';
import DriverDocuments from '../../screens/Ride/driverDocuments/DriverDocuments';
import UpcomingRides from '../../screens/Ride/upcomingRides/UpcomingRides';
import RideBookingLogs from '../../screens/Ride/rideBookingLogs/RideBookingLogs';
import Documents from '../../screens/Ride/documents/Documents';
import MyVehicle from '../../screens/Ride/myVehicle/MyVehicle';
import TotalEarnings from '../../screens/Ride/totalEarnings/TotalEarnings';
import CancelBooking from '../../screens/Ride/cancelBooking/CancelBooking';
import RideRequest from '../../screens/Ride/rideRequest/RideRequest';

const Stack = createNativeStackNavigator();

const RideStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      {/* Subscription & Plans */}
      <Stack.Screen name="MyVehicle" component={MyVehicle} />
      <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlans} />
      <Stack.Screen name="ManagePlans" component={ManagePlans} />

      {/* Registration & Documents */}
      <Stack.Screen name="DriverRegistration" component={DriverRegistration} />
      <Stack.Screen name="DriverDocuments" component={DriverDocuments} />
      <Stack.Screen
        name="VehicleRegistration"
        component={VehicleRegistration}
      />
      <Stack.Screen name="VehicleDocuments" component={VehicleDocuments} />
      <Stack.Screen name="Documents" component={Documents} />

      {/* Ride Management */}
      <Stack.Screen name="RideNumber" component={RideNumber} />
      <Stack.Screen name="Pickup" component={Pickup} />
      <Stack.Screen name="DropOff" component={DropOff} />
      <Stack.Screen name="TripEnded" component={TripEnd} />
      <Stack.Screen name="CancelBooking" component={CancelBooking} />
      <Stack.Screen name="Offline" component={Offline} />

      {/* Rides & Earnings */}
      <Stack.Screen name="UpcomingRides" component={UpcomingRides} />
      <Stack.Screen name="RideBookingLogs" component={RideBookingLogs} />
      <Stack.Screen name="TotalEarnings" component={TotalEarnings} />

      {/* Vehicle Management */}
      <Stack.Screen name="RideRequest" component={RideRequest} />
    </Stack.Navigator>
  );
};

export default RideStack;
