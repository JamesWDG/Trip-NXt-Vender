import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Calendar, Clock } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';
import images from '../../config/images';

type RideStatus =
  | 'Completed'
  | 'Pending'
  | 'Cancelled'
  | 'In Progress'
  | 'Upcoming';

interface RideBookingCardProps {
  rideId: string;
  status: RideStatus;
  date: string;
  time: string;
  amount: number;
  rideCode: string;
  passengerName: string;
  passengerPhone: string;
  passengerAvatar?: ImageSourcePropType;
  onPress?: () => void;
}

const RideBookingCard: React.FC<RideBookingCardProps> = ({
  rideId,
  status,
  date,
  time,
  amount,
  rideCode,
  passengerName,
  passengerPhone,
  passengerAvatar,
  onPress,
}) => {
  const formatAmount = (amt: number) => {
    return `$${amt.toFixed(2)}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Completed':
        return colors.c_0162C0;
      case 'Pending':
        return colors.c_F59523;
      case 'Cancelled':
        return colors.c_EE4026;
      case 'In Progress':
        return colors.green;
      case 'Upcoming':
        return colors.c_0162C0;
      default:
        return colors.c_666666;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, GeneralStyles.shadow]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Top Section - Ride Details */}
      <View style={styles.topSection}>
        <View style={styles.rideHeader}>
          <Text style={styles.rideId}>Ride # {rideId}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <View style={styles.rideDetails}>
          <View style={styles.leftDetails}>
            <View style={styles.detailRow}>
              <Calendar size={16} color={colors.c_666666} />
              <Text style={styles.dateText}>{date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={16} color={colors.c_666666} />
              <Text style={styles.timeText}>{time}</Text>
            </View>
            <Text style={styles.rideCode}>{rideCode}</Text>
          </View>

          <View style={styles.rightDetails}>
            <Text style={styles.amount}>{formatAmount(amount)}</Text>
          </View>
        </View>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Bottom Section - Passenger Details */}
      <View style={styles.bottomSection}>
        <Image
          source={passengerAvatar || images.avatar}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.passengerInfo}>
          <Text style={styles.passengerName}>{passengerName}</Text>
          <Text style={styles.passengerPhone}>{passengerPhone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RideBookingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: colors.c_DDDDDD,
  },
  topSection: {
    marginBottom: 12,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rideId: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    position: 'absolute',
    right: -15,
    top: -15,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftDetails: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  timeText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  rideCode: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginTop: 4,
  },
  rightDetails: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  amount: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
  },
  separator: {
    height: 1,
    backgroundColor: colors.c_F3F3F3,
    marginVertical: 12,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 4,
  },
  passengerPhone: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
});
