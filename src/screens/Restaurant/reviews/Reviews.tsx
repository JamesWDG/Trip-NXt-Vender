import {
  ActivityIndicator,
  FlatList,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import RestaurantTabButtons from '../../../components/restaurantTabButtons/RestaurantTabButtons';
import ReviewCard from '../../../components/reviewCard/ReviewCard';
import { useLazyGetRestaurantReviewsQuery } from '../../../redux/services/reviewService';
import GeneralStyles from '../../../utils/GeneralStyles';
import fonts from '../../../config/fonts';
import { formatRelativeTime } from '../../../utils/utility';
import images from '../../../config/images';

type ApiUser = {
  id: number;
  name?: string;
  profilePicture?: string | null;
};

type ApiReview = {
  id: number;
  user?: ApiUser;
  rating: number;
  comment?: string;
  createdAt: string;
};

type ApiDish = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
};

type DishReviewsGroup = {
  dish: ApiDish;
  reviews: ApiReview[];
};

type FlatReviewRow = {
  id: number;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  dishDetails: {
    image: ImageSourcePropType;
    name: string;
    price: number;
  };
};

function normalizeGroups(payload: unknown): DishReviewsGroup[] {
  if (Array.isArray(payload)) return payload as DishReviewsGroup[];
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const d = (payload as { data: unknown }).data;
    if (Array.isArray(d)) return d as DishReviewsGroup[];
  }
  return [];
}

function flattenDishReviews(groups: DishReviewsGroup[]): FlatReviewRow[] {
  const rows: FlatReviewRow[] = [];
  for (const group of groups) {
    const dish = group?.dish;
    const reviews = group?.reviews;
    if (!dish || !Array.isArray(reviews)) continue;
    for (const rev of reviews) {
      const imageUri = dish.image?.trim();
      rows.push({
        id: rev.id,
        reviewerName: rev.user?.name?.trim() || 'Anonymous',
        rating: Number(rev.rating) || 0,
        comment: (rev.comment ?? '').trim(),
        createdAt: rev.createdAt,
        dishDetails: {
          image: imageUri ? { uri: imageUri } : images.placeholder,
          name: dish.name,
          price: Number(dish.price) || 0,
        },
      });
    }
  }
  return rows;
}

const Reviews = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [getRestaurantReviews, { data, isLoading }] =
    useLazyGetRestaurantReviewsQuery();

  const flatListData = useMemo(() => {
    const groups = normalizeGroups(data);
    return flattenDishReviews(groups);
  }, [data]);

  useEffect(() => {
    fetchRestaurantReviews();
  }, []);

  const fetchRestaurantReviews = async () => {
    try {
      await getRestaurantReviews(undefined).unwrap();
    } catch (error) {
      console.log('restaurant reviews error ===>', error);
    }
  };

  return (
    <WrapperContainer title="Reviews" navigation={navigation}>
      <View style={styles.tabContainer}>
        <RestaurantTabButtons
          data={['Top Reviews', 'Newest', 'Highest Rating', 'Lowest Rating']}
        />
      </View>
      {isLoading ? (
        <View
          style={[
            GeneralStyles.flex,
            GeneralStyles.justifyContent,
            GeneralStyles.alignItems,
          ]}
        >
          <ActivityIndicator size="large" color="#0162C0" />
        </View>
      ) : (
        <FlatList
          data={flatListData}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ReviewCard
              reviewerName={item.reviewerName}
              rating={item.rating}
              timestamp={formatRelativeTime(item.createdAt) || '—'}
              reviewText={item.comment}
              helpfulCount={0}
              dishDetails={item.dishDetails}
            />
          )}
          keyExtractor={item => String(item.id)}
        />
      )}
    </WrapperContainer>
  );
};

export default Reviews;

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontFamily: fonts.medium,
  },
});
