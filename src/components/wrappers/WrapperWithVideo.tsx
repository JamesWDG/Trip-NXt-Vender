import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import images from '../../config/images';
import { height } from '../../config/constants';
import colors from '../../config/colors';

const WrapperWithVideo = ({
  children,
  introWrapper = true,
  otherStyles = {},
}: {
  children: React.ReactNode;
  introWrapper?: boolean;
  otherStyles?: ViewStyle | ViewStyle[];
}) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.overlay} />
      <Video
        source={{
          uri: images.video,
        }}
        style={styles.videoStyles}
        repeat={true}
        resizeMode="cover"
      />
      {/* Foreground Content */}
      <View style={styles.content}>{children}</View>
      {/* {children} */}
    </View>
  );
};

export default WrapperWithVideo;

const styles = StyleSheet.create({
  videoStyles: { width: '100%', aspectRatio: 3 / 7 },
  container: {
    position: 'absolute',
    backgroundColor: colors.primary,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    height: height * 1,
    width: '100%',
    // opacity: 0.5,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: height * 1.4,
    backgroundColor: colors.primaryrgb,
    // opacity: 0.9, // adjust for transparency
    zIndex: 1,
  },
  content: {
    position: 'absolute', // <-- this is key to bring content above
    top: 0,
    left: 0,
    width: '100%',
    height: height * 1,
    zIndex: 2,
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
