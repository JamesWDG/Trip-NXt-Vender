import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating-widget';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

interface Params {
  name: string;
  rating: number;
  time: string;
  image: string;
  description: string;
  otherStyles?: StyleProp<ViewStyle>;
}
const ReviewCard = ({
  name,
  rating,
  time,
  image,
  description,
  otherStyles,
}: Params) => {
  return (
    <View style={[styles.container, otherStyles]}>
      <View style={styles.imageContainer}>
        <FastImage source={image} style={styles.image} resizeMode="cover" />
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <StarRating
          rating={rating}
          onChange={() => {}}
          starSize={14}
          starStyle={styles.starRating}
        />
        <Text style={styles.time}>{time}</Text>
      </View>

      <Text numberOfLines={3} style={styles.description}>
        {description}
      </Text>
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  time: { fontSize: 10, fontFamily: fonts.medium },
  description: { fontSize: 12, lineHeight: 19, marginTop: 12 },
  imageContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: { fontSize: 14, fontFamily: fonts.medium },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  container: {
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000000', // black color
    shadowOffset: { width: 0, height: 1 }, // 0px 1px
    shadowOpacity: 0.1, // #00000026 = 15% opacity (26 hex = ~15%)
    shadowRadius: 12, // blur radius
    elevation: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.c_666666,
  },
  image: {
    height: 40,
    width: 40,
  },
  starRating: {
    gap: 0,
    padding: 0,
    margin: 0,
  },
});
