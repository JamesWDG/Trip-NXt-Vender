import { FlatList, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import EarningsSummaryCard from '../../../components/earningsSummaryCard/EarningsSummaryCard';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import OrderCard from '../../../components/orderCard/OrderCard';
import GeneralStyles from '../../../utils/GeneralStyles';

type TimeFilter = 'Today' | 'Weekly' | 'Monthly';
type PaymentMethod = 'Cash' | 'Online';
type OrderStatus =
  | 'Delivered'
  | 'Pending'
  | 'Preparing'
  | 'Cancelled'
  | 'Refunded';

interface Order {
  id: string;
  orderId: string;
  status: OrderStatus;
  amount: number;
  paymentMethod: PaymentMethod;
  time: string;
}

// Sample data - replace with actual data from API/state
const sampleOrders: Order[] = [
  {
    id: '1',
    orderId: '12345',
    status: 'Delivered',
    amount: 15.2,
    paymentMethod: 'Cash',
    time: '06:25 am',
  },
  {
    id: '2',
    orderId: '12345',
    status: 'Refunded',
    amount: 15.2,
    paymentMethod: 'Cash',
    time: '06:25 am',
  },
  {
    id: '3',
    orderId: '12345',
    status: 'Delivered',
    amount: 542.52,
    paymentMethod: 'Online',
    time: '06:25 am',
  },
  {
    id: '4',
    orderId: '12345',
    status: 'Delivered',
    amount: 15.2,
    paymentMethod: 'Cash',
    time: '06:25 am',
  },
];

const TABS: TimeFilter[] = ['Today', 'Weekly', 'Monthly'];

const Earning = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [activeTab, setActiveTab] = useState<TimeFilter>('Today');
  const [orders] = useState(sampleOrders);

  // Sample earnings data - replace with actual calculations
  const totalEarnings = 1520;
  const onlinePayments = 1520;
  const codPayments = 540;

  const handleOrderPress = (order: Order) => {
    // Handle order card press
    console.log('Order pressed:', order);
    // navigation.navigate('OrderDetails', { orderId: order.id });
  };

  return (
    <WrapperContainer navigation={navigation} title="Total Earnings">
      <View style={styles.container}>
        {/* Earnings Summary Cards */}
        <View style={styles.summaryContainer}>
          <EarningsSummaryCard value={totalEarnings} label="Total Earnings" />
          <EarningsSummaryCard value={onlinePayments} label="Online Payments" />
          <EarningsSummaryCard
            value={codPayments}
            label="COD Payments"
            isHighlighted={true}
          />
        </View>

        {/* Tab Bar */}
        <View style={[GeneralStyles.paddingHorizontal, styles.tabContainer]}>
          <AccomodationTabButtons data={TABS} />
        </View>

        {/* Orders List */}
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <OrderCard
              orderId={item.orderId}
              status={item.status}
              amount={item.amount}
              paymentMethod={item.paymentMethod}
              time={item.time}
              onPress={() => handleOrderPress(item)}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </WrapperContainer>
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
});
