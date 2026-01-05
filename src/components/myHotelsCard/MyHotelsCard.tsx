import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';
import { width } from '../../config/constants';
import images from '../../config/images';

interface MyHotelsCardProps {
  title?: string;
  monthLabel?: string;
  date?: string;
  badgeCount?: number;
  onPress?: () => void;
}

const MyHotelsCard: React.FC<MyHotelsCardProps> = ({
  title = 'My Hotels',
  monthLabel = 'Month',
  date = 'December 2023',
  badgeCount = 1,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, GeneralStyles.shadow]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Badge */}
      {/* <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {badgeCount.toString().padStart(2, '0')}
        </Text>
      </View> */}

      <ImageBackground source={images.Ellipse} style={styles.imageBackground}>
        <Text style={styles.badgeText}>
          {badgeCount.toString().padStart(2, '0')}
        </Text>
      </ImageBackground>

      {/* Bed Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.bedIcon}>🛏️</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Month Label */}
      <Text style={styles.monthLabel}>{monthLabel}</Text>

      {/* Date */}
      <Text style={styles.date}>{date}</Text>
    </TouchableOpacity>
  );
};

export default MyHotelsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.c_F59523,
    borderRadius: 12,
    minWidth: 32,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  iconContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  bedIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 4,
  },
  monthLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  imageBackground: {
    height: 50,
    width: 50,
    borderRadius: 100,
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingBottom: 10,
  },
});
