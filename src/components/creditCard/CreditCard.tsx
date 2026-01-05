import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { width } from '../../config/constants';

interface CreditCardProps {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cardType?: 'amex' | 'visa' | 'mastercard' | 'generic';
  isBack?: boolean;
  style?: any;
}

const CreditCard: React.FC<CreditCardProps> = ({
  cardNumber,
  cardHolderName,
  expiryDate,
  cardType = 'generic',
  isBack = false,
  style,
}) => {
  const getCardBackgroundColor = () => {
    switch (cardType) {
      case 'amex':
        return '#FFD700'; // Gold for Amex
      case 'visa':
        return '#1A1F71'; // Blue for Visa
      case 'mastercard':
        return '#EB001B'; // Red for Mastercard
      default:
        return '#E8F4F8'; // Light blue/white for generic
    }
  };

  const getCardTextColor = () => {
    return cardType === 'amex' ? colors.c_2B2B2B : colors.white;
  };

  const formatCardNumber = (num: string) => {
    if (cardType === 'amex') {
      // Amex format: 3759 87853 21001
      return num.replace(/(\d{4})(\d{5})(\d{5})/, '$1 $2 $3');
    }
    // Standard format: 3759 876543 2001
    return num.replace(/(\d{4})(\d{6})(\d{4})/, '$1 $2 $3');
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: getCardBackgroundColor() },
        style,
      ]}
    >
      {!isBack && (
        <>
          {/* Card Type Logo */}
          {cardType === 'amex' && (
            <View style={styles.logoContainer}>
              <Text style={[styles.logoText, { color: getCardTextColor() }]}>
                AMERICAN EXPRESS
              </Text>
            </View>
          )}

          {/* Chip */}
          <View style={styles.chipContainer}>
            <View
              style={[styles.chip, { backgroundColor: getCardTextColor() }]}
            />
          </View>

          {/* Card Number */}
          <Text style={[styles.cardNumber, { color: getCardTextColor() }]}>
            {formatCardNumber(cardNumber)}
          </Text>

          {/* Card Holder Name and Expiry */}
          <View style={styles.cardFooter}>
            <Text
              style={[styles.cardHolderName, { color: getCardTextColor() }]}
            >
              {cardHolderName.toUpperCase()}
            </Text>
            <Text style={[styles.expiryDate, { color: getCardTextColor() }]}>
              {expiryDate}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default CreditCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    height: 200,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    letterSpacing: 1,
  },
  chipContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  chip: {
    width: 40,
    height: 30,
    borderRadius: 4,
  },
  cardNumber: {
    fontSize: 18,
    fontFamily: fonts.bold,
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHolderName: {
    fontSize: 12,
    fontFamily: fonts.medium,
    letterSpacing: 1,
  },
  expiryDate: {
    fontSize: 12,
    fontFamily: fonts.medium,
  },
});
