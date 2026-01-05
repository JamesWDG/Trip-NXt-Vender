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
import { NavigationProp, useNavigation } from '@react-navigation/native';
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
  rating: number;
  reviewCount: number;
}

const OrderDetails = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { top } = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(true);
  const [notificationCount] = useState(3);

  const contentStyles = useMemo(() => makeContentStyles(top), [top]);

  const orderItems: OrderItem[] = [
    {
      id: '1',
      image: images.placeholder,
      name: 'Chicken burger Noodle Soup',
      description: 'Lorem Ipsum is simply dummy text',
      price: 24.0,
      rating: 4.8,
      reviewCount: 150,
    },
    {
      id: '2',
      image: images.placeholder,
      name: 'Pretzel Chicken Noodle Soup',
      description: 'Lorem Ipsum is simply dummy text',
      price: 24.0,
      rating: 4.8,
      reviewCount: 150,
    },
    {
      id: '3',
      image: images.placeholder,
      name: 'Pretzel Chicken Noodle Soup',
      description: 'Lorem Ipsum is simply dummy text',
      price: 24.0,
      rating: 4.8,
      reviewCount: 150,
    },
  ];

  const subtotal = 75.58;
  const couponDiscount = 5.5;
  const deliveryFee = 5.0;
  const totalAmount = subtotal - couponDiscount + deliveryFee;

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
    <View key={item.id}>
      <View style={styles.orderItem}>
        <Image
          source={item.image}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>
              {item.rating} ({item.reviewCount} reviews)
            </Text>
          </View>
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
            <Text style={styles.headerTitle}>Order Details</Text>
            <TouchableOpacity
              style={styles.printButton}
              onPress={handlePrint}
              activeOpacity={0.8}
            >
              <Text style={styles.printButtonText}>Print</Text>
            </TouchableOpacity>
          </View>

          {/* Ordered Items List */}
          <View style={styles.itemsSection}>
            {orderItems.map((item, index) => renderOrderItem(item, index))}
          </View>

          {/* Payment Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            {renderPaymentRow('Subtotal', subtotal)}
            {renderPaymentRow(
              'Coupon discount',
              `-${formatPrice(couponDiscount)}`,
            )}
            {renderPaymentRow('Delivery Fee', deliveryFee, false, true)}
            <View style={styles.dashedSeparator} />
            {renderPaymentRow('Total Amount', totalAmount, true)}
          </View>

          {/* Order Details Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            {renderPaymentRow('1x Chicken Cheese Burger', totalAmount)}
            {renderPaymentRow('Subtotal', subtotal)}
            {renderPaymentRow(
              'Coupon discount',
              `-${formatPrice(couponDiscount)}`,
            )}
            {renderPaymentRow('Delivery Fee', deliveryFee, false, true)}
            <View style={styles.dashedSeparator} />
            {renderPaymentRow('Total Amount', totalAmount, true)}
          </View>
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
  itemName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    // marginBottom: 4,
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
});
