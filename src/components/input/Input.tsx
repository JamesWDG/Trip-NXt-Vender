import { StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import React, { FC } from 'react';
import colors from '../../config/colors';
import { width } from '../../config/constants';
import fonts from '../../config/fonts';

interface Params {
  placeholder: string;
  title: string;
  value: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  otherStyles?: ViewStyle | ViewStyle[];
  errorText?: boolean | string;
  errorBorder?: boolean;
}

const Input: FC<Params> = ({
  placeholder,
  title,
  otherStyles,
  onChangeText,
  value,
  secureTextEntry,
  keyboardType,
  errorText,
  errorBorder,
}) => {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={colors.gray}
        style={[
          styles.input,
          errorBorder && { borderWidth: 1.5, borderColor: colors.red },
          otherStyles,
        ]}
      />
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
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
  errorText: {
    color: colors.red,
    fontSize: 15,
    fontFamily: fonts.normal,
    marginTop: 5,
  },
});
