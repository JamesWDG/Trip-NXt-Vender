import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import images from '../../../config/images';
import HotelCard from '../../../components/hotelCard/HotelCard';
import SectionHeader from '../../../components/sectionHeader/SectionHeader';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import { useNavigation } from '@react-navigation/native';
import { useLazyGetBookingLogsQuery } from '../../../redux/services/hotelService';
import { BookingLog } from '../../../contants/Accomodation';
import { ShowToast } from '../../../config/constants';

const BookingLogs = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [getAllVendorBookings, { isLoading }] = useLazyGetBookingLogsQuery();
  const [allBookings, setAllBookings] = useState<BookingLog[]>([]);

  const fetchAllBookings = async () => {
    try {
      // No status = fetch all (pending, confirmed, cancelled) for this vendor
      const res = await getAllVendorBookings(undefined).unwrap();
      setAllBookings(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      ShowToast('error', 'Failed to fetch booking logs');
      setAllBookings([]);
    }
  };

  useEffect(() => {
    fetchAllBookings();
    const sub = navigation.addListener('focus', () => {
      fetchAllBookings();
    });
    return () => sub();
  }, []);

  const locationStr = (item: BookingLog) => {
    const loc = (item?.hotel as any)?.location;
    const parts = [loc?.city, loc?.country].filter(Boolean);
    return parts.length ? parts.join(', ') : '—';
  };

  return (
    <WrapperContainer title="Booking Logs" navigation={navigation}>
      <View style={styles.mainContainer}>
        <SectionHeader title="All Bookings" />
      </View>
      <FlatList
        data={allBookings}
        renderItem={({ item }) => (
          <HotelCard
            image={
              item.hotel?.images?.length
                ? item.hotel.images[0]
                : images.placeholder
            }
            hotelName={item.hotel?.name ?? 'Hotel'}
            rentPerDay={item.totalAmount}
            rentPerHour={item.hotel?.rentPerHour ?? 0}
            rating={4.5}
            beds={item.numberOfBeds}
            baths={item?.hotel?.numberOfBathrooms ?? 0}
            parking={item?.numberOfGuests}
            location={locationStr(item)}
            onPress={() => {
              navigation.navigate('Accomodation', {
                screen: 'BookingDetails',
                params: { booking: item },
              });
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading && allBookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bookings yet</Text>
            </View>
          ) : null
        }
      />
    </WrapperContainer>
  );
};

export default BookingLogs;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 120,
    gap: 16,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
