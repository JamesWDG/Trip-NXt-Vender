import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import { useNavigation } from '@react-navigation/native';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import HotelCard from '../../../components/hotelCard/HotelCard';
import images from '../../../config/images';
import labels from '../../../config/labels';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { width, height } from '../../../config/constants';
import { Plus } from 'lucide-react-native';

const MyHotels = () => {
  const navigation = useNavigation<NavigationPropType>();
  const onPressAddHotel = () => {
    navigation.navigate('Accomodation', { screen: 'AddHotel' });
  };
  return (
    <WrapperContainer title="My Hotels" navigation={navigation}>
      <FlatList
        data={[]}
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
            image={images.apartment}
            hotelName="Lux Hotel Casino"
            price="$180"
            rating={4.5}
            beds={3}
            baths={2}
            parking={2}
            location="Kingdom Tower, Brazil"
            onPress={() => {
              /* handle navigation */
            }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

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
    paddingBottom: 40,
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
