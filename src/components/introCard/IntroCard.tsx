import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import Divider from '../divider/Divider';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface Params {
  name: string;
  image: string;
  description: string;
  designation: string;
  reviews: number;
  rating: number;
  yearsHosting: number;
}
const IntroCard = ({
  name,
  image,
  description,
  designation,
  reviews,
  rating,
  yearsHosting,
}: Params) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <FastImage
          source={image as ImageSourcePropType}
          style={styles.logo}
          resizeMode="cover"
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.designation} numberOfLines={2}>
          {designation}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.reviewsContainer}>
          <Text style={styles.yearsHostingTitle}>{reviews}</Text>
          <Text style={styles.yearsHostingText}> Reviews</Text>
        </View>
        <Divider height={0.5} color={colors.gray} width={'100%'} />
        <View style={styles.reviewsContainer}>
          <Text style={styles.yearsHostingTitle}>{rating}</Text>
          <Text style={styles.yearsHostingText}> Ratings</Text>
        </View>
        <Divider height={0.5} color={colors.gray} width={'100%'} />
        <View style={styles.reviewsContainer}>
          <Text style={styles.yearsHostingTitle}>{yearsHosting}</Text>
          <Text style={styles.yearsHostingText}> Years hosting</Text>
        </View>
      </View>
    </View>
  );
};

export default IntroCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: '#000000', // black color
    shadowOffset: { width: 0, height: 1 }, // 0px 1px
    shadowOpacity: 0.15, // #00000026 = 15% opacity (26 hex = ~15%)
    shadowRadius: 12, // blur radius
    elevation: 5,
    borderWidth: 0.5,
    borderColor: colors.c_666666,
  },
  logoContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    flex: 0.5,
    gap: 10,
  },
  logo: {
    height: 100,
    width: 100,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.semibold,
  },
  designation: {
    fontSize: 12,
    fontFamily: fonts.normal,
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 0.5,
  },
  yearsHostingText: {
    fontSize: 12,
    fontFamily: fonts.normal,
  },
  yearsHostingTitle: {
    fontSize: 18,
    fontFamily: fonts.medium,
  },
  reviewsContainer: {
    gap: 3,
    marginVertical: 7,
  },
});
