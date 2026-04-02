import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useCallback, useState } from 'react';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { useAppSelector } from '../../../redux/store';
import GeneralStyles from '../../../utils/GeneralStyles';
import { ShowToast } from '../../../config/constants';
import {
  useConfirmWalletPaymentMutation,
  useCreatePaymentIntentMutation,
} from '../../../redux/services/walletService';

type PaymentRoute = RouteProp<{ Payment: { balance?: number } }, 'Payment'>;

const Payment: FC<{ route: PaymentRoute }> = ({ route }) => {
  const navigation = useNavigation<NavigationPropType>();
  const region = useAppSelector(state => state.region.selectedRegion);
  const { confirmPayment } = useStripe();
  const [createPaymentIntent, { isLoading: isCreatingPaymentIntent }] =
    useCreatePaymentIntentMutation();
  const [confirmWalletPayment, { isLoading: isConfirmingPayment }] =
    useConfirmWalletPaymentMutation();
  const walletBalance = Number(route.params?.balance ?? 0);
  const [amount, setAmount] = useState<number>(0);
  const [cardComplete, setCardComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currencySymbol = region === 'NGN' ? '₦' : '$';

  const handleCardChange = useCallback((details: { complete?: boolean }) => {
    setCardComplete(!!details?.complete);
  }, []);

  const handleAddBalance = async () => {
    if (Number.isNaN(amount) || amount <= 0) {
      ShowToast('error', 'Enter a valid amount greater than zero.');
      return;
    }
    if (!cardComplete) {
      ShowToast('error', 'Enter complete card details.');
      return;
    }
    console.log('amount: ', amount);
    setSubmitting(true);
    try {
      const response = await createPaymentIntent({ amount }).unwrap();
      console.log('response: ', response);
      const { paymentIntent, error } = await confirmPayment(
        response.data.client_secret,
        {
          paymentMethodType: 'Card',
        },
      );
      console.log('paymentIntent: ', paymentIntent);
      if (error) {
        ShowToast('error', error.message);
        return;
      }
      const confirmResponse = await confirmWalletPayment({
        paymentIntentId: response.data.id,
      }).unwrap();
      console.log('confirmResponse: ', confirmResponse);
      if (confirmResponse.success) {
        ShowToast('success', 'Balance added successfully.');
        navigation.navigate('Congratulations');
      } else {
        ShowToast('error', confirmResponse.message);
      }
    } catch (error) {
      console.log('error: ', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WrapperContainer title="Add balance" navigation={navigation}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Balance summary */}
          <View style={[styles.summaryCard, GeneralStyles.shadow]}>
            <Text style={styles.summaryLabel}>Wallet balance</Text>
            <Text style={styles.summaryAmount}>
              {region === 'NGN'
                ? '₦' +
                  walletBalance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : `$${walletBalance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </Text>
          </View>

          {/* Amount */}
          <View style={[styles.sectionCard, GeneralStyles.shadow]}>
            <Text style={styles.sectionTitle}>Amount to add</Text>
            <View style={styles.hintBanner}>
              <View style={styles.hintAccentBar} />
              <Text style={styles.sectionHint}>
                Enter how much you want to add to your wallet.
              </Text>
            </View>
            <View style={styles.amountRow}>
              <View style={styles.currencyChip}>
                <Text style={styles.currencyChipText}>{currencySymbol}</Text>
              </View>
              <TextInput
                style={styles.amountInput}
                value={amount.toString()}
                onChangeText={text => setAmount(Number(text))}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.c_999999}
              />
            </View>
          </View>

          {/* Stripe card */}
          <View style={[styles.sectionCard, GeneralStyles.shadow]}>
            <Text style={styles.sectionTitle}>Card details</Text>
            <View style={styles.cardFieldWrap}>
              <CardField
                postalCodeEnabled={false}
                countryCode={region === 'NGN' ? 'NG' : 'US'}
                placeholders={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: colors.c_F6F6F6,
                  borderWidth: 1,
                  borderColor: colors.c_DDDDDD,
                  borderRadius: 12,
                  textColor: colors.c_2B2B2B,
                  placeholderColor: colors.c_999999,
                  fontSize: 16,
                }}
                style={styles.cardField}
                onCardChange={handleCardChange}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!cardComplete || submitting) && styles.primaryButtonDisabled,
            ]}
            onPress={handleAddBalance}
            disabled={!cardComplete || submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>Add balance</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

export default Payment;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.c_EE4026,
    marginBottom: 6,
  },
  summaryAmount: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 10,
  },
  hintBanner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgba(35, 109, 181, 0.07)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(35, 109, 181, 0.18)',
    paddingVertical: 12,
    paddingRight: 14,
    paddingLeft: 0,
    marginBottom: 14,
    overflow: 'hidden',
  },
  hintAccentBar: {
    width: 4,
    backgroundColor: colors.primary,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    marginRight: 12,
  },
  sectionHint: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_505050,
    lineHeight: 21,
    paddingTop: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.c_F6F6F6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    paddingHorizontal: 4,
    minHeight: 52,
  },
  currencyChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 4,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  currencyChipText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  maxLink: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  maxLinkText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  cardFieldWrap: {
    marginTop: 4,
  },
  cardField: {
    width: '100%',
    height: Platform.select({ ios: 50, android: 56 }) ?? 50,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
    minHeight: 54,
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 17,
    fontFamily: fonts.semibold,
  },
});
