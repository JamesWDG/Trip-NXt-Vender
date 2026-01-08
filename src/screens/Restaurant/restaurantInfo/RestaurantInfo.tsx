import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  Edit,
  UtensilsCrossed,
  Star,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react-native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import { useLazyGetAuthUserRestaurantQuery } from '../../../redux/services/restaurantService';

const RestaurantInfo = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const [getRestaurant, { data: restaurantData, isLoading }] = useLazyGetAuthUserRestaurantQuery();

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const res = await getRestaurant({}).unwrap();
      console.log('restaurant data ===>', res);
    } catch (error) {
      console.log('error ===>', error);
    }
  };

  // Extract restaurant data from API response
  const restaurant = restaurantData?.data?.restaurant;
  const location = restaurant?.location?.[0];
  
  // Format address from location object
  const formatAddress = () => {
    if (!location) return '';
    const parts = [
      location.address,
      location.city,
      location.state,
      location.country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const restaurantInfo = {
    name: restaurant?.name || '',
    ownerName: restaurant?.owner?.name || '',
    phone: restaurant?.phoneNumber || '',
    email: restaurant?.owner?.email || '',
    address: formatAddress(),
    description: restaurant?.description || '',
    rating: 4.5, // Not in API response, keeping default
    totalReviews: 128, // Not in API response, keeping default
    logo: restaurant?.logo,
  };

  const handleEdit = () => {
    navigation.navigate('RestaurantDetails');
  };

  const handleMenus = () => {
    navigation.navigate('Menu');
  };

  const handleShowReviews = () => {
    navigation.navigate('Reviews');
  };

  console.log(restaurantInfo, 'restaurantInforestaurantInforestaurantInfo');

  return (
    <WrapperContainer title="Restaurant Information" navigation={navigation}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
       

        {/* Restaurant Image/Logo */}
        <View style={styles.imageContainer}>
          <Image
            source={
              restaurantInfo.logo
                ? { uri: restaurantInfo.logo }
                : { uri: restaurantInfo.logo }
            }
            style={styles.restaurantImage}
            resizeMode="cover"
          />
        </View>

        {/* Restaurant Name */}
        <Text style={styles.restaurantName}>{restaurantInfo.name}</Text>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Star size={16} color={colors.c_F47E20} fill={colors.c_F47E20} />
          <Text style={styles.ratingText}>
            {restaurantInfo.rating} ({restaurantInfo.totalReviews} reviews)
          </Text>
        </View>

        {/* Info Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <User size={18} color={colors.c_0162C0} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Owner Name</Text>
              <Text style={styles.detailValue}>{restaurantInfo.ownerName}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Phone size={18} color={colors.c_0162C0} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{restaurantInfo.phone}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Mail size={18} color={colors.c_0162C0} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{restaurantInfo.email}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MapPin size={18} color={colors.c_0162C0} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{restaurantInfo.address}</Text>
            </View>
          </View>

          <View style={styles.descriptionRow}>
            <View style={styles.iconContainer}>
              <FileText size={18} color={colors.c_0162C0} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text
                style={styles.detailValue}
                numberOfLines={4}
                ellipsizeMode="tail"
              >
                {restaurantInfo.description}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEdit}
            activeOpacity={0.8}
          >
            <View style={styles.buttonIconContainer}>
              <Edit size={22} color={colors.white} />
            </View>
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleMenus}
            activeOpacity={0.8}
          >
            <View style={styles.buttonIconContainer}>
              <UtensilsCrossed size={22} color={colors.white} />
            </View>
            <Text style={styles.actionButtonText}>Menus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.reviewsButton]}
            onPress={handleShowReviews}
            activeOpacity={0.8}
          >
            <View style={styles.buttonIconContainer}>
              <Star size={22} color={colors.white} fill={colors.white} />
            </View>
            <Text style={styles.actionButtonText}>Show Reviews</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default RestaurantInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
  
  },
  restaurantName: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    textAlign: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  detailsContainer: {
    gap: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.c_666666,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    lineHeight: 22,
  },
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.c_0162C0,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 24,
    shadowColor: colors.c_0162C0,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  reviewsButton: {
    backgroundColor: colors.c_F47E20,
    shadowColor: colors.c_F47E20,
  },
  buttonIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
    letterSpacing: 0.3,
  },
});
