import { StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import colors from '../../config/colors';

interface Params {
  height: number;
  color: string;
  width: number | string;
}
const Divider = ({ height, color, width }: Params) => {
  const DividerStyles = useMemo(
    () => styles(color, height, width),
    [color, height, width],
  );
  return <View style={DividerStyles.container} />;
};
export default Divider;

const styles = (color: string, height: number, width: number | string) =>
  StyleSheet.create({
    container: {
      height: height,
      borderRadius: 100,
      width: width,
      backgroundColor: color,
    },
  });
