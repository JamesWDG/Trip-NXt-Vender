import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';
import { useAppSelector } from '../../redux/store';

interface EarningsSummaryCardProps {
  value: number;
  label: string;
  isHighlighted?: boolean;
}

const EarningsSummaryCard: React.FC<EarningsSummaryCardProps> = ({
  value,
  label,
  isHighlighted = false,
}) => {
  const region = useAppSelector((state) => state.region.selectedRegion);

  const formatAmount = (amt: number) => {
    const formatted = amt.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    if (region === 'NGN') {
      return `₦${formatted}`;
    }
    return `$${formatted}`;
  };

  return (
    <View
      style={[
        styles.card,
        GeneralStyles.shadow,
        isHighlighted && styles.highlightedCard,
      ]}
    >
      <Text style={[styles.value,{fontSize: region === 'NGN' ? 16 : 24}]}>{formatAmount(value)}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default EarningsSummaryCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.c_DDDDDD,
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: colors.c_0162C0,
  },
  value: {
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    textAlign: 'center',
  },
});
