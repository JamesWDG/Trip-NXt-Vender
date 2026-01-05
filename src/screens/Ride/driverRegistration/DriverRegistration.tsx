import {
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
import CustomTextInput from '../../../components/customTextInput/CustomTextInput';
import DateInput from '../../../components/dateInput/DateInput';
import SelectInput from '../../../components/selectInput/SelectInput';
import SinglePhotoUpload from '../../../components/singlePhotoUpload/SinglePhotoUpload';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';

const DriverRegistration = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    nationalId: '',
    phoneNumber: '',
    email: '',
    address: '',
    profilePhoto: null as string | null,
  });

  const handleDateSelect = () => {
    // Handle date picker
    console.log('Open date picker');
    // You can use a date picker library here
  };

  const handleNationalIdSelect = () => {
    // Handle national ID selection
    console.log('Open national ID selection');
    // You can use a bottom sheet or modal here
  };

  const handleNext = () => {
    // Handle next button
    console.log('Next pressed', formData);
    // navigation.navigate('DriverDocuments');
    navigation.navigate('DriverDocuments');
  };

  return (
    <WrapperContainer navigation={navigation} title="Driver Registration">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Driver Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver Details</Text>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={text =>
                setFormData({ ...formData, fullName: text })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <DateInput
              placeholder="Date of Birth"
              value={formData.dateOfBirth}
              onPress={handleDateSelect}
              otherStyles={GeneralStyles.rounded}
            />
          </View>

          <View style={styles.inputContainer}>
            <SelectInput
              containerStyle={GeneralStyles.rounded}
              placeholder="National ID"
              value={formData.nationalId}
              onPress={handleNationalIdSelect}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChangeText={text =>
                setFormData({ ...formData, phoneNumber: text })
              }
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={text => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Address"
              value={formData.address}
              onChangeText={text => setFormData({ ...formData, address: text })}
              multiline
              numberOfLines={3}
              style={styles.addressInput}
            />
          </View>
        </View>

        {/* Profile Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Profile Photo (passport style)
          </Text>
          <SinglePhotoUpload
            placeholder="Click to Upload Profile Photo"
            onImageChange={imageUri =>
              setFormData({ ...formData, profilePhoto: imageUri })
            }
          />
        </View>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Status: Pending Approval</Text>
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <GradientButtonForAccomodation
            title="Next"
            onPress={handleNext}
            fontSize={16}
            fontFamily={fonts.semibold}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default DriverRegistration;

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
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  addressInput: {
    height: 100,
    borderRadius: 12,
    paddingTop: 16,
    textAlignVertical: 'top',
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
    fontFamily: fonts.semibold,
    color: '#8B6914', // Dark brown/orange
  },
  buttonContainer: {
    marginTop: 8,
  },
});
