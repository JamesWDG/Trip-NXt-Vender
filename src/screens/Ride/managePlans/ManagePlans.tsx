import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import PaymentHistoryCard from '../../../components/paymentHistoryCard/PaymentHistoryCard';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

type PlanType = 'Monthly Plan' | 'Yearly Plan' | 'Weekly Plan';

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  planType: PlanType;
  status: 'Paid' | 'Pending' | 'Failed';
}

// Sample data - replace with actual data from API/state
const samplePaymentHistory: PaymentHistory[] = [
  {
    id: '1',
    date: '01 Oct 2025',
    amount: 50,
    planType: 'Monthly Plan',
    status: 'Paid',
  },
  {
    id: '2',
    date: '01 Oct 2025',
    amount: 50,
    planType: 'Monthly Plan',
    status: 'Paid',
  },
  {
    id: '3',
    date: '01 Oct 2025',
    amount: 50,
    planType: 'Monthly Plan',
    status: 'Paid',
  },
  {
    id: '4',
    date: '01 Oct 2025',
    amount: 50,
    planType: 'Monthly Plan',
    status: 'Paid',
  },
];

const ManagePlans = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [paymentHistory] = useState(samplePaymentHistory);
  const currentPlan = 'Monthly';
  const expiryDate = '30 Oct 2025';

  const handleRenew = () => {
    // Handle renew action
    console.log('Renew pressed');
    // navigation.navigate('RenewPlan');
  };

  const handleUpgrade = () => {
    // Handle upgrade action
    console.log('Upgrade pressed');
    // navigation.navigate('UpgradePlan');
  };

  const handlePaymentPress = (payment: PaymentHistory) => {
    // Handle payment history card press
    console.log('Payment pressed:', payment);
    // navigation.navigate('PaymentDetails', { paymentId: payment.id });
  };

  return (
    <WrapperContainer navigation={navigation} title="Manage Plans">
      <View style={styles.container}>
        {/* Current Plan Section */}
        <View style={styles.planSection}>
          <Text style={styles.planLabel}>Current Plan: {currentPlan}</Text>
          <Text style={styles.expiryLabel}>Expiry Date: {expiryDate}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.renewButton}
            onPress={handleRenew}
            activeOpacity={0.8}
          >
            <Text style={styles.renewButtonText}>Renew</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={handleUpgrade}
            activeOpacity={0.8}
          >
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* Payment History Section */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Payment History</Text>
          <FlatList
            data={paymentHistory}
            renderItem={({ item }) => (
              <PaymentHistoryCard
                date={item.date}
                amount={item.amount}
                planType={item.planType}
                status={item.status}
                onPress={() => handlePaymentPress(item)}
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </WrapperContainer>
  );
};

export default ManagePlans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  planSection: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
    alignItems: 'center',
  },
  planLabel: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  expiryLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 24,
  },
  renewButton: {
    flex: 1,
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renewButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  upgradeButton: {
    flex: 1,
    backgroundColor: colors.c_666666,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  historySection: {
    flex: 1,
    paddingTop: 24,
  },
  historyTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 40,
  },
});
