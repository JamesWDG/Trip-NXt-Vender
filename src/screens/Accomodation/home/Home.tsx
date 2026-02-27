import {
  Animated,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import images from '../../../config/images';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import { useNavigation } from '@react-navigation/native';
import labels from '../../../config/labels';
import HomeHeader from '../../../components/homeHeader/HomeHeader';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import { height, ShowToast, width } from '../../../config/constants';
import colors from '../../../config/colors';
import GeneralStyles from '../../../utils/GeneralStyles';
import fonts from '../../../config/fonts';
import { homeCardData, Hotel } from '../../../contants/Accomodation';
import HomeCard from '../../../components/Accomodation/homecard/HomeCard';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import HotelCard from '../../../components/hotelCard/HotelCard';
import DrawerModal from '../../../components/drawers/DrawerModal';
import { useLazyGetMyHotelQuery, useLazyGetVendorPendingBookingsQuery } from '../../../redux/services/hotelService';

export type HotelBookingItem = {
  id: number;
  hotelId: number;
  status: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  hotel?: {
    id: number;
    name: string;
    images?: string[];
    rentPerDay?: number;
    rentPerHour?: number;
    numberOfBeds?: number;
    numberOfBathrooms?: number;
    numberOfGuests?: number;
    location?: { city?: string; address?: string };
  };
};

const SkeletonBox = ({ style }: { style?: object }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.6, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[styles.skeletonBox, style, { opacity }]} />;
};

const PendingBookingsSkeleton = () => (
  <View style={styles.pendingSkeletonWrap}>
    {[1, 2, 3].map((i) => (
      <View key={i} style={styles.skeletonCard}>
        <SkeletonBox style={styles.skeletonImage} />
        <View style={styles.skeletonContent}>
          <SkeletonBox style={[styles.skeletonLine, { width: '70%', marginBottom: 8 }]} />
          <SkeletonBox style={[styles.skeletonLine, { width: '50%', height: 14 }]} />
        </View>
      </View>
    ))}
  </View>
);

