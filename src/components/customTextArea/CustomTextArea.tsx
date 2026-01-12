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

interface CustomTextAreaProps extends TextInputProps {
  containerStyle?: ViewStyle;
  numberOfLines?: number;
  errorText?: string;
  errorBorder?: boolean;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  containerStyle,
  style,
  numberOfLines = 4,
  errorBorder,
  errorText,
  ...props
}) => {
  return (
    <View>
      <TextInput
        style={[
          styles.textArea,
          style,
          errorBorder && { borderWidth: 1.5, borderColor: colors.red },
        ]}
        placeholderTextColor={colors.c_666666}
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
      />
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
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
  errorText: {
    color: colors.red,
    fontSize: 12,
    fontFamily: fonts.normal,
    marginTop: 5,
  },
});
