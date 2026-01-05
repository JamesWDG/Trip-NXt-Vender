import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import images from '../../../config/images';
import HotelCard from '../../../components/hotelCard/HotelCard';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import { useNavigation } from '@react-navigation/native';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import labels from '../../../config/labels';

const BookingLogs = () => {
  const navigation = useNavigation<NavigationPropType>();
  return (
    <WrapperContainer title="Booking Logs" navigation={navigation}>
      <View style={styles.mainContainer}>
        <SearchWithFilters
          placeholder={labels.whatareYouLookingFor}
          navigation={navigation}
        />
        <AccomodationTabButtons data={['Hotels', 'Foods', 'Ride']} />
      </View>
      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
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
        keyExtractor={item => item.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </WrapperContainer>
  );
};

export default BookingLogs;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    // marginBottom: 20,
    gap: 16,
    // backgroundColor: 'red',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
    gap: 16,
  },
});
