import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ImageResizeMode,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import images from '../../config/images';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import IntroWrappers from '../wrappers/IntroWrapper';
import { ChevronLeftIcon } from 'lucide-react-native';
interface Params {
  title: string;
  resizeMode?: ImageResizeMode;
  showBack?: boolean;
  locationStyle?: ViewStyle;
  onBackPress?: () => void;
}
const IntroWrapperWithTitle = ({
  title,
  resizeMode = 'cover',
  showBack = false,
  locationStyle,
  onBackPress,
}: Params) => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const locationContainerStyle = locationContainer(top);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <IntroWrappers
        otherStyles={styles.introWrapper}
        resizeMode={resizeMode}
        maxHeight={260}
      >
        {showBack && (
          <TouchableOpacity
            style={[styles.backButton, { top: top + 10 }]}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon size={40} color={colors.white} />
          </TouchableOpacity>
        )}
        <View
          style={[locationContainerStyle.locationContainerStyle, locationStyle]}
        >
          <ImageBackground
            source={images.location}
            style={styles.locationImage}
            imageStyle={styles.bgImageStyles}
            resizeMode="contain"
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
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 11,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 20,
    fontFamily: fonts.bold,
  },
});
