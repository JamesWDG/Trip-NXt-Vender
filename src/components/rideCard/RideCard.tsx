import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Clock } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';

type PaymentMethod = 'Cash' | 'Online';

interface RideCardProps {
  rideId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  time: string;
  onPress?: () => void;
}

const RideCard: React.FC<RideCardProps> = ({
  rideId,
  amount,
  paymentMethod,
  time,
  onPress,
}) => {
  const formatAmount = (amt: number) => {
    return `$${amt.toFixed(2)}`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, GeneralStyles.shadow]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <Text style={styles.rideId}>Ride ID: # {rideId}</Text>
        <View style={styles.timeContainer}>
          <Clock size={14} color={colors.c_666666} />
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.amount}>
          {formatAmount(amount)} - {paymentMethod}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RideCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: colors.c_DDDDDD,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rideId: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  time: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
});
