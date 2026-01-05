import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import WrapperWithVideo from '../../components/wrappers/WrapperWithVideo';

import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { width } from '../../config/constants';
import GradientButton from '../../components/gradientButton/GradientButton';
import ButtonWithIcon from '../../components/buttonWithIcon/ButtonWithIcon';
import { CommonActions, useNavigation } from '@react-navigation/native';
import labels from '../../config/labels';
import IntroWrapperWithTitle from '../../components/introWrapperWithTitle/IntroWrapperWithTitle';
import Input from '../../components/input/Input';
import ToggleBox from '../../components/toggleBox/ToggleBox';
import { NavigationPropType } from '../../navigation/authStack/AuthStack';

const Signin = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [isRememberMe, setIsRememberMe] = useState(false);
  const handleRememberMe = () => {
    setIsRememberMe(!isRememberMe);
  };
  const onLoginPress = () => {
    navigation.navigate('DashboardTabs');
    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [{ name: 'app' }],
    //   }),
    // );
  };
  const onSignupPress = () => {
    navigation.navigate('Signup');
  };
  return (
    <WrapperWithVideo introWrapper={true} otherStyles={styles.introWrapper}>
      <View style={styles.introWrapperContainer} pointerEvents="none">
        <IntroWrapperWithTitle title={labels.login} resizeMode="stretch" />
      </View>

      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <View style={styles.inputContainer}>
            <Input placeholder={labels.typeYourEmail} title={labels.email} />
            <Input
              placeholder={labels.typeYourPassword}
              title={labels.password}
            />
          </View>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={handleRememberMe}
            >
              <ToggleBox isChecked={isRememberMe} />
              <Text style={styles.toggleText}>{labels.rememberMe}</Text>
            </TouchableOpacity>
            <Text style={styles.toggleText}>{labels.forgetPassword}</Text>
          </View>
          <View style={styles.loginButtonContainer}>
            <GradientButton
              title={labels.login}
              onPress={onLoginPress}
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

          <View style={styles.dontHaveAnAccountContainer}>
            <Text style={styles.dontHaveAnAccountText}>
              {labels.dontHaveAnAccount}
            </Text>
            <TouchableOpacity onPress={onSignupPress}>
              <Text style={[styles.dontHaveAnAccountText, styles.boldText]}>
                {labels.signup}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperWithVideo>
  );
};

export default Signin;

const styles = StyleSheet.create({
  inputContainer: {
    gap: 16,
    marginTop: 300,
  },
  continueWithGoogleContainer: { width: width * 0.9, marginTop: 28 },
  loginButtonContainer: { marginTop: 40 },
  introWrapper: {
    position: 'absolute',
    // top: -140,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  introWrapperContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
  rememberMeContainer: { flexDirection: 'row', gap: 10 },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: width * 0.9,
    paddingHorizontal: 10,
    marginTop: 12,
  },
  toggleText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.white,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 28,
    // backgroundColor: 'red',
    width: width * 0.9,
  },
  orLine: {
    height: 1,
    // width: '100%',
    flex: 1,
    backgroundColor: colors.white,
  },
  orText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.normal,
  },
  dontHaveAnAccountContainer: {
    marginTop: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    width: width * 0.9,
    paddingHorizontal: 10,
  },
  dontHaveAnAccountText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.white,
  },
  boldText: {
    fontFamily: fonts.bold,
  },
  scrollViewContentContainer: {},
});
