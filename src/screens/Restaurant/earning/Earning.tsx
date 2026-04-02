import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
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
} from '../../../redux/services/vendorService';
import { useLazyGetRestaurantTotalEarningsQuery } from '../../../redux/services/restaurantService';
import { formatTime12h } from '../../../utils/utility';
import { useLazyGetHotelTotalEarningsQuery } from '../../../redux/services/hotelService';
import { useLazyGetCabTotalEarningsQuery } from '../../../redux/services/cabService';
import { useAppSelector } from '../../../redux/store';
import { ShowToast } from '../../../config/constants';
import {
  useLazyGetWalletQuery,
  useRequestWalletPayoutMutation,
} from '../../../redux/services/walletService';

type TimeFilter = 'Restaurant' | 'Hotel' | 'Cab';
const TABS: TimeFilter[] = ['Restaurant', 'Hotel', 'Cab'];

const Earning = ({
  route,
}: {
  route: RouteProp<{ Earning: { type: 'restaurant' | 'accomodation' } }>;
}) => {
  const navigation = useNavigation<NavigationPropType>();
  const [activeTab, setActiveTab] = useState<TimeFilter>('Restaurant');
  const { type } = route.params;
  const [connectStripeVisible, setConnectStripeVisible] = useState(false);
  const [confirmPayoutVisible, setConfirmPayoutVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [payoutAmountInput, setPayoutAmountInput] = useState('');
  const { data, isLoading } = useGetVendorEarningsSummaryQuery();
  const [
    getWallet,
    { data: walletData, isFetching: isFetchingWallet },
  ] = useLazyGetWalletQuery();
  const [checkStripeStatus, { isLoading: isLoadingStripeStatus }] =
    useLazyGetStripeVendorStatusQuery();
  const [requestWalletPayout, { isLoading: isRequestingPayout }] =
    useRequestWalletPayoutMutation();
  const [
    getRestaurantTotalEarnings,
    { data: totalEarningsData, isLoading: isLoadingTotalEarnings },
  ] = useLazyGetRestaurantTotalEarningsQuery();
  const [
    getHotelTotalEarnings,
    { data: hotelTotalEarningsData, isLoading: isLoadingHotelTotalEarnings },
  ] = useLazyGetHotelTotalEarningsQuery();
  const [
    getCabTotalEarnings,
    { data: cabTotalEarningsData, isLoading: isLoadingCabTotalEarnings },
  ] = useLazyGetCabTotalEarningsQuery();
  const user = useAppSelector(state => state.auth.user);
  const region = useAppSelector(state => state.region.selectedRegion);

  const pendingBalance = Number(walletData?.data?.pendingBalance ?? 0);
  const canRequestPayout =
    walletData != null && !isFetchingWallet && pendingBalance > 0;

  const formatPayoutAmount = (amt: number) => {
    const n = Math.max(0, amt);
    const formatted = n.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return region === 'NGN' ? `₦${formatted}` : `$${formatted}`;
  };

  useEffect(() => {
    if (user) {
      console.log('user', user);
    }
    console.log('user', user);
  }, [user]);

  const handleFetchScreenData = async () => {
    try {
      const res = await Promise.all([
        getRestaurantTotalEarnings(undefined).unwrap(),
        getHotelTotalEarnings(undefined).unwrap(),
        getCabTotalEarnings(undefined).unwrap(),
        getWallet(undefined).unwrap(),
      ]);
      console.log('screen data', res);
    } catch (error) {
      console.log('error fetching screen data', error);
      ShowToast('error', 'Failed to fetch screen data');
    }
  };

  useEffect(() => {
    handleFetchScreenData();
  }, [type]);

  const handleRequestPayout = async () => {
    if (!canRequestPayout) {
      ShowToast(
        'error',
        pendingBalance <= 0
          ? 'No pending balance available to withdraw.'
          : 'Wallet is still loading. Try again in a moment.',
      );
      return;
    }
    try {
      await checkStripeStatus().unwrap();
    } catch {
      setConnectStripeVisible(true);
      return;
    }
    setPayoutAmountInput(
      pendingBalance > 0 ? String(pendingBalance) : '',
    );
    setConfirmPayoutVisible(true);
  };

  const parseWithdrawalAmount = (raw: string): number => {
    const normalized = raw.trim().replace(/,/g, '');
    return Number(normalized);
  };

  return (
    <>
      <WrapperContainer navigation={navigation} title="Total Earnings">
        <View style={styles.container}>
          {/* Earnings Summary Cards */}
          <View style={styles.summaryContainer}>
            <EarningsSummaryCard
              value={walletData?.data?.totalEarnings ?? 0}
              label="Total Earnings"
            />
            <EarningsSummaryCard
              value={walletData?.data?.pendingBalance ?? 0}
              label="Pending Balance"
              isHighlighted={true}
            />
            <EarningsSummaryCard
              value={walletData?.data?.totalPayouts ?? 0}
              label="Total Payout"
            />
          </View>

          {/* Payout button */}
          <TouchableOpacity
            style={[
              styles.payoutButton,
              (!canRequestPayout || isLoadingStripeStatus) && styles.payoutButtonDisabled,
            ]}
            disabled={
              !canRequestPayout ||
              isLoading ||
              isRequestingPayout ||
              isLoadingStripeStatus
            }
            onPress={handleRequestPayout}
          >
            <Text style={styles.payoutButtonText}>
              {isRequestingPayout || isLoadingStripeStatus
                ? 'Requesting…'
                : 'Request Payout'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.payoutButton}
            onPress={() => navigation.navigate('Payment',{balance: walletData?.data?.pendingBalance ?? 0})}
          >
            <Text style={styles.payoutButtonText}>{'Add Balance'}</Text>
          </TouchableOpacity>
          {/* Tab Bar */}
          <View style={[GeneralStyles.paddingHorizontal, styles.tabContainer]}>
            <AccomodationTabButtons selectedIndex={setActiveTab} data={TABS} />
          </View>
          {(
            activeTab === 'Restaurant'
              ? isLoadingTotalEarnings
              : activeTab === 'Hotel'
              ? isLoadingHotelTotalEarnings
              : isLoadingCabTotalEarnings
          ) ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#0162C0" />
            </View>
          ) : (
            <>
              {/* Orders List */}
              <FlatList
                data={
                  activeTab === 'Restaurant'
                    ? totalEarningsData?.data?.orders ?? []
                    : activeTab === 'Hotel'
                    ? hotelTotalEarningsData?.data?.bookings ?? []
                    : cabTotalEarningsData?.data?.rides ?? []
                }
                ListEmptyComponent={
                  <View style={styles.empty}>
                    <Text style={styles.emptyText}>
                      {activeTab === 'Restaurant'
                        ? 'No orders found'
                        : activeTab === 'Hotel'
                        ? 'No bookings found'
                        : 'No rides found'}
                    </Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <OrderCard
                    orderId={String(item.id)}
                    status={item.status}
                    amount={item.totalAmount}
                    customerName={item?.user?.name ?? 'N/A'}
                    paymentMethod={item.paymentMethod}
                    time={formatTime12h(item.createdAt)}
                    onViewDetails={() =>
                      navigation.navigate('EarningOrderDetail', {
                        type:
                          activeTab === 'Restaurant'
                            ? 'restaurant'
                            : activeTab === 'Hotel'
                            ? 'hotel'
                            : 'cab',
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
              Please connect your Stripe vendor account before requesting
              payout.
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
            <Text style={styles.modalTitle}>Request wallet payout</Text>
            <Text style={styles.modalMessage}>
              {`Available pending balance: ${formatPayoutAmount(pendingBalance)}. Enter how much to withdraw. The request stays pending until an admin processes it.`}
            </Text>
            <Text style={styles.modalFieldLabel}>Withdrawal amount</Text>
            <View style={styles.modalAmountRow}>
              <Text style={styles.modalCurrencyPrefix}>
                {region === 'NGN' ? '₦' : '$'}
              </Text>
              <TextInput
                style={styles.modalAmountInput}
                value={payoutAmountInput}
                onChangeText={setPayoutAmountInput}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.c_666666}
              />
            </View>
            <TouchableOpacity
              style={styles.modalMaxButton}
              onPress={() =>
                setPayoutAmountInput(
                  pendingBalance > 0 ? String(pendingBalance) : '',
                )
              }
            >
              <Text style={styles.modalMaxButtonText}>Use max</Text>
            </TouchableOpacity>
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
                  const amount = parseWithdrawalAmount(payoutAmountInput);
                  if (Number.isNaN(amount) || amount <= 0) {
                    ShowToast('error', 'Enter a valid withdrawal amount greater than zero.');
                    return;
                  }
                  if (amount > pendingBalance) {
                    ShowToast(
                      'error',
                      `Amount cannot exceed available pending balance (${formatPayoutAmount(pendingBalance)}).`,
                    );
                    return;
                  }
                  try {
                    setConfirmPayoutVisible(false);
                    await requestWalletPayout({
                      requestedAmount: amount,
                      currency: region === 'NGN' ? 'NGN' : 'USD',
                    }).unwrap();
                    setSuccessVisible(true);
                  } catch (e: any) {
                    const msg =
                      e?.data?.message ||
                      e?.error ||
                      'Could not submit wallet payout request.';
                    setErrorMessage(
                      typeof msg === 'string' ? msg : 'Could not submit wallet payout request.',
                    );
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
              {errorMessage ? 'Payout not submitted' : 'Success'}
            </Text>
            <Text style={styles.modalMessage}>
              {errorMessage || 'Wallet payout request submitted. It will remain pending until processed.'}
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
  payoutButtonDisabled: {
    opacity: 0.55,
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
    marginBottom: 12,
  },
  modalFieldLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
    marginBottom: 6,
  },
  modalAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: colors.white,
  },
  modalCurrencyPrefix: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
    marginRight: 4,
  },
  modalAmountInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
    paddingVertical: 10,
    minHeight: 44,
  },
  modalMaxButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 4,
  },
  modalMaxButtonText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.primary,
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
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
