import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ImageResizeMode,
} from 'react-native';
import React from 'react';
import images from '../../config/images';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IntroWrappers from '../wrappers/IntroWrapper';
interface Params {
  title: string;
  resizeMode?: ImageResizeMode;
}
const IntroWrapperWithTitle = ({ title, resizeMode = 'cover' }: Params) => {
  const { top } = useSafeAreaInsets();
  const locationContainerStyle = locationContainer(top);
  return (
    <>
      <IntroWrappers
        otherStyles={styles.introWrapper}
        resizeMode={resizeMode}
        maxHeight={260}
      >
        <View style={locationContainerStyle.locationContainerStyle}>
          <ImageBackground
            source={images.location}
            style={styles.locationImage}
            imageStyle={styles.bgImageStyles}
          >
            <Text style={styles.locationText}>{title}</Text>
          </ImageBackground>
        </View>
      </IntroWrappers>
    </>
  );
};

export default IntroWrapperWithTitle;

const locationContainer = (top: number) =>
  StyleSheet.create({
    locationContainerStyle: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 8,
      top: top - 15,
      height: 200,
      // backgroundColor: 'green',
      alignItems: 'center',
      // justifyContent: 'center',
    },
  });
const styles = StyleSheet.create({
  introWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  bgImageStyles: {
    opacity: 0.09,
    top: 10,
  },

  locationImage: {
    minWidth: 150,
    height: 200,
    alignItems: 'center',
    zIndex: 8,
    justifyContent: 'center',
  },
  locationText: {
    color: colors.white,
    fontSize: 40,
    fontFamily: fonts.bold,
  },
});
