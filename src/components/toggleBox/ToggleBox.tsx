import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import colors from '../../config/colors';
const ToggleBox = ({ isChecked }: { isChecked: boolean }) => {
  return (
    <View>
      <CheckBox
        boxType="square"
        value={isChecked}
        tintColor={colors.primary}
        onCheckColor={colors.primary}
        onTintColor={colors.greenWithRgba}
        onFillColor={colors.greenWithRgba}
        style={styles.checkbox}
      />
    </View>
  );
};

export default ToggleBox;

const styles = StyleSheet.create({
  checkbox: {
    height: 16,
    width: 16,
  },
});
