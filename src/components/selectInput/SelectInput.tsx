import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ChevronDown } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface SelectInputProps {
  placeholder: string;
  value?: string;
  onPress: () => void;
  containerStyle?: any;
  error?: string;
  errorBorder?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  placeholder,
  value,
  onPress,
  containerStyle,
  error,
  errorBorder,
}) => {
  return (
    <View style={containerStyle}>
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
        <ChevronDown size={20} color={colors.c_666666} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default SelectInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderRadius: 100,
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
    color: colors.c_2B2B2B,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    fontFamily: fonts.normal,
    marginTop: 5,
    marginLeft: 4,
  },
});
