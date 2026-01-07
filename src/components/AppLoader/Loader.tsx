import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';

interface LoaderProps {
  color?: string;
  size?: 'small' | 'large';
  flex?: number;
  justifyContent?: any;
}

const Loader = ({
  color = colors.white,
  size = 'small',
  flex = 0,
  justifyContent,
}: LoaderProps) => {
  return (
    <View
      style={[styles.container, { flex: flex, justifyContent: justifyContent }]}
    >
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
