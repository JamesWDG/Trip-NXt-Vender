import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import PrimaryHeader from '../../components/primaryHeader/PrimaryHeader';
import MainCarousel from '../../components/mainCarousel/MainCarousel';
import DetailsCard from '../../components/detailsCard/DetailsCard';
import { CarouselData, Hotel } from '../../contants/Accomodation';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';
import images from '../../config/images';
import ReviewCard from '../Accomodation/reviewCard/ReviewCard';
import { width } from '../../config/constants';
import FastImage from 'react-native-fast-image';
import { useGetHotelByIdQuery } from '../../redux/services/hotelService';
import { useGetHotelReviewsQuery } from '../../redux/services/reviewService';

const defaultCarouselData: CarouselData[] = [{ id: '0', image: '', title: 'Hotel', description: '' }];

const HotelDetails = ({ navigation }: { navigation?: any }) => {
  const { top } = useSafeAreaInsets();
  const route = useRoute<any>();
  const { data: reviews, isLoading: isReviewsLoading } = useGetHotelReviewsQuery(route.params.hotel.id!, {
    skip: route.params.hotel.id == null || route.params.hotel.id === undefined,
  });

  const { data: fetchedHotel, isLoading: isHotelLoading } = useGetHotelByIdQuery(route.params.hotel.id!, {
    skip: route.params.hotel.id == null || route.params.hotel.id === undefined,
  });

  const hotel: Hotel | undefined = (fetchedHotel as Hotel) ?? route.params.hotel;

  const wishlistButtonStyles = useMemo(() => {
    return wishlistButton(top);
  }, [top]);

  const locationStr = hotel
    ? `${(hotel as any)?.location?.city ?? ''}, ${(hotel as any)?.location?.state ?? ''} ${(hotel as any)?.location?.country ?? ''}`.trim() || '—'
    : 'Las Vegas, NV, USA';

    useEffect(() => {
      console.log(route.params.hotel.id, 'hotelId', route.params);
      if (reviews) {
        console.log('reviews ===>', reviews);
      }
    }, [reviews]);

  if (route.params.hotel.id != null && isHotelLoading && !route.params.hotel) {
    return (
      <View style={GeneralStyles.flex as ViewStyle}>
        <View style={styles.headerContainer}>
          <PrimaryHeader title="Hotel Details" onBackPress={() => navigation?.goBack?.()} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={GeneralStyles.flex as ViewStyle}>
      <View style={styles.headerContainer}>
        <PrimaryHeader
          title="Hotel Details"
          onBackPress={() => navigation?.goBack?.()}
        />
      </View>
      <View style={wishlistButtonStyles.carouselContainer}>
        {hotel?.images?.length ? (
          <FlatList
            data={hotel.images}
            horizontal
            pagingEnabled
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carouselImage} resizeMode="cover" />
            )}
          />
        ) : (
          <MainCarousel data={defaultCarouselData} />
        )}
      </View>

      <View style={styles.lowerContainer}>
        <ScrollView
          style={GeneralStyles.flex}
          contentContainerStyle={wishlistButtonStyles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <DetailsCard
            title={hotel?.name ?? 'Lux Hotel Casino'}
            reviews={hotel?.reviewCount ?? 0}
            rating={hotel.avgRating}
            price={hotel?.rentPerDay}
            location={locationStr}
            description={hotel?.description}
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
              data={reviews?.data?.reviews}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <ReviewCard
                  name={item.user.name}
                  rating={item.rating}
                  time={item.createdAt}
                  image={item.user.profilePicture}
                  otherStyles={{ width: width * 0.75 }}
                  description={item?.comment ?? ''}
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

const wishlistButton = (top: number) =>
  StyleSheet.create({
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  carouselImage: {
    width: width,
    height: 220,
  },
});
