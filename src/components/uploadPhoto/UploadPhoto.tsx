import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import GeneralStyles from '../../utils/GeneralStyles';
import images from '../../config/images';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { X, Plus } from 'lucide-react-native';
import { width } from '../../config/constants';

interface UploadPhotoCompProps {
  onImagesChange?: (images: string[]) => void;
  maxImages?: number;
}

const UploadPhotoComp: React.FC<UploadPhotoCompProps> = ({
  onImagesChange,
  maxImages = 10,
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const openImagePicker = () => {
    const remainingSlots = maxImages - selectedImages.length;
    if (remainingSlots <= 0) {
      Alert.alert(
        'Limit Reached',
        `You can only upload up to ${maxImages} images.`,
      );
      return;
    }

    ImagePicker.openPicker({
      multiple: true,
      maxFiles: remainingSlots,
      mediaType: 'photo',
      cropping: false,
      includeBase64: false,
    })
      .then(images => {
        const newImagePaths = images.map((img: any) => img.path);
        const updatedImages = [...selectedImages, ...newImagePaths];
        setSelectedImages(updatedImages);
        onImagesChange?.(updatedImages);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('ImagePicker Error: ', error);
        }
      });
  };

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const renderImageItem = (imagePath: string, index: number) => {
    return (
      <View key={index} style={styles.imageItem}>
        <Image source={{ uri: imagePath }} style={styles.selectedImage} />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeImage(index)}
        >
          <X size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* First Image - Full Width (Larger) */}
        {selectedImages.length > 0 && (
          <View style={styles.firstImageContainer}>
            {renderImageItem(selectedImages[0], 0)}
          </View>
        )}

        {/* Remaining Images - 2 Column Grid */}
        <View style={styles.gridContainer}>
          {selectedImages.slice(1).map((imagePath, index) => (
            <View key={index + 1} style={styles.gridItem}>
              {renderImageItem(imagePath, index + 1)}
            </View>
          ))}

          {/* Add More Button - Full Width (if no images selected) */}
          {selectedImages.length === 0 && (
            <TouchableOpacity
              style={[
                styles.uploadButton,
                styles.firstImageContainer,
                GeneralStyles.shadow,
              ]}
              onPress={openImagePicker}
              activeOpacity={0.7}
            >
              <View style={styles.uploadButtonContent}>
                <Image
                  source={images.placeholder}
                  style={styles.placeholderIcon}
                />
                <Text style={styles.uploadText}>Add Photo</Text>
                <Text style={styles.uploadSubtext}>
                  {selectedImages.length}/{maxImages}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {/* Add More Button in Grid */}
          {selectedImages.length < maxImages && (
            <TouchableOpacity
              style={[
                styles.uploadButton,
                styles.gridItem,
                GeneralStyles.shadow,
              ]}
              onPress={openImagePicker}
              activeOpacity={0.7}
            >
              <View style={styles.uploadButtonContent}>
                <Image
                  source={images.placeholder}
                  style={styles.placeholderIcon}
                />
                <Text style={styles.uploadText}>Add Photo</Text>
                <Text style={styles.uploadSubtext}>
                  {selectedImages.length}/{maxImages}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default UploadPhotoComp;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollContent: {
    paddingVertical: 10,
    gap: 12,
  },
  firstImageContainer: {
    width: '100%',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: (width - 40 - 12) / 2, // 40 for padding, 12 for gap
  },
  uploadButton: {
    height: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.lightGray,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  uploadButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    height: 40,
    width: 40,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 10,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  imageItem: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.c_EE4026,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