const Home = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [getMyHotel, { isLoading }] = useLazyGetMyHotelQuery();
  const [getPendingBookings, { isLoading: loadingPending }] = useLazyGetVendorPendingBookingsQuery();
  const [myHotels, setMyHotels] = useState<Hotel[]>([]);
  const [pendingBookings, setPendingBookings] = useState<HotelBookingItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyHotels = async () => {
    try {
      setLoading(true);
      const res = await getMyHotel(1).unwrap();
      setMyHotels(res?.data ?? []);
    } catch (error) {
      ShowToast('error', 'Failed to fetch my hotels');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingBookings = async () => {
    try {
      const res = await getPendingBookings().unwrap();
      const list = Array.isArray(res?.data) ? res.data : [];
      setPendingBookings(list);
    } catch (error) {
      ShowToast('error', 'Failed to fetch pending bookings');
      setPendingBookings([]);
    }
  };

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      fetchMyHotels();
      fetchPendingBookings();
    });
    return () => subscribe();
  }, []);
  return (
    <View style={[GeneralStyles.flex, styles.container]}>
      <ImageBackground
        source={images.accomodation_home}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <HomeHeader
          navigation={navigation}
          onPress={() => setIsModalVisible(true)}
        />
        <View style={styles.textContainer}>
          <Text style={styles.accomodationText}>{labels.helloVendor}</Text>
          <View style={styles.divider} />
          <Text style={styles.stayInStyles}>{labels.myDashBoard}</Text>
        </View>
        <SearchWithFilters
          placeholder={labels.whatareYouLookingFor}
          navigation={navigation}
        />
      </ImageBackground>

      <FlatList
        data={[1]}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.toString()}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.parentContainer}
        renderItem={({ item }) => (
          <>
            {/* First Section */}
            <View style={styles.homeCardSection}>
              <FlatList
                contentContainerStyle={styles.contentContainer}
                showsHorizontalScrollIndicator={false}
                data={homeCardData}
                horizontal
                renderItem={({ item }) => (
                  <HomeCard title={item.title} description={item.description} />
                )}
              />

              <View style={GeneralStyles.paddingHorizontal}>
                <GradientButtonForAccomodation
                  title="+ Add Hotel"
                  onPress={() => {
                    navigation.navigate('MyHotels');
                  }}
                  fontFamily={fonts.bold}
                  fontSize={16}
                />
              </View>
            </View>

            {/* Second Section */}
            <View style={styles.sectionStyles}>
              <Text style={styles.secondSectionTitle}>My Hotels</Text>
              <FlatList
                data={myHotels}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.myHotelsListContent}
                ItemSeparatorComponent={() => <View style={styles.cardGap} />}
                renderItem={({ item }) => (
                  <View style={[styles.horizontalCardWrapper, { width: width * 0.78 }]}>
                    <HotelCard
                      image={item.images?.length > 0 ? item.images[0] : images.placeholder}
                      hotelName={item.name}
                      rentPerDay={item.rentPerDay}
                      rentPerHour={item.rentPerHour}
                      rating={4.5}
                      beds={item.numberOfBeds}
                      baths={item.numberOfBathrooms}
                      parking={item.numberOfGuests}
                      location="Kingdom Tower, Brazil"
                      onPress={() => {
                        navigation.navigate('Accomodation', {
                          screen: 'HotelDetails',
                          params: { hotel: item },
                        });
                      }}
                    />
                  </View>
                )}
              />
            </View>

            {/* Third Section - Pending Bookings */}
            <View style={styles.sectionStyles}>
              <Text style={styles.secondSectionTitle}>Pending Bookings</Text>
              {loadingPending ? (
                <PendingBookingsSkeleton />
              ) : pendingBookings.length === 0 ? (
                <View style={styles.emptyPendingWrap}>
                  <Text style={styles.emptyPendingText}>No pending bookings</Text>
                </View>
              ) : (
                <FlatList
                  data={pendingBookings}
                  keyExtractor={(item) => String(item.id)}
                  contentContainerStyle={styles.contentContainerStyles}
                  style={styles.contentContainerStyles}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const hotel = item.hotel;
                    const locationStr =
                      hotel?.location?.city || hotel?.location?.address || '—';
                    return (
                      <View style={styles.hotelCardContainer}>
                        <HotelCard
                          image={
                            hotel?.images?.length
                              ? hotel.images[0]
                              : images.placeholder
                          }
                          hotelName={hotel?.name ?? 'Hotel'}
                          rentPerDay={hotel?.rentPerDay ?? 0}
                          rentPerHour={hotel?.rentPerHour ?? 0}
                          rating={4.5}
                          beds={hotel?.numberOfBeds ?? 0}
                          baths={hotel?.numberOfBathrooms ?? 0}
                          parking={hotel?.numberOfGuests ?? 0}
                          location={locationStr}
                          onPress={() => {
                            navigation.navigate('Accomodation', {
                              screen: 'BookingDetails',
                              params: { booking: item },
                            });
                          }}
                        />
                      </View>
                    );
                  }}
                />
              )}
            </View>
          </>
        )}
      />

      <DrawerModal
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  imageBackground: {
    height: height * 0.31,
    paddingHorizontal: 20,
  },
  container: { backgroundColor: colors.white },
  textContainer: { flex: 1, marginTop: 30 },
  accomodationText: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  homeCardSection: {
    gap: 20,
    marginTop: 10,
  },
  hotelCardContainer: { paddingHorizontal: 16 },
  sectionStyles: {
    marginVertical: 20,
  },
  secondSectionTitle: {
    paddingLeft: 20,
    marginBottom: 20,
    fontSize: 20,
    fontFamily: fonts.semibold,
  },
  divider: {
    height: 3,
    borderRadius: 100,
    width: 110,
    backgroundColor: colors.white,
  },
  stayInStyles: {
    fontSize: 25,
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: 8,
  },
  contentContainer: {
    paddingLeft: 20,
    gap: 10,
  },
  contentContainerStyles: {
    gap: 20,
  },
  myHotelsListContent: {
    paddingHorizontal: 20,
    paddingRight: 20,
  },
  horizontalCardWrapper: {
    minHeight: 140,
  },
  cardGap: {
    width: 16,
  },
  parentContainer: {
    paddingBottom: 120,
  },
  skeletonBox: {
    backgroundColor: colors.c_F3F3F3 || '#f3f3f3',
  },
  pendingSkeletonWrap: {
    paddingHorizontal: 20,
    gap: 16,
  },
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 12,
  },
  skeletonImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  skeletonLine: {
    height: 16,
    borderRadius: 6,
  },
  emptyPendingWrap: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyPendingText: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
});
