import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import CustomTextInput from '../../../components/customTextInput/CustomTextInput';
import SelectInput from '../../../components/selectInput/SelectInput';
import SinglePhotoUpload from '../../../components/singlePhotoUpload/SinglePhotoUpload';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';

const VehicleRegistration = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [formData, setFormData] = useState({
    vehicleType: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    color: '',
    vehiclePhoto: null as string | null,
    insurancePhoto: null as string | null,
  });

  const handleVehicleTypeSelect = () => {
    // Handle vehicle type selection
    console.log('Open vehicle type selection');
    // You can use a bottom sheet or modal here
  };

  const handleSubmit = () => {
    // Handle submit logic
    console.log('Submit vehicle registration', formData);
    navigation.navigate('SubscriptionPlans');
  };

  return (
    <WrapperContainer navigation={navigation} title="Vehicle Registration">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Vehicle Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>

          <View style={styles.inputContainer}>
            <SelectInput
              placeholder="Vehicle Type"
              value={formData.vehicleType}
              onPress={handleVehicleTypeSelect}
              containerStyle={GeneralStyles.rounded}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Vehicle Model"
              value={formData.vehicleModel}
              onChangeText={text =>
                setFormData({ ...formData, vehicleModel: text })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Vehicle Year"
              value={formData.vehicleYear}
              onChangeText={text =>
                setFormData({ ...formData, vehicleYear: text })
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Vehicle Plate #"
              value={formData.vehiclePlate}
              onChangeText={text =>
                setFormData({ ...formData, vehiclePlate: text })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Color"
              value={formData.color}
              onChangeText={text => setFormData({ ...formData, color: text })}
            />
          </View>
        </View>

        {/* Vehicle Photo Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Photo Upload</Text>
          <SinglePhotoUpload
            placeholder="Click to Upload Vehicle Photo"
            onImageChange={imageUri =>
              setFormData({ ...formData, vehiclePhoto: imageUri })
            }
          />
        </View>

        {/* Insurance Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insurance Upload</Text>
          <SinglePhotoUpload
            placeholder="Click to Upload Insurance"
            onImageChange={imageUri =>
              setFormData({ ...formData, insurancePhoto: imageUri })
            }
          />
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

export default VehicleRegistration;

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
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
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
