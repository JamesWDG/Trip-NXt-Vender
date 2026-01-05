import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import { useNavigation, CommonActions } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { Send } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import { width } from '../../../config/constants';

const MessageSent = () => {
  const navigation = useNavigation<NavigationPropType>();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
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

    // Continuous flying animation with rotation
    Animated.loop(
      Animated.parallel([
        // Horizontal movement (flying to the right)
        Animated.sequence([
          Animated.timing(translateXAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(translateXAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        // Vertical movement (flying upward)
        Animated.sequence([
          Animated.timing(translateYAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        // Rotation animation (tilting during flight)
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();

    // Text fade in animation (delayed)
    Animated.timing(textFadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-20deg', '-10deg', '-20deg'],
  });

  const translateX = translateXAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const translateY = translateYAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const iconAnimatedStyle = {
    opacity: fadeAnim,
    transform: [
      { scale: scaleAnim },
      { rotate: rotate },
      { translateX: translateX },
      { translateY: translateY },
    ],
  };

  const textAnimatedStyle = {
    opacity: textFadeAnim,
  };

  const handleGoBackToHome = () => {
    // Navigate to AccomodationStack which contains Home
    navigation.navigate('Home');
  };

  return (
    <WrapperContainer title="Message Sent" navigation={navigation}>
      <View style={styles.container}>
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <Send size={80} color={colors.c_0162C0} strokeWidth={2} />
        </Animated.View>

        <Animated.View style={textAnimatedStyle}>
          <Text style={styles.messageTitle}>Message Sent</Text>
          <Text style={styles.messageSubtitle}>
            Your Message has Been Successfully send.
          </Text>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <GradientButtonForAccomodation
            title="Go Back To Home"
            onPress={handleGoBackToHome}
            fontSize={16}
            fontFamily={fonts.bold}
          />
        </View>
      </View>
    </WrapperContainer>
  );
};

export default MessageSent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  messageTitle: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
    textAlign: 'center',
  },
  messageSubtitle: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 120,
  },
});
