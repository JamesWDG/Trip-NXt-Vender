import { FlatList, Modal, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import EarningsSummaryCard from '../../../components/earningsSummaryCard/EarningsSummaryCard';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import OrderCard from '../../../components/orderCard/OrderCard';
import GeneralStyles from '../../../utils/GeneralStyles';
import fonts from '../../../config/fonts';
import colors from '../../../config/colors';
import {
  useGetVendorEarningsSummaryQuery,
  useLazyGetStripeVendorStatusQuery,
  useRequestVendorWithdrawalMutation,
} from '../../../redux/services/vendorService';
import { useLazyGetRestaurantTotalEarningsQuery } from '../../../redux/services/restaurantService';
import { formatTime12h } from '../../../utils/utility';
import { useLazyGetHotelTotalEarningsQuery } from '../../../redux/services/hotelService';

type TimeFilter = 'Today' | 'Weekly' | 'Monthly';

// Sample data - replace with actual data from API/state
// const sampleOrders: Order[] = [
//   {
//     id: '1',
//     orderId: '12345',
//     status: 'Delivered',
//     amount: 15.2,
//     paymentMethod: 'Cash',
//     time: '06:25 am',
//   },
//   {
//     id: '2',
//     orderId: '12345',
//     status: 'Refunded',
//     amount: 15.2,
//     paymentMethod: 'Cash',
//     time: '06:25 am',
//   },
//   {
//     id: '3',
//     orderId: '12345',
//     status: 'Delivered',
//     amount: 542.52,
//     paymentMethod: 'Online',
//     time: '06:25 am',
//   },
//   {
//     id: '4',
//     orderId: '12345',
//     status: 'Delivered',
//     amount: 15.2,
//     paymentMethod: 'Cash',
//     time: '06:25 am',
//   },
// ];

const TABS: TimeFilter[] = ['Today', 'Weekly', 'Monthly'];

const Earning = ({route}: {route: RouteProp<{Earning: {type: 'restaurant' | 'accomodation'}}>}) => {
  const navigation = useNavigation<NavigationPropType>();
  const [activeTab, setActiveTab] = useState<TimeFilter>('Today');
  const {type} = route.params;
  // const [orders] = useState(sampleOrders);
  const [connectStripeVisible, setConnectStripeVisible] = useState(false);
  const [confirmPayoutVisible, setConfirmPayoutVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isLoading } = useGetVendorEarningsSummaryQuery();
  const [checkStripeStatus] = useLazyGetStripeVendorStatusQuery();
  const [requestWithdrawal, { isLoading: isWithdrawing }] = useRequestVendorWithdrawalMutation();
  const [getRestaurantTotalEarnings,{data:totalEarningsData,isLoading:isLoadingTotalEarnings}] = useLazyGetRestaurantTotalEarningsQuery();
  const [getHotelTotalEarnings,{data:hotelTotalEarningsData,isLoading:isLoadingHotelTotalEarnings}] = useLazyGetHotelTotalEarningsQuery();
  const totalEarnings = data?.totalNet ?? 0;
  const totalGross = data?.totalGross ?? 0;
  const pendingBalance = data?.pendingBalance ?? 0;

  console.log('type',type)

  useEffect(() => {
    if(type === 'restaurant'){
      fetchRestaurantTotalEarnings();
    } else {
      fetchHotelTotalEarnings();
    }
  },[type]);

  const fetchRestaurantTotalEarnings = async () => {
    try {
      const res = await getRestaurantTotalEarnings(undefined).unwrap();
      // console.log('total earnings data', res);
    } catch (error) {
      console.log('error fetching total earnings', error);
    }
  };

  const fetchHotelTotalEarnings = async () => {
    try {
      const res = await getHotelTotalEarnings(undefined).unwrap();
      console.log('hotel earnings data', res);
    } catch (error) {
      console.log('error fetching total earnings', error);
    }
  };

  const handleRequestPayout = async () => {
    try {
      // Ensure Stripe vendor account is connected + completed
      await checkStripeStatus().unwrap();
    } catch (err: any) {
      setConnectStripeVisible(true);
      return;
    }

    if (!pendingBalance || pendingBalance <= 0) {
      setErrorMessage('You have no pending balance to withdraw.');
      return;
    }

    setConfirmPayoutVisible(true);
  };

  return (
    <>
      <WrapperContainer navigation={navigation} title="Total Earnings">
        <View style={styles.container}>
          {/* Earnings Summary Cards */}
          <View style={styles.summaryContainer}>
            <EarningsSummaryCard value={type === 'restaurant' ? totalEarningsData?.data?.totalEarnings ?? 0 : hotelTotalEarningsData?.data?.totalEarnings ?? 0} label="Total Earnings" />
            <EarningsSummaryCard
              value={pendingBalance}
              label="Pending Balance"
              isHighlighted={true}
            />
            <EarningsSummaryCard value={type === 'restaurant' ? totalEarningsData?.data?.totalNet ?? 0 : hotelTotalEarningsData?.data?.totalNet ?? 0} label="Total Gross" />
          </View>

          {/* Payout button */}
          <TouchableOpacity
            style={styles.payoutButton}
            disabled={isLoading || isWithdrawing}
            onPress={handleRequestPayout}
          >
            <Text style={styles.payoutButtonText}>
              {isWithdrawing ? 'Requesting…' : 'Request Payout'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.payoutButton}
            onPress={() => navigation.navigate('Payment')}
          >
            <Text style={styles.payoutButtonText}>
              {'Add Balance'}
            </Text>
          </TouchableOpacity>
          {/* Tab Bar */}
          <View style={[GeneralStyles.paddingHorizontal, styles.tabContainer]}>
            <AccomodationTabButtons data={TABS} />
          </View>
          {(type === 'restaurant' ? isLoadingTotalEarnings : isLoadingHotelTotalEarnings) ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#0162C0" />
            </View>
          ) : (
            <>    
          {/* Orders List */}
          <FlatList
            data={type === 'restaurant' ? totalEarningsData?.data?.orders ?? [] : hotelTotalEarningsData?.data?.bookings ?? []}
            ListEmptyComponent={<View style={styles.empty}>
              <Text style={styles.emptyText}>{type === 'restaurant' ? 'No orders found' : 'No bookings found'}</Text>
            </View>}
            renderItem={({ item }) => (
              <OrderCard
                orderId={String(item.id)}
                status={item.status}
                amount={item.totalAmount}
                customerName={item?.user?.name ??  'N/A'}
                paymentMethod={item.paymentMethod}
                time={formatTime12h(item.createdAt)}
                onViewDetails={() =>
                  navigation.navigate('EarningOrderDetail', {
                    type: type === 'restaurant' ? 'restaurant' : 'hotel',
                    order: item,
                  })
                }
              />
            )}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          </>
          )}
        </View>
      </WrapperContainer>

      {/* Connect Stripe modal */}
      <Modal
        visible={connectStripeVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConnectStripeVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Connect Stripe</Text>
            <Text style={styles.modalMessage}>
              Please connect your Stripe vendor account before requesting payout.
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSecondaryButton]}
                onPress={() => setConnectStripeVisible(false)}
              >
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setConnectStripeVisible(false);
                  navigation.navigate('StripeConnection');
                }}
              >
                <Text style={styles.modalButtonText}>Connect now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm payout modal */}
      <Modal
        visible={confirmPayoutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmPayoutVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm payout</Text>
            <Text style={styles.modalMessage}>
              Request payout of {pendingBalance.toFixed(2)}?
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSecondaryButton]}
                onPress={() => setConfirmPayoutVisible(false)}
              >
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={async () => {
                  try {
                    setConfirmPayoutVisible(false);
                    await requestWithdrawal({
                      requestedAmount: pendingBalance,
                      currency: 'NGN',
                    }).unwrap();
                    setSuccessVisible(true);
                  } catch (e: any) {
                    setErrorMessage(e?.data?.message || 'Failed to create withdrawal request.');
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success / error modal */}
      <Modal
        visible={!!errorMessage || successVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setErrorMessage(null);
          setSuccessVisible(false);
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {errorMessage ? 'Error' : 'Success'}
            </Text>
            <Text style={styles.modalMessage}>
              {errorMessage || 'Withdrawal request submitted.'}
            </Text>
            <View style={styles.modalButtonRowSingle}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setErrorMessage(null);
                  setSuccessVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Earning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
  },
  tabContainer: {
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  payoutButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  payoutButtonText: {
    color: '#FFFFFF',
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 16,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButtonRowSingle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  modalSecondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  modalSecondaryText: {
    color: colors.c_2B2B2B,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: '#666',
  },
  loader:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
