import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import HotelCard from '../../../components/hotelCard/HotelCard';
import images from '../../../config/images';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';
import { MoreVertical } from 'lucide-react-native';

const HotelBooking = () => {
  const navigation = useNavigation<NavigationPropType>();

  return (
    <WrapperContainer navigation={navigation} title="Hotel Booking">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card 1: Hotel Details */}
        <View
          style={[styles.card, GeneralStyles.shadow, styles.hotelCardWrapper]}
        >
          <TouchableOpacity style={styles.menuButton}>
            <MoreVertical size={20} color={colors.c_2B2B2B} />
          </TouchableOpacity>
          <HotelCard
            image={images.apartment}
            hotelName="Lux Hotel Casino"
            price="$180"
            rating={4.5}
            beds={3}
            baths={2}
            parking={2}
            location="Kingdom Tower, Brazil"
            onPress={() => {}}
          />
        </View>

        {/* Card 2: User and Contact Information */}
        <View style={[styles.card, GeneralStyles.shadow]}>
          <View style={styles.userInfoContainer}>
            <View style={styles.userProfileSection}>
              <Image
                source={images.ronald_adams}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <Text style={styles.userName}>Ronald Adam</Text>
              <Text style={styles.userRole}>User</Text>
            </View>
            <View style={styles.contactSection}>
              <Text style={styles.contactInfo}>+92 023 039 0304</Text>
              <Text style={styles.contactInfo}>info@gmail.com</Text>
            </View>
          </View>
        </View>

        {/* Card 3: Booking Dates and Guests */}
        <View style={[styles.card, GeneralStyles.shadow]}>
          <View style={styles.bookingInfoContainer}>
            <View style={styles.bookingRow}>
              <Text style={styles.bookingLabel}>Check in Date:</Text>
              <Text style={styles.bookingValue}>December 20, 2023</Text>
            </View>
            <View style={styles.bookingRow}>
              <Text style={styles.bookingLabel}>Check Out Date:</Text>
              <Text style={styles.bookingValue}>December 28, 2023</Text>
            </View>
            <View style={styles.bookingRow}>
              <Text style={styles.bookingLabel}>No. of Guests:</Text>
              <Text style={styles.bookingValue}>2</Text>
            </View>
          </View>
        </View>

        {/* Card 4: Price Breakdown */}
        <View style={[styles.card, GeneralStyles.shadow]}>
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>1 room x 2 nights:</Text>
              <Text style={styles.priceValue}>$240</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Taxes:</Text>
              <Text style={styles.priceValue}>$10</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Fees:</Text>
              <Text style={styles.priceValue}>$5</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Discount:</Text>
              <Text style={styles.priceValue}>0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>$255</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default HotelBooking;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
    gap: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 10,
    padding: 16,
  },
  hotelCardWrapper: {
    position: 'relative',
    padding: 0,
    overflow: 'visible',
  },
  menuButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  userProfileSection: {
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  contactSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  contactInfo: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  bookingInfoContainer: {
    gap: 16,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  bookingValue: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  priceContainer: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  priceValue: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  divider: {
    height: 1,
    backgroundColor: colors.c_F3F3F3,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
});
