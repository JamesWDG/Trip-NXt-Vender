import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../../config/colors';
import images from '../../config/images';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { navigationRef } from '../../config/constants';
import { useLazyGetUserQuery } from '../../redux/services/authService';
import { setActiveStack } from '../../redux/slices/navigationSlice';

type NavigationProp = NativeStackNavigationProp<any>;

const Splash: FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const scaleAnimation = useRef(new Animated.Value(0.1)).current;
  const [getUser] = useLazyGetUserQuery();

  const fetchUser = async () => {
    try {
      const res = await getUser(undefined).unwrap();
      console.log('user data ===>', res);
      if (res.success) {
        const stackName = res.data.role && res.data.role.length > 0
          ? res.data.role[0] === 'restaurant_owner'
            ? 'RestaurantStack'
            : res.data.role[0] === 'accommodation_owner'
              ? 'Accomodation'
              : 'CabStack'
          : 'RestaurantStack';
        dispatch(setActiveStack({ stack: stackName }));
        navigationRef.dispatch(CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'app',
              state: {
                routes: [{ name: stackName }],
                index: 0,
              },
            },
          ],
        }));
      } else {
        navigation.navigate('GetStarted');
      }
    } catch (error) {
      navigation.navigate('GetStarted');
      console.log('error ===>', error);
    }
  }
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
    fetchUser();
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
