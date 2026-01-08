import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RestaurantHome from '../../screens/Restaurant/restaurantHome/RestaurantHome';
import OtpVerify from '../../screens/Restaurant/otpVerify/OtpVerify';
import RestaurantDetails from '../../screens/Restaurant/restaurantDetails/RestaurantDetails';
import ScheduleAndBank from '../../screens/Restaurant/scheduleAndBank/ScheduleAndBank';
import StripeConnection from '../../screens/Restaurant/stripeConnection/StripeConnection';
import Menu from '../../screens/Restaurant/menu/Menu';
import AddMenu from '../../screens/Restaurant/addMenu/AddMenu';
import MenuImage from '../../screens/Restaurant/menuImage/MenuImage';
import Orders from '../../screens/Restaurant/orders/Orders';
import OrderDetails from '../../screens/Restaurant/orderDetails/OrderDetails';
import CurrentOrders from '../../screens/Restaurant/currentOrders/CurrentOrders';
import Earning from '../../screens/Restaurant/earning/Earning';
import Reviews from '../../screens/Restaurant/reviews/Reviews';
import RestaurantProfile from '../../screens/Restaurant/restaurantProfile/RestaurantProfile';
import RestaurantInfo from '../../screens/Restaurant/restaurantInfo/RestaurantInfo';
import ManagePlan from '../../screens/Restaurant/managePlans/ManagePlan';
import SubscriptionPlans from '../../screens/Ride/subscriptionPlans/SubscriptionPlans';
import RideDetails from '../../screens/Restaurant/rideDetails/RideDetails';
import RiderDetails from '../../screens/Restaurant/riderDetails/RiderDetails';
import FindYourRide from '../../screens/Restaurant/findYourRide/FindYourRide';
import Map from '../../screens/Restaurant/Map/Map';

const Stack = createNativeStackNavigator();

const RestaurantStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      {/* Home Screen */}
      <Stack.Screen name="RestaurantHome" component={RestaurantHome} />

      {/* Authentication & Setup Flow */}

      <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="ScheduleAndBank" component={ScheduleAndBank} />
      <Stack.Screen name="StripeConnection" component={StripeConnection} />
      <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlans} />

      {/* Menu Management */}
      <Stack.Screen name="Menu" component={Menu} />
      <Stack.Screen name="FindYourRide" component={FindYourRide} />
      <Stack.Screen name="RiderDetails" component={RiderDetails} />
      <Stack.Screen name="AddMenu" component={AddMenu} />
      <Stack.Screen name="MenuImage" component={MenuImage} />

      {/* Orders */}
      <Stack.Screen name="Orders" component={Orders} />
      {/* <Stack.Screen name="MenuManage" component={MenuManage} /> */}
      <Stack.Screen name="CurrentOrders" component={CurrentOrders} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />

      {/* Other Screens */}
      <Stack.Screen name="Earning" component={Earning} />
      <Stack.Screen name="Reviews" component={Reviews} />
      <Stack.Screen name="RestaurantProfile" component={RestaurantProfile} />
      <Stack.Screen name="RestaurantInfo" component={RestaurantInfo} />
      <Stack.Screen name="ManagePlan" component={ManagePlan} />
      <Stack.Screen name="RideDetails" component={RideDetails} />
    </Stack.Navigator>
  );
};

export default RestaurantStack;
