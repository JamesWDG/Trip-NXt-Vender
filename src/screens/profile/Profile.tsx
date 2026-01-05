import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useState, useMemo } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Mail, Phone, Lock, Camera } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import images from '../../config/images';
import ProfileInputField from '../../components/profileInputField/ProfileInputField';
import GradientButton from '../../components/gradientButton/GradientButton';
import { width } from '../../config/constants';
import WrapperWithVideo from '../../components/wrappers/WrapperWithVideo';
import IntroWrapperWithTitle from '../../components/introWrapperWithTitle/IntroWrapperWithTitle';

const Profile = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { top, bottom } = useSafeAreaInsets();
  const [name, setName] = useState('Augustine Okpala');
  const [email, setEmail] = useState('loremipsum@gmail.com');
  const [phone, setPhone] = useState('123 456 7890');
  const [password, setPassword] = useState('**********');
  const [confirmPassword, setConfirmPassword] = useState('**********');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);

  const handleUpdate = () => {
    // Validate passwords match if changed
    if (password !== '**********' && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Handle update logic
    console.log('Update profile', {
      name,
      email,
      phone,
      password: password !== '**********' ? password : 'unchanged',
      profileImage,
    });

    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleEditPhoto = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      cropperCircleOverlay: true,
      width: 500,
      height: 500,
      includeBase64: false,
    })
      .then(image => {
        setProfileImage(image.path);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('ImagePicker Error: ', error);
        }
      });
  };

  // Wave path for smooth transition
  const WavePath = () => (
    <Svg
      width={width}
      height={60}
      style={styles.wave}
      viewBox={`0 0 ${width} 60`}
    >
      <Path
        d={`M 0 0 Q ${width / 4} 30 ${
          width / 2
        } 30 T ${width} 30 L ${width} 0 Z`}
        fill={colors.c_0162C0}
      />
    </Svg>
  );

  return (
    <WrapperWithVideo introWrapper={true} otherStyles={styles.introWrapper}>
      <IntroWrapperWithTitle title={'Profile'} resizeMode="stretch" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : images.user_circle || images.placeholder
            }
            style={styles.profilePicture}
          />
          <TouchableOpacity
            style={styles.editPhotoButton}
            onPress={handleEditPhoto}
            activeOpacity={0.8}
          >
            <Camera size={16} color={colors.black} />
          </TouchableOpacity>
        </View>

        {/* Blue Content Section */}
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputsContainer}>
            <ProfileInputField
              icon={User}
              value={name}
              placeholder="Name"
              onChangeText={setName}
            />
            <ProfileInputField
              icon={Mail}
              value={email}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
            <ProfileInputField
              icon={Phone}
              value={phone}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={setPhone}
            />
            <ProfileInputField
              icon={Lock}
              value={password}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
            <ProfileInputField
              icon={Lock}
              value={confirmPassword}
              placeholder="Confirm Password"
              secureTextEntry={true}
              onChangeText={setConfirmPassword}
            />
          </View>
          {/* Update Button */}

          <GradientButton
            title="Update"
            onPress={handleUpdate}
            fontSize={16}
            fontFamily={fonts.bold}
            otherStyles={styles.updateButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperWithVideo>
  );
};

export default Profile;

const makeHeaderStyles = (top: number) =>
  StyleSheet.create({
    headerContainer: {
      paddingTop: top + 10,
      paddingBottom: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 230,
  },
  introWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  orangeHeader: {
    backgroundColor: colors.c_F47E20,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  wave: {
    position: 'absolute',
    top: 'auto',
    left: 0,
    right: 0,
    zIndex: 1,
  },
  profilePictureContainer: {
    top: 'auto',
    alignSelf: 'center',
    zIndex: 10,
    marginTop: -50,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.white,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputsContainer: {
    // marginTop: 40,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: colors.c_0162C0,
    paddingTop: 20,
  },
  updateButton: {
    // height: 50,
    // borderRadius: 100,
    // marginTop: 20,
  },
});
