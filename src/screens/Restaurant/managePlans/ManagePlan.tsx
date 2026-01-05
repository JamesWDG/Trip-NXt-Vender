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
import RestaurantTabButtons from '../../../components/restaurantTabButtons/RestaurantTabButtons';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import PlanCard from '../../../components/planCard/PlanCard';
type PlanType = 'monthly' | 'quarterly';

const ManagePlan = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('quarterly');

  const handleRenew = () => {
    console.log('Renew');
  };
  const handleUpgrade = () => {
    console.log('Upgrade');
  };
  return (
    <WrapperContainer navigation={navigation} title="Manage Plan">
      <View style={styles.tabContainer}>
        <RestaurantTabButtons
          data={[
            'Restaurant Info',
            'Subscritions',
            'Account Setting',
            'App Setting',
          ]}
        />
      </View>

      <FlatList
        data={[1]}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          return (
            <>
              <View style={styles.planSection}>
                <Text style={styles.planLabel}>Current Plan: Monthly</Text>
                <Text style={styles.planExpiry}>Expiry Date: 2025-01-01</Text>
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
            </>
          );
        }}
      />
    </WrapperContainer>
  );
};

export default ManagePlan;

const styles = StyleSheet.create({
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 24,
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
  listContainer: {
    paddingHorizontal: 20,
  },
  planSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  planLabel: {
    fontSize: 24,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 4,
  },
  planExpiry: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  tabContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
});
