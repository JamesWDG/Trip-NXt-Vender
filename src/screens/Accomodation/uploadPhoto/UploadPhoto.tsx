import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import fonts from '../../../config/fonts';
import UploadPhotoComp from '../../../components/uploadPhoto/UploadPhoto';

const UploadPhoto = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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
          onPress={handleUploadPhoto}
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
