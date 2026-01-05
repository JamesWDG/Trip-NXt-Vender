import { ImageBackground, ImageSourcePropType, StyleSheet } from 'react-native';

import images from '../../config/images';
import React, { forwardRef } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { BottomSheetComponentRef } from '../bottomSheetComp/BottomSheetComp';

interface RideWrapperProps {
  navigation: NavigationProp<any>;
  source?: ImageSourcePropType;
  children?: React.ReactNode;
}

const RideWrapper = forwardRef<BottomSheetComponentRef, RideWrapperProps>(
  ({ navigation, source = images.map_bg, children }, ref) => {
    return (
      <ImageBackground source={images.map_bg} style={styles.imageBackground}>
        {children}
      </ImageBackground>
    );
  },
);

RideWrapper.displayName = 'RideWrapper';

export default RideWrapper;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    // paddingHorizontal: 20,
    // backgroundColor: 'red',
    // height: 200,
  },
});
