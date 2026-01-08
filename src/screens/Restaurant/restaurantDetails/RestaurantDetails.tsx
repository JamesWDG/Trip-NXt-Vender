import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MapPin, X } from 'lucide-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import CustomTextInput from '../../../components/customTextInput/CustomTextInput';
import CustomTextArea from '../../../components/customTextArea/CustomTextArea';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import DestinationSearch, {
  SearchHistoryItem,
} from '../../../components/destinationSearch/DestinationSearch';
import MapView from 'react-native-maps';

interface restaurantStateTypes {
  restaurantName: string;
  phoneNumber: string;
  address: SearchHistoryItem | null;
  about: string;
  logoImage: string;
  coverImage: string;
}

const RestaurantDetails = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [state, setState] = useState<restaurantStateTypes>({
    restaurantName: '',
    phoneNumber: '',
    address: null,
    about: '',
    logoImage: '',
    coverImage: '',
  });
  // const [restaurantName, setRestaurantName] = useState('');
  // const [ownerName, setOwnerName] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [email, setEmail] = useState('user@example.com'); // Auto-filled
  // const [address, setAddress] = useState('');
  // const [about, setAbout] = useState('');
  // const [description, setDescription] = useState('');
  // const [logoImages, setLogoImages] = useState<string[]>([]);
  // const [coverImages, setCoverImages] = useState<string[]>([]);

  const handleLogoPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: false,
      includeBase64: false,
      multiple: false,
    })
      .then((image: any) => {
        setState(prevState => ({
          ...prevState,
          logoImage: image.path,
        }));
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('ImagePicker Error: ', error);
        }
      });
  };

  const handleCoverPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: false,
      includeBase64: false,
      width: 1080,
      height: 600,
      multiple: false,
    })
      .then((image: any) => {
        setState(prevState => ({
          ...prevState,
          coverImage: image.path,
        }));
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('ImagePicker Error: ', error);
        }
      });
  };

  const handleRemoveLogoImage = () => {
    setState(prevState => ({
      ...prevState,
      logoImage: '',
    }));
  };

  const handleRemoveCoverImage = () => {
    setState(prevState => ({
      ...prevState,
      coverImage: '',
    }));
  };

  const handleMapPinPicker = () => {
    // Handle map pin picker action
    navigation.navigate('Map');
    console.log('Map Pin Picker pressed');
    // TODO: Navigate to map picker screen or open map modal
  };

  const handleNext = () => {
    // Validate required fields
    // if (!restaurantName.trim() || !ownerName.trim() || !phoneNumber.trim()) {
    //   console.log('Please fill in all required fields');
    //   return;
    // }

    // Save restaurant details and navigate to next step
    return console.log('Restaurant details:', {
      state,
    });
    navigation.navigate('RestaurantStack', {
      screen: 'ScheduleAndBank',
    });
  };

  return (
    <WrapperContainer
      hideBack={true}
      showRight={false}
      title="Business Information"
      navigation={navigation}
    >
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Business Information</Text>
            <Text style={styles.subtitle}>
              Step 1: Restaurant Identity Setup
            </Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputsSection}>
            {/* Restaurant Name */}
            <View style={styles.inputWrapper}>
              <CustomTextInput
                placeholder="Enter Restaurant Name"
                value={state.restaurantName}
                onChangeText={text =>
                  setState(prevState => ({
                    ...prevState,
                    restaurantName: text,
                  }))
                }
                style={styles.input}
              />
            </View>

            {/* Owner Name */}
            {/* <View style={styles.inputWrapper}>
              <CustomTextInput
                placeholder="Enter Owner Name"
                value={ownerName}
                onChangeText={setOwnerName}
                style={styles.input}
              />
            </View> */}

            {/* Phone Number */}
            <View style={styles.inputWrapper}>
              <CustomTextInput
                placeholder="Enter Phone Number"
                value={state.phoneNumber}
                onChangeText={text =>
                  setState(prevState => ({ ...prevState, phoneNumber: text }))
                }
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            {/* Email (Auto-filled) */}
            {/* <View style={styles.inputWrapper}>
              <CustomTextInput
                placeholder="Email (auto-filled)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
                style={[styles.input, styles.disabledInput]}
              />
            </View> */}

            {/* Address */}
            <DestinationSearch
              onItemPress={(item: SearchHistoryItem) => {
                setState(prevState => ({ ...prevState, address: item }));
              }}
              onSearchChange={(text: string) =>
                console.log('locationText', text)
              }
              placeholder="Enter Address"
            />
            {/* <View style={styles.inputWrapper}>
              <CustomTextInput
                placeholder="Enter Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
              />
            </View> */}

            {/* Map Pin Picker */}
            <TouchableOpacity
              style={styles.mapPinContainer}
              onPress={handleMapPinPicker}
              activeOpacity={0.7}
            >
              <MapPin size={16} color={colors.c_B40000} />
              <Text style={styles.mapPinText}>Map Pin Picker</Text>
            </TouchableOpacity>

            {/* About */}
            <View style={styles.inputWrapper}>
              <CustomTextArea
                placeholder="About / Description"
                value={state.about}
                onChangeText={text =>
                  setState(prevState => ({ ...prevState, about: text }))
                }
                numberOfLines={4}
                style={styles.textArea}
              />
            </View>

            {/* Description */}
            {/* <View style={styles.inputWrapper}>
              <CustomTextArea
                placeholder="About / Description"
                value={description}
                onChangeText={setDescription}
                numberOfLines={4}
                style={styles.textArea}
              />
            </View> */}
          </View>

          {/* Upload Buttons */}
          <View style={styles.uploadSection}>
            {/* Logo Upload */}
            <View style={styles.uploadGroup}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleLogoPicker}
                activeOpacity={0.7}
              >
                <Text style={styles.uploadButtonText}>
                  Click to Upload Logo
                </Text>
              </TouchableOpacity>

              {/* Selected Logo Image */}
              {state.logoImage ? (
                <View style={styles.selectedImagesContainer}>
                  <View style={styles.imageItem}>
                    <Image
                      source={{ uri: state.logoImage }}
                      style={styles.selectedImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={handleRemoveLogoImage}
                      activeOpacity={0.8}
                    >
                      <X size={16} color={colors.white} strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>

            {/* Cover Photo Upload */}
            <View style={styles.uploadGroup}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleCoverPicker}
                activeOpacity={0.7}
              >
                <Text style={styles.uploadButtonText}>Upload Cover Photo</Text>
              </TouchableOpacity>

              {/* Selected Cover Image */}
              {state.coverImage ? (
                <View style={styles.selectedImagesContainer}>
                  <View style={styles.imageItem}>
                    <Image
                      source={{ uri: state.coverImage }}
                      style={styles.selectedImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={handleRemoveCoverImage}
                      activeOpacity={0.8}
                    >
                      <X size={16} color={colors.white} strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
          {/* Next Button */}
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    </WrapperContainer>
  );
};

export default RestaurantDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  inputsSection: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 12,
  },
  disabledInput: {
    opacity: 0.6,
  },
  mapPinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  mapPinText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_B40000,
  },
  textArea: {
    borderRadius: 12,
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadGroup: {
    marginBottom: 20,
  },
  uploadButton: {
    height: 50,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.c_DDDDDD,
    borderRadius: 100,
    backgroundColor: colors.c_F3F3F3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  selectedImagesContainer: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  imageItem: {
    position: 'relative',
    width: '100%',
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.c_F3F3F3,
  },
  selectedImage: {
    width: '100%',
    // width: 200,
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.c_B40000,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomButtonContainer: {
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: colors.white,
  },
  nextButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
