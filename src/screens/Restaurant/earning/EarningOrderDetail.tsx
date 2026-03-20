import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';
import { useLazyGetSingleOrderQuery } from '../../../redux/services/orderService';
import { formatTime12h, formatDate } from '../../../utils/utility';
import { useAppSelector } from '../../../redux/store';

type Params = {
  EarningOrderDetail: { order?: Record<string, any> };
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

const EarningOrderDetail = () => {
  const navigation = useNavigation<NavigationPropType>();
  const route = useRoute<RouteProp<Params, 'EarningOrderDetail'>>();
  const summary = route.params?.order;
  const orderId = summary?.id;

  const [fetchOrder, { data: orderDetail, isFetching, isError }] =
    useLazyGetSingleOrderQuery();
  const region = useAppSelector((s) => s.region.selectedRegion);

  useEffect(() => {
    if (orderId != null && orderId !== '') {
      fetchOrder(orderId);
    }
  }, [orderId, fetchOrder]);

  const order = useMemo(
    () => (orderDetail && typeof orderDetail === 'object' ? orderDetail : summary) ?? {},
    [orderDetail, summary],
  );

  const formatMoney = (n: number | string | undefined) => {
    const num = Number(n);
    if (Number.isNaN(num)) return '—';
    return region === 'NGN' ? `₦${num.toFixed(2)}` : `$${num.toFixed(2)}`;
  };

  const user = order.user ?? summary?.user;
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <WrapperContainer navigation={navigation} title="Earning detail">
      {isFetching && !orderDetail && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.c_0162C0} />
        </View>
      )}
      <ScrollView
        style={GeneralStyles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isError && !orderDetail && summary ? (
          <Text style={styles.hint}>Showing list data. Full order could not be loaded.</Text>
        ) : null}

        <View style={[styles.card, GeneralStyles.shadow]}>
          <Text style={styles.sectionTitle}>Order</Text>
          <DetailRow label="Order ID" value={String(order.id ?? orderId ?? '—')} />
          <DetailRow label="Status" value={String(order.status ?? '—')} />
          <DetailRow
            label="Payment"
            value={String(order.paymentMethod ?? summary?.paymentMethod ?? '—')}
          />
          <DetailRow
            label="Time"
            value={
              order.createdAt
                ? formatTime12h(order.createdAt)
                : summary?.createdAt
                  ? formatTime12h(summary.createdAt)
                  : '—'
            }
          />
          <DetailRow
            label="Date"
            value={
              order.createdAt
                ? formatDate(order.createdAt)
                : summary?.createdAt
                  ? formatDate(summary.createdAt)
                  : '—'
            }
          />
        </View>

        <View style={[styles.card, GeneralStyles.shadow]}>
          <Text style={styles.sectionTitle}>Amounts</Text>
          <DetailRow
            label="Total"
            value={formatMoney(order.totalAmount ?? summary?.totalAmount)}
          />
          <DetailRow label="Subtotal" value={formatMoney(order.subTotal)} />
          <DetailRow label="Tax" value={formatMoney(order.tax)} />
          <DetailRow label="Delivery fee" value={formatMoney(order.deliveryFee)} />
        </View>

        {(user?.name || user?.email) && (
          <View style={[styles.card, GeneralStyles.shadow]}>
            <Text style={styles.sectionTitle}>Customer</Text>
            <DetailRow label="Name" value={String(user.name ?? '—')} />
            <DetailRow label="Email" value={String(user.email ?? '—')} />
            {user.phoneNumber ? (
              <DetailRow label="Phone" value={String(user.phoneNumber)} />
            ) : null}
          </View>
        )}

        {order.restaurant?.name ? (
          <View style={[styles.card, GeneralStyles.shadow]}>
            <Text style={styles.sectionTitle}>Restaurant</Text>
            <DetailRow label="Name" value={String(order.restaurant.name)} />
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
                  <Text style={styles.linePrice}>{formatMoney(Number(price) * Number(qty))}</Text>
                </View>
              );
            })}
          </View>
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
  loader: {
    paddingVertical: 24,
    alignItems: 'center',
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
});
