import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

const StripeConnection = () => {
  const navigation = useNavigation<NavigationProp<any>>();

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

        {/* Content will be added here */}
        <View style={styles.content}>
          <Text style={styles.contentText}>
            Stripe integration content will be added here
          </Text>
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
});













