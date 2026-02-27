import {
  ScrollView,
  StyleSheet,
  Text,
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
import DateTimePicker from '../../../components/dateTimePicker/DateTimePicker';
import DestinationSearch, { SearchHistoryItem } from '../../../components/destinationSearch/DestinationSearch';
import moment from 'moment';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { updateRegistrationData } from '../../../redux/slices/registrationSlice';

const DriverRegistration = () => {
  const navigation = useNavigation<NavigationPropType>();
  const dispatch = useAppDispatch();
  const registrationData = useAppSelector(state => state.registration);
  const user = useAppSelector(state => state.auth.user);

  const [formData, setFormData] = useState({
    fullName: registrationData.fullName || '',
    dob: registrationData.dob || '',
    phoneNumber: registrationData.phoneNumber || user?.phoneNumber || '',
    email: registrationData.email || user?.email || '',
    address: registrationData.address || '',
    profilePhoto: registrationData.passportPhoto || null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleLocationSelect = (item: SearchHistoryItem) => {
    setFormData(prev => ({ ...prev, address: item.destination }));
    if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
  };

  const handleDateSelect = () => {
    setIsDatePickerVisible(true);
  };

  const onDateConfirm = (date: Date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setFormData({ ...formData, dob: formattedDate });
    setIsDatePickerVisible(false);
    if (errors.dob) {
      setErrors({ ...errors, dob: '' });
    }
  };

  const onDateCancel = () => {
    setIsDatePickerVisible(false);
  };

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile Photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      return;
    }

    // Handle next button
    console.log('Next pressed', formData);

    dispatch(updateRegistrationData({
      fullName: formData.fullName,
      dob: formData.dob,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      address: formData.address,
      passportPhoto: formData.profilePhoto,
    }));

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
              onChangeText={text => {
                setFormData({ ...formData, fullName: text });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              errorText={errors.fullName}
              errorBorder={!!errors.fullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <DateInput
              placeholder="Date of Birth"
              value={formData.dob}
              onPress={handleDateSelect}
              otherStyles={GeneralStyles.rounded}
              error={errors.dob}
              errorBorder={!!errors.dob}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChangeText={text => {
                setFormData({ ...formData, phoneNumber: text });
                if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
              }}
              keyboardType="phone-pad"
              errorText={errors.phoneNumber}
              errorBorder={!!errors.phoneNumber}
              editable={!user?.phoneNumber}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={text => {
                setFormData({ ...formData, email: text });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              errorText={errors.email}
              errorBorder={!!errors.email}
              editable={!user?.email}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <DestinationSearch
              placeholder="Search for your address"
              onItemPress={handleLocationSelect}
              inputValue={formData.address}
              errorBorder={!!errors.address}
              errorText={errors.address}
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
            initialImage={formData.profilePhoto}
            onImageChange={imageUri => {
              setFormData({ ...formData, profilePhoto: imageUri });
              if (errors.profilePhoto) setErrors({ ...errors, profilePhoto: '' });
            }}
          />
          {errors.profilePhoto && <Text style={styles.errorText}>{errors.profilePhoto}</Text>}
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

        <DateTimePicker
          visible={isDatePickerVisible}
          mode="date"
          initialDate={formData.dob ? new Date(formData.dob) : moment().subtract(18, 'years').toDate()}
          maximumDate={moment().subtract(18, 'years').toDate()}
          onConfirm={onDateConfirm}
          onClose={onDateCancel}
          title="Select Date of Birth"
        />
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
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
    marginBottom: 8,
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
  errorText: {
    color: colors.red,
    fontSize: 12,
    fontFamily: fonts.semibold,
    marginTop: 8,
    textAlign: 'center',
  },
});
