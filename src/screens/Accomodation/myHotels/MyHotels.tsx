import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import { useNavigation } from '@react-navigation/native';
import HotelCard from '../../../components/hotelCard/HotelCard';
import images from '../../../config/images';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { width, height, ShowToast } from '../../../config/constants';
import { Plus } from 'lucide-react-native';
import { useLazyGetMyHotelQuery } from '../../../redux/services/hotelService';
import { Hotel } from '../../../contants/Accomodation';

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
  return <Animated.View style={[skeletonStyles.box, style, { opacity }]} />;
};

const skeletonStyles = StyleSheet.create({
  box: { backgroundColor: colors.c_F3F3F3 },
  card: { borderRadius: 12, overflow: 'hidden' as const, marginBottom: 16 },
  image: { width: '100%', height: 160, borderRadius: 0 },
  content: { padding: 16 },
  title: { width: '70%', height: 20, borderRadius: 6 },
  line: { width: '90%', height: 14, borderRadius: 6 },
  lineShort: { width: '50%', height: 12, borderRadius: 6 },
  featuresRow: { flexDirection: 'row' as const, gap: 12, marginTop: 12 },
  feature: { width: 40, height: 24, borderRadius: 6 },
});

const HotelCardSkeleton = () => (
  <View style={skeletonStyles.card}>
    <SkeletonBox style={skeletonStyles.image} />
    <View style={skeletonStyles.content}>
      <SkeletonBox style={skeletonStyles.title} />
      <SkeletonBox style={[skeletonStyles.line, { marginTop: 8 }]} />
      <SkeletonBox style={[skeletonStyles.lineShort, { marginTop: 6 }]} />
      <View style={skeletonStyles.featuresRow}>
        <SkeletonBox style={skeletonStyles.feature} />
        <SkeletonBox style={skeletonStyles.feature} />
        <SkeletonBox style={skeletonStyles.feature} />
      </View>
      <SkeletonBox style={[skeletonStyles.lineShort, { marginTop: 10 }]} />
    </View>
  </View>
);

const MyHotels = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [myHotels, setMyHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [getMyHotel, { isLoading }] = useLazyGetMyHotelQuery();

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
  const onPressAddHotel = () => {
    navigation.navigate('Accomodation', { screen: 'AddHotel' });
  };
  return (
    <WrapperContainer title="My Hotels" navigation={navigation}>
      <View style={{ height: height * 0.83 }}>
        {loading ? (
          <View style={styles.listContainer}>
            <HotelCardSkeleton />
            <HotelCardSkeleton />
            <HotelCardSkeleton />
          </View>
        ) : (
          <FlatList
            data={myHotels}
            ListEmptyComponent={() => (
              <>
                <View style={styles.bannerContainer}>
                  <Text style={styles.bannerTitle}>
                    Please Register Your Hotel.
                  </Text>
                  <Text style={styles.bannerSubtitle}>
                    You will be able to view your registered hotel details here
                  </Text>
                </View>
                <View style={styles.illustrationContainer}>
                  <Image
                    source={images.no_hotel}
                    style={styles.illustration}
                    resizeMode="contain"
                  />
                </View>
              </>
            )}
            renderItem={({ item }) => (
              <HotelCard
                image={item.images.length > 0 ? item.images[0] : images.placeholder}
                hotelName={item.name}
                rentPerDay={item.rentPerDay}
                rentPerHour={item.rentPerHour}
                rating={4.5}
                beds={item.numberOfBeds}
                baths={item.numberOfBathrooms}
                parking={item.numberOfGuests}
                location={"Kingdom Tower, Brazil"}
                onPress={() => {
                navigation.navigate('Accomodation', {
                  screen: 'HotelDetails',
                  params: { hotel: item },
                });
              }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={onPressAddHotel}>
        <Plus color={colors.white} />
      </TouchableOpacity>
    </WrapperContainer>
  );
};

export default MyHotels;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  bannerContainer: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  illustration: {
    width: width * 0.9,
    height: height * 0.4,
  },
  mainContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    gap: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
    gap: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 100,
    padding: 10,
  },
});
