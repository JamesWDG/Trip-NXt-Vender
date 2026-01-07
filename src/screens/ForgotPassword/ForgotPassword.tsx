import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useState } from 'react';
import WrapperWithVideo from '../../components/wrappers/WrapperWithVideo';
import IntroWrapperWithTitle from '../../components/introWrapperWithTitle/IntroWrapperWithTitle';
import labels from '../../config/labels';
import Input from '../../components/input/Input';
import GradientButton from '../../components/gradientButton/GradientButton';
import { forgotValidation } from '../../utils/validations';
import { useNavigation } from '@react-navigation/native';
import { useForgetPasswordMutation } from '../../redux/services/authService';
import { ShowToast } from '../../config/constants';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigation = useNavigation<any>();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const onSendPress = async () => {
    const error = forgotValidation(email);
    setError(error);
    if (error) {
      return;
    }
    try {
      let data = {
        email: email?.toLowerCase(),
      };
      const res = await forgetPassword(data).unwrap();
      console.log('res', res);
      ShowToast('success', res.message);
      if (res.success) {
        (navigation as any).navigate('OtpVerify', { type: 'reset', email });
      }
    } catch (error) {
      ShowToast(
        'error',
        (error as { data: { message: string } }).data.message ||
          'Something went wrong',
      );
      console.log('error while sending an email', error);
    }
  };

  return (
    <WrapperWithVideo otherStyles={styles.introWrapper}>
      <View style={styles.introWrapperContainer} pointerEvents="none">
        <IntroWrapperWithTitle
          title={labels.forgotPassword}
          resizeMode="stretch"
        />
      </View>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <View style={styles.inputContainer}>
            <Input
              onChangeText={text => {
                setEmail(text);
                setError('');
              }}
              value={email}
              placeholder={labels.typeYourEmail}
              title={labels.email}
              errorText={error}
              errorBorder={!!error}
            />
          </View>
          <View style={styles.buttonContainer}>
            <GradientButton
              loader={isLoading}
              title={labels.continue}
              onPress={onSendPress}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperWithVideo>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  inputContainer: {
    gap: 16,
    marginTop: 300,
  },
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
  buttonContainer: {
    marginTop: 30,
  },
  scrollViewContentContainer: {},
});
