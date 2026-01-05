import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
interface Params {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  otherStyles?: ViewStyle | ViewStyle[];
}
const GradientButtonForAccomodation = ({
  title,
  onPress,
  disabled = false,
  color = colors.white,
  fontSize = 14,
  fontFamily = fonts.normal,
  otherStyles = {},
}: Params) => {
  const textStyles = textStyle(color, fontSize, fontFamily);
  return (
    <TouchableOpacity
      style={[styles.button, styles.gradient, otherStyles, otherStyles]}
      disabled={disabled}
      onPress={onPress}
    >
      {/* <LinearGradient
          colors={['#F47E20', '#EE4026']}
          style={[styles.gradient, otherStyles]}
        > */}
      <Text style={textStyles.text}>{title}</Text>
      {/* </LinearGradient> */}
    </TouchableOpacity>
  );
};

export default GradientButtonForAccomodation;

const textStyle = (color: string, fontSize: number, fontFamily: string) =>
  StyleSheet.create({
    text: {
      color: color,
      fontSize: fontSize,
      fontFamily: fontFamily,
    },
  });
const styles = StyleSheet.create({
  gradient: {
    // flex: 1,
    // borderRadius: 100,
    // width: '100%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: colors.c_0162C0,
    width: '100%',
    borderRadius: 100,
  },
});
