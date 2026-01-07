import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Star } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';

interface MenuItemCardProps {
  image: ImageSourcePropType;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  onPress?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  image,
  name,
  description,
  price,
  rating,
  reviewCount,
  onPress,
}) => {
  const formatPrice = (amt: number) => {
    return `$${amt.toFixed(1)}`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, GeneralStyles.shadow]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={image} style={styles.menuImage} resizeMode="cover" />
      <View style={styles.contentContainer}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.price}>{formatPrice(price)}</Text>
        <View style={styles.ratingContainer}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
          <Text style={styles.ratingText}>
            {rating} ({reviewCount} reviews)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MenuItemCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: colors.c_DDDDDD,
  },
  menuImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.c_F3F3F3,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 8,
    lineHeight: 18,
  },
  price: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
});














