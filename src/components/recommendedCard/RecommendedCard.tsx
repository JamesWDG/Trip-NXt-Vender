import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import images from '../../config/images';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import {
  Bath,
  Bed,
  BedDouble,
  CarFront,
  Star as StarIcon,
} from 'lucide-react-native';

const DummyPage = () => {
  return (
    <View>
      <RecommendedCard
        image={images.recommended_accomodation}
        title="Book Your Place"
        description="Book Your Place"
        price={100}
        rating={4.5}
        location={'Kingdom Tower, Brazil'}
        onPress={() => {}}
      />
      <RecommendedCard
        image={images.bookYourPlace}
        title="Book Your Place"
        description="Book Your Place"
        price={100}
        rating={4.5}
        location={'Kingdom Tower, Brazil'}
        onPress={() => {}}
      />
    </View>
  );
};

export default DummyPage;

export const RecommendedCard = ({
  image,
  title,
  description,
  price,
  rating,
  location,
  onPress,
  otherStyles,
}: {
  image: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  location: string;
  onPress: () => void;
  otherStyles?: StyleProp<ViewStyle>;
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, styles.box, otherStyles]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View>
        <Image
          source={image as ImageSourcePropType}
          style={{ width: 120, height: 150, borderRadius: 12 }}
          resizeMode="cover"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
          <View style={styles.ratingContainer}>
            <Image source={images.star} style={{ width: 10, height: 10 }} />
            <Text style={styles.rating}>{rating}</Text>
          </View>
        </View>
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <BedDouble size={20} color={'#F47E20'} />
            <Text style={styles.featureItemText}>{12} Beds</Text>
          </View>
          <View style={styles.featureItem}>
            <Bath size={20} color={'#F47E20'} />
            <Text style={styles.featureItemText}>{12} Baths</Text>
          </View>
          <View style={styles.featureItem}>
            <CarFront size={20} color={'#F47E20'} />
            <Text style={styles.featureItemText}>{12} Parkings</Text>
          </View>
        </View>
        <Text style={styles.location}>{location}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    borderWidth: 0.5,
    borderColor: colors.c_666666,
  },
  featureItemText: {
    fontFamily: fonts.normal,
    fontSize: 12,
    color: colors.c_666666,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 10,
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  descriptionContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  location: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  box: {
    backgroundColor: '#fff',
    shadowColor: '#000000', // black color
    shadowOffset: { width: 0, height: 1 }, // 0px 1px
    shadowOpacity: 0.15, // #00000026 = 15% opacity (26 hex = ~15%)
    shadowRadius: 12, // blur radius
    elevation: 5, // for Android shadow
    borderRadius: 12,
    padding: 16,
  },
  infoContainer: {
    // gap: 5,
    // flexWrap: 'wrap',
    // backgroundColor: 'red',
    flex: 1,
    maxWidth: '62%',
    // overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  rating: {
    fontSize: 12,
    fontFamily: fonts.normal,
  },
});
