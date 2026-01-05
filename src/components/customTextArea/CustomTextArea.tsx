import { StyleSheet, TextInput, TextInputProps, ViewStyle } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface CustomTextAreaProps extends TextInputProps {
  containerStyle?: ViewStyle;
  numberOfLines?: number;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  containerStyle,
  style,
  numberOfLines = 4,
  ...props
}) => {
  return (
    <TextInput
      style={[styles.textArea, style]}
      placeholderTextColor={colors.c_666666}
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      {...props}
    />
  );
};

export default CustomTextArea;

const styles = StyleSheet.create({
  textArea: {
    width: '100%',
    height: 120,
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
});
