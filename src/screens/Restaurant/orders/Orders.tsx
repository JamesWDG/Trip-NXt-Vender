import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import OrderCard from '../../../components/orderCard/OrderCard';
import OrderRequestCard from '../../../components/orderRequestCard/OrderRequestCard';
import { useLazyGetOrdersQuery, useUpdateOrderStatusMutation } from '../../../redux/services/orderService';
import { useLazyGetUserQuery } from '../../../redux/services/authService';
import { ShowToast } from '../../../config/constants';

type PaymentMethod = 'Cash' | 'Online';

interface OrderItem {
  quantity: number;
  name: string;
  price: number;
}

interface OrderDisplay {
  id: string;
  orderNumber: string;
  time: string;
  customerName: string;
  amount: string;
  paymentMethod: string;
  status?: string;
}

const Orders = () => {
  const navigation = useNavigation<NavigationPropType>();
  const route = useRoute<any>();
  const restaurantIdFromParams = route.params?.restaurantId ?? '';
  const [restaurantId, setRestaurantId] = useState(restaurantIdFromParams);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [ordersDisplay, setOrdersDisplay] = useState<OrderDisplay[]>([]);
  const [fullOrdersData, setFullOrdersData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<'accept' | 'reject' | null>(null);

  const [getOrders] = useLazyGetOrdersQuery();
  const [getUser] = useLazyGetUserQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const buildOrdersFromApi = useCallback((ordersData: any[]) => {
    if (!Array.isArray(ordersData) || ordersData.length === 0) {
      setOrdersDisplay([]);
      setFullOrdersData([]);
      return;
    }

    const ordersMap = new Map<number, { order: any; items: OrderItem[]; fullOrderData: any }>();

    ordersData.forEach((orderItem: any) => {
      const orderId = orderItem.orderId;
      const order = orderItem.order;
      const item = orderItem.item;

      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          order,
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
            order: orderItem.order,
            item: orderItem.item,
            restaurant: orderItem.restaurant,
            allItems: [orderItem],
          },
        });
      }

      const orderData = ordersMap.get(orderId)!;
      orderData.items.push({
        quantity: orderItem.quantity || 1,
        name: item?.name || 'Item',
        price: item?.price || 0,
      });
      if (!orderData.fullOrderData.allItems.find((oi: any) => oi.id === orderItem.id)) {
        orderData.fullOrderData.allItems.push(orderItem);
      }
    });

    const ordersWithDate = Array.from(ordersMap.entries()).map(([orderId, orderData]) => {
      const order = orderData.order;
      const date = order?.createdAt || new Date();
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
          amount: `$${totalAmount}`,
          paymentMethod: ((order as any)?.paymentMethod || 'Cash') as PaymentMethod,
          status: orderStatus,
        },
        fullOrderData: orderData.fullOrderData,
        createdAt: date,
      };
    });

    ordersWithDate.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setOrdersDisplay(ordersWithDate.map((x) => x.order));
    setFullOrdersData(ordersWithDate.map((x) => x.fullOrderData));
  }, []);

  const fetchOrders = useCallback(async () => {
    let rid = restaurantIdFromParams || restaurantId;
    if (!rid || String(rid).trim() === '') {
      try {
        const userRes = await getUser(undefined).unwrap();
        rid = userRes?.data?.restaurant?.id?.toString() || userRes?.data?.restaurant?._id?.toString() || '';
        if (rid) setRestaurantId(rid);
      } catch {
        rid = '';
      }
    }
    if (!rid || String(rid).trim() === '') {
      setOrdersDisplay([]);
      setFullOrdersData([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await getOrders({ restaurantId: rid, status: 'all' }).unwrap();
      if (!res.success) {
        setOrdersDisplay([]);
        setFullOrdersData([]);
        return;
      }
      const ordersData = res.data ?? [];
      buildOrdersFromApi(Array.isArray(ordersData) ? ordersData : []);
    } catch {
      setOrdersDisplay([]);
      setFullOrdersData([]);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantIdFromParams, restaurantId, getOrders, getUser, buildOrdersFromApi]);

  useEffect(() => {
    if (restaurantIdFromParams) setRestaurantId(restaurantIdFromParams);
  }, [restaurantIdFromParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // API uses "pending" for new orders; active = pending + processing
  const activeStatuses = ['pending', 'processing'];
  const activeOrders = ordersDisplay.filter((o) =>
    activeStatuses.includes((o.status || '').toLowerCase())
  );
  const orderHistory = ordersDisplay.filter(
    (o) => !activeStatuses.includes((o.status || '').toLowerCase())
  );
  const currentData = activeTabIndex === 0 ? activeOrders : orderHistory;

  const getFullOrderData = (orderId: string) =>
    fullOrdersData.find(
      (f: any) => f.orderId?.toString() === orderId || f.order?.id?.toString() === orderId
    );

  const handleViewDetails = (orderId: string) => {
    const data = getFullOrderData(orderId);
    if (data) {
      navigation.navigate('OrderDetails', { orderData: data });
    }
  };

  const handleAccept = async (orderId: string) => {
    const rid = restaurantIdFromParams || restaurantId;
    if (!orderId || !rid) return;
    setLoadingOrderId(orderId);
    setLoadingAction('accept');
    try {
      await updateOrderStatus({
        id: orderId,
        data: { status: 'dispatched', restaurantId: rid },
      }).unwrap();
      ShowToast('success', 'Order accepted');
      await fetchOrders();
      const data = getFullOrderData(orderId);
      if (data) {
        navigation.navigate('OrderDetails', { orderData: data });
      }
    } catch (e: any) {
      ShowToast('error', e?.data?.message || e?.message || 'Failed to accept order');
    } finally {
      setLoadingOrderId(null);
      setLoadingAction(null);
    }
  };

  const handleReject = async (orderId: string) => {
    const rid = restaurantIdFromParams || restaurantId;
    if (!orderId || !rid) return;
    setLoadingOrderId(orderId);
    setLoadingAction('reject');
    try {
      await updateOrderStatus({
        id: orderId,
        data: { status: 'cancelled', restaurantId: rid },
      }).unwrap();
      ShowToast('success', 'Order rejected');
      await fetchOrders();
    } catch (e: any) {
      ShowToast('error', e?.data?.message || e?.message || 'Failed to reject order');
    } finally {
      setLoadingOrderId(null);
      setLoadingAction(null);
    }
  };

  const renderActiveOrder = ({ item }: { item: OrderDisplay }) => {
    const fullData = getFullOrderData(item.id);
    const items: OrderItem[] = fullData?.allItems?.map((oi: any) => ({
      quantity: oi.quantity || 1,
      name: oi.item?.name || 'Item',
      price: Number(oi.item?.price ?? 0),
    })) ?? [];
    const totalBill = Number(fullData?.order?.totalAmount ?? fullData?.order?.subTotal ?? 0);
    const isAccepting = loadingOrderId === item.id && loadingAction === 'accept';
    const isRejecting = loadingOrderId === item.id && loadingAction === 'reject';

    return (
      <OrderRequestCard
        orderNumber={item.orderNumber}
        time={item.time}
        customerName={item.customerName}
        items={items}
        totalBill={totalBill}
        paymentMethod={(item.paymentMethod as PaymentMethod) || 'Cash'}
        showAcceptReject={true}
        onAccept={() => handleAccept(item.id)}
        onReject={() => handleReject(item.id)}
        isAccepting={isAccepting}
        isRejecting={isRejecting}
      />
    );
  };

  const renderHistoryOrder = ({ item }: { item: OrderDisplay }) => (
    <OrderCard
      orderId={item.orderNumber}
      time={item.time}
      customerName={item.customerName}
      amount={item.amount}
      paymentMethod={item.paymentMethod}
      status={item.status}
      onViewDetails={() => handleViewDetails(item.id)}
    />
  );

  const renderOrderCard = ({ item }: { item: OrderDisplay }) =>
    activeTabIndex === 0 ? renderActiveOrder({ item }) : renderHistoryOrder({ item });

  return (
    <WrapperContainer navigation={navigation} title="Orders">
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <AccomodationTabButtons
            data={['Active Orders', 'Order History']}
            selectedIndex={setActiveTabIndex}
          />
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#0162C0" />
          </View>
        ) : (
          <FlatList
            data={currentData}
            renderItem={renderOrderCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  {activeTabIndex === 0 ? 'No active orders' : 'No order history'}
                </Text>
              </View>
            }
          />
        )}
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
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
});
