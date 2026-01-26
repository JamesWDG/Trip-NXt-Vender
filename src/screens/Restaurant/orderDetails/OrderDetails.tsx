import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import React, { useState, useMemo } from 'react';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrderHeader from '../../../components/orderHeader/OrderHeader';
import images from '../../../config/images';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { height } from '../../../config/constants';

interface OrderItem {
  id: string;
  image: any;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const OrderDetails = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const { top } = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(true);
  const [notificationCount] = useState(3);

  // Get order data from route params
  const orderData = (route.params as any)?.orderData;

  const contentStyles = useMemo(() => makeContentStyles(top), [top]);

  // Extract order information
  const order = orderData?.order || {};
  const allItems = orderData?.allItems || [];
  const user = order?.user || {};
  const restaurant = orderData?.restaurant || {};
  const deliveryAddress = order?.deliveryAddress || {};

  // Format order items from API data
  const orderItems: OrderItem[] = allItems.map((item: any) => ({
    id: item?.id?.toString() || item?.itemId?.toString() || '',
    image: item?.item?.image ? { uri: item.item.image } : images.placeholder,
    name: item?.item?.name || 'Item',
    description: item?.item?.description || '',
    price: item?.item?.price || item?.price || 0,
    quantity: item?.quantity || 1,
  }));

  // Calculate amounts from order data
  const subtotal = order?.subTotal || 0;
  const deliveryFee = order?.deliveryFee || 0;
  const tax = order?.tax || 0;
  const discountId = order?.discountId;
  const couponDiscount = discountId ? 0 : 0; // You can calculate discount if needed
  const totalAmount = order?.totalAmount || subtotal + deliveryFee + tax;

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Parse restaurant location if it's a string
  const getRestaurantLocation = () => {
    if (!restaurant?.location) return {};
    if (typeof restaurant.location === 'string') {
      try {
        return JSON.parse(restaurant.location);
      } catch {
        return {};
      }
    }
    return restaurant.location;
  };

  const restaurantLocation = getRestaurantLocation();

  const handlePrint = () => {
    // Handle print action
    console.log('Print pressed');
    // TODO: Implement print functionality
  };

  const handleFindRider = () => {
    // Handle find rider action
    console.log('Find Rider pressed');
    // TODO: Navigate to find rider screen
    navigation.navigate('FindYourRide');
  };

  const handleNotificationPress = () => {
    // Handle notification press
    console.log('Notification pressed');
    // TODO: Navigate to notifications screen
  };

  const handleToggleChange = (online: boolean) => {
    setIsOnline(online);
    console.log('Online status changed:', online);
  };

