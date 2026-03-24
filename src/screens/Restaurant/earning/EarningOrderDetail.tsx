import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';
import { formatTime12h, formatDate } from '../../../utils/utility';
import { useAppSelector } from '../../../redux/store';
import { useCreateSingleChatMutation } from '../../../redux/services/chatService';

export type EarningDetailType = 'restaurant' | 'hotel';

type Params = {
  EarningOrderDetail: {
    type?: EarningDetailType;
    order?: Record<string, any>;
  };
};

function DetailRow({ label, value }: { label: string; value: string }) {
  if (value === '' || value === 'undefined') return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function customerUserIdFromParams(
  data: Record<string, any>,
  earningType: EarningDetailType,
): number | null {
  const fromApi = Number(data.customerUserId);
  if (Number.isFinite(fromApi) && fromApi > 0) return fromApi;
  const raw =
    earningType === 'restaurant'
      ? data.userId ?? data.user?.id
      : data.userId ?? data.user?.id;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function customerChatTitle(
  data: Record<string, any>,
  earningType: EarningDetailType,
): string {
  if (earningType === 'restaurant') {
    return String(data.user?.name ?? 'Customer');
  }
  return String(
    data.guestInfo?.name ?? data.user?.name ?? data.user?.email ?? 'Guest',
  );
}

function hotelPaymentFromParams(data: Record<string, any>): string {
  const pm = data.payment;
  if (pm?.isCashPayment === true) return 'Cash';
  if (pm?.isCashPayment === false && pm?.paymentProvider) return String(pm.paymentProvider);
  if (pm?.status) return String(pm.status);
  if (data.paymentMethod != null && data.paymentMethod !== '') return String(data.paymentMethod);
  return '—';
}

const EarningOrderDetail = () => {
  const navigation = useNavigation<NavigationPropType>();
  const route = useRoute<RouteProp<Params, 'EarningOrderDetail'>>();
  const earningType: EarningDetailType =
    route.params?.type === 'hotel' ? 'hotel' : 'restaurant';
  const data = route.params?.order ?? {};
  const region = useAppSelector((s) => s.region.selectedRegion);
  const [createSingleChat, { isLoading: openingChat }] = useCreateSingleChatMutation();
  const customerUserId = customerUserIdFromParams(data, earningType);
  const chatTitle = customerChatTitle(data, earningType);

  const onMessageCustomer = async () => {
    if (!customerUserId) return;
    try {
      const chat = await createSingleChat({ otherUserId: customerUserId, direct: true }).unwrap();
      navigation.navigate('ChatConversation', {
        chatId: chat.id,
        chatData: JSON.stringify(chat),
        chatName: chatTitle,
      });
    } catch (e: any) {
      Alert.alert(
        'Chat',
        typeof e?.data?.message === 'string' ? e.data.message : 'Could not open conversation. Try again.',
      );
    }
  };

  const formatMoney = (n: number | string | undefined) => {
    const num = Number(n);
    if (Number.isNaN(num)) return '—';
    return region === 'NGN' ? `₦${num.toFixed(2)}` : `$${num.toFixed(2)}`;
  };

  const items = earningType === 'restaurant' && Array.isArray(data.items) ? data.items : [];
  const guest = earningType === 'hotel' ? data.guestInfo : null;
  const restaurantCustomerVisible =
    earningType === 'restaurant' &&
    Boolean(
      data.user?.name ||
        data.user?.email ||
        data.user?.phoneNumber ||
        customerUserId,
    );
  const hotelGuestVisible =
    earningType === 'hotel' &&
    Boolean(
      guest?.name ||
        guest?.email ||
        guest?.phoneNumber ||
        data.user?.name ||
        data.user?.email ||
        customerUserId,
    );

  const messageButton = customerUserId ? (
    <TouchableOpacity
      style={styles.chatBtn}
      onPress={onMessageCustomer}
      disabled={openingChat}
      activeOpacity={0.8}
    >
      {openingChat ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.chatBtnText}>
          {earningType === 'restaurant' ? 'Message customer' : 'Message guest'}
        </Text>
      )}
    </TouchableOpacity>
  ) : null;

  return (
    <WrapperContainer navigation={navigation} title="Earning detail">
      <ScrollView
        style={GeneralStyles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!route.params?.order ? (
          <Text style={styles.hint}>No data passed.</Text>
        ) : null}

        {earningType === 'restaurant' ? (
          <>
            <View style={[styles.card, GeneralStyles.shadow]}>
              <Text style={styles.sectionTitle}>Order</Text>
              <DetailRow label="Order ID" value={String(data.id ?? '—')} />
              <DetailRow label="Status" value={String(data.status ?? '—')} />
              <DetailRow label="Payment" value={String(data.paymentMethod ?? '—')} />
              <DetailRow
                label="Time"
                value={data.createdAt ? formatTime12h(data.createdAt) : '—'}
              />
              <DetailRow
                label="Date"
                value={data.createdAt ? formatDate(data.createdAt) : '—'}
              />
            </View>

            <View style={[styles.card, GeneralStyles.shadow]}>
              <Text style={styles.sectionTitle}>Amounts</Text>
              <DetailRow label="Total" value={formatMoney(data.totalAmount)} />
              <DetailRow label="Subtotal" value={formatMoney(data.subTotal)} />
              <DetailRow label="Tax" value={formatMoney(data.tax)} />
              <DetailRow label="Delivery fee" value={formatMoney(data.deliveryFee)} />
            </View>

            {restaurantCustomerVisible ? (
              <View style={[styles.card, GeneralStyles.shadow]}>
                <Text style={styles.sectionTitle}>Customer</Text>
                <DetailRow label="Name" value={String(data.user?.name ?? '—')} />
                <DetailRow label="Email" value={String(data.user?.email ?? '—')} />
                {data.user?.phoneNumber ? (
                  <DetailRow label="Phone" value={String(data.user.phoneNumber)} />
                ) : null}
                {!data.user?.name && !data.user?.email && customerUserId ? (
                  <Text style={styles.chatHint}>
                    Customer account is linked to this order; details may be limited.
                  </Text>
                ) : null}
                {messageButton}
              </View>
            ) : null}

            {data.restaurant?.name ? (
              <View style={[styles.card, GeneralStyles.shadow]}>
                <Text style={styles.sectionTitle}>Restaurant</Text>
                <DetailRow label="Name" value={String(data.restaurant.name)} />
              </View>
            ) : null}

            {items.length > 0 && (
              <View style={[styles.card, GeneralStyles.shadow]}>
                <Text style={styles.sectionTitle}>Items</Text>
                {items.map((line: any, index: number) => {
                  const name = line.item?.name ?? line.name ?? 'Item';
                  const qty = line.quantity ?? 1;
                  const price = line.item?.price ?? line.price ?? 0;
                  return (
                    <View key={line.id ?? index} style={styles.lineItem}>
                      <Text style={styles.lineName}>
                        {qty}× {name}
                      </Text>
                      <Text style={styles.linePrice}>
                        {formatMoney(Number(price) * Number(qty))}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        ) : (
          <>
            <View style={[styles.card, GeneralStyles.shadow]}>
              <Text style={styles.sectionTitle}>Booking</Text>
              <DetailRow label="Booking ID" value={String(data.id ?? '—')} />
              <DetailRow label="Status" value={String(data.status ?? '—')} />
              <DetailRow label="Payment" value={hotelPaymentFromParams(data)} />
              <DetailRow
                label="Check-in"
                value={data.checkInDate ? formatDate(data.checkInDate) : '—'}
              />
              <DetailRow
                label="Check-out"
                value={data.checkOutDate ? formatDate(data.checkOutDate) : '—'}
              />
              <DetailRow
                label="Time"
                value={data.createdAt ? formatTime12h(data.createdAt) : '—'}
              />
              <DetailRow
                label="Booked on"
                value={data.createdAt ? formatDate(data.createdAt) : '—'}
              />
              <DetailRow
                label="Guests"
                value={
                  data.numberOfGuests != null ? String(data.numberOfGuests) : '—'
                }
              />
              <DetailRow
                label="Rooms"
                value={
                  data.numberOfRooms != null ? String(data.numberOfRooms) : '—'
                }
              />
            </View>

            <View style={[styles.card, GeneralStyles.shadow]}>
              <Text style={styles.sectionTitle}>Amounts</Text>
              <DetailRow label="Total" value={formatMoney(data.totalAmount)} />
            </View>

            {hotelGuestVisible ? (
              <View style={[styles.card, GeneralStyles.shadow]}>
                <Text style={styles.sectionTitle}>Guest</Text>
                <DetailRow label="Name" value={String(guest?.name ?? data.user?.name ?? '—')} />
                <DetailRow label="Email" value={String(guest?.email ?? data.user?.email ?? '—')} />
                {(guest?.phoneNumber || data.user?.phoneNumber) ? (
                  <DetailRow
                    label="Phone"
                    value={String(guest?.phoneNumber ?? data.user?.phoneNumber ?? '—')}
                  />
                ) : null}
                {!guest?.name && !guest?.email && data.user?.name ? (
                  <Text style={styles.chatHint}>
                    Booking is tied to the guest account below; contact info may match their profile.
                  </Text>
                ) : null}
                {messageButton}
              </View>
            ) : null}

            {data.hotel?.name ? (
              <View style={[styles.card, GeneralStyles.shadow]}>
                <Text style={styles.sectionTitle}>Hotel</Text>
                <DetailRow label="Name" value={String(data.hotel.name)} />
                {data.hotel?.location?.city ? (
                  <DetailRow label="City" value={String(data.hotel.location.city)} />
                ) : null}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </WrapperContainer>
  );
};

export default EarningOrderDetail;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  hint: {
    fontSize: 13,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.c_F3F3F3,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    flex: 1,
    marginRight: 12,
  },
  value: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
    flex: 1,
    textAlign: 'right',
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.c_F3F3F3,
  },
  lineName: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    marginRight: 12,
  },
  linePrice: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  chatBtn: {
    marginTop: 16,
    backgroundColor: colors.c_007DFC,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  chatBtnText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.semibold,
  },
  chatHint: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    lineHeight: 18,
  },
});
