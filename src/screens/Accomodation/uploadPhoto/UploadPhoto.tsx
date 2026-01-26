import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import fonts from '../../../config/fonts';
import UploadPhotoComp from '../../../components/uploadPhoto/UploadPhoto';
import { useCreateHotelMutation } from '../../../redux/services/hotelService';
import { ShowToast } from '../../../config/constants';

interface UploadPhotoRouteParams {
  bathrooms: number;
  bedrooms: number;
  beds: number;
  checkInTime: string;
  checkOutTime: string;
  guests: number;
  hotelName: string;
  hotelAddress: {
    country: string;
    state: string;
    city: string;
    longitude: string;
    latitude: string;
  };
  rentPerDay: string;
  rentPerHour: string;
  description: string;
  features: string;
  category: string;
  postalCode: string;
  website: string;
  phoneNumber: string;
}

const UploadPhoto = ({route}: {route: RouteProp<{ UploadPhoto: UploadPhotoRouteParams }, 'UploadPhoto'> }) => {
  const navigation = useNavigation<NavigationPropType>();
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [createHotel] = useCreateHotelMutation();

  const handleImagesChange = (images: string[]) => {
    setUploadedImages(images);
  };

  const handleUploadPhoto = () => {
    if (uploadedImages.length === 0) {
      // Show alert or toast
      return;
    }
    console.log('Uploading images:', uploadedImages);
    // Handle upload logic here
    navigation.navigate('Accomodation', { screen: 'RulesAndRegulations' });
  };

  const handleSubmit = async () => {
    try {
      let data = new FormData();
      console.log("route?.params: ",route?.params)
      data.append('name', route?.params?.hotelName);
      data.append('country', route?.params?.hotelAddress?.country);
      data.append('state', route?.params?.hotelAddress?.state);
      data.append('city', route?.params?.hotelAddress?.city);
      data.append('address', JSON.stringify(route?.params?.hotelAddress));
      data.append('zip', route?.params?.postalCode);
      data.append('hotelType', route?.params?.category);
      data.append('rentPerHour', route?.params?.rentPerHour);
      data.append('rentPerDay', route?.params?.rentPerDay);
      data.append('description', route?.params?.description);
      data.append('website', route.params?.website);
      data.append('phoneNumber', route.params?.phoneNumber);
      data.append('longitude', route?.params?.hotelAddress?.longitude);
      data.append('latitude', route?.params?.hotelAddress?.latitude);
      data.append('numberOfRooms', route?.params?.bedrooms);
      data.append('checkOutTime',  route?.params?.checkOutTime);
      data.append('checkInTime',  route?.params?.checkInTime);
      data.append('numberOfBeds', route?.params.beds);
      data.append('numberOfGuests', route?.params.guests);
      data.append('numberOfBathrooms', route?.params?.bathrooms);
      data.append('features', route?.params?.features);
      data.append('category', route?.params?.category);
      uploadedImages.forEach((image, index) => {
        data.append('images', {
          name: image.filename || `image${index}.jpg`,
          type: image.mime || 'image/jpeg',
          uri: image.path,
        });
      })
      console.log("data: ",data)
      const res = await createHotel(data).unwrap();
      console.log("res creating accomodation: ",res);
      if(res?.success){
        ShowToast('success', res?.message);
        navigation.navigate('Accomodation', { screen: 'Home' });
      }
    } catch (error) {
      console.log("Error Creating Accomodation: ",error)
      ShowToast('error', 'Failed to create accomodation');
    }
  }

  return (
    <WrapperContainer title="Upload Photo" navigation={navigation}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.uploadPhotoContainer}>
          <UploadPhotoComp onImagesChange={handleImagesChange} maxImages={10} />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <GradientButtonForAccomodation
          title="Upload Photo"
          // onPress={handleUploadPhoto}
          onPress={handleSubmit}
          fontSize={16}
          fontFamily={fonts.bold}
        />
      </View>
    </WrapperContainer>
  );
};

export default UploadPhoto;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  uploadPhotoContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    paddingTop: 20,
  },
});
