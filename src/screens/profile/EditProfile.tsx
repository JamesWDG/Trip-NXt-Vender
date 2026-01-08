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
import React, { useState, useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Phone, Camera } from 'lucide-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import images from '../../config/images';
import ProfileInputField from '../../components/profileInputField/ProfileInputField';
import GradientButton from '../../components/gradientButton/GradientButton';
import WrapperWithVideo from '../../components/wrappers/WrapperWithVideo';
import IntroWrapperWithTitle from '../../components/introWrapperWithTitle/IntroWrapperWithTitle';
import { useUpdateUserMutation } from '../../redux/services/authService';
import { ShowToast } from '../../config/constants';
import { isValidPhoneNumber } from 'libphonenumber-js';

interface stateTypes {
  image: string;
  name: string;
  phone: string;
  phoneError?: string;
}

const Profile = ({ route }: { route: any }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { top, bottom } = useSafeAreaInsets();
  const [state, setState] = useState<stateTypes>({
    image: '',
    name: '',
    phone: '',
    phoneError: '',
  });
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { userData } = route?.params || {};
  const [isInitialized, setIsInitialized] = useState(false);
  console.log('userData', userData);

  useEffect(() => {
    if (userData && !isInitialized) {
      setState({
        image: userData.profilePicture || '',
        name: userData.name || '',
        phone: userData.phoneNumber || '',
      });
      setIsInitialized(true);
    }
  }, [userData, isInitialized]);
  //   const [name, setName] = useState('Augustine Okpala');
  //   const [email, setEmail] = useState('loremipsum@gmail.com');
  //   const [phone, setPhone] = useState('123 456 7890');
  //   const [password, setPassword] = useState('**********');
  //   const [confirmPassword, setConfirmPassword] = useState('**********');
  //   const [profileImage, setProfileImage] = useState<string | null>(null);

  //   console.log('activeStack', activeStack);

  // const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);

  const handleUpdate = async () => {
    if (!isValidPhoneNumber(state.phone, 'US')) {
      setState(prevState => ({
        ...prevState,
        phoneError: 'Please enter a valid phone umber',
      }));
      return;
    }
    try {
      let data = new FormData();
      data.append('name', state.name);
      data.append('phoneNumber', state.phone);
      if (state.image) {
        data.append('profilePicture', {
          uri: state.image,
          name: 'profilePicture.jpg',
          type: 'image/jpeg',
        });
      }
      const res = await updateUser({ id: userData?.id, data }).unwrap();
      console.log('update user response ===>', res);
      ShowToast('success', res.message);
      if (res.success) {
        navigation.goBack();
      }
    } catch (error) {
      console.log('error while updating the user', error);
      ShowToast(
        'success',
        (error as { data: { message: string } }).data.message ||
          'Something went wrong',
      );
    }
    // Validate passwords match if changed
    // if (password !== '**********' && password !== confirmPassword) {
    //   Alert.alert('Error', 'Passwords do not match');
    //   return;
    // }
    // // Handle update logic
    // console.log('Update profile', {
    //   name,
    //   email,
    //   phone,
    //   password: password !== '**********' ? password : 'unchanged',
    //   profileImage,
    // });
    // Alert.alert('Success', 'Profile updated successfully!');
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
        setState(prevState => ({
          ...prevState,
          image: image.path,
        }));
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('ImagePicker Error: ', error);
        }
      });
  };

  const onChangeText = (key: 'name' | 'phone', value: string) => {
    setState(prevState => ({
      ...prevState,
      [key]: value,
      phoneError: '',
    }));
  };

  // Wave path for smooth transition
  //   const WavePath = () => (
  //     <Svg
  //       width={width}
  //       height={60}
  //       style={styles.wave}
  //       viewBox={`0 0 ${width} 60`}
  //     >
  //       <Path
  //         d={`M 0 0 Q ${width / 4} 30 ${
  //           width / 2
  //         } 30 T ${width} 30 L ${width} 0 Z`}
  //         fill={colors.c_0162C0}
  //       />
  //     </Svg>
  //   );

  return (
    <WrapperWithVideo otherStyles={styles.introWrapper}>
      <IntroWrapperWithTitle title={'Edit Profile'} resizeMode="stretch" 
      showBack={true} onBackPress={() => navigation.goBack()}
      
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <Image
            source={
              state.image
                ? { uri: state.image }
                : images.dummyImage || images.placeholder
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
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputsContainer}>
            <ProfileInputField
              icon={User}
              value={state.name}
              placeholder="Name"
              onChangeText={text => onChangeText('name', text)}
              editable={true}
              autoCapitalize="words"
              returnKeyType="next"
            />
            {/* <ProfileInputField
              icon={Mail}
              value={state.}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={text => onChangeText('email', text)}
            /> */}
            <ProfileInputField
              icon={Phone}
              value={state.phone}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              error={state.phoneError}
              containerStyle={{ marginBottom: 2 }}
              onChangeText={text => onChangeText('phone', text)}
            />
            {state.phoneError && (
              <Text style={styles.errorText}>{state.phoneError}</Text>
            )}
            {/* <ProfileInputField
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
            /> */}
          </View>
          {/* Update Button */}

          <GradientButton
            title="Update"
            onPress={handleUpdate}
            fontSize={16}
            loader={isLoading}
            fontFamily={fonts.bold}
            otherStyles={styles.updateButton}
          />
          {/* {activeStack === 'RestaurantStack' &&
                  <GradientButton
                  title="E"
                  onPress={handleUpdate}
                  fontSize={16}
                  fontFamily={fonts.bold}
                  otherStyles={styles.updateButton}
                />  
          }   */}
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
    pointerEvents: 'box-none',
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
    marginTop: 30,
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
  errorText: {
    color: colors.red,
    fontSize: 15,
    marginRight: 20,
    fontFamily: fonts.normal,
    // marginTop: 5,
  },
  updateButton: {
    // height: 50,
    // borderRadius: 100,
    marginTop: 5,
  },
});
