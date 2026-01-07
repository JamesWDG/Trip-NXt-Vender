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
  const animation = useRef(new Animated.Value(10)).current;
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 2000,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [animation]);

  const animatedStyle = {
    width: animation,
    height: animation,
    borderRadius: '50%',
  };

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('GetStarted');
    }, 3000);
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (token) {
  //       if (activeStack) {
  //         if (navigationRef.isReady()) {
  //           navigationRef.reset({
  //             index: 0,
  //             routes: [
  //               {
  //                 name: 'app',
  //                 state: {
  //                   routes: [
  //                     {
  //                       name: activeStack,
  //                     },
  //                   ],
  //                   index: 0,
  //                 },
  //               },
  //             ],
  //           });
  //         }
  //       } else {
  //         navigation.navigate('GetStarted');
  //       }
  //     } else {
  //       navigation.navigate('Login');
  //     }
  //   }, 3000);
  // }, [token, activeStack, navigation]);
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
  },
  object: {
    backgroundColor: colors.primary,
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
