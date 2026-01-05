import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { FC } from 'react';
import WrapperWithVideo from '../../components/wrappers/WrapperWithVideo';
import IntroWrapperWithTitle from '../../components/introWrapperWithTitle/IntroWrapperWithTitle';
import labels from '../../config/labels';
import Input from '../../components/input/Input';
import GradientButton from '../../components/gradientButton/GradientButton';
import fonts from '../../config/fonts';
import ButtonWithIcon from '../../components/buttonWithIcon/ButtonWithIcon';
import colors from '../../config/colors';
import { width } from '../../config/constants';
import TabButtons from '../../components/tabButtons/TabButtons';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../navigation/authStack/AuthStack';

const Signup: FC = () => {
  const navigation = useNavigation<NavigationPropType>();
  const onLoginPress = () => {
    navigation.navigate('DashboardTabs');
  };
  const onSignupPress = () => {
    navigation.navigate('DashboardTabs');
  };
  return (
    <WrapperWithVideo introWrapper={true} otherStyles={styles.introWrapper}>
      <View style={styles.introWrapperContainer} pointerEvents="none">
        <IntroWrapperWithTitle title={labels.signup} resizeMode="stretch" />
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
            <Input placeholder={labels.typeYourEmail} title={labels.email} />
            <Input
              placeholder={labels.phoneNumber}
              title={labels.phoneNumber}
            />
            <Input
              placeholder={labels.typeYourPassword}
              title={labels.password}
            />
            <Input
              placeholder={labels.confirmPassword}
              title={labels.confirmPassword}
            />
          </View>

          <View style={styles.loginButtonContainer}>
            <GradientButton
              title={labels.signup}
              onPress={onSignupPress}
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
    bottom: 0,
    zIndex: 10,
    flex: 1,
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
    paddingTop: 20,
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
    width: width * 0.9,
    marginVertical: 28,
  },
  scrollViewStyles: {},
  keyboardAvoidingView: {
    flex: 1,
    marginTop: 250,
  },
});
