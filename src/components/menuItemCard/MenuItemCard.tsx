import {
  Image,
  ImageSourcePropType,
  ImageURISource,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Edit, Star, Trash2 } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

interface MenuItemCardProps {
  id: number;
  category: string;
  image: ImageURISource | string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  onPress?: () => void;
  onDelete?: (id: number) => void;
  extraToppings: {
    id: number;
    name: string;
    price: number;
    description: string
  }[]
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  category,
  image,
  name,
  description,
  price,
  rating,
  reviewCount,
  onPress,
  onDelete,
  extraToppings,
}) => {
  const navigation = useNavigation<NavigationProp<ParamListBase, string>>();
  const formatPrice = (amt: number) => {
    return `$${amt.toFixed(1)}`;
  };
  const handleEditItem = () => {
    navigation.navigate('MenuImage', {
      type: 'edit',
      id: id,
      name: name,
      description: description,
      price: price,
      image: image as string,
      category: category,
      extraToppings: extraToppings,
    })
  }
  const handleDeleteItem = () => {
    onDelete?.(id);
  }

  return (
    <TouchableOpacity
      style={[styles.card, GeneralStyles.shadow]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: image as string }} style={styles.menuImage} resizeMode="cover" />
      <View style={styles.contentContainer}>
        <View style={styles.itemNameContainer}>
          <Text style={styles.itemName}>{name}</Text>
          <View style={styles.actionContainer}>
            <Pressable onPress={handleDeleteItem}>
              <Trash2 size={16} color={colors.red} />
            </Pressable>
            <Pressable onPress={handleEditItem}>
              <Edit size={16} color={colors.black} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
        <Text style={styles.price}>{formatPrice(price)}</Text>
        {/* <View style={styles.ratingContainer}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
          <Text style={styles.ratingText}>
            {rating} ({reviewCount} reviews)
          </Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

export default MenuItemCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 2,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
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
    justifyContent: 'space-around',
  },
  itemNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  description: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    // marginBottom: 8,
    lineHeight: 18,
  },
  price: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
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


















