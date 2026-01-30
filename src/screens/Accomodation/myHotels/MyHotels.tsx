import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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
        <FlatList
          data={myHotels}
          ListEmptyComponent={() => {
            return (
              <>
                {/* Blue Banner */}
                <View style={styles.bannerContainer}>
                  <Text style={styles.bannerTitle}>
                    Please Register Your Hotel.
                  </Text>
                  <Text style={styles.bannerSubtitle}>
                    You will be able to view your registered hotel details here
                  </Text>
                </View>
                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                  <Image
                    source={images.no_hotel}
                    style={styles.illustration}
                    resizeMode="contain"
                  />
                </View>
              </>
            );
          }}
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
                /* handle navigation */
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={onPressAddHotel}>
        <Plus color={colors.white} />
      </TouchableOpacity>
      {
        loading && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={colors.white} />
            </View>
          </View>
        )
      }
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
  loadingContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loadingContent: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
