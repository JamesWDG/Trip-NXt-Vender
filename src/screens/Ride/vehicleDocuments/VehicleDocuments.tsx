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

const VehicleDocuments = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [insuranceImage, setInsuranceImage] = useState<string | null>(null);
  const [registrationImage, setRegistrationImage] = useState<string | null>(
    null,
  );

  const handleInsuranceImageChange = (imageUri: string | null) => {
    setInsuranceImage(imageUri);
  };

  const handleRegistrationImageChange = (imageUri: string | null) => {
    setRegistrationImage(imageUri);
  };

  const handleSubmit = () => {
    // Handle submit logic
    console.log('Submit vehicle documents');
    navigation.navigate('VehicleRegistration');
  };

  return (
    <WrapperContainer navigation={navigation} title="Vehicle Documents">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Vehicle Insurance Paper Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Insurance Paper</Text>
          <SinglePhotoUpload
            placeholder="Click to Upload Insurance"
            onImageChange={handleInsuranceImageChange}
          />
        </View>

        {/* Vehicle Reg Document Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Reg Document</Text>
          <SinglePhotoUpload
            placeholder="Click to Upload Registration Document"
            onImageChange={handleRegistrationImageChange}
          />
        </View>

        {/* Document Previews */}
        {(insuranceImage || registrationImage) && (
          <View style={styles.previewContainer}>
            {insuranceImage && (
              <View style={styles.previewItem}>
                <Image
                  source={{ uri: insuranceImage }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <Text style={styles.previewLabel}>Insurance</Text>
              </View>
            )}
            {registrationImage && (
              <View style={styles.previewItem}>
                <Image
                  source={{ uri: registrationImage }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <Text style={styles.previewLabel}>Registration</Text>
              </View>
            )}
          </View>
        )}

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

export default VehicleDocuments;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
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
  previewContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  previewItem: {
    flex: 1,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    marginBottom: 8,
  },
  previewLabel: {
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
