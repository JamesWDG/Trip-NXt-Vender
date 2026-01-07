import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import Loader from '../AppLoader/Loader';
interface Params {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  otherStyles?: ViewStyle | ViewStyle[];
  loader?: boolean;
}
const GradientButton = ({
  title,
  onPress,
  disabled = false,
  color = colors.white,
  fontSize = 14,
  fontFamily = fonts.normal,
  otherStyles = {},
  loader = false,
}: Params) => {
  const textStyles = textStyle(color, fontSize, fontFamily);
  return (
    <TouchableOpacity
      style={[styles.button, otherStyles]}
      disabled={disabled}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#F47E20', '#EE4026']}
        style={[styles.gradient, otherStyles]}
      >
        {loader ? <Loader /> : <Text style={textStyles.text}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;

const textStyle = (color: string, fontSize: number, fontFamily: string) =>
  StyleSheet.create({
    text: {
      color: colors.white,
      fontSize: fontSize,
      fontFamily: fontFamily,
    },
  });
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    width: '100%',
  },
  button: {
    height: 50,
    width: '100%',
    borderRadius: 100,
  },
});
