import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import React, { FC } from 'react';
interface Params {
  image: string;
  title: string;
  imageStyles?: StyleProp<ImageStyle>;
  textStyles?: StyleProp<TextStyle>;
}
const ImageWithCard: FC<Params> = ({
  image,
  title,
  imageStyles,
  textStyles,
}) => {
  return (
    <View>
      <Image source={image} style={imageStyles} resizeMode="cover" />
      <Text style={textStyles}>{title}</Text>
    </View>
  );
};

export default ImageWithCard;

const styles = StyleSheet.create({});
