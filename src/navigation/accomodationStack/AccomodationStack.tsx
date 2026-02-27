import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../screens/Accomodation/home/Home';
import Payment from '../../screens/Accomodation/payment/Payment';
import MyWallet from '../../screens/Accomodation/myWallet/MyWallet';
import RulesAndRegulations from '../../screens/Accomodation/rulesAndRegulations/RulesAndRegulations';
import Congratulations from '../../screens/Accomodation/congratulations/Congratulations';
import MyHotels from '../../screens/Accomodation/myHotels/MyHotels';
import BookingLogs from '../../screens/Accomodation/bookingLogs/BookingLogs';
import MyCalender from '../../screens/Accomodation/myCalender/MyCalender';
import AddHotel from '../../screens/Accomodation/addHotel/AddHotel';
import ThankNote from '../../screens/Accomodation/thankNote/ThankNote';
import MessageSent from '../../screens/Accomodation/messageSent/MessageSent';
import UploadPhoto from '../../screens/Accomodation/uploadPhoto/UploadPhoto';
import PeopleStays from '../../screens/Accomodation/peopleStays/PeopleStays';
import Features from '../../screens/Accomodation/features/Features';
import HotelBooking from '../../screens/Accomodation/hotelBooking/HotelBooking';
import SubscriptionPlans from '../../screens/Accomodation/subscriptionPlans/SubscriptionPlans';
import ContactUs from '../../screens/Accomodation/contactUs/ContactUs';
import HotelDetails from '../../screens/hotelDetails/HotelDetails';
import BookingDetails from '../../screens/Accomodation/bookingDetails/BookingDetails';
import Notification from '../../screens/notification/Notification';

const Stack = createNativeStackNavigator();

const AccomodationStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      {/* <Stack.Screen name="MyHotels" component={MyHotels} /> */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="HotelDetails" component={HotelDetails} />
      <Stack.Screen name="BookingDetails" component={BookingDetails} />
      <Stack.Screen name="UploadPhoto" component={UploadPhoto} />
      <Stack.Screen name="BookingLogs" component={BookingLogs} />
      <Stack.Screen name="Congratulations" component={Congratulations} />
      <Stack.Screen
        name="RulesAndRegulations"
        component={RulesAndRegulations}
      />
      <Stack.Screen name="MyWallet" component={MyWallet} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="AddHotel" component={AddHotel} />
      <Stack.Screen name="ThankNote" component={ThankNote} />
      <Stack.Screen name="MessageSent" component={MessageSent} />
      <Stack.Screen name="MyCalender" component={MyCalender} />
      <Stack.Screen name="PeopleStays" component={PeopleStays} />
      <Stack.Screen name="Features" component={Features} />
      <Stack.Screen name="HotelBooking" component={HotelBooking} />
      <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlans} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Notifications" component={Notification} />
    </Stack.Navigator>
  );
};

export default AccomodationStack;
