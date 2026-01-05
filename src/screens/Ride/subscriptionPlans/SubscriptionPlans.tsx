import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import SelectInput from '../../../components/selectInput/SelectInput';
import PlanCard from '../../../components/planCard/PlanCard';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import CountryPicker from '../../../components/countryPicker/CountryPicker';
import { BottomSheetComponentRef } from '../../../components/bottomSheetComp/BottomSheetComp';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

type PlanType = 'monthly' | 'quarterly';

const SubscriptionPlans = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [selectedCountry, setSelectedCountry] = useState<string>('USA');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('quarterly');
  const activeStack = useSelector(
    (state: RootState) => state.navigation.activeStack,
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('Paypal');
  const countryPickerRef = useRef<BottomSheetComponentRef>(null);

  const handleCountrySelect = () => {
    countryPickerRef.current?.open();
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  const handlePaymentMethodSelect = () => {
    // Handle payment method selection
    console.log('Open payment method selection');
    // You can use a bottom sheet or modal here
  };

  const handleProceedToPayment = () => {
    // Handle proceed to payment
    console.log('Proceed to payment', {
      country: selectedCountry,
      plan: selectedPlan,
      paymentMethod: selectedPaymentMethod,
    });

    if (activeStack === 'RestaurantStack') {
      navigation.navigate('RestaurantStack', { screen: 'RestaurantHome' });
    } else if (activeStack === 'CabStack') {
      // Navigate to RestaurantHome
      navigation.navigate('Offline');
    } else if (activeStack === 'Accomodation') {
      navigation.navigate('Accomodation', { screen: 'Payment' });
    }
  };

  return (
    <WrapperContainer navigation={navigation} title="Subscription Plans">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Select Country Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Country</Text>
          <SelectInput
            placeholder="Select Country"
            value={selectedCountry}
            onPress={handleCountrySelect}
            containerStyle={GeneralStyles.rounded}
          />
        </View>

        {/* Choose Plan Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Plan</Text>
          <PlanCard
            title="Monthly"
            subtitle="$50 (USA) ₦20,000 (Nigeria)"
            isSelected={selectedPlan === 'monthly'}
            onPress={() => setSelectedPlan('monthly')}
          />
          <PlanCard
            title="3 Months"
            subtitle="3 Months: Discounted Plan"
            isSelected={selectedPlan === 'quarterly'}
            onPress={() => setSelectedPlan('quarterly')}
          />
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <SelectInput
            placeholder="Select Payment Method"
            value={selectedPaymentMethod}
            onPress={handlePaymentMethodSelect}
            containerStyle={GeneralStyles.rounded}
          />
        </View>

        {/* Proceed to Payment Button */}
        <View style={styles.buttonContainer}>
          <GradientButtonForAccomodation
            title="Proceed to Payment"
            onPress={handleProceedToPayment}
            fontSize={16}
            fontFamily={fonts.bold}
          />
        </View>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Status: Subscription Not Active</Text>
        </View>
      </ScrollView>

      {/* Country Picker Bottom Sheet */}
      <CountryPicker
        selectedCountry={selectedCountry}
        onCountrySelect={handleCountryChange}
        bottomSheetRef={countryPickerRef}
      />
    </WrapperContainer>
  );
};

export default SubscriptionPlans;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  statusContainer: {
    backgroundColor: '#FFF9E6', // Light yellow/gold
    borderRadius: 100,
    padding: 16,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
});
