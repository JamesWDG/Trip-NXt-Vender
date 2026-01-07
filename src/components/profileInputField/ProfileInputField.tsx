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
  iconColor?: string;
  // editable?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
}

const ProfileInputField: React.FC<ProfileInputFieldProps> = ({
  icon: Icon,
  error,
  iconColor,
  // editable = true,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        styles.container,
        error && { borderColor: colors.red, borderWidth: 1 },
        containerStyle,
      ]}
    >
      {Icon && (
        <View style={styles.iconContainer} pointerEvents="none">
          <Icon size={20} color={iconColor || colors.c_666666} />
        </View>
      )}
      <TextInput
        style={[styles.input, style, ,]}
        placeholderTextColor={colors.c_666666}
        {...props}
      />
    </View>
    // <View>
    //   {error && <Text style={styles.errorText}>{error}</Text>}
    // </View>
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
