import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import images from '../../../config/images';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GradientButton from '../../../components/gradientButton/GradientButton';
import { height, width } from '../../../config/constants';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';

const Congratulations = () => {
  const navigation = useNavigation<NavigationPropType>();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale animation - pop in effect
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 10,
      friction: 3,
      useNativeDriver: true,
    }).start();

    // Rotation animation - slight tilt
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: -0.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Bounce animation - continuous subtle bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const animatedStyle = {
    transform: [
      { scale: scaleAnim },
      { rotate: rotate },
      { translateY: translateY },
    ],
  };

  const handleGoBackToHome = () => {
    // Navigate to AccomodationStack which contains Home
    navigation.navigate('Home');
  };

  return (
    <WrapperContainer title="Congratulations" navigation={navigation}>
      <View style={styles.container}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image
            source={images.success}
            style={styles.successImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={styles.congratulationsText}>Congratulations</Text>
        <Text style={styles.successMessage}>
          Your Funds Have Been Withdrawn Successfully!!
        </Text>

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

export default Congratulations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    marginBottom: 30,
  },
  successImage: {
    width: width * 0.4,
    height: width * 0.4,
  },
  congratulationsText: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
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
    bottom: 130,
  },
});
