import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { X } from 'lucide-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import CustomTextInput from '../../../components/customTextInput/CustomTextInput';
import CustomTextArea from '../../../components/customTextArea/CustomTextArea';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

const RideDetails = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: false,
      includeBase64: false,
    })
      .then(image => {
        setSelectedImage(image.path);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('ImagePicker Error: ', error);
        }
      });
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleSave = () => {
    // Validate required fields
    // if (!productName.trim() || !price.trim()) {
    //   Alert.alert('Error', 'Please fill in Product Name and Price');
    //   return;
    // }

    // Save product data
    console.log('Saving product:', {
      productName,
      price,
      description,
      image: selectedImage,
    });

    // Show success message
    Alert.alert('Success', 'Product added successfully!', [
      {
        text: 'OK',
        onPress: () => {
          // Navigate back or reset form
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <WrapperContainer title="Add Product" navigation={navigation}>
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Product Name Input */}
          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Product Name"
              value={productName}
              onChangeText={setProductName}
              style={styles.input}
            />
          </View>

          {/* Price Input */}
          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <CustomTextArea
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>

          {/* Photo Upload Area */}
          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>Product Image</Text>
            <TouchableOpacity
              style={styles.photoUploadArea}
              onPress={handleImagePicker}
              activeOpacity={0.7}
            >
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={handleRemoveImage}
                    activeOpacity={0.8}
                  >
                    <X size={16} color={colors.white} />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.photoUploadText}>
                  Click to Upload Photo
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save Product</Text>
          </TouchableOpacity>
        </ScrollView>
      </>
    </WrapperContainer>
  );
};

export default RideDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderRadius: 12,
  },
  textArea: {
    borderRadius: 12,
  },
  photoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
  },
  photoUploadArea: {
    minHeight: 150,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.c_DDDDDD,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoUploadText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    minHeight: 150,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    minHeight: 150,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.c_EE4026,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
