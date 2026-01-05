import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import RideCard from '../../../components/rideCard/RideCard';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import GeneralStyles from '../../../utils/GeneralStyles';

type TimeFilter = 'Today' | 'Weekly' | 'Monthly';
type PaymentMethod = 'Cash' | 'Online';

interface Ride {
  id: string;
  rideId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  time: string;
}

// Sample data - replace with actual data from API/state
const sampleRides: Ride[] = [
  {
    id: '1',
    rideId: '12345',
    amount: 15.2,
    paymentMethod: 'Cash',
    time: '06:25 am',
  },
  {
    id: '2',
    rideId: '12345',
    amount: 15.2,
    paymentMethod: 'Cash',
    time: '06:25 am',
  },
  {
    id: '3',
    rideId: '12345',
    amount: 542.52,
    paymentMethod: 'Online',
    time: '06:25 am',
  },
  {
    id: '4',
    rideId: '12345',
    amount: 15.2,
    paymentMethod: 'Cash',
    time: '06:25 am',
  },
  {
    id: '5',
    rideId: '12345',
    amount: 542.52,
    paymentMethod: 'Online',
    time: '06:25 am',
  },
];

const TABS: TimeFilter[] = ['Today', 'Weekly', 'Monthly'];

const TotalEarnings = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [activeTab, setActiveTab] = useState<TimeFilter>('Today');
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const [rides] = useState(sampleRides); // Replace with actual state management

  const totalEarnings = 2000.0; // Replace with actual calculation

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const handleTabPress = (index: number) => {
    const selectedTab = TABS[index];
    setActiveTab(selectedTab);
    const tabWidth = containerWidth / TABS.length;

    Animated.spring(translateX, {
      toValue: tabWidth * index,
      useNativeDriver: true,
    }).start();

    // Filter rides based on selected tab
    // This would typically fetch data from API
  };

  const handleRidePress = (ride: Ride) => {
    // Handle ride card press
    console.log('Ride pressed:', ride);
    // navigation.navigate('RideDetails', { rideId: ride.id });
  };

  const tabWidth = containerWidth / TABS.length;

  return (
    <WrapperContainer navigation={navigation} title="Total Earnings">
      <View style={styles.container}>
        {/* Total Earnings Section */}
        <View style={styles.earningsSection}>
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsAmount}>${totalEarnings.toFixed(2)}</Text>
        </View>

        {/* Tab Bar */}
        <View
          style={[GeneralStyles.paddingHorizontal, GeneralStyles.marginBottom]}
        >
          <AccomodationTabButtons data={['Today', 'Weekly', 'Monthly']} />
        </View>
        {/* Rides List */}
        <FlatList
          data={rides}
          renderItem={({ item }) => (
            <RideCard
              rideId={item.rideId}
              amount={item.amount}
              paymentMethod={item.paymentMethod}
              time={item.time}
              onPress={() => handleRidePress(item)}
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

export default TotalEarnings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  earningsSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  earningsLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_F59523,
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 36,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  tabWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabContainer: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.c_0162C0,
    padding: 2,
    overflow: 'hidden',
    height: 44,
  },
  tabRow: {
    flexDirection: 'row',
    position: 'relative',
  },
  tab: {
    height: '100%',
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    zIndex: 2,
  },
  tabText: {
    fontSize: 16,
  },
  activeBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
