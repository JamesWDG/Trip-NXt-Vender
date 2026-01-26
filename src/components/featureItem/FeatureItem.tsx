import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface FeatureItemProps {
  icon: string;
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  label,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
        <Image source={{ uri: icon }} style={styles.icon} />
      </View>
      <Text style={[styles.label, isSelected && styles.selectedLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default FeatureItem;

const styles = StyleSheet.create({
  container: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
    marginBottom: 12,
  },
  selectedContainer: {
    backgroundColor: colors.c_0162C0,
    borderColor: colors.c_0162C0,
  },
  iconContainer: {
    marginBottom: 8,
    backgroundColor: 'red',
  },
  selectedIconContainer: {
    // Additional styling if needed
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    textAlign: 'center',
  },
  selectedLabel: {
    color: colors.white,
    fontFamily: fonts.medium,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

