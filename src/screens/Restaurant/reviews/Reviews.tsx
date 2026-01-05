import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import RestaurantTabButtons from '../../../components/restaurantTabButtons/RestaurantTabButtons';
import ReviewCard from '../../../components/reviewCard/ReviewCard';
import images from '../../../config/images';

const Reviews = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const reviewsData = [
    {
      id: '1',
      reviewerName: 'Floyd Miles',
      rating: 5,
      timestamp: '2 Days Ago',
      reviewText: 'Improve Chicken Quality',
      helpfulCount: 8,
      likedDishCount: 1,
      dishDetails: {
        image: images.placeholder, // You can replace with actual burger image
        name: '1 Zinger Cheez Crispy Burger',
        price: 150.0,
      },
    },
    {
      id: '2',
      reviewerName: 'Floyd Miles',
      rating: 4,
      timestamp: '4 Days Ago',
      reviewText:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      helpfulCount: 8,
    },
    {
      id: '3',
      reviewerName: 'Floyd Miles',
      rating: 5,
      timestamp: '1 Week Ago',
      reviewText: 'Improve Chicken Quality',
      helpfulCount: 8,
      likedDishCount: 1,
      dishDetails: {
        image: images.placeholder,
        name: '1 chicken sandwich Cheez Crispy Burger',
        price: 150.0,
      },
    },
    {
      id: '4',
      reviewerName: 'Floyd Miles',
      rating: 4,
      timestamp: '4 Days Ago',
      reviewText:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      helpfulCount: 8,
    },
  ];

  return (
    <WrapperContainer title="Reviews" navigation={navigation}>
      <View style={styles.tabContainer}>
        <RestaurantTabButtons
          data={['Top Reviews', 'Newest', 'Highest Rating', 'Lowest Rating']}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={reviewsData}
          renderItem={({ item }) => (
            <ReviewCard
              reviewerName={item.reviewerName}
              rating={item.rating}
              timestamp={item.timestamp}
              reviewText={item.reviewText}
              helpfulCount={item.helpfulCount}
              likedDishCount={item.likedDishCount}
              dishDetails={item.dishDetails}
            />
          )}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      </ScrollView>
    </WrapperContainer>
  );
};

export default Reviews;

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
