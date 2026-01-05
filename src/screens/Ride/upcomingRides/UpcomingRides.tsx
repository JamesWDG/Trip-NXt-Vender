import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import RideBookingCard from '../../../components/rideBookingCard/RideBookingCard';
import images from '../../../config/images';
import fonts from '../../../config/fonts';

type RideStatus = 'Upcoming';

interface UpcomingRide {
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
const sampleUpcomingRides: UpcomingRide[] = [
  {
    id: '1',
    rideId: '12345',
    status: 'Upcoming',
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
    status: 'Upcoming',
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
    status: 'Upcoming',
    date: '08 Jan, 2024',
    time: '10:15 am',
    amount: 200.0,
    rideCode: 'FRA-BE-123456791-LUXROOM',
    passengerName: 'Jane Smith',
    passengerPhone: '555 123 4567',
    passengerAvatar: images.avatar,
  },
];

const UpcomingRides = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [upcomingRides] = useState(sampleUpcomingRides);

  const handleRidePress = (ride: UpcomingRide) => {
    // Handle ride card press
    console.log('Ride pressed:', ride);
    // navigation.navigate('RideDetails', { rideId: ride.id });
  };

  return (
    <WrapperContainer navigation={navigation} title="Upcoming">
      <FlatList
        data={upcomingRides}
        ListHeaderComponent={() => {
          return (
            <View>
              <Text style={styles.headerText}>Upcoming</Text>
            </View>
          );
        }}
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

export default UpcomingRides;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 20,
    fontFamily: fonts.bold,
    marginBottom: 20,
  },
});
