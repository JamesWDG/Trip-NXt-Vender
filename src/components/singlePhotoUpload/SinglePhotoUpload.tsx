import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { X } from 'lucide-react-native';

interface SinglePhotoUploadProps {
  placeholder: string;
  onImageChange?: (imageUri: string | null) => void;
  containerStyle?: any;
  initialImage?: string | null;
}

const SinglePhotoUpload: React.FC<SinglePhotoUploadProps> = ({
  placeholder,
  onImageChange,
  containerStyle,
  initialImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);

  React.useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
    }
  }, [initialImage]);

  const openImagePicker = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: false,
      includeBase64: false,
    })
      .then(image => {
        setSelectedImage(image.path);
        onImageChange?.(image.path);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('ImagePicker Error: ', error);
        }
      });
  };

  const removeImage = () => {
    setSelectedImage(null);
    onImageChange?.(null);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.selectedImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={removeImage}
            activeOpacity={0.8}
          >
            <X size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={openImagePicker}
          activeOpacity={0.7}
        >
          <Text style={styles.uploadText}>{placeholder}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SinglePhotoUpload;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  uploadButton: {
    height: 50,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.lightGray,
    borderRadius: 100,
    backgroundColor: colors.c_F3F3F3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  uploadText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    textAlign: 'center',
  },
  imageContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.c_F3F3F3,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
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
