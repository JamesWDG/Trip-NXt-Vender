import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../../config/colors';
import images from '../../config/images';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { navigationRef } from '../../config/constants';

type NavigationProp = NativeStackNavigationProp<any>;

const Splash: FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { token } = useSelector((state: RootState) => state.auth);
  const { activeStack } = useSelector((state: RootState) => state.navigation);
  // console.log(activeStack);
  const scaleAnimation = useRef(new Animated.Value(0.1)).current;
  useEffect(() => {
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [scaleAnimation]);

  const animatedStyle = {
    transform: [{ scale: scaleAnimation }],
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('GetStarted');
      // navigation.navigate('MyHotels');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.object, animatedStyle]}>
        <Image source={images.splash} style={styles.image} />
      </Animated.View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  object: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 140,
    width: 227,
  },
});
