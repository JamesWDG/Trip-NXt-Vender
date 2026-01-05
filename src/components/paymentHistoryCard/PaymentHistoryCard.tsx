import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';

type PlanType = 'Monthly Plan' | 'Yearly Plan' | 'Weekly Plan';

interface PaymentHistoryCardProps {
  date: string;
  amount: number;
  planType: PlanType;
  status: 'Paid' | 'Pending' | 'Failed';
  onPress?: () => void;
}

const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({
  date,
  amount,
  planType,
  status,
  onPress,
}) => {
  const formatAmount = (amt: number) => {
    return `$${amt.toFixed(0)}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Paid':
        return '#00C853'; // Green color for paid
      case 'Pending':
        return colors.c_F59523; // Orange for pending
      case 'Failed':
        return colors.c_EE4026; // Red for failed
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
      <View style={styles.topRow}>
        <Text style={styles.date}>{date}</Text>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {status}
        </Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.amount}>
          {formatAmount(amount)} - {planType}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PaymentHistoryCard;

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
  date: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  status: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
});
