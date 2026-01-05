import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Edit, UtensilsCrossed, Star } from 'lucide-react-native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';

const RestaurantInfo = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  // Sample restaurant data - in real app, this would come from API/state
  const [restaurantInfo] = useState({
    name: 'The Gourmet Kitchen',
    ownerName: 'John Doe',
    phone: '+1 234 567 8900',
    email: 'contact@gourmetkitchen.com',
    address: '123 Main Street, New York, NY 10001',
    description:
      'A fine dining restaurant serving authentic cuisine with a modern twist.',
    rating: 4.5,
    totalReviews: 128,
  });

  const handleEdit = () => {
    navigation.navigate('RestaurantDetails');
  };

  const handleMenus = () => {
    navigation.navigate('Menu');
  };

  const handleShowReviews = () => {
    navigation.navigate('Reviews');
  };

  return (
    <WrapperContainer title="Restaurant Information" navigation={navigation}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Edit Button */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Restaurant Information</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <Edit size={18} color={colors.c_0162C0} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Restaurant Info Card */}
        <View style={styles.infoCard}>
          {/* Restaurant Image/Logo */}
          <View style={styles.imageContainer}>
            <Image
              source={images.placeholder}
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
              <Text style={styles.detailLabel}>Owner Name:</Text>
              <Text style={styles.detailValue}>{restaurantInfo.ownerName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{restaurantInfo.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{restaurantInfo.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address:</Text>
              <Text style={styles.detailValue}>{restaurantInfo.address}</Text>
            </View>
            <View style={styles.descriptionRow}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.detailValue}>
                {restaurantInfo.description}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleMenus}
            activeOpacity={0.8}
          >
            <UtensilsCrossed size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Menus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.reviewsButton]}
            onPress={handleShowReviews}
            activeOpacity={0.8}
          >
            <Star size={20} color={colors.white} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.c_F3F3F3,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_0162C0,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.c_F3F3F3,
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
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  descriptionRow: {
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    flex: 1,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
    paddingHorizontal: 20,
  },
  reviewsButton: {
    backgroundColor: colors.c_F47E20,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
});
