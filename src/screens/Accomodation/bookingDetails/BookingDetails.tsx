import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo } from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { BookingLog } from '../../../contants/Accomodation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { ShowToast } from '../../../config/constants';
import { useGetBookingByIdQuery, useUpdateHotelBookingStatusMutation } from '../../../redux/services/hotelService';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';

const HOURS_BEFORE_CHECKIN_TO_ALLOW_CANCEL = 24;

/** True if check-in is more than 24 hours from now */
const canCancelBooking = (checkInDateStr: string): boolean => {
  if (!checkInDateStr) return false;
  const checkIn = new Date(checkInDateStr);
  const now = new Date();
  const diffMs = checkIn.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours >= HOURS_BEFORE_CHECKIN_TO_ALLOW_CANCEL;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

type BookingDetailsParams = { booking?: BookingLog; bookingId?: number };

const BookingDetails = ({
  route,
  navigation,
}: {
  route: RouteProp<{ BookingDetails: BookingDetailsParams }, 'BookingDetails'>;
  navigation: any;
}) => {
  const paramsBooking = route.params?.booking;
  const bookingId = paramsBooking?.id ?? route.params?.bookingId;

  const { data: fetchResult, isLoading: isFetching, refetch } = useGetBookingByIdQuery(bookingId!, {
    skip: bookingId == null || bookingId === undefined,
  });
  const fetchedBooking = (fetchResult as any)?.data as BookingLog | undefined;
  const booking: BookingLog | undefined = fetchedBooking ?? paramsBooking;

  const [updateStatus, { isLoading: isUpdating }] = useUpdateHotelBookingStatusMutation();

  const allowCancel = useMemo(() => {
    if (!booking || (booking.status || '').toLowerCase() !== 'pending') return false;
    return canCancelBooking(booking.checkInDate);
  }, [booking]);

  const cancelMessage = useMemo(() => {
    if (!booking?.checkInDate) return 'Cannot cancel this booking.';
    if ((booking.status || '').toLowerCase() !== 'pending') return 'Booking is no longer pending.';
    if (!canCancelBooking(booking.checkInDate)) {
      return 'Cancellation is allowed only at least 24 hours before check-in.';
    }
    return null;
  }, [booking]);

  const handleCancelBooking = () => {
    if (!booking || !allowCancel) return;
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateStatus({ id: booking.id, status: 'cancelled' }).unwrap();
              ShowToast('success', 'Booking cancelled successfully');
              refetch();
            } catch (e: any) {
              ShowToast('error', e?.data?.message || e?.message || 'Failed to cancel booking');
            }
          },
        },
      ]
    );
  };

  if (bookingId != null && isFetching && !paramsBooking) {
    return (
      <WrapperContainer title="Booking Details" navigation={navigation}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </WrapperContainer>
    );
  }

  if (!booking) {
    return (
      <WrapperContainer title="Booking Details" navigation={navigation}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Booking not found.</Text>
        </View>
      </WrapperContainer>
    );
  }

  const hotel = booking.hotel as any;
  const locationStr = `${hotel?.location?.city ?? ''}, ${hotel?.location?.country ?? ''}`.trim() || '—';

  return (
    <WrapperContainer title="Booking Details" navigation={navigation}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{hotel?.name ?? 'Hotel'}</Text>
          <Text style={styles.location}>{locationStr}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Check-in</Text>
          <Text style={styles.value}>{formatDate(booking.checkInDate)}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Check-out</Text>
          <Text style={styles.value}>{formatDate(booking.checkOutDate)}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Guests</Text>
          <Text style={styles.value}>{booking.numberOfGuests ?? '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Rooms</Text>
          <Text style={styles.value}>{booking.numberOfRooms ?? '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Total amount</Text>
          <Text style={styles.valueAmount}>${booking.totalAmount ?? 0}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, styles.statusText]}>
            {(booking.status || 'pending').toUpperCase()}
          </Text>
        </View>

        {cancelMessage && (
          <Text style={styles.cancelHint}>{cancelMessage}</Text>
        )}

        {allowCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelBooking}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </WrapperContainer>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: colors.c_666666 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: colors.c_DDDDDD,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  location: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.c_666666,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
  },
  valueAmount: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  statusText: {
    textTransform: 'capitalize',
  },
  cancelHint: {
    fontSize: 13,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginTop: 8,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: colors.c_B40000,
    borderRadius: 100,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
});
