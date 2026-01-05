import { FlatList, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import GeneralStyles from '../../../utils/GeneralStyles';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import OrderRequestCard from '../../../components/orderRequestCard/OrderRequestCard';

type PaymentMethod = 'Cash' | 'Online';

interface OrderItem {
  quantity: number;
  name: string;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  time: string;
  customerName: string;
  items: OrderItem[];
  totalBill: number;
  paymentMethod: PaymentMethod;
}

// Sample data for Current Orders (with Accept/Reject buttons)
const currentOrdersData: Order[] = [
  {
    id: '1',
    orderNumber: '0214',
    time: '05:30 PM',
    customerName: 'Leonelle Ferguson',
    items: [{ quantity: 1, name: 'Burger Chees', price: 250 }],
    totalBill: 250,
    paymentMethod: 'Cash',
  },
  {
    id: '2',
    orderNumber: '0215',
    time: '06:00 PM',
    customerName: 'John Doe',
    items: [
      { quantity: 2, name: 'Pizza Margherita', price: 300 },
      { quantity: 1, name: 'Coca Cola', price: 50 },
    ],
    totalBill: 650,
    paymentMethod: 'Online',
  },
];

// Sample data for In Delivery (with Order Ready button)
const inDeliveryData: Order[] = [
  {
    id: '3',
    orderNumber: '0214',
    time: '05:30 PM',
    customerName: 'Leonelle Ferguson',
    items: [
      { quantity: 1, name: 'Burger Chees', price: 250 },
      { quantity: 5, name: 'Sandwich', price: 150 },
    ],
    totalBill: 250,
    paymentMethod: 'Cash',
  },
  {
    id: '4',
    orderNumber: '0216',
    time: '06:15 PM',
    customerName: 'Jane Smith',
    items: [{ quantity: 3, name: 'Chicken Wings', price: 400 }],
    totalBill: 1200,
    paymentMethod: 'Cash',
  },
];

const CurrentOrders = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const isCurrentOrders = activeTabIndex === 0;

  const orders = isCurrentOrders ? currentOrdersData : inDeliveryData;

  const handleAccept = (orderId: string) => {
    console.log('Accept order:', orderId);
    // Handle accept logic
  };

  const handleReject = (orderId: string) => {
    console.log('Reject order:', orderId);
    // Handle reject logic
  };

  const handleOrderReady = (orderId: string) => {
    console.log('Order ready:', orderId);
    // Handle order ready logic
  };

  // We need to track tab changes from AccomodationTabButtons
  // Since it doesn't expose the active index, we'll use a workaround
  // by checking which tab is selected based on the data shown

  return (
    <WrapperContainer navigation={navigation} title="Current Orders">
      {/* Tab Bar */}
      <View
        style={[
          GeneralStyles.paddingHorizontal,
          GeneralStyles.marginBottom,
          styles.tabContainer,
        ]}
      >
        <AccomodationTabButtons
          data={['Current Orders', 'In Delivery']}
          selectedIndex={setActiveTabIndex}
        />
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <OrderRequestCard
            orderNumber={item.orderNumber}
            time={item.time}
            customerName={item.customerName}
            items={item.items}
            totalBill={item.totalBill}
            paymentMethod={item.paymentMethod}
            showAcceptReject={isCurrentOrders}
            onAccept={() => handleAccept(item.id)}
            onReject={() => handleReject(item.id)}
            onOrderReady={() => handleOrderReady(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </WrapperContainer>
  );
};

export default CurrentOrders;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  tabContainer: {
    marginTop: 40,
  },
});
