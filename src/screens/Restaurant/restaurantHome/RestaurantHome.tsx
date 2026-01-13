import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import images from '../../../config/images';
import { width } from '../../../config/constants';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';
import RestaurantHomeHeader from '../../../components/restaurantHomeHeader/RestaurantHomeHeader';
import SectionHeader from '../../../components/sectionHeader/SectionHeader';
import OrderRequestCard from '../../../components/orderRequestCard/OrderRequestCard';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import DrawerModal from '../../../components/drawers/DrawerModal';
import DrawerModalRestaurant from '../../../components/drawers/DrawerModalRestaurant';

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

  const handleAccept = (orderId: string) => {
    console.log('Accept order:', orderId);
    // TODO: Handle accept logic
  };

  const handleReject = (orderId: string) => {
    console.log('Reject order:', orderId);
    // TODO: Handle reject logic
  };

  const renderOrderCard = ({ item }: { item: Order }) => (
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
    />
  );
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
                  source={images.placeholder}
                  style={styles.restaurantImage}
                  resizeMode="cover"
                />
                <View style={styles.restaurantDetails}>
                  <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantName}>Galaxy Kitchen</Text>

                    <Text style={styles.restaurantDescription}>
                      Lorem Ipsum is simply
                    </Text>
                  </View>
                  <View style={styles.vegTag}>
                    <Text style={styles.vegTagText}>VEG</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Summary Statistics Card */}
            <View style={[styles.statsCard, GeneralStyles.shadow]}>
              <View style={styles.statColumn}>
                <Text style={styles.statValue}>05</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statColumn}>
                <Text style={styles.statValue}>10</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statColumn}>
                <Text style={styles.statValue}>05</Text>
                <Text style={styles.statLabel}>Cancelled</Text>
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
              data={currentOrdersData}
              renderItem={renderOrderCard}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.ordersList}
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
});
