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
}

const DateInput = ({
  placeholder,
  value,
  onPress,
  otherStyles,
}: DateInputProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, otherStyles]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, value && styles.textWithValue]}>
        {value || placeholder}
      </Text>
      <Calendar size={20} color={colors.c_666666} />
    </TouchableOpacity>
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
});
