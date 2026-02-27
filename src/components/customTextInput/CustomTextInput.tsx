import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface CustomTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  errorBorder?: boolean;
  errorText?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  containerStyle,
  style,
  errorBorder,
  errorText,
  ...props
}) => {
  return (
    <View>
      <TextInput
        style={[
          styles.input,
          style,
          errorBorder && { borderWidth: 1.5, borderColor: colors.red },
          props.editable === false && { backgroundColor: colors.c_DDDDDD, opacity: 0.7 },
        ]}
        placeholderTextColor={colors.c_666666}
        {...props}
      />
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
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
  errorText: {
    color: colors.red,
    fontSize: 12,
    fontFamily: fonts.normal,
    marginTop: 5,
  },
});
