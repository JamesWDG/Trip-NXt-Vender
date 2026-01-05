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
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

const OtpVerify = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

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

  const handleVerify = () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP code');
      return;
    }

    // TODO: Implement actual OTP verification API call
    console.log('Verifying OTP:', otpString);

    // Simulate verification
    // Replace this with actual API call
    Alert.alert('Success', 'OTP verified successfully!', [
      {
        text: 'OK',
        onPress: () => {
          // Navigate to next screen after successful verification
          // navigation.navigate('NextScreen');
        },
      },
    ]);
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    // TODO: Implement resend OTP API call
    console.log('Resending OTP...');

    // Reset timer and OTP fields
    setTimer(45);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    Alert.alert('Success', 'OTP has been resent to your phone and email');
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <WrapperContainer title="Verify Your Account" navigation={navigation}>
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text style={styles.title}>Verify Your Account</Text>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              Enter the 6-digit code sent to your phone and email.
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
          <TouchableOpacity
            style={[
              styles.verifyButton,
              !isOtpComplete && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerify}
            disabled={!isOtpComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        </ScrollView>
      </>
    </WrapperContainer>
  );
};

export default OtpVerify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
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
    color: colors.c_666666,
    textAlign: 'center',
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
    paddingHorizontal: 10,
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
    color: colors.c_666666,
    marginBottom: 8,
  },
  resendButton: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_B40000,
    textDecorationLine: 'underline',
  },
  resendButtonDisabled: {
    color: colors.c_B40000,
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
});
