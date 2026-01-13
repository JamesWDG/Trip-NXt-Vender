import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import images from '../../config/images';
import GradientButton from '../../components/gradientButton/GradientButton';
import colors from '../../config/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import fonts from '../../config/fonts';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../navigation/authStack/AuthStack';

const GetStarted = () => {
  const navigation = useNavigation<NavigationPropType>();
  const { bottom } = useSafeAreaInsets();
  const style = styles(bottom);
  const onGetStartedPress = () => {
    navigation.navigate('Login');
  };
  return (
    <View style={style.container}>
      <View />
      <Image source={images.splash} style={style.image} />

      <GradientButton
        title="Get Started"
        onPress={onGetStartedPress}
        fontFamily={fonts.bold}
        fontSize={18}
      />
    </View>
  );
};

export default GetStarted;

const styles = (bottom: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingBottom: bottom + 40,
    },
    image: {
      height: 140,
      width: 227,
    },

    buttonContainer: {
      width: '100%',
      alignSelf: 'flex-end',
    },
  });
