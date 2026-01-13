import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import  { useState } from 'react';
import WrapperWithVideo from '../../components/wrappers/WrapperWithVideo';
import IntroWrapperWithTitle from '../../components/introWrapperWithTitle/IntroWrapperWithTitle';
import labels from '../../config/labels';
import Input from '../../components/input/Input';
import GradientButton from '../../components/gradientButton/GradientButton';
import fonts from '../../config/fonts';
import ButtonWithIcon from '../../components/buttonWithIcon/ButtonWithIcon';
import colors from '../../config/colors';
import { ShowToast, width } from '../../config/constants';
import { validateSignupFields } from '../../utils/validations';
import { useSignupMutation } from '../../redux/services/authService';
import { useAppDispatch } from '../../store/hooks';
import { setActiveStack } from '../../redux/slices/navigationSlice';

interface stateTypes {
  name: string;
  email: string;
  phone: string;
  password: string;
  cPassword: string;
  errors: {
    name: string;
    email: string;
    phone: string;
    password: string;
    cPassword: string;
  };
}

const Signup = ({ route, navigation }: { route: any; navigation: any }) => {
  const [state, setState] = useState<stateTypes>({
    name: '',
    email: '',
    phone: '19707840508',
    password: 'Abcd!234',
    cPassword: 'Abcd!234',
    errors: {
      name: '',
      email: '',
      phone: '',
      password: '',
      cPassword: '',
    },
  });
  const [signup, { isLoading }] = useSignupMutation();
  const { flowDetails } = route?.params;
  const dispatch = useAppDispatch();

  console.log('user type', flowDetails);

  const onLoginPress = () => {
    navigation.navigate('app');
  };
  const onSignupPress = async () => {
    const errors = validateSignupFields(state);
    // console.log(errors);
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        ...errors,
      },
    }));
    if (errors.email || errors.phone || errors.password || errors.cPassword) {
      return;
    }
    try {
      let data = {
        name: state.name,
        email: state.email?.toLowerCase(),
        password: state.password,
        phoneNumber: state.phone,
        role: [flowDetails?.user_type],
      };
      const res = await signup(data).unwrap();
     
      ShowToast('success', res.message);
      if (res.success) {
        dispatch(setActiveStack({ stack: flowDetails?.stack }));
        navigation.navigate('OtpVerify', {
          email: state.email,
          screenToNavigate: {
            selectedStack: flowDetails?.stack,
            screenName: flowDetails?.screenName,
          },
        });
      }
    } catch (error) {
      ShowToast(
        'error',
        (error as { data: { message: string } }).data.message ||
          'Something went wrong',
      );
      console.log('error', error);
    }
  };

  const onChangeText = (
    text: string,
    key: 'name' | 'email' | 'phone' | 'password' | 'cPassword',
  ) => {
    setState(prev => ({
      ...prev,
      [key]: text,
      errors: {
        ...prev.errors,
        [key]: '',
      },
    }));
  };

  return (
    <WrapperWithVideo otherStyles={styles.introWrapper} >
      <View style={styles.introWrapperContainer} pointerEvents="box-none">
        <IntroWrapperWithTitle
          showBack={true}
          locationStyle={styles.locationContainerStyle}
          title={labels.signup}
          resizeMode="stretch"
        />
      </View>
      {/* <View style={styles.tabButtonsContainer}>
        <TabButtons />
      </View> */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="padding"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainer}
          bounces={false}
        >
          <View style={styles.inputContainer}>
            <Input
              onChangeText={text => onChangeText(text, 'name')}
              placeholder={labels.typeYourName}
              title={labels.name}
              value={state.name}
              errorBorder={!!state.errors.name}
              errorText={state.errors.name}
            />
            <Input
              keyboardType="email-address"
              onChangeText={text => onChangeText(text, 'email')}
              placeholder={labels.typeYourEmail}
              title={labels.email}
              value={state.email}
              errorBorder={!!state.errors.email}
              errorText={state.errors.email}
            />
            <Input
              placeholder={labels.phoneNumber}
              value={state.phone}
              keyboardType="numeric"
              onChangeText={text => onChangeText(text, 'phone')}
              title={labels.phoneNumber}
              errorBorder={!!state.errors.phone}
              errorText={state.errors.phone}
            />
            <Input
              placeholder={labels.typeYourPassword}
              value={state.password}
              onChangeText={text => onChangeText(text, 'password')}
              title={labels.password}
              errorBorder={!!state.errors.password}
              secureTextEntry={true}
              errorText={state.errors.password}
            />
            <Input
              placeholder={labels.confirmPassword}
              value={state.cPassword}
              onChangeText={text => onChangeText(text, 'cPassword')}
              title={labels.confirmPassword}
              secureTextEntry={true}
              errorBorder={!!state.errors.cPassword}
              errorText={state.errors.cPassword}
            />
          </View>

          <View style={styles.loginButtonContainer}>
            <GradientButton
              title={labels.signup}
              onPress={onSignupPress}
              loader={isLoading}
              fontFamily={fonts.bold}
              fontSize={18}
            />
          </View>

          {/* Or Component */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>{labels.or}</Text>
            <View style={styles.orLine} />
          </View>

          {/* Google Signup Button */}
          <View style={styles.continueWithGoogleContainer}>
            <ButtonWithIcon
              title={labels.continueWithGoogle}
              onPress={onLoginPress}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperWithVideo>
  );
};

export default Signup;

const styles = StyleSheet.create({
  introWrapper: {
    position: 'absolute',
    // top: -140,
    left: 0,
    right: 0,
    // backgroundColor: 'red',
    bottom: 0,
    zIndex: 10,
    flex: 1,
  },
  locationContainerStyle: {
    // position: 'relative',
  },
  introWrapperContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
  tabButtonsContainer: {
    zIndex: 10000,
    top: 210,
    // width: width * 1,
  },
  scrollViewContentContainer: {
    // paddingTop: 30,
    // paddingBottom: 150,
    paddingTop: 260,
    paddingBottom: 150,
    zIndex: 100000,
  },
  inputContainer: {
    gap: 16,
    zIndex: 1000000,
  },
  loginButtonContainer: { marginTop: 40 },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 28,
    width: width * 0.9,
  },
  orLine: {
    height: 1,
    flex: 1,
    backgroundColor: colors.white,
  },
  orText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.normal,
  },
  continueWithGoogleContainer: {
    // width: width * 0.9,
    marginVertical: 28,
  },
  scrollViewStyles: {},
  keyboardAvoidingView: {
    flex: 1,
    // zIndex: 1,
    // marginTop: 250,
  },
});
