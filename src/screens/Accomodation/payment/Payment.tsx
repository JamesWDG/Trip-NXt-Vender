import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import CreditCard from '../../../components/creditCard/CreditCard';
import { width } from '../../../config/constants';
import {
  ChevronRightIcon,
  CameraIcon,
  MoveRight,
  ArrowRight,
} from 'lucide-react-native';
import images from '../../../config/images';

const Payment = () => {
  const navigation = useNavigation<NavigationPropType>();

  const handlePaymentWithdrawal = () => {
    // Handle payment withdrawal
    console.log('Payment withdrawal');
  };

  const handleAddNewCard = () => {
    // Navigate to add card screen
    console.log('MyWallet');
  };

  const handleScanCreditCard = () => {
    // Handle scan credit card
    console.log('Scan credit card');
  };

  // Sample card data
  const cards = [
    {
      id: 1,
      cardNumber: '37598785321001',
      cardHolderName: 'KENNETH LEE',
      expiryDate: '09/25',
      cardType: 'amex' as const,
    },
    {
      id: 2,
      cardNumber: '37598765432001',
      cardHolderName: 'LINDA BERG',
      expiryDate: '09/25',
      cardType: 'generic' as const,
    },
  ];

  const onAddNewCard = () => {
    navigation.navigate('MyWallet');
  };

  return (
    <WrapperContainer title="Payment Methode" navigation={navigation}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Balance Section */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$2,000.00</Text>
        </View>

        {/* Credit Cards Display */}
        <View style={styles.cardsContainer}>
          {/* American Express Card - Using Image */}
          <Image
            source={images.american_express}
            style={[styles.cardImage]}
            resizeMode="contain"
          />
        </View>

        {/* Payment Withdrawal Button */}
        <TouchableOpacity style={styles.buttonContainer} onPress={onAddNewCard}>
          <Text style={styles.addCardText}>Add new card</Text>
          <View style={styles.addCardIcon}>
            <ArrowRight color={colors.white} size={20} />
          </View>
        </TouchableOpacity>

        {/* Add New Card Section */}
        <View style={styles.addCardContainer}>
          <TouchableOpacity
            style={styles.scanCardButton}
            onPress={handleScanCreditCard}
          >
            <CameraIcon color={colors.c_666666} size={18} />
            <Text style={styles.scanCardText}>Scan Credit Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default Payment;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  balanceContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_EE4026,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  cardsContainer: {
    alignItems: 'center',
    marginBottom: 30,
    height: 300,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  buttonContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  withdrawalButton: {
    borderRadius: 12,
  },
  cardStyle: {
    position: 'absolute',
  },
  cardImage: {
    width: width * 1,
    height: 300,
    borderRadius: 16,
    position: 'absolute',
  },
  addCardContainer: {
    alignSelf: 'center',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addCardText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.c_0162C0,
  },
  addCardIcon: {
    width: 42,
    height: 42,
    borderRadius: 100,
    padding: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanCardText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
});
