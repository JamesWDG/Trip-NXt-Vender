import { StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import React, { FC } from 'react';
import colors from '../../config/colors';
import { width } from '../../config/constants';
import fonts from '../../config/fonts';

interface Params {
  placeholder: string;
  title: string;
  otherStyles?: ViewStyle | ViewStyle[];
}

const Input: FC<Params> = ({ placeholder, title, otherStyles }) => {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        style={[styles.input, otherStyles]}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    marginTop: 8,
    width: width * 0.9,
    borderRadius: 100,
    height: 48,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.normal,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.white,
  },
});
