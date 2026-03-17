import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { useCreateStripeVendorAccountMutation } from '../../../redux/services/vendorService';

const StripeConnection = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [createStripeAccount, { isLoading }] = useCreateStripeVendorAccountMutation();

  const handleConnectStripe = async () => {
    try {
      const res: any = await createStripeAccount().unwrap();
      // Backend response shape:
      // { success, message, data: { stripeVenderAccount: { url, ... } } }
      const accountLink = res?.data?.stripeVenderAccount || res?.stripeVenderAccount;
      const url =
        accountLink?.url ||
        accountLink?.accountLink?.url ||
        null;

      if (!url) {
        Alert.alert('Error', 'Unable to get Stripe onboarding link.');
        return;
      }

      // Navigate to in-app Web screen to show Stripe onboarding page
      navigation.navigate('Web', { url });
    } catch (e: any) {
      Alert.alert('Error', e?.data?.message || 'Failed to start Stripe onboarding.');
    }
  };

  return (
    <WrapperContainer title="Connect to Stripe" navigation={navigation}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Connect to Stripe</Text>
          <Text style={styles.subtitle}>
            Securely connect your Stripe account to receive payments
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.contentText}>
            Connect your Stripe Express account to receive payouts from Trip Nxt.
          </Text>
          <TouchableOpacity
            style={styles.connectButton}
            disabled={isLoading}
            onPress={handleConnectStripe}
          >
            <Text style={styles.connectButtonText}>
              {isLoading ? 'Connecting…' : 'Connect with Stripe'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default StripeConnection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  content: {
    marginTop: 20,
  },
  contentText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  connectButton: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontFamily: fonts.medium,
    fontSize: 16,
  },
});















