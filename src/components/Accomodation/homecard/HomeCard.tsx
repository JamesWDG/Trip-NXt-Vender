import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../../config/colors';
import GeneralStyles from '../../../utils/GeneralStyles';
import { width } from '../../../config/constants';
import fonts from '../../../config/fonts';

interface HomeCardProps {
  title: string;
  description: string;
}
const HomeCard = ({ title, description }: HomeCardProps) => {
  return (
    <View style={[styles.container, GeneralStyles.shadow]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    borderColor: colors.c_666666,
    width: width * 0.4,
    height: 90,
    padding: 10,
    borderRadius: 10,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
  },
  description: {
    fontSize: 18,
    fontFamily: fonts.regular,
  },
});
