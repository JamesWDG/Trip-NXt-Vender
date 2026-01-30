import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { useLazyGetMyHotelQuery } from '../../../redux/services/hotelService';
const Home = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [getMyHotel, { isLoading }] = useLazyGetMyHotelQuery();
  const [myHotels, setMyHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchMyHotels = async () => {
    try {
      setLoading(true);
      const res = await getMyHotel({}).unwrap();
      console.log('my hotels: ', res);
      setMyHotels(res.data);
    } catch (error) {
      console.log('error fetching my hotels: ', error);
      ShowToast('error', 'Failed to fetch my hotels');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      fetchMyHotels();
    });
    return () => {
      subscribe();
    };
  }, [])
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
                        // navigation.navigate('HotelDetails', { ...item });
                      }}
                    />
                  </View>
                )}
              />
            </View>

            {/* Third Section */}
            <View style={styles.sectionStyles}>
              <Text style={styles.secondSectionTitle}>Pending Bookings</Text>
              <FlatList
                contentContainerStyle={styles.contentContainerStyles}
                style={styles.contentContainerStyles}
                showsVerticalScrollIndicator={false}
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                renderItem={({ item }) => (
                  <View style={styles.hotelCardContainer}>
                    <HotelCard
                      image={images.apartment}
                      hotelName="Lux Hotel Casino"
                      rentPerDay={180}
                      rentPerHour={10}
                      rating={4.5}
                      beds={3}
                      baths={2}
                      parking={2}
                      location="Kingdom Tower, Brazil"
                      onPress={() => {
                        /* handle navigation */
                      }}
                    />
                  </View>
                )}
              />
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
});
