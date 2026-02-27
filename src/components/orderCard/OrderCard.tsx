import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';

interface OrderCardProps {
  orderId: string;
  time: string;
  customerName: string;
  amount: string;
  paymentMethod: string;
  status?: string;
  onViewDetails?: () => void;
}

const formatStatus = (s: string) => {
  const lower = (s || '').toLowerCase();
  if (lower === 'pending') return 'Pending';
  if (lower === 'processing') return 'Processing';
  if (lower === 'dispatched') return 'Dispatched';
  if (lower === 'completed' || lower === 'delivered') return 'Completed';
  if (lower === 'cancelled') return 'Cancelled';
  return (s || '').charAt(0).toUpperCase() + (s || '').slice(1).toLowerCase();
};

const OrderCard: React.FC<OrderCardProps> = ({
  orderId,
  time,
  customerName,
  amount,
  paymentMethod,
  status,
  onViewDetails,
}) => {
  return (
    <View style={[styles.card, GeneralStyles.shadow]}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.leftSection}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>{orderId}</Text>
            <View style={styles.separator} />
            <Text style={styles.time}>{time}</Text>
            {status ? (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{formatStatus(status)}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.customerNameContainer}>
            <Text style={styles.customerName}>{customerName}</Text>
            <View style={styles.rightSection}>
              <Text style={styles.paymentInfo}>
                {amount} • {paymentMethod}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Button Section */}
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={onViewDetails}
        activeOpacity={0.8}
      >
        <Text style={styles.viewDetailsText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.c_0162C0,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftSection: {
    flex: 1,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  statusBadge: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: colors.c_F3F3F3,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
  },
  separator: {
    width: 1,
    height: 14,
    backgroundColor: colors.c_666666,
    marginHorizontal: 8,
  },
  time: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  customerName: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_EE4026, // Red color
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  paymentInfo: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginBottom: 12,
  },
  viewDetailsButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  viewDetailsText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  customerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
