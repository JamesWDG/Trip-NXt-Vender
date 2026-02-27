import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import images from '../../../config/images';
import { width, ShowToast } from '../../../config/constants';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';
import RestaurantHomeHeader from '../../../components/restaurantHomeHeader/RestaurantHomeHeader';
import SectionHeader from '../../../components/sectionHeader/SectionHeader';
import OrderRequestCard from '../../../components/orderRequestCard/OrderRequestCard';
import { NavigationProp, ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import DrawerModalRestaurant from '../../../components/drawers/DrawerModalRestaurant';
import { useLazyGetUserQuery } from '../../../redux/services/authService';
import { useLazyGetOrdersQuery, useUpdateOrderStatusMutation } from '../../../redux/services/orderService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';

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
  status?: string;
}

const SkeletonBox = ({ style }: { style?: object }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View style={[skeletonStyles.box, style, { opacity }]} />
  );
};

const skeletonStyles = StyleSheet.create({
  box: {
    backgroundColor: colors.c_F3F3F3,
  },
  title: { width: 180, height: 22, borderRadius: 6 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  line: { width: 200, height: 18, borderRadius: 6 },
  lineShort: { width: 120, height: 14, borderRadius: 6 },
  statsCard: { width: '100%', height: 90, borderRadius: 12 },
  orderCard: { width: '100%', height: 100, borderRadius: 12 },
});

const RestaurantHomeSkeleton = () => (
  <View style={styles.summarySection}>
    <SkeletonBox style={[skeletonStyles.title, { marginBottom: 16 }]} />
    <View style={styles.skeletonRestaurantRow}>
      <SkeletonBox style={skeletonStyles.avatar} />
      <View style={styles.skeletonRestaurantText}>
        <SkeletonBox style={[skeletonStyles.line, { marginBottom: 10 }]} />
        <SkeletonBox style={skeletonStyles.lineShort} />
      </View>
    </View>
    <SkeletonBox style={[skeletonStyles.statsCard, { marginTop: 16, marginBottom: 24 }]} />
    <View style={styles.skeletonOrdersHeader}>
      <SkeletonBox style={skeletonStyles.line} />
      <SkeletonBox style={[skeletonStyles.line, { width: 60 }]} />
    </View>
    {[1, 2, 3].map(i => (
      <SkeletonBox key={i} style={[skeletonStyles.orderCard, { marginTop: 12 }]} />
    ))}
  </View>
);

const RestaurantHome = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase, 'RestaurantHome'>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { needRestaurantVerification } = useSelector((state: RootState) => state.auth);
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
  const [fullOrdersData, setFullOrdersData] = useState<any[]>([]); // Store full order data from API
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [hasNoRestaurant, setHasNoRestaurant] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<'accept' | 'reject' | null>(null);
  const [getUser] = useLazyGetUserQuery();
  const [getOrders] = useLazyGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const fetchRestaurant = async () => {
    setIsLoading(true);
    try {
      const res = await getUser({}).unwrap();
      console.log('restaurant data ===>', res);

      // Check if restaurant exists
      if (!res.data?.restaurant) {
        console.log('No restaurant data found');
        setHasNoRestaurant(true);
        setUserData({
          name: '',
          description: '',
          logo: '',
        });
        setRestaurantId('');
        setOrders([]);
        return;
      }

      setHasNoRestaurant(false);

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
    } finally {
      setIsLoading(false);
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
      const res = await getOrders({ restaurantId, status: 'processing' }).unwrap();
      console.log('orders data ===>', res);

      // Check if API call was successful
      

      // API shape: { success, message, data: [{ id, orderId, restaurantId, itemId, quantity, status, order: { id, totalAmount, subTotal, user: { name }, createdAt, status }, item: { name, price }, restaurant }, ...] }
      const ordersData = res.data || [];

  

      console.log(ordersData , "ordersData ===>", res)

      // Group order items by orderId (one order can have multiple items)
      const ordersMap = new Map<number, {
        order: any;
        items: OrderItem[];
        fullOrderData: any; // Store full order data for navigation
      }>();

      ordersData.forEach((orderItem: any) => {
        const orderId = orderItem.orderId;
        const order = orderItem.order;
        const item = orderItem.item;

        if (!ordersMap.has(orderId)) {
          // Create new order entry with full data including restaurant and user info
          ordersMap.set(orderId, {
            order: order,
            items: [],
            fullOrderData: {
              id: orderItem.id,
              orderId: orderItem.orderId,
              restaurantId: orderItem.restaurantId,
              itemId: orderItem.itemId,
              quantity: orderItem.quantity,
              status: orderItem.status,
              createdAt: orderItem.createdAt,
              updatedAt: orderItem.updatedAt,
              order: orderItem.order, // Full order with user info
              item: orderItem.item, // Menu item
              restaurant: orderItem.restaurant, // Restaurant info
              allItems: [orderItem], // Store all order items for this order
            },
          });
        }

        // Add item to the order
        const orderData = ordersMap.get(orderId)!;
        orderData.items.push({
          quantity: orderItem.quantity || 1,
          name: item?.name || 'Item',
          price: item?.price || 0,
        });

        // Add to full order data items array
        if (!orderData.fullOrderData.allItems.find((oi: any) => oi.id === orderItem.id)) {
          orderData.fullOrderData.allItems.push(orderItem);
        }
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

        const orderStatus = (order as any)?.status ?? orderData.fullOrderData?.status ?? 'pending';
        const totalAmount = Number(order?.totalAmount ?? order?.subTotal ?? 0);
        const customerName = (order as any)?.user?.name ?? (order as any)?.user?.email ?? `Customer #${order?.userId ?? 'N/A'}`;
        return {
          order: {
            id: order?.id?.toString() || `order-${orderId}`,
            orderNumber: `#${order?.id ?? orderId}`,
            time: timeStr,
            customerName,
            items: orderData.items,
            totalBill: totalAmount,
            paymentMethod: ((order as any)?.paymentMethod || 'Cash') as PaymentMethod,
            status: orderStatus,
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

      // Extract orders without createdAt and store full data
      const finalOrders: Order[] = ordersWithDate.map(item => item.order);
      const fullOrdersArray = Array.from(ordersMap.values()).map(orderData => orderData.fullOrderData);

      setFullOrdersData(fullOrdersArray);
      setOrders(finalOrders);
    } catch (error: any) {
      console.log('error fetching orders ===>', error);
      if (error?.data?.message?.includes('restaurantId') || error?.message?.includes('restaurantId')) {
        console.log('Restaurant ID related error, setting empty orders');
      }
      setOrders([]);
      setFullOrdersData([]);
    }
  };

  // Har baar home pe aane par data fetch + skeleton (focus pe refetch)
  useFocusEffect(
    React.useCallback(() => {
      fetchRestaurant();
    }, [])
  );

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
      const data = { status: 'dispatched', restaurantId }
      const res = await updateOrderStatus({
        id: orderId,
        data
      }).unwrap();
      await fetchOrders(restaurantId);

      console.log('Order accepted successfully:', res);

      // Show success toast
      ShowToast('success', res?.message || 'Order accepted successfully');

      // Find the full order data to pass to OrderDetails (before refresh)
      const currentOrderData = fullOrdersData.find(
        (order: any) => order.orderId?.toString() === orderId || order.order?.id?.toString() === orderId
      );

      // Refresh orders list to get updated status
      if (restaurantId && restaurantId.trim() !== '') {
        await fetchOrders(restaurantId);
      }

      // Navigate to OrderDetails with order data
      // Use current order data if available, otherwise it will be available after refresh
      if (currentOrderData) {
        // Update status in the data before navigating
        const updatedOrderData = {
          ...currentOrderData,
          order: {
            ...currentOrderData.order,
            status: 'dispatched', // Update status to dispatched
          },
        };
        navigation.navigate('OrderDetails', { orderData: updatedOrderData });
      } else {
        // If not found, wait a bit for state update then navigate
        setTimeout(() => {
          const updatedOrder = fullOrdersData.find(
            (order: any) => order.orderId?.toString() === orderId || order.order?.id?.toString() === orderId
          );
          if (updatedOrder) {
            navigation.navigate('OrderDetails', { orderData: updatedOrder });
          }
        }, 500);
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
      const data = { status: 'cancelled', restaurantId }
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
            onToggleChange={() => { }}
            profileImage={images.avatar}
            notificationCount={3}
            // title="Current Status"
          />
        </View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <RestaurantHomeSkeleton />
          ) : (
          <>
          {/* Today's Summary Section */}
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Restaurant Summary</Text>

            {hasNoRestaurant ? (
              <View style={styles.noRestaurantCard}>
                <Text style={styles.noRestaurantTitle}>No restaurant linked</Text>
                <Text style={styles.noRestaurantText}>
                  Add your restaurant details to start receiving orders and view your summary.
                </Text>
                <GradientButtonForAccomodation
                  title="Add Restaurant"
                  onPress={() => navigation.navigate('RestaurantDetails')}
                  otherStyles={styles.addRestaurantButton}
                />
              </View>
            ) : (
              <>
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
              </>
            )}
          </View>

          {/* Current Orders Section - pending & processing (API uses "pending" for new orders) */}
          <View style={styles.ordersSection}>
            <View style={styles.ordersHeader}>
              <SectionHeader
                title="Current Orders"
                seeAllText="See All"
                onSeeAllPress={() => {
                  navigation.navigate('Orders', { restaurantId });
                }}
              />
            </View>
            <FlatList
              data={orders.filter(o => ['pending', 'processing'].includes((o.status || '').toLowerCase()))}
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
          </>
          )}
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
  skeletonRestaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonRestaurantText: {
    flex: 1,
    marginLeft: 16,
  },
  skeletonOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 10,
  },
  noRestaurantCard: {
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  noRestaurantTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  noRestaurantText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    textAlign: 'center',
    marginBottom: 20,
  },
  addRestaurantButton: {
    minWidth: 180,
    alignSelf: 'center',
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
