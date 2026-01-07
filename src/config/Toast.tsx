import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
import colors from './colors';

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const ToastConfig = {
  error: ({ text1, text2 }: CustomToastProps) => (
    <View style={[styles.container, styles.errorContainer]}>
      {text1 && <Text style={styles.errorText}>{text1}</Text>}
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  ),

  success: ({ text1, text2 }: CustomToastProps) => (
    <View style={[styles.container, styles.successContainer]}>
      {text1 && <Text style={styles.successText}>{text1}</Text>}
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  ),

  delete: ({ text1, text2 }: CustomToastProps) => (
    <View style={[styles.container, styles.errorContainer]}>
      {text1 && <Text style={styles.errorText}>{text1}</Text>}
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  ),
};

export default ToastConfig;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
    height: 52,
    padding: 12,
    borderRadius: 12,
  },

  text2: {
    color: 'white',
    fontSize: 12,
    marginLeft: 8,
  },

  // Error style
  errorContainer: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: '#D92D20',
  },

  errorText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },

  // Success style

  successContainer: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  successText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});
