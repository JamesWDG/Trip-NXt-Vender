import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { LucideIcon } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface ProfileInputFieldProps extends TextInputProps {
  icon?: LucideIcon;
  containerStyle?: ViewStyle;
}

const ProfileInputField: React.FC<ProfileInputFieldProps> = ({
  icon: Icon,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {Icon && (
        <View style={styles.iconContainer}>
          <Icon size={20} color={colors.c_666666} />
        </View>
      )}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.c_666666}
        {...props}
      />
    </View>
  );
};

export default ProfileInputField;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    marginBottom: 16,
    paddingHorizontal: 16,
    minHeight: 50,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    paddingVertical: 0,
  },
});
