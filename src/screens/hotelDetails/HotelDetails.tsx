import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Heart,
  LocateIcon,
  LocateOffIcon,
  LocationEditIcon,
  MapPin,
} from 'lucide-react-native';
import StarRating from 'react-native-star-rating-widget';

import { useNavigation } from '@react-navigation/native';
import PrimaryHeader from '../../components/primaryHeader/PrimaryHeader';
import MainCarousel from '../../components/mainCarousel/MainCarousel';
import DetailsCard from '../../components/detailsCard/DetailsCard';
import { CarouselData } from '../../contants/Accomodation';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';
import images from '../../config/images';
import IntroCard from '../../components/introCard/IntroCard';
import GradientButtonForAccomodation from '../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import ReviewCard from '../Accomodation/reviewCard/ReviewCard';
import { width } from '../../config/constants';
import FastImage from 'react-native-fast-image';

const HotelDetails = ({ navigation }: { navigation?: any }) => {
  const { top } = useSafeAreaInsets();
  const [wishlist, setWishlist] = useState(false);
  const nav = useNavigation<any>();

  const wishlistButtonStyles = useMemo(() => {
    return wishlistButton(wishlist, top);
  }, [wishlist]);
  return (
    <View style={GeneralStyles.flex as ViewStyle}>
      <View style={styles.headerContainer}>
        <PrimaryHeader
          title="Hotel Details"
          onBackPress={() => navigation.goBack()}
        />
      </View>
      <View style={wishlistButtonStyles.carouselContainer}>
        <MainCarousel data={CarouselData} />
      </View>

      <View style={styles.lowerContainer}>
        <ScrollView
          style={GeneralStyles.flex}
          contentContainerStyle={wishlistButtonStyles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <DetailsCard
            title="Lux Hotel Casino"
            reviews={11}
            rating={4}
            price={23456}
            location="Las Vegas, NV, USA"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries."
            amenities={[
              {
                name: 'WiFi',
                icon: images.wifi,
              },
              {
                name: 'Shower',
                icon: images.shower,
              },
              {
                name: 'Breakfast',
                icon: images.coffee,
              },
              {
                name: 'TV',
                icon: images.TV,
              },
              {
                name: 'AC',
                icon: images.AC,
              },
            ]}
          />

          <View
            style={[styles.locationContainer, styles.paddingHorizontalStyle]}
          >
            <Text style={styles.locationTitle}>Location/Map</Text>
            <Text style={styles.locationText}>View on Google MAP</Text>
          </View>

          {/* <View
            style={[styles.paddingHorizontalStyle, styles.introCardContainer]}
          >
          <IntroCard
          name={'John Doe'}
          rating={4.5}
          reviews={100}
          yearsHosting={10}
          image={images.avatar}
          description={
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries."
            }
            designation={'CEO, Company Name'}
            />
            </View> */}

          <View
            style={[styles.paddingHorizontalStyle, styles.introCardContainer]}
          >
            <FastImage source={images.maps} style={styles.mapsImage} />
          </View>

          <View>
            <Text style={[GeneralStyles.paddingHorizontal, styles.reviewTitle]}>
              James Henry Reviews
            </Text>

            <FlatList
              data={[1, 2, 2, 2, 2, 2]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <ReviewCard
                  name={'James Henry'}
                  rating={4.5}
                  time={'1 Day ago'}
                  image={images.avatar}
                  otherStyles={{ width: width * 0.75 }}
                  description={
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries."
                  }
                />
              )}
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={styles.flatListContentContainer2}
              showsVerticalScrollIndicator={false}
              // scrollEnabled={false}
            />
          </View>
          {/* <View style={styles.wishlistContainer}>
            <TouchableOpacity
              onPress={() => setWishlist(!wishlist)}
              style={wishlistButtonStyles.container}
            >
              <Heart
                color={wishlist ? colors.white : colors.c_F47E20}
                size={26}
              />
            </TouchableOpacity>
            <View style={GeneralStyles.flex}>
              <GradientButtonForAccomodation
                title="Book Now"
                onPress={() => (navigation || nav).navigate('CalenderBooking')}
                fontSize={18}
                fontFamily={fonts.semibold}
              />
            </View>
          </View> */}
        </ScrollView>
      </View>
    </View>
  );
};

export default HotelDetails;

const wishlistButton = (wishlist: boolean, top: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: wishlist ? colors.c_F47E20 : colors.transparent,
      padding: 10,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: wishlist ? colors.c_F47E20 : colors.transparent,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollViewContent: { flexGrow: 1, paddingBottom: top + 20 + 100 },
    carouselContainer: {
      zIndex: 10,
      marginTop: -top - 20,
    },
  });
const styles = StyleSheet.create({
  lowerContainer: {
    flex: 1,
    backgroundColor: colors.white,
    zIndex: 999,
    marginTop: -90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  locationTitle: {
    fontSize: 20,
    fontFamily: fonts.semibold,
  },
  locationText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    textDecorationColor: 'underline',
    textDecorationLine: 'underline',
  },
  paddingHorizontalStyle: {
    paddingHorizontal: 20,
  },
  introCardContainer: {
    // marginTop: 20,
  },
  wishlistContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  reviewTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    marginTop: 30,
    marginBottom: 20,
  },
  flatListContentContainer: {
    marginTop: 30,
  },
  flatListContentContainer2: {
    gap: 20,
    marginLeft: 20,
  },
  mapsImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
});
