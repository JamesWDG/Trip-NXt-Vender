import { ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useRef, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import CustomTextInput from '../../../components/customTextInput/CustomTextInput';
import SelectInput from '../../../components/selectInput/SelectInput';
import SinglePhotoUpload from '../../../components/singlePhotoUpload/SinglePhotoUpload';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import colors from '../../../config/colors';
import appFonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { updateRegistrationData } from '../../../redux/slices/registrationSlice';
import BottomSheetComp, { BottomSheetComponentRef } from '../../../components/bottomSheetComp/BottomSheetComp';
import { Check } from 'lucide-react-native';

const VehicleRegistration = () => {
  const navigation = useNavigation<NavigationPropType>();
  const dispatch = useAppDispatch();
  const registrationData = useAppSelector(state => state.registration);

  const [formData, setFormData] = useState({
    vehicleType: registrationData.vehicleType,
    vehicleModel: registrationData.vehicleModal,
    vehicleYear: registrationData.vehicleYear,
    vehiclePlate: registrationData.vehicleNumber,
    color: registrationData.vehicleColor,
    vehiclePhoto: registrationData.vehicleImage || null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const vehicleTypeSheetRef = useRef<BottomSheetComponentRef>(null);
  const colorSheetRef = useRef<BottomSheetComponentRef>(null);

  const vehicleTypes = useMemo(() => [
    'sedan', 'suv', 'hatchback', 'convertible', 'coupe', 'wagon',
    'van', 'bus', 'truck', 'motorcycle', 'bicycle', 'other'
  ], []);

  const predefinedColors = useMemo(() => [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Silver', value: '#C0C0C0' },
    { name: 'Gray', value: '#808080' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#008000' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Orange', value: '#FFA500' },
    { name: 'Brown', value: '#A52A2A' },
  ], []);

  const handleVehicleTypeSelect = () => {
    vehicleTypeSheetRef.current?.open();
  };

  const handleColorSelect = () => {
    colorSheetRef.current?.open();
  };

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle Type is required';
    if (!formData.vehicleModel) newErrors.vehicleModel = 'Vehicle Model is required';
    if (!formData.vehicleYear) newErrors.vehicleYear = 'Vehicle Year is required';
    if (!formData.vehiclePlate) newErrors.vehiclePlate = 'Vehicle Plate # is required';
    if (!formData.color) newErrors.color = 'Color is required';
    if (!formData.vehiclePhoto) newErrors.vehiclePhoto = 'Vehicle Photo is required';
    if (!formData.vehiclePhoto) newErrors.vehiclePhoto = 'Vehicle Photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    // Handle submit logic
    console.log('Submit vehicle registration', formData);

    dispatch(updateRegistrationData({
      vehicleType: formData.vehicleType,
      vehicleModal: formData.vehicleModel,
      vehicleYear: formData.vehicleYear,
      vehicleNumber: formData.vehiclePlate,
      vehicleColor: formData.color,
      vehicleImage: formData.vehiclePhoto,
    }));

    navigation.navigate('VehicleDocuments');
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
              error={errors.vehicleType}
              errorBorder={!!errors.vehicleType}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Vehicle Model"
              value={formData.vehicleModel}
              onChangeText={text => {
                setFormData({ ...formData, vehicleModel: text });
                if (errors.vehicleModel) setErrors({ ...errors, vehicleModel: '' });
              }}
              errorText={errors.vehicleModel}
              errorBorder={!!errors.vehicleModel}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Vehicle Year"
              value={formData.vehicleYear}
              onChangeText={text => {
                setFormData({ ...formData, vehicleYear: text });
                if (errors.vehicleYear) setErrors({ ...errors, vehicleYear: '' });
              }}
              keyboardType="numeric"
              errorText={errors.vehicleYear}
              errorBorder={!!errors.vehicleYear}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Vehicle Plate #"
              value={formData.vehiclePlate}
              onChangeText={text => {
                setFormData({ ...formData, vehiclePlate: text });
                if (errors.vehiclePlate) setErrors({ ...errors, vehiclePlate: '' });
              }}
              errorText={errors.vehiclePlate}
              errorBorder={!!errors.vehiclePlate}
            />
          </View>

          <View style={styles.inputContainer}>
            <SelectInput
              placeholder="Color"
              value={formData.color}
              onPress={handleColorSelect}
              containerStyle={GeneralStyles.rounded}
              error={errors.color}
              errorBorder={!!errors.color}
            />
          </View>
        </View>

        {/* Vehicle Photo Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Photo Upload</Text>
          <SinglePhotoUpload
            placeholder="Click to Upload Vehicle Photo"
            initialImage={formData.vehiclePhoto}
            onImageChange={imageUri => {
              setFormData({ ...formData, vehiclePhoto: imageUri });
              if (errors.vehiclePhoto) setErrors({ ...errors, vehiclePhoto: '' });
            }}
          />
          {errors.vehiclePhoto && <Text style={styles.errorText}>{errors.vehiclePhoto}</Text>}
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
            fontFamily={appFonts.bold}
          />
        </View>
      </ScrollView>

      {/* Vehicle Type Bottom Sheet */}
      <BottomSheetComp ref={vehicleTypeSheetRef} enableDynamicSizing={true}>
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Select Vehicle Type</Text>
          <FlatList
            data={vehicleTypes}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  setFormData({ ...formData, vehicleType: item });
                  if (errors.vehicleType) setErrors({ ...errors, vehicleType: '' });
                  vehicleTypeSheetRef.current?.dismiss();
                }}
              >
                <Text style={[styles.optionText, formData.vehicleType === item && styles.selectedOptionText]}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
                {formData.vehicleType === item && <Check size={20} color={colors.c_F47E20} />}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </BottomSheetComp>

      {/* Color Picker Bottom Sheet */}
      <BottomSheetComp ref={colorSheetRef} enableDynamicSizing={true}>
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Select Vehicle Color</Text>
          <View style={styles.colorGrid}>
            {predefinedColors.map(colorItem => (
              <TouchableOpacity
                key={colorItem.name}
                style={styles.colorItemContainer}
                onPress={() => {
                  setFormData({ ...formData, color: colorItem.name });
                  if (errors.color) setErrors({ ...errors, color: '' });
                  colorSheetRef.current?.dismiss();
                }}
              >
                <View style={[
                  styles.colorCircle,
                  { backgroundColor: colorItem.value },
                  formData.color === colorItem.name && styles.selectedColorCircle
                ]} />
                <Text style={styles.colorName}>{colorItem.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BottomSheetComp>
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
    fontFamily: appFonts.bold,
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
    fontFamily: appFonts.bold,
    color: '#8B6914', // Dark brown/orange
  },
  buttonContainer: {
    marginTop: 8,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    fontFamily: appFonts.bold,
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSheetContent: {
    padding: 20,
    paddingBottom: 40,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontFamily: appFonts.bold,
    color: colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  optionText: {
    fontSize: 16,
    fontFamily: appFonts.normal,
    color: colors.c_2B2B2B,
  },
  selectedOptionText: {
    fontFamily: appFonts.bold,
    color: colors.c_F47E20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  colorItemContainer: {
    width: '18%',
    alignItems: 'center',
    marginBottom: 15,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  selectedColorCircle: {
    borderWidth: 3,
    borderColor: colors.c_F47E20,
  },
  colorName: {
    fontSize: 10,
    fontFamily: appFonts.normal,
    color: colors.c_666666,
    marginTop: 4,
    textAlign: 'center',
  },
});
