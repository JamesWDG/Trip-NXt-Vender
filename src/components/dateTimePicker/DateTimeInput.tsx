import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Clock, Calendar } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { PickerMode } from './DateTimePicker';

interface DateTimeInputProps {
  placeholder: string;
  value?: string;
  onPress: () => void;
  mode?: PickerMode;
  otherStyles?: any;
}

const DateTimeInput = ({
  placeholder,
  value,
  onPress,
  mode = 'time',
  otherStyles,
}: DateTimeInputProps) => {
  const Icon = mode === 'date' ? Calendar : Clock;

  return (
    <TouchableOpacity
      style={[styles.container, otherStyles]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, value && styles.textWithValue]}>
        {value || placeholder}
      </Text>
      <Icon size={20} color={colors.c_666666} />
    </TouchableOpacity>
  );
};

export default DateTimeInput;

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
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
});










