import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';

const MyWallet = () => {
  const [cardNumber, setCardNumber] = useState('****1234**5644');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const navigation = useNavigation<NavigationPropType>();
  const formatCardNumber = (text: string) => {
    // Remove all non-digits and asterisks
    const cleaned = text.replace(/[^\d*]/g, '');
    // Keep the format with asterisks
    if (cleaned.length <= 16) {
      return cleaned;
    }
    return cleaned.slice(0, 16);
  };

  const formatExpiryDate = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Format as MM/YY
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    setExpiryDate(formatted);
  };

  const handleConfirm = () => {
    console.log('Card details:', {
      cardNumber,
      cardHolderName,
      expiryDate,
      cvv,
    });
    // Navigate to success screen
    navigation.navigate('Congratulations');
  };

  return (
    <WrapperContainer title="Payment Methode" navigation={navigation}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add New Card Form */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Add New Card</Text>

          {/* Card Number Field */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.cardNumberInput]}
              placeholder="Card Number"
              placeholderTextColor={colors.c_666666}
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="default"
              maxLength={16}
            />
            <View style={styles.visaLogo}>
              <Text style={styles.visaText}>VISA</Text>
            </View>
          </View>

          {/* Card Holder Name Field */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Card Holder Name"
              placeholderTextColor={colors.c_666666}
              value={cardHolderName}
              onChangeText={setCardHolderName}
            />
          </View>

          {/* Expiry Date and CVV Row */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <TextInput
                style={styles.input}
                placeholder="Expiry Date"
                placeholderTextColor={colors.c_666666}
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <TextInput
                style={styles.input}
                placeholder="CVV Number"
                placeholderTextColor={colors.c_666666}
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>
          <GradientButtonForAccomodation
            title="Confirm Now"
            onPress={handleConfirm}
            fontSize={16}
            fontFamily={fonts.semibold}
            otherStyles={styles.confirmButton}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default MyWallet;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 100,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 100,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  cardNumberInput: {
    paddingRight: 70,
    letterSpacing: 1,
  },
  visaLogo: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
    backgroundColor: colors.c_0162C0,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  visaText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
});
