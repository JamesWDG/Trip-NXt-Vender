import {
  Image,
  ImageSourcePropType,
  ImageURISource,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { width } from '../../config/constants';
import GeneralStyles from '../../utils/GeneralStyles';

interface HotelCardProps {
  image: ImageSourcePropType | string | ImageURISource;
  hotelName: string;
  rentPerDay: number;
  rentPerHour: number;
  rating: number;
  beds: number;
  baths: number;
  parking: number;
  location: string;
  show?: boolean;
  onPress?: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({
  image,
  hotelName,
  rentPerDay,
  rentPerHour,
  rating,
  beds,
  baths,
  parking,
  location,
  onPress,
  show = true,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, GeneralStyles.shadow]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.hotelImage} resizeMode="cover" />
      <View style={styles.contentContainer}>
        <Text style={styles.hotelName}>{hotelName}</Text>
        <View style={styles.priceRatingContainer}>
          <Text style={styles.priceRating}>
            Rent Per Day: ${rentPerDay}
          </Text>
          <Text style={styles.priceRating}>
            Rent Per Hour: ${rentPerHour}
          </Text>
        </View>
        {
          show ? <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🛏️</Text>
            <Text style={styles.featureText}>{beds}</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🛁</Text>
            <Text style={styles.featureText}>{baths}</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>👥</Text>
            <Text style={styles.featureText}>{parking}</Text>
          </View>
        </View>:null
        }
        <Text style={styles.location} numberOfLines={1} ellipsizeMode="tail">{location}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default HotelCard;

const styles = StyleSheet.create({
  card: {
    padding: 5,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.c_666666,

    // overflow: 'hidden',
    // marginVertical: 14,
  },
  hotelImage: {
    width: '40%',
    height: '100%',
    borderRadius: 12,
  },
  contentContainer: {
    flex: 1,
    padding: 5,

    // justifyContent: 'space-between',
  },
  hotelName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
  },
  priceRatingContainer: {
    marginBottom: 16,
  },
  priceRating: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  featuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 6,
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureIcon: {
    fontSize: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.c_F59523,
  },
  location: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
});
