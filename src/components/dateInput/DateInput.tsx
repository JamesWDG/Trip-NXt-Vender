import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Calendar } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { width } from '../../config/constants';

interface DateInputProps {
  placeholder: string;
  value?: string;
  onPress: () => void;
  otherStyles?: any;
  error?: string;
  errorBorder?: boolean;
}

const DateInput = ({
  placeholder,
  value,
  onPress,
  otherStyles,
  error,
  errorBorder,
}: DateInputProps) => {
  return (
    <View style={otherStyles}>
      <TouchableOpacity
        style={[
          styles.container,
          errorBorder && { borderWidth: 1.5, borderColor: colors.red },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, value && styles.textWithValue]}>
          {value || placeholder}
        </Text>
        <Calendar size={20} color={colors.c_666666} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default DateInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    flex: 1,
  },
  textWithValue: {
    color: colors.black,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    fontFamily: fonts.normal,
    marginTop: 5,
    marginLeft: 4,
  },
});
