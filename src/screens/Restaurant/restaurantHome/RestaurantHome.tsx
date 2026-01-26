import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import images from '../../../config/images';
import { width, ShowToast } from '../../../config/constants';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';
import RestaurantHomeHeader from '../../../components/restaurantHomeHeader/RestaurantHomeHeader';
import SectionHeader from '../../../components/sectionHeader/SectionHeader';
import OrderRequestCard from '../../../components/orderRequestCard/OrderRequestCard';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import DrawerModalRestaurant from '../../../components/drawers/DrawerModalRestaurant';
import { useLazyGetUserQuery } from '../../../redux/services/authService';
import { useLazyGetOrdersQuery, useUpdateOrderStatusMutation } from '../../../redux/services/orderService';

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

// Sample data for current orders
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
  {
    id: '3',
    orderNumber: '0216',
    time: '06:15 PM',
    customerName: 'Jane Smith',
    items: [{ quantity: 3, name: 'Chicken Wings', price: 400 }],
    totalBill: 1200,
    paymentMethod: 'Cash',
  },
];

const RestaurantHome = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    description: string;
    logo: string;
    restaurantId?: string;
  }>({
    name: '',
    description: '',
    logo: '',
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<'accept' | 'reject' | null>(null);
  const [getUser] = useLazyGetUserQuery();
  const [getOrders] = useLazyGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const fetchRestaurant = async () => {
    try {
      const res = await getUser({}).unwrap();
      console.log('restaurant data ===>', res);
      
      // Check if restaurant exists
      if (!res.data?.restaurant) {
        console.log('No restaurant data found');
        setUserData({
          name: '',
          description: '',
          logo: '',
        });
        setOrders([]);
        return;
      }

      const restaurantIdValue = res.data?.restaurant?.id?.toString() || res.data?.restaurant?._id?.toString();
      
      setUserData({
        name: res.data.restaurant.name || '',
        description: res.data.restaurant.description || '',
        logo: res.data.restaurant.logo || '',
        restaurantId: restaurantIdValue || undefined,
      });
      
      // Store restaurant ID separately for easy access
      if (restaurantIdValue && restaurantIdValue.trim() !== '') {
        setRestaurantId(restaurantIdValue);
        await fetchOrders(restaurantIdValue);
      } else {
        console.log('Restaurant ID not available, skipping orders fetch');
        setRestaurantId('');
        setOrders([]);
      }
    } catch (error) {
      console.log('error ===>', error);
      setOrders([]);
    }
  };

  const fetchOrders = async (restaurantId: string) => {
    // Validate restaurant ID before making API call
    if (!restaurantId || restaurantId.trim() === '') {
      console.log('Invalid restaurant ID, skipping orders fetch');
      setOrders([]);
      return;
    }

    try {
      const res = await getOrders(restaurantId).unwrap();
      console.log('orders data ===>', res);
      
      // Check if API call was successful
      if (!res.success && res.message) {
        console.log('Orders API error:', res.message);
        setOrders([]);
        return;
      }
      
      // API returns array of order items, need to group by orderId
      const ordersData = res.data || [];
      
      if (!Array.isArray(ordersData) || ordersData.length === 0) {
        setOrders([]);
        return;
      }

      // Group order items by orderId
      const ordersMap = new Map<number, {
        order: any;
        items: OrderItem[];
      }>();

      ordersData.forEach((orderItem: any) => {
        const orderId = orderItem.orderId;
        const order = orderItem.order;
        const item = orderItem.item;

        if (!ordersMap.has(orderId)) {
          // Create new order entry
          ordersMap.set(orderId, {
            order: order,
            items: [],
          });
        }

        // Add item to the order
        const orderData = ordersMap.get(orderId)!;
        orderData.items.push({
          quantity: orderItem.quantity || 1,
          name: item?.name || 'Item',
          price: item?.price || 0,
        });
      });

      // Convert map to array with date for sorting
      const ordersWithDate = Array.from(ordersMap.entries()).map(([orderId, orderData]) => {
        const order = orderData.order;
        const date = order?.createdAt || new Date();
        
        // Format time from createdAt
        const timeStr = new Date(date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return {
          order: {
            id: order?.id?.toString() || `order-${orderId}`,
            orderNumber: order?.id?.toString() || `ORD-${orderId}`,
            time: timeStr,
            customerName: `Customer #${order?.userId || 'N/A'}`,
            items: orderData.items,
            totalBill: order?.totalAmount || order?.subTotal || 0,
            paymentMethod: (order?.paymentMethod || 'Cash') as PaymentMethod,
          },
          createdAt: date,
        };
      });

      // Sort by most recent first (by createdAt date)
      ordersWithDate.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      // Extract orders without createdAt
      const finalOrders: Order[] = ordersWithDate.map(item => item.order);
      
      setOrders(finalOrders);
    } catch (error: any) {
      console.log('error fetching orders ===>', error);
      // If error is due to missing restaurant ID, just set empty array
      if (error?.data?.message?.includes('restaurantId') || error?.message?.includes('restaurantId')) {
        console.log('Restaurant ID related error, setting empty orders');
      }
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  },[])

  const handleAccept = async (orderId: string) => {
    if (!orderId || orderId.trim() === '') {
      ShowToast('error', 'Invalid order ID');
      return;
    }

    try {
      setLoadingOrderId(orderId);
      setLoadingAction('accept');
      console.log('Accepting order with ID:', orderId);
      
      // Call updateOrderStatus API: PUT /order/update-order-status/:id
      // Body: { status: 'dispatched' }
      const data = {status: 'dispatched',  restaurantId}
      const res = await updateOrderStatus({
        id: orderId,
        data
      }).unwrap();
      
      console.log('Order accepted successfully:', res);
      
      // Show success toast
      ShowToast('success', res?.message || 'Order accepted successfully');
      
      // Refresh orders list after successful update
      if (restaurantId && restaurantId.trim() !== '') {
        await fetchOrders(restaurantId);
      }
    } catch (error: any) {
      console.log('Error accepting order:', error);
      console.log('Error details:', error?.data || error?.message);
      
      // Show error toast
      const errorMessage = error?.data?.message || error?.message || 'Failed to accept order. Please try again.';
      ShowToast('error', errorMessage);
    } finally {
      setLoadingOrderId(null);
      setLoadingAction(null);
    }
  };

  const handleReject = async (orderId: string) => {
    if (!orderId || orderId.trim() === '') {
      ShowToast('error', 'Invalid order ID');
      return;
    }

    try {
      setLoadingOrderId(orderId);
      setLoadingAction('reject');
      console.log('Rejecting order with ID:', orderId);
      
      // Call updateOrderStatus API: PUT /order/update-order-status/:id
      // Body: { status: 'cancelled' }
      const data = {status: 'cancelled',  restaurantId}
      const res = await updateOrderStatus({
        id: orderId,
        data
      }).unwrap();
      
      console.log('Order rejected successfully:', res);
      
      // Show success toast
      ShowToast('success', res?.message || 'Order rejected successfully');
      
      // Refresh orders list after successful update
      if (restaurantId && restaurantId.trim() !== '') {
        await fetchOrders(restaurantId);
      }
    } catch (error: any) {
      console.log('Error rejecting order:', error);
      console.log('Error details:', error?.data || error?.message);
      
      // Show error toast
      const errorMessage = error?.data?.message || error?.message || 'Failed to reject order. Please try again.';
      ShowToast('error', errorMessage);
    } finally {
      setLoadingOrderId(null);
      setLoadingAction(null);
    }
  };

  const renderOrderCard = ({ item }: { item: Order }) => {
    const isCurrentOrderLoading = loadingOrderId === item.id;
    const isAccepting = isCurrentOrderLoading && loadingAction === 'accept';
    const isRejecting = isCurrentOrderLoading && loadingAction === 'reject';


    console.log('isAcceptindshjfbejahg', item );
    return (
      <OrderRequestCard
        orderNumber={item.orderNumber}
        time={item.time}
        customerName={item.customerName}
        items={item.items}
        totalBill={item.totalBill}
        paymentMethod={item.paymentMethod}
        showAcceptReject={true}
        onAccept={() => handleAccept(item.id)}
        onReject={() => handleReject(item.id)}
        isAccepting={isAccepting}
        isRejecting={isRejecting}
      />
    );
  };
  return (
    <View style={GeneralStyles.flex}>
      <ImageBackground
        source={images.introWrapper}
        imageStyle={styles.imageStyle}
        resizeMode={'cover'}
        style={[styles.imageWrapper]}
      >
        <View style={styles.headerContainer}>
          <RestaurantHomeHeader
            isOnline={true}
            onMenuPress={() => setIsModalVisible(true)}
            onNotificationPress={() => navigation.navigate('Notification')}
            onToggleChange={() => {}}
            profileImage={images.avatar}
            notificationCount={3}
            title="Current Status"
          />
        </View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Today's Summary Section */}
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Today's Summary</Text>

            {/* Restaurant Information Card */}
            <View style={[styles.restaurantCard]}>
              <View style={styles.restaurantInfo}>
                <Image
                  source={{ uri: userData.logo }}
                  style={styles.restaurantImage}
                  resizeMode="cover"
                />
                <View style={styles.restaurantDetails}>
                  <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantName}>{userData.name}</Text>

                    <Text style={styles.restaurantDescription}>
                      {userData.description}
                    </Text>
                  </View>
                  {/* <View style={styles.vegTag}>
                    <Text style={styles.vegTagText}>VEG</Text>
                  </View> */}
                </View>
              </View>
            </View>

            {/* Summary Statistics Card */}
            <View style={[styles.statsCard, GeneralStyles.shadow]}>
              <View style={styles.statColumn}>
                <Text style={styles.statValue}>{orders.length}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statColumn}>
                <Text style={styles.statValue}>
                  {orders.filter(order => order.paymentMethod === 'Online').length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statColumn}>
                <Text style={styles.statValue}>
                  {orders.filter(order => order.paymentMethod === 'Cash').length}
                </Text>
                <Text style={styles.statLabel}>Cash</Text>
              </View>
            </View>
          </View>

          {/* Current Orders Section */}
          <View style={styles.ordersSection}>
            <View style={styles.ordersHeader}>
              <SectionHeader
                title="Current Orders"
                seeAllText="See All"
                onSeeAllPress={() => {
                  // Navigate to orders screen
                  navigation.navigate('Orders');
                }}
              />
            </View>
            <FlatList
              data={orders.length > 0 ? orders : currentOrdersData}
              renderItem={renderOrderCard}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.ordersList}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No orders found</Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </View>

      <DrawerModalRestaurant
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </View>
  );
};

export default RestaurantHome;

const styles = StyleSheet.create({
  imageWrapper: {
    width: width * 1,
    height: 400,
    position: 'absolute',
    top: -220,
  },
  imageStyle: { maxHeight: 400 },
  headerContainer: {
    top: 230,
  },
  contentContainer: {
    flex: 0.9,
    marginTop: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 999,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  summarySection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 10,
  },
  restaurantCard: {
    // backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: colors.c_F3F3F3,
  },
  restaurantDetails: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantHeader: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
  },

  vegTag: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    width: 60,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
  },
  vegTagText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  restaurantDescription: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  statsCard: {
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    // marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.c_DDDDDD,
  },
  ordersSection: {
    marginTop: 30,
  },
  ordersList: {
    paddingBottom: 0,
    paddingHorizontal: 20,
  },
  ordersHeader: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
});
