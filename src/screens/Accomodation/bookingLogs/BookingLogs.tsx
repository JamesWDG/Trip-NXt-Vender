import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import images from '../../../config/images';
import HotelCard from '../../../components/hotelCard/HotelCard';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import { useNavigation } from '@react-navigation/native';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import labels from '../../../config/labels';
import { useLazyGetBookingLogsQuery } from '../../../redux/services/hotelService';
import { BookingLog, Hotel } from '../../../contants/Accomodation';
import { ShowToast } from '../../../config/constants';

const BookingLogs = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [getBookingLogs, { isLoading }] = useLazyGetBookingLogsQuery();
  const [bookingLogs, setBookingLogs] = useState<BookingLog[]>([]);
  const fetchBookingLogs = async () => {
    try {
      const res = await getBookingLogs(1).unwrap();
      console.log('booking logs: ', res);
      setBookingLogs(res.data);
    } catch (error) {
      console.log('error fetching booking logs: ', error);
      ShowToast('error', 'Failed to fetch booking logs');
    }
  }
  useEffect(() => {
    fetchBookingLogs();
  }, []);
  return (
    <WrapperContainer title="Booking Logs" navigation={navigation}>
      <View style={styles.mainContainer}>
        <SearchWithFilters
          placeholder={labels.whatareYouLookingFor}
          navigation={navigation}
        />
        <AccomodationTabButtons data={['Hotels', 'Foods', 'Ride']} />
      </View>
      <FlatList
        data={bookingLogs}
        renderItem={({ item }) => (
          <HotelCard
            image={item.hotel.images[0]}
            hotelName={item.hotel.name}
            rentPerDay={item.totalAmount}
            rentPerHour={0}
            rating={4.5}
            beds={item.numberOfBeds}
            baths={item?.hotel?.numberOfBathrooms}
            parking={item?.numberOfGuests}
            location={`${item?.hotel?.location?.city}, ${item?.hotel?.location?.country}`}
            onPress={() => {
              /* handle navigation */
            }}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </WrapperContainer>
  );
};

export default BookingLogs;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    // marginBottom: 20,
    gap: 16,
    // backgroundColor: 'red',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
    gap: 16,
  },
});
