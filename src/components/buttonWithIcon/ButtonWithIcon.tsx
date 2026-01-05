import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';
import images from '../../config/images';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface Params {
  imageSrc?: string;
  title: string;
  onPress: () => void;
  height?: number;
  width?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
}

const ButtonWithIcon: FC<Params> = ({
  imageSrc = images.google,
  title,
  onPress,
  height = 20,
  width = 20,
  backgroundColor = colors.transparent,
  borderColor = colors.white,
  textColor = colors.white,
  fontSize = 16,
  fontFamily = fonts.normal,
}) => {
  const imageStyle = imageStyles(height, width);
  const containerStyles = styles(backgroundColor, borderColor);
  const textStyle = textStyles(textColor, fontSize, fontFamily);
  return (
    <TouchableOpacity style={containerStyles.container}>
      <Image source={imageSrc} style={imageStyle.image} />
      <Text style={textStyle.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonWithIcon;

const textStyles = (color: string, fontSize: number, fontFamily: string) =>
  StyleSheet.create({
    text: {
      color: color,
      fontSize: fontSize,
      fontFamily: fontFamily,
    },
  });
const imageStyles = (height: number, width: number) =>
  StyleSheet.create({
    image: {
      width: height,
      height: width,
    },
  });
const styles = (backgroundColor: string, borderColor: string) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor,
      borderWidth: 1,
      borderColor: borderColor,
      height: 48,
      width: '100%',
      borderRadius: 100,
    },
  });
