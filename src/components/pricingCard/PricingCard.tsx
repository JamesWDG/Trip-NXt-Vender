import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface PricingCardProps {
  planName: string;
  price: string;
  features: string[];
  isHighlighted?: boolean;
  hasBlueBorder?: boolean;
  onSelectPlan?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  planName,
  price,
  features,
  isHighlighted = false,
  hasBlueBorder = false,
  onSelectPlan,
}) => {
  return (
    <View
      style={[
        styles.card,
        isHighlighted && styles.highlightedCard,
        hasBlueBorder && styles.borderedCard,
      ]}
    >
      <Text style={[styles.planName, isHighlighted && styles.highlightedText]}>
        {planName}
      </Text>
      <Text style={[styles.price, isHighlighted && styles.highlightedText]}>
        {price}
      </Text>
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Text
            key={index}
            style={[
              styles.featureText,
              isHighlighted && styles.highlightedText,
            ]}
          >
            {feature}
          </Text>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.selectButton,
          isHighlighted ? styles.highlightedButton : styles.normalButton,
        ]}
        onPress={onSelectPlan}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.selectButtonText,
            isHighlighted && styles.highlightedButtonText,
          ]}
        >
          Select Plan
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PricingCard;

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    // alignSelf: 'center',
    justifyContent: 'center',
    // height: 400,
  },
  highlightedCard: {
    backgroundColor: colors.c_0162C0,
  },
  borderedCard: {
    borderWidth: 2,
    borderColor: colors.c_0162C0,
  },
  planName: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
  },
  highlightedText: {
    color: colors.white,
  },
  price: {
    fontSize: 36,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 24,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    lineHeight: 20,
  },
  selectButton: {
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalButton: {
    backgroundColor: colors.c_0162C0,
  },
  highlightedButton: {
    backgroundColor: colors.c_F59523,
  },
  selectButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  highlightedButtonText: {
    color: colors.white,
  },
});
