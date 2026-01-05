import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface PlanCardProps {
  title: string;
  subtitle: string;
  isSelected: boolean;
  onPress: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  subtitle,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Radio Button at Top Center */}
      <View style={styles.radioContainer}>
        <View style={[styles.radioCircle, isSelected && styles.radioSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </View>
      
      {/* Title and Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PlanCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: colors.c_0162C0,
  },
  radioContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    textAlign: 'center',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.c_666666,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#00C853', // Green color
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C853', // Green color
  },
});