  const formatPrice = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const renderOrderItem = (item: OrderItem, index: number) => (
    <View key={item.id || index}>
      <View style={styles.orderItem}>
        <Image
          source={item.image}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
          </View>
          {item.description ? (
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          <Text style={styles.itemPrice}>
            {formatPrice(item.price * item.quantity)}
          </Text>
        </View>
      </View>
      {index < orderItems.length - 1 && <View style={styles.separator} />}
    </View>
  );

  const renderPaymentRow = (
    label: string,
    value: string | number,
    isBold: boolean = false,
    isBlue: boolean = false,
  ) => (
    <View style={styles.paymentRow}>
      <Text
        style={[
          styles.paymentLabel,
          isBold && styles.paymentLabelBold,
          isBlue && styles.paymentLabelBlue,
        ]}
      >
        {label}
      </Text>
      <Text style={[styles.paymentValue, isBold && styles.paymentValueBold]}>
        {typeof value === 'number' ? formatPrice(value) : value}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={images.placeholder}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Blur Overlay */}
        <View style={styles.blurOverlay} />

        {/* Header */}
        <View style={styles.headerContainer}>
          <OrderHeader
            onBackPress={() => navigation?.goBack()}
            onNotificationPress={handleNotificationPress}
            isOnline={isOnline}
            onToggleChange={handleToggleChange}
            profileImage={images.avatar}
            notificationCount={notificationCount}
          />
        </View>
      </ImageBackground>

      {/* White Content Card */}
      <View style={contentStyles.contentCard}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={contentStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Custom Header with Print Button */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Order Details</Text>
              {order?.id && (
                <Text style={styles.orderId}>Order #{order.id}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.printButton}
              onPress={handlePrint}
              activeOpacity={0.8}
            >
              <Text style={styles.printButtonText}>Print</Text>
            </TouchableOpacity>
          </View>

          {/* Customer Information */}
          {user && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              {user.name && (
                <Text style={styles.infoText}>Name: {user.name}</Text>
              )}
              {user.email && (
                <Text style={styles.infoText}>Email: {user.email}</Text>
              )}
              {user.phoneNumber && (
                <Text style={styles.infoText}>Phone: {user.phoneNumber}</Text>
              )}
            </View>
          )}

          {/* Delivery Address */}
          {deliveryAddress?.location && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <Text style={styles.infoText}>{deliveryAddress.location}</Text>
            </View>
          )}

          {/* Ordered Items List */}
          {orderItems.length > 0 && (
            <View style={styles.itemsSection}>
              <Text style={styles.sectionTitle}>Ordered Items</Text>
              {orderItems.map((item, index) => renderOrderItem(item, index))}
            </View>
          )}

          {/* Payment Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            {renderPaymentRow('Subtotal', subtotal)}
            {tax > 0 && renderPaymentRow('Tax', tax)}
            {couponDiscount > 0 && renderPaymentRow(
              'Coupon discount',
              `-${formatPrice(couponDiscount)}`,
            )}
            {renderPaymentRow('Delivery Fee', deliveryFee, false, true)}
            <View style={styles.dashedSeparator} />
            {renderPaymentRow('Total Amount', totalAmount, true)}
          </View>

          {/* Order Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Information</Text>
            {order?.status && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={[styles.infoValue, styles.statusText]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            )}
            {order?.createdAt && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Order Date:</Text>
                <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
              </View>
            )}
            {order?.updatedAt && order.updatedAt !== order.createdAt && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Updated:</Text>
                <Text style={styles.infoValue}>{formatDate(order.updatedAt)}</Text>
              </View>
            )}
          </View>

          {/* Restaurant Information */}
          {restaurant && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Restaurant Information</Text>
              {restaurant.name && (
                <Text style={styles.infoText}>Name: {restaurant.name}</Text>
              )}
              {restaurant.phoneNumber && (
                <Text style={styles.infoText}>Phone: {restaurant.phoneNumber}</Text>
              )}
              {restaurantLocation.address && (
                <Text style={styles.infoText}>
                  Address: {[
                    restaurantLocation.address,
                    restaurantLocation.city,
                    restaurantLocation.state,
                    restaurantLocation.country,
                  ].filter(Boolean).join(', ')}
                </Text>
              )}
            </View>
          )}
        </ScrollView>

        {/* Find Rider Button */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.findRiderButton}
            onPress={handleFindRider}
            activeOpacity={0.8}
          >
            <Text style={styles.findRiderButtonText}>Find Rider</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OrderDetails;

const makeContentStyles = (top: number) =>
  StyleSheet.create({
    contentCard: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -90,
      zIndex: 999,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: top + 50,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backgroundImage: {
    height: height * 0.35,
    width: '100%',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  printButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  printButtonText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  itemsSection: {
    marginBottom: 24,
  },
  orderItem: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.c_F3F3F3,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_666666,
    marginLeft: 8,
  },
  itemDescription: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    // marginBottom: 6,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_F47E20,
    // marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  separator: {
    height: 1,
    backgroundColor: colors.c_DDDDDD,
    marginVertical: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  paymentLabelBold: {
    fontFamily: fonts.bold,
  },
  paymentLabelBlue: {
    color: colors.c_0162C0,
  },
  paymentValue: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  paymentValueBold: {
    fontFamily: fonts.bold,
  },
  dashedSeparator: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: colors.c_DDDDDD,
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.c_DDDDDD,
  },
  findRiderButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  findRiderButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  orderId: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    marginBottom: 8,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  statusText: {
    textTransform: 'capitalize',
    color: colors.c_0162C0,
  },
});
