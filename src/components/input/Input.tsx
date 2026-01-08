import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { FC, useState } from 'react';
import colors from '../../config/colors';
import { width } from '../../config/constants';
import fonts from '../../config/fonts';
import { Eye, EyeOff } from 'lucide-react-native';

interface Params {
  placeholder: string;
  title: string;
  value: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  otherStyles?: ViewStyle | ViewStyle[];
  errorText?: boolean | string;
  errorBorder?: boolean;
}

const Input: FC<Params> = ({
  placeholder,
  title,
  otherStyles,
  onChangeText,
  value,
  secureTextEntry,
  keyboardType,
  errorText,
  errorBorder,
}) => {
  const [secure, setSecure] = useState<boolean>(true);
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View
        style={[
          styles.input,
          errorBorder && { borderWidth: 1.5, borderColor: colors.red },
        ]}
      >
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry ? secure : false}
          placeholderTextColor={colors.gray}
          style={[
            styles.inputStyle,
            // styles.input,
            otherStyles,
          ]}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            {secure ? (
              <EyeOff size={22} color="#666" />
            ) : (
              <Eye size={22} color="#666" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    marginTop: 8,
    width: '100%',
    // width: width * 0.9,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 48,
    backgroundColor: colors.white,
    // color: colors.black,
    // fontSize: 14,
    // fontFamily: fonts.normal,
  },
  inputStyle: {
    color: colors.black,
    fontSize: 14,
    // height: 48,
    width: '80%',
    // paddingHorizontal: 20,
    fontFamily: fonts.normal,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.white,
  },
  errorText: {
    color: colors.red,
    fontSize: 15,
    fontFamily: fonts.normal,
    marginTop: 5,
  },
});
