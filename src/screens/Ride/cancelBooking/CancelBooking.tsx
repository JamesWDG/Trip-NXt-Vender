import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import images from '../../../config/images';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { width } from '../../../config/constants';

const CancelBooking = () => {
  const navigation = useNavigation<NavigationPropType>();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation for icon
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Scale animation - bouncy pop in effect
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        tension: 8,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 8,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Shake animation for attention
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Text fade in animation (delayed)
    Animated.timing(textFadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Button fade in animation (more delayed)
    Animated.timing(buttonFadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const shake = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg'],
  });

  const iconAnimatedStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }, { rotate: shake }],
  };

  const textAnimatedStyle = {
    opacity: textFadeAnim,
  };

  const buttonAnimatedStyle = {
    opacity: buttonFadeAnim,
  };

  const handleYes = () => {
    // Handle cancel ride confirmation
    navigation.goBack();
  };

  const handleNo = () => {
    // Handle cancel ride rejection
    navigation.goBack();
  };

  return (
    <WrapperContainer title="Cancel Ride" navigation={navigation}>
      <View style={styles.container}>
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <Image
            source={images.cancel_booking}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={textAnimatedStyle}>
          <Text style={styles.title}>Cancel Ride</Text>
          <Text style={styles.message}>
            Are You Sure You Want To Cancel Ride?
          </Text>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity style={styles.yesButton} onPress={handleYes}>
            <Text style={styles.yesButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.noButton} onPress={handleNo}>
            <Text style={styles.noButtonText}>No</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </WrapperContainer>
  );
};

export default CancelBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: width * 0.5,
    height: width * 0.5,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    gap: 16,
    position: 'absolute',
    bottom: 120,
  },
  yesButton: {
    flex: 1,
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yesButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  noButton: {
    flex: 1,
    backgroundColor: colors.c_666666,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
