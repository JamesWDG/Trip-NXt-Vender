import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import colors from '../../config/colors';
import { NavigationProp } from '@react-navigation/native';
import PrimaryHeader from '../primaryHeader/PrimaryHeader';

const WrapperContainer = ({
  title,
  children,
  navigation,
  goBack = true,
  showRight = true,
  hideBack = false,
  onBackPress = null,
  onMenuPress = () => {},
}: {
  title: string;
  children: React.ReactNode;
  navigation?: NavigationProp<any>;
  goBack?: boolean;
  showRight?: boolean;
  hideBack?: boolean;
  onBackPress?: null | (() => void);
  onMenuPress?: () => void;
}) => {
  return (
    <View style={styles.container}>
      <PrimaryHeader
        title={title}
        showRight={showRight}
        hideBack={hideBack}
        onBackPress={() => onBackPress ? onBackPress() : navigation?.goBack()}
        goBack={goBack}
        onMenuPress={onMenuPress}
      />
      <View style={styles.scrollViewContent}>{children}</View>
    </View>
  );
};

export default WrapperContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.c_0162C0,
    flex: 1,
  },
  scrollViewContent: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingHorizontal: 20,
  },
});
