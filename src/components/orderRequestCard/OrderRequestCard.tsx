import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';

type PaymentMethod = 'Cash' | 'Online';

interface OrderItem {
  quantity: number;
  name: string;
  price: number;
}

interface OrderRequestCardProps {
  orderNumber: string;
  time: string;
  customerName: string;
  items: OrderItem[];
  totalBill: number;
  paymentMethod: PaymentMethod;
  onAccept?: () => void;
  onReject?: () => void;
  onOrderReady?: () => void;
  showAcceptReject?: boolean; // If true, shows Accept/Reject buttons, else shows Order Ready button
  isAccepting?: boolean;
  isRejecting?: boolean;
}

const OrderRequestCard: React.FC<OrderRequestCardProps> = ({
  orderNumber,
  time,
  customerName,
  items,
  totalBill,
  paymentMethod,
  onAccept,
  onReject,
  onOrderReady,
  showAcceptReject = true,
  isAccepting = false,
  isRejecting = false,
}) => {
  const formatAmount = (amt: number) => {
    return `$${amt.toFixed(0)}`;
  };

  return (
    <View style={[styles.card, GeneralStyles.shadow]}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.orderNumber}>{orderNumber}</Text>
        <View style={styles.verticalLine} />
        <Text style={styles.time}>{time}</Text>
      </View>

      {/* Customer Name */}
      {/* <Text style={styles.customerName}>{customerName}</Text> */}

      {/* Separator */}
      <View style={styles.separator} />

      {/* Order Items */}
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>
              {item.quantity}x {item.name}
            </Text>
            <Text style={styles.itemPrice}>{formatAmount(item.price)}</Text>
          </View>
        ))}
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Bill Summary */}
      <View style={styles.billSummary}>
        <Text style={styles.totalBill}>
          Total Bill: {formatAmount(totalBill)}
        </Text>
        <Text style={styles.paymentMode}>
          Payment Mode:{' '}
          <Text style={styles.paymentMethod}>{paymentMethod}</Text>
        </Text>
      </View>

      {/* Action Buttons */}
      {showAcceptReject ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.acceptButton, (isAccepting || isRejecting) && styles.buttonDisabled]}
            onPress={onAccept}
            activeOpacity={0.8}
            disabled={isAccepting || isRejecting}
          >
            {isAccepting ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.acceptButtonText}>Accept</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rejectButton, (isAccepting || isRejecting) && styles.buttonDisabled]}
            onPress={onReject}
            activeOpacity={0.8}
            disabled={isAccepting || isRejecting}
          >
            {isRejecting ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.rejectButtonText}>Reject</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.orderReadyButton}
          onPress={onOrderReady}
          activeOpacity={0.8}
        >
          <Text style={styles.orderReadyButtonText}>Order Ready</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OrderRequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: colors.c_DDDDDD,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
  },
  verticalLine: {
    width: 1,
    height: 16,
    backgroundColor: colors.c_666666,
    marginHorizontal: 12,
  },
  time: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  customerName: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_EE4026,
    // marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: colors.c_F3F3F3,
    marginVertical: 12,
  },
  itemsContainer: {
    // marginVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  billSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  totalBill: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
  },
  paymentMode: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  paymentMethod: {
    fontFamily: fonts.semibold,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    // marginTop: 16,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.c_079D48,
    borderRadius: 100,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: colors.c_B40000,
    borderRadius: 100,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  orderReadyButton: {
    backgroundColor: colors.c_079D48,
    borderRadius: 100,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  orderReadyButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
