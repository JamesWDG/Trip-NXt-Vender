import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import SinglePhotoUpload from '../../../components/singlePhotoUpload/SinglePhotoUpload';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';

const DriverDocuments = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  const handleFrontImageChange = (imageUri: string | null) => {
    setFrontImage(imageUri);
  };

  const handleBackImageChange = (imageUri: string | null) => {
    setBackImage(imageUri);
  };

  const handleSubmit = () => {
    // Handle submit logic
    console.log('Submit driver documents');
    navigation.navigate('VehicleDocuments');
  };

  return (
    <WrapperContainer navigation={navigation} title="Driver Documents">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Front Side Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Driver's License Photo (Front)
          </Text>
          <SinglePhotoUpload
            placeholder="Click to Upload Front Side"
            onImageChange={handleFrontImageChange}
          />
        </View>

        {/* Back Side Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver's License Photo (Back)</Text>
          <SinglePhotoUpload
            placeholder="Click to Upload Back Side"
            onImageChange={handleBackImageChange}
          />
        </View>

        {/* License Photo Preview Section */}
        <View style={styles.exampleContainer}>
          <View style={styles.imagesRow}>
            <View style={styles.imagePreviewContainer}>
              {frontImage ? (
                <Image
                  source={{ uri: frontImage }}
                  style={styles.exampleImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>No image uploaded</Text>
                </View>
              )}
            </View>
            <View style={styles.imagePreviewContainer}>
              {backImage ? (
                <Image
                  source={{ uri: backImage }}
                  style={styles.exampleImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>No image uploaded</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Status: Pending Approval</Text>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <GradientButtonForAccomodation
            title="Submit"
            onPress={handleSubmit}
            fontSize={16}
            fontFamily={fonts.bold}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default DriverDocuments;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
  },
  exampleContainer: {
    marginBottom: 24,
    width: '100%',
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.c_F3F3F3,
    width: '100%',
    padding: 12,
    borderRadius: 12,
  },
  imagePreviewContainer: {
    flex: 1,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  exampleImage: {
    width: '100%',
    minHeight: 120,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
  },
  placeholderImage: {
    width: '100%',
    // height: 200,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.lightGray,
  },
  placeholderText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  statusContainer: {
    backgroundColor: '#FFF9E6', // Light yellow
    borderRadius: 100,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#8B6914', // Dark brown/orange
  },
  buttonContainer: {
    marginTop: 8,
  },
});
