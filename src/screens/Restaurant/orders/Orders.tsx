import { FlatList, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import OrderCard from '../../../components/orderCard/OrderCard';

interface Order {
  id: string;
  orderId: string;
  time: string;
  customerName: string;
  amount: string;
  paymentMethod: string;
}

// Sample data for Active Orders
const activeOrdersData: Order[] = [
  {
    id: '1',
    orderId: '0214',
    time: '05:30 PM',
    customerName: 'Leonelle Ferguson',
    amount: '$32',
    paymentMethod: 'Wallet',
  },
  {
    id: '2',
    orderId: '0214',
    time: '05:30 PM',
    customerName: 'Mary Smith',
    amount: '$32',
    paymentMethod: 'Wallet',
  },
  {
    id: '3',
    orderId: '0214',
    time: '05:30 PM',
    customerName: 'Leonelle Ferguson',
    amount: '$32',
    paymentMethod: 'Wallet',
  },
];

// Sample data for Order History
const orderHistoryData: Order[] = [
  {
    id: '1',
    orderId: '0213',
    time: '04:15 PM',
    customerName: 'John Doe',
    amount: '$45',
    paymentMethod: 'Cash',
  },
  {
    id: '2',
    orderId: '0212',
    time: '03:00 PM',
    customerName: 'Jane Wilson',
    amount: '$28',
    paymentMethod: 'Wallet',
  },
  {
    id: '3',
    orderId: '0211',
    time: '02:30 PM',
    customerName: 'Robert Brown',
    amount: '$52',
    paymentMethod: 'Cash',
  },
];

const Orders = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleViewDetails = (orderId: string) => {
    // Navigate to order details screen
    navigation.navigate('OrderDetails', { orderId });
  };

  const renderOrderCard = ({ item }: { item: Order }) => (
    <OrderCard
      orderId={item.orderId}
      time={item.time}
      customerName={item.customerName}
      amount={item.amount}
      paymentMethod={item.paymentMethod}
      onViewDetails={() => handleViewDetails(item.id)}
    />
  );

  const currentData =
    activeTabIndex === 0 ? activeOrdersData : orderHistoryData;

  return (
    <WrapperContainer navigation={navigation} title="Orders">
      <View style={styles.container}>
        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <AccomodationTabButtons
            data={['Active Orders', 'Order History']}
            selectedIndex={setActiveTabIndex}
          />
        </View>

        {/* Orders List */}
        <FlatList
          data={currentData}
          renderItem={renderOrderCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </WrapperContainer>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 20,
  },
  tabContainer: {
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
});
