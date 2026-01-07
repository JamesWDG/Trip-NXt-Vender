import {
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useState } from 'react';
import WrapperWithVideo from '../../components/wrappers/WrapperWithVideo';
import IntroWrapperWithTitle from '../../components/introWrapperWithTitle/IntroWrapperWithTitle';
import labels from '../../config/labels';
import Input from '../../components/input/Input';
import GradientButton from '../../components/gradientButton/GradientButton';
import fonts from '../../config/fonts';
import { passwordValidation } from '../../utils/validations';
import { useNavigation } from '@react-navigation/native';
import { useResetPasswordMutation } from '../../redux/services/authService';
import { ShowToast } from '../../config/constants';

interface stateTypes {
  password: string;
  cPassword: string;
  newPassword: string;
  errors: {
    password: string;
    cPassword: string;
    newPassword: string;
  };
}

const ResetPassword = ({ route }: { route: any }) => {
  const [state, setState] = useState<stateTypes>({
    password: '',
    cPassword: '',
    newPassword: '',
    errors: {
      password: '',
      cPassword: '',
      newPassword: '',
    },
  });
  const navigation = useNavigation<any>();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { type, email } = route?.params || {};

  const onChangeText = (
    text: string,
    key: 'password' | 'cPassword' | 'newPassword',
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

  const onResetPress = async () => {
    const errors = passwordValidation(state, type);
    setState(prevState => ({
      ...prevState,
      errors,
    }));
    if (errors.password || errors.cPassword || errors.newPassword) {
      return;
    }
    try {
      let data = {
        email: email?.toLowerCase(),
        password: state.newPassword,
      };
      const res = await resetPassword(data).unwrap();
      console.log('reset password response ===>', res);
      ShowToast('success', res.message);
      if (res.success) {
        (navigation as any).navigate('Login');
      }
    } catch (error) {
      ShowToast(
        'error',
        (error as { data: { message: string } }).data.message ||
          'Something went wrong',
      );
      console.log('error while resetting the password', error);
    }
  };

  return (
    <WrapperWithVideo otherStyles={styles.introWrapper}>
      <View style={styles.introWrapperContainer} pointerEvents="none">
        <IntroWrapperWithTitle
          title={labels.passwordHeading}
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
            {type !== 'reset' && (
              <Input
                errorBorder={!!state.errors.password}
                errorText={state.errors.password}
                value={state.password}
                secureTextEntry={true}
                onChangeText={text => onChangeText(text, 'password')}
                placeholder={labels.password}
                title={labels.currentPassword}
              />
            )}
            <Input
              errorBorder={!!state.errors.newPassword}
              errorText={state.errors.newPassword}
              value={state.newPassword}
              // secureTextEntry={true}
              onChangeText={text => onChangeText(text, 'newPassword')}
              placeholder={labels.password}
              title={labels.newPassword}
            />
            <Input
              errorBorder={!!state.errors.cPassword}
              errorText={state.errors.cPassword}
              value={state.cPassword}
              // secureTextEntry={true}
              onChangeText={text => onChangeText(text, 'cPassword')}
              placeholder={labels.confirmPassword}
              title={labels.confirmPassword}
            />
          </View>
          <View style={styles.buttonContainer}>
            <GradientButton
              title={type === 'reset' ? labels.reset : labels.change}
              onPress={onResetPress}
              loader={isLoading}
              fontFamily={fonts.bold}
              fontSize={18}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperWithVideo>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
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
  scrollViewContentContainer: {},
  inputContainer: {
    gap: 16,
    marginTop: 300,
  },
  buttonContainer: {
    marginTop: 40,
  },
});
