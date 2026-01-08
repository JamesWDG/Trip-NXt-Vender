import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useOtpVerificationMutation,
  useResendOTPMutation,
} from '../../../redux/services/authService';
import { ShowToast } from '../../../config/constants';
import WrapperWithVideo from '../../../components/wrappers/WrapperWithVideo';
import IntroWrapperWithTitle from '../../../components/introWrapperWithTitle/IntroWrapperWithTitle';
import fonts from '../../../config/fonts';
import colors from '../../../config/colors';
import labels from '../../../config/labels';
import GradientButton from '../../../components/gradientButton/GradientButton';

//   import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
//   import colors from '../../../config/colors';
//   import fonts from '../../../config/fonts';

const OtpVerify = ({ route }: { route: any }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { top } = useSafeAreaInsets();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [otpVerification, { isLoading }] = useOtpVerificationMutation();
  const [resendOtp] = useResendOTPMutation();

  const { type, email, screenToNavigate } = route?.params || {};
  // console.log(screenToNavigate);

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Timer countdown
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, canResend]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue.length > 1) {
      // Handle paste scenario
      const pastedOtp = numericValue.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);

      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(index + pastedOtp.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Single digit input
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);

      // Auto-focus next input if value is entered
      if (numericValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit OTP code');
      return;
    }

    try {
      let data = {
        email: email?.toLowerCase(),
        otp: otpString,
        type: type,
      };
      const res = await otpVerification(data).unwrap();
      console.log('res', res);
      ShowToast('success', res.message);
      if (res.success) {
        if (type === 'reset') {
          (navigation as any).navigate('ResetPassword', { type, email });
        } else {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'app',
                state: {
                  routes: [
                    {
                      name: screenToNavigate?.selectedStack,
                      ...(screenToNavigate?.selectedStack === 'RestaurantStack'
                        ? {
                            state: {
                              routes: [{ name: screenToNavigate?.screenName }],
                              index: 0,
                            },
                          }
                        : {}),
                      ...(screenToNavigate?.selectedStack === 'CabStack'
                        ? { params: { screen: screenToNavigate?.screenName } }
                        : {}),
                    },
                  ],
                  index: 0,
                },
              },
            ],
          });
        }
      }
      // console.log('Verifying OTP:', otpString);

      // Alert.alert('Success', 'OTP verified successfully!', [
      //   {
      //     text: 'OK',
      //     onPress: () => {

      //     },
      //   },
      // ]);
    } catch (error) {
      console.log('error while verifying the otp', error);
      ShowToast(
        'error',
        (error as { data: { message: string } }).data.message ||
          'Something went wrong',
      );
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      let data = {
        email: email?.toLowerCase(),
      };
      const res = await resendOtp(data).unwrap();
      console.log('resend otp response ===>', res);
      ShowToast('success', res.message);
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      ShowToast(
        'error',
        (error as { data: { message: string } }).data.message ||
          'Something went wrong',
      );
      console.log('error while resending the otp', error);
    }
    // console.log('Resending OTP...');
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <WrapperWithVideo introWrapper={true} otherStyles={styles.introWrapper}>
      <View style={styles.introWrapperContainer} pointerEvents="box-none">
        <IntroWrapperWithTitle
          showBack={true}
          title={labels.verify}
          resizeMode="stretch"
        />
      </View>
      {/* // <WrapperContainer
    //   showRight={false}
    //   title="Verify Your Account"
    //   navigation={navigation}
    // > */}
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingTop: 100 + top },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Title */}
          {/* <Text style={styles.title}>Verify Your Account</Text> */}

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              Enter the 4-digit code sent to your email.
            </Text>
          </View>

          {/* OTP Input Fields */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref: TextInput | null) => {
                  if (ref) {
                    inputRefs.current[index] = ref;
                  }
                }}
                style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={!canResend}
              activeOpacity={canResend ? 0.7 : 1}
            >
              <Text
                style={[
                  styles.resendButton,
                  !canResend && styles.resendButtonDisabled,
                ]}
              >
                Resend Code ({formatTimer(timer)})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          {/* <TouchableOpacity
            style={[
              styles.verifyButton,
              !isOtpComplete && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerify}
            disabled={!isOtpComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity> */}
          <GradientButton
            title={labels.otpButton}
            loader={isLoading}
            onPress={handleVerify}
            otherStyles={
              !isOtpComplete ? styles.verifyButtonDisabled : undefined
            }
            fontFamily={fonts.bold}
            disabled={!isOtpComplete}
            fontSize={18}
          />
        </ScrollView>
      </>
      {/* // </WrapperContainer> */}
    </WrapperWithVideo>
  );
};

export default OtpVerify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: 270,
    // paddingBottom: 40,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionsContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
    paddingHorizontal: 40,
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: colors.white,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  otpInputFilled: {
    borderColor: colors.c_0162C0,
    backgroundColor: colors.white,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.white,
    marginBottom: 8,
  },
  resendButton: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
    textDecorationLine: 'underline',
  },
  resendButtonDisabled: {
    color: colors.white,
    opacity: 0.6,
  },
  verifyButton: {
    width: '100%',
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
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
    pointerEvents: 'box-none',
  },
});
