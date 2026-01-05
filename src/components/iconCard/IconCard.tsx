import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
interface Params {
  name: string;
  icon: string;
}
const IconCard = ({ name, icon }: Params) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={icon as ImageSourcePropType}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

export default IconCard;
// border: 0.5px solid #DDDDDD
const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    borderWidth: 0.5,
    borderColor: colors.c_DDDDDD,
    backgroundColor: colors.c_F6F6F6,
    height: 50,
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 20,
    width: 20,
  },
  name: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.black,
  },
});
