import { StyleSheet, TextInput, TextInputProps, ViewStyle } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface CustomTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  containerStyle,
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={colors.c_666666}
      {...props}
    />
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 100,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
});
