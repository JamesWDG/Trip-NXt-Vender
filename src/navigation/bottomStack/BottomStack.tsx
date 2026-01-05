import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBars from '../../components/tabBars/TabBars';
import AccomodationStack from '../accomodationStack/AccomodationStack';
import BookingLogs from '../../screens/Accomodation/bookingLogs/BookingLogs';
import MyHotels from '../../screens/Accomodation/myHotels/MyHotels';
import AppStack from '../appStack/AppStack';
import PrivacyPolicy from '../../screens/privacyPolicy/PrivacyPolicy';
import Faqs from '../../screens/faqs/Faqs';
import RestaurantStack from '../restaurantStack/RestaurantStack';
import ContactUs from '../../screens/Accomodation/contactUs/ContactUs';
import ProfileStack from '../profileStack/ProfileStack';
import Notification from '../../screens/notification/Notification';
import RideStack from '../rideStack/RideStack';
// import AppStack from '../appStack/AppStack';
// import AccomodationStack from '../accomodationStack/AccomodationStack';
// import CarStack from '../carStack/CarStack';
// import FoodStack from '../foodStack/FoodStack';
// import ProfileStack from '../profileStack/ProfileStack';

const Tab = createBottomTabNavigator();

const HomeScreen = () => (
  <View>
    <Text>Home</Text>
  </View>
);

const ProfileScreen = () => (
  <View>
    <Text>Profile</Text>
  </View>
);

const BottomStack: FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <TabBars {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      backBehavior="history"
    >
      <Tab.Screen name="RestaurantStack" component={RestaurantStack} />
      <Tab.Screen name="Accomodation" component={AccomodationStack} />
      <Tab.Screen name="CabStack" component={RideStack} />
      <Tab.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Tab.Screen name="FAQs" component={Faqs} />
      <Tab.Screen name="BookingLogs" component={BookingLogs} />
      <Tab.Screen name="ContactUs" component={ContactUs} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="MyHotels" component={MyHotels} />
      {/* <Tab.Screen name="Main" component={AppStack} /> */}
      {/* <Tab.Screen name="Car" component={CarStack} />
      <Tab.Screen name="Food" component={FoodStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Main" component={AppStack} /> */}
    </Tab.Navigator>
  );
};

export default BottomStack;

const styles = StyleSheet.create({});
