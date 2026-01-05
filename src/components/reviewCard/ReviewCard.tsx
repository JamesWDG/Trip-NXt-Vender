import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { ThumbsUp } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';

interface DishDetails {
  image: ImageSourcePropType;
  name: string;
  price: number;
}

interface ReviewCardProps {
  reviewerName: string;
  rating: number; // 1-5
  timestamp: string; // e.g., "2 Days Ago"
  reviewText: string;
  helpfulCount?: number;
  likedDishCount?: number; // e.g., 1 for "liked 1 Dish"
  dishDetails?: DishDetails; // Optional dish details
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewerName,
  rating,
  timestamp,
  reviewText,
  helpfulCount = 0,
  likedDishCount,
  dishDetails,
}) => {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => {
          const isHalfStar = rating >= star - 0.5 && rating < star;
          const isFullStar = rating >= star;
          return (
            <Text key={star} style={styles.star}>
              {isFullStar ? '★' : isHalfStar ? '★' : '☆'}
            </Text>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.card, GeneralStyles.shadow]}>
      {/* Header: Name */}
      <Text style={styles.reviewerName}>{reviewerName}</Text>

      {/* Rating and Timestamp */}
      <View style={styles.ratingContainer}>
        {renderStars()}
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>

      {/* Review Text */}
      <Text style={styles.reviewText}>{reviewText}</Text>

      {/* Liked Dish Indicator and Details */}
      {likedDishCount !== undefined && likedDishCount > 0 && (
        <>
          <Text style={styles.likedDish}>
            liked {likedDishCount} Dish{likedDishCount > 1 ? 'es' : ''}
          </Text>
          {dishDetails && (
            <View style={styles.dishContainer}>
              <Image
                source={dishDetails.image}
                style={styles.dishImage}
                resizeMode="cover"
              />
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{dishDetails.name}</Text>
                <Text style={styles.dishPrice}>
                  {formatPrice(dishDetails.price)}
                </Text>
              </View>
            </View>
          )}
        </>
      )}

      {/* Helpful Count */}
      <View style={styles.helpfulContainer}>
        <ThumbsUp size={16} color={colors.c_666666} />
        <Text style={styles.helpfulText}>Helpful {helpfulCount}</Text>
      </View>
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: colors.c_DDDDDD,
  },
  reviewerName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 16,
    color: '#FFA500', // Orange color for stars
  },
  timestamp: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    marginBottom: 8,
    lineHeight: 20,
  },
  likedDish: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  dishContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 8,
    padding: 12,
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  dishInfo: {
    flex: 1,
  },
  dishName: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    marginBottom: 4,
  },
  dishPrice: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  helpfulContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  helpfulText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
});
