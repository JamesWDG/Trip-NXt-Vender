import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import fonts from '../../config/fonts';
import { NavigationProp } from '@react-navigation/native';
import Divider from '../divider/Divider';

interface Params {
  image: string;
  title: string;
  divider?: boolean | string;
  dividerColor?: string;
  onPress: () => void;
}
const IconWithTitleAndDivider = ({
  image,
  title,
  divider,
  dividerColor = '',
  onPress,
}: Params) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={image as ImageSourcePropType} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {divider && <Divider height={0.5} color={dividerColor} width="100%" />}
    </TouchableOpacity>
  );
};

export default IconWithTitleAndDivider;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: '100%',
    paddingVertical: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.normal,
  },
});
