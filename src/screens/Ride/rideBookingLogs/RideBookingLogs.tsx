import { FlatList, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import labels from '../../../config/labels';
import RideBookingCard from '../../../components/rideBookingCard/RideBookingCard';
import images from '../../../config/images';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import GeneralStyles from '../../../utils/GeneralStyles';

type RideStatus = 'Completed' | 'Pending' | 'Cancelled' | 'In Progress';

interface RideBooking {
  id: string;
  rideId: string;
  status: RideStatus;
  date: string;
  time: string;
  amount: number;
  rideCode: string;
  passengerName: string;
  passengerPhone: string;
  passengerAvatar?: any;
}

// Sample data - replace with actual data from API/state
const sampleRideBookings: RideBooking[] = [
  {
    id: '1',
    rideId: '12345',
    status: 'Completed',
    date: '06 Jan, 2024',
    time: '06:25 am',
    amount: 180.0,
    rideCode: 'FRA-BE-123456789-LUXROOM',
    passengerName: 'Lorem Ipsum',
    passengerPhone: '123 456 7890',
    passengerAvatar: images.avatar,
  },
  {
    id: '2',
    rideId: '12346',
    status: 'Pending',
    date: '07 Jan, 2024',
    time: '08:30 am',
    amount: 150.0,
    rideCode: 'FRA-BE-123456790-LUXROOM',
    passengerName: 'John Doe',
    passengerPhone: '987 654 3210',
    passengerAvatar: images.avatar,
  },
  {
    id: '3',
    rideId: '12347',
    status: 'In Progress',
    date: '08 Jan, 2024',
    time: '10:15 am',
    amount: 200.0,
    rideCode: 'FRA-BE-123456791-LUXROOM',
    passengerName: 'Jane Smith',
    passengerPhone: '555 123 4567',
    passengerAvatar: images.avatar,
  },
];

const RideBookingLogs = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [rideBookings] = useState(sampleRideBookings);

  const handleRidePress = (ride: RideBooking) => {
    // Handle ride card press
    console.log('Ride pressed:', ride);
    // navigation.navigate('RideDetails', { rideId: ride.id });
  };

  return (
    <WrapperContainer navigation={navigation} title="Booking Logs">
      <View style={styles.searchContainer}>
        <SearchWithFilters
          placeholder={labels.whatareYouLookingFor}
          navigation={navigation}
        />
      </View>

      {/* Tab Bar */}
      <View
        style={[GeneralStyles.paddingHorizontal, GeneralStyles.marginBottom]}
      >
        <AccomodationTabButtons data={['Completed', 'Cancelled']} />
      </View>
      <FlatList
        data={rideBookings}
        renderItem={({ item }) => (
          <RideBookingCard
            rideId={item.rideId}
            status={item.status}
            date={item.date}
            time={item.time}
            amount={item.amount}
            rideCode={item.rideCode}
            passengerName={item.passengerName}
            passengerPhone={item.passengerPhone}
            passengerAvatar={item.passengerAvatar}
            onPress={() => handleRidePress(item)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </WrapperContainer>
  );
};

export default RideBookingLogs;

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
