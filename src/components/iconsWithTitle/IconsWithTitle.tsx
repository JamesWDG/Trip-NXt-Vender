import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../config/colors';

interface Params {
  image: string;
  title: string;
}
const IconsWithTitle = ({ image, title }: Params) => {
  return (
    <View style={styles.container}>
      <View style={[styles.box]}>
        <Image source={image as ImageSourcePropType} />
      </View>
      <Text>{title}</Text>
    </View>
  );
};

export default IconsWithTitle;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
  },
  box: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06, // 0x0F ≈ 15/255 ≈ 0.06
    shadowRadius: 3,
    padding: 10,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,

    // Android shadow
    elevation: 2,
    backgroundColor: colors.c_F6F6F6,
  },
  // iOS shadow
});
