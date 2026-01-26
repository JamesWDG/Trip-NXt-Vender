import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../config/colors';

interface Params {
  image: string;
  title: string;
  onPress?: () => void;
}
const IconsWithTitle = ({ image, title, onPress = () => {} }: Params) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.box]}>
        <Image source={image as ImageSourcePropType} />
      </View>
      <Text>{title}</Text>
    </Pressable>
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
