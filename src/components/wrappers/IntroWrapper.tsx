import {
  ImageBackground,
  ImageResizeMode,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, { FC } from 'react';
import images from '../../config/images';
import { width } from '../../config/constants';

interface Params {
  otherStyles?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  resizeMode?: ImageResizeMode;
  maxHeight?: number;
}
const IntroWrappers: FC<Params> = ({
  otherStyles,
  children,
  resizeMode = 'cover',
  maxHeight = 400,
}) => {
  return (
    <ImageBackground
      source={images.introWrapper}
      imageStyle={{
        maxHeight: maxHeight,
      }}
      resizeMode={resizeMode}
      style={[styles.imageWrapper, otherStyles]}
    >
      {children}
    </ImageBackground>
  );
};

export default IntroWrappers;
const styles = StyleSheet.create({
  imageWrapper: { width: width * 1, height: 400, position: 'absolute', top: 0 },
});
