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
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { updateRegistrationData, resetRegistrationData } from '../../../redux/slices/registrationSlice';
import { useCreateCabVendorMutation } from '../../../redux/services/cabService';
import Toast from 'react-native-toast-message';

const VehicleDocuments = () => {
  const navigation = useNavigation<NavigationPropType>();
  const dispatch = useAppDispatch();
  const registrationData = useAppSelector(state => state.registration);
  const user = useAppSelector(state => state.auth.user);
  const [createCabVendor, { isLoading }] = useCreateCabVendorMutation();

  const [insuranceImage, setInsuranceImage] = useState<string | null>(registrationData.vehicleInsuranceFront);
  const [registrationImage, setRegistrationImage] = useState<string | null>(registrationData.vehicleInsuranceBack);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInsuranceImageChange = (imageUri: string | null) => {
    setInsuranceImage(imageUri);
  };

  const handleRegistrationImageChange = (imageUri: string | null) => {
    setRegistrationImage(imageUri);
  };

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    if (!insuranceImage) newErrors.insuranceImage = 'Vehicle Insurance is required';
    if (!registrationImage) newErrors.registrationImage = 'Vehicle Registration is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    // Handle submit logic
    console.log('Submit vehicle documents');

    const updatedData = {
      ...registrationData,
      vehicleInsuranceFront: insuranceImage,
      vehicleInsuranceBack: registrationImage,
    };

    try {
      const formData = new FormData();

      // Append technical fields
      formData.append('userId', String(user?.id || '1'));
      formData.append('dob', updatedData.dob);
      formData.append('location', updatedData.address || ''); // Sending string address
      formData.append('status', 'pending');
      formData.append('vehicleType', updatedData.vehicleType);
      formData.append('vehicleModal', updatedData.vehicleModal);
      formData.append('vehicleYear', String(updatedData.vehicleYear));
      formData.append('vehicleColor', updatedData.vehicleColor);
      formData.append('vehicleNumber', updatedData.vehicleNumber);

      // Helper function to append file
      const appendFile = (key: string, uri: string | null, defaultName: string) => {
        if (uri) {
          const fileName = uri.split('/').pop() || defaultName;
          formData.append(key, {
            uri: uri,
            name: fileName,
            type: 'image/jpeg',
          } as any);
        }
      };

      // Append files
      appendFile('passportPhoto', updatedData.passportPhoto, 'passport.jpg');
      appendFile('driverLicenseFront', updatedData.driverLicenseFront, 'license_front.jpg');
      appendFile('driverLicenseBack', updatedData.driverLicenseBack, 'license_back.jpg');
      appendFile('vehicleInsuranceFront', updatedData.vehicleInsuranceFront, 'insurance_front.jpg');
      appendFile('vehicleInsuranceBack', updatedData.vehicleInsuranceBack, 'insurance_back.jpg');
      appendFile('vehicleImage', updatedData.vehicleImage, 'vehicle_image.jpg');

      console.log('Final FormData structure before sending:');
      // Note: We can't log FormData contents easily in React Native, but this is the structure

      const response = await createCabVendor(formData).unwrap();
      console.log('Registration success:', response);

      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Your vehicle has been registered and is pending approval.',
      });

      dispatch(resetRegistrationData());

      setTimeout(() => {
        navigation.navigate('MyVehicle');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
    }
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
            initialImage={insuranceImage}
            onImageChange={imageUri => {
              handleInsuranceImageChange(imageUri);
              if (errors.insuranceImage) setErrors({ ...errors, insuranceImage: '' });
            }}
          />
          {errors.insuranceImage && <Text style={styles.errorText}>{errors.insuranceImage}</Text>}
        </View>

        {/* Vehicle Reg Document Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Reg Document</Text>
          <SinglePhotoUpload
            placeholder="Click to Upload Registration Document"
            initialImage={registrationImage}
            onImageChange={imageUri => {
              handleRegistrationImageChange(imageUri);
              if (errors.registrationImage) setErrors({ ...errors, registrationImage: '' });
            }}
          />
          {errors.registrationImage && <Text style={styles.errorText}>{errors.registrationImage}</Text>}
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
  errorText: {
    color: colors.red,
    fontSize: 12,
    fontFamily: fonts.bold,
    marginTop: 8,
    textAlign: 'center',
  },
});
