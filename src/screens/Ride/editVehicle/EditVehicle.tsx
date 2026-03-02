import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import CustomTextInput from '../../../components/customTextInput/CustomTextInput';
import SinglePhotoUpload from '../../../components/singlePhotoUpload/SinglePhotoUpload';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { useUpdateCabVendorMutation } from '../../../redux/services/cabService';

type EditVehicleRouteParams = {
  cabVendor: any;
};

const EditVehicle: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: EditVehicleRouteParams }, 'params'>>();
  const cabVendor = route.params?.cabVendor;

  const [updateCabVendor, { isLoading }] = useUpdateCabVendorMutation();

  const [vehicleModal, setVehicleModal] = useState<string>(cabVendor?.vehicleModal || '');
  const [vehicleYear, setVehicleYear] = useState<string>(cabVendor?.vehicleYear ? String(cabVendor.vehicleYear) : '');
  const [vehicleColor, setVehicleColor] = useState<string>(cabVendor?.vehicleColor || '');
  const [vehicleNumber, setVehicleNumber] = useState<string>(cabVendor?.vehicleNumber || '');

  const [passportPhoto, setPassportPhoto] = useState<string | null>(cabVendor?.passportPhoto || null);
  const [licenseFront, setLicenseFront] = useState<string | null>(cabVendor?.driverLicenseFront || null);
  const [licenseBack, setLicenseBack] = useState<string | null>(cabVendor?.driverLicenseBack || null);
  const [insuranceFront, setInsuranceFront] = useState<string | null>(cabVendor?.vehicleInsuranceFront || null);
  const [vehicleImage, setVehicleImage] = useState<string | null>(cabVendor?.vehicleImage || null);

  const onSave = async () => {
    if (!cabVendor?.id) {
      Alert.alert('Error', 'Vehicle not found');
      return;
    }
    const formData = new FormData();
    formData.append('vehicleModal', vehicleModal);
    formData.append('vehicleYear', vehicleYear);
    formData.append('vehicleColor', vehicleColor);
    formData.append('vehicleNumber', vehicleNumber);

    const appendFile = (field: string, path: string | null) => {
      if (!path) return;
      const uri = path;
      const name = uri.split('/').pop() || `${field}.jpg`;
      formData.append(field, {
        uri,
        name,
        type: 'image/jpeg',
      } as any);
    };

    appendFile('passportPhoto', passportPhoto);
    appendFile('driverLicenseFront', licenseFront);
    appendFile('driverLicenseBack', licenseBack);
    appendFile('vehicleInsuranceFront', insuranceFront);
    appendFile('vehicleInsuranceBack', null); // not exposed yet
    appendFile('vehicleImage', vehicleImage);

    try {
      await updateCabVendor({ id: cabVendor.id, formData } as any).unwrap();
      Alert.alert('Success', 'Vehicle updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.data?.message || e?.message || 'Failed to update vehicle');
    }
  };

  return (
    <WrapperContainer navigation={navigation} title="Edit Vehicle">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Vehicle Details</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Type</Text>
          <Text style={styles.readonlyValue}>{cabVendor?.vehicleType ?? 'N/A'}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Model</Text>
          <CustomTextInput
            placeholder="Enter vehicle model"
            value={vehicleModal}
            onChangeText={setVehicleModal}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Year</Text>
          <CustomTextInput
            placeholder="e.g. 2018"
            value={vehicleYear}
            onChangeText={setVehicleYear}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Color</Text>
          <CustomTextInput
            placeholder="e.g. Black"
            value={vehicleColor}
            onChangeText={setVehicleColor}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Plate Number</Text>
          <CustomTextInput
            placeholder="e.g. ABC-1234"
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
          />
        </View>

        <Text style={styles.sectionTitle}>Documents</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Passport</Text>
          <SinglePhotoUpload
            placeholder={passportPhoto ? 'Change passport photo' : 'Upload passport photo'}
            initialImage={passportPhoto}
            onImageChange={setPassportPhoto}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>License Front</Text>
          <SinglePhotoUpload
            placeholder={licenseFront ? 'Change license front' : 'Upload license front'}
            initialImage={licenseFront}
            onImageChange={setLicenseFront}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>License Back</Text>
          <SinglePhotoUpload
            placeholder={licenseBack ? 'Change license back' : 'Upload license back'}
            initialImage={licenseBack}
            onImageChange={setLicenseBack}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Insurance Front</Text>
          <SinglePhotoUpload
            placeholder={insuranceFront ? 'Change insurance front' : 'Upload insurance front'}
            initialImage={insuranceFront}
            onImageChange={setInsuranceFront}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Vehicle Photo</Text>
          <SinglePhotoUpload
            placeholder={vehicleImage ? 'Change vehicle photo' : 'Upload vehicle photo'}
            initialImage={vehicleImage}
            onImageChange={setVehicleImage}
          />
        </View>

        <View style={styles.buttonContainer}>
          <GradientButtonForAccomodation
            title={isLoading ? 'Saving...' : 'Save Changes'}
            onPress={onSave}
            fontSize={16}
            fontFamily={fonts.bold}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default EditVehicle;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
    marginTop: 12,
  },
   fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_666666,
    marginBottom: 6,
  },
  readonlyValue: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

