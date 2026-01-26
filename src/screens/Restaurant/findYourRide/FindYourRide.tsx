import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import StatusHeader from '../../../components/statusHeader/StatusHeader';
import Input from '../../../components/input/Input';
import GradientButton from '../../../components/gradientButton/GradientButton';
import { ShowToast } from '../../../config/constants';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';

const FindYourRide = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isOnline, setIsOnline] = useState(true);
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuPress = () => {
    // Handle hamburger menu press
  };

  const handleToggleChange = (newValue: boolean) => {
    setIsOnline(newValue);
  };

  const handleSave = async () => {
    // Validate inputs
    if (!riderName.trim()) {
      ShowToast('error', 'Please enter rider name');
      return;
    }

    if (!riderPhone.trim()) {
      ShowToast('error', 'Please enter rider phone number');
      return;
    }

    // Show loading for 2 seconds
    setIsLoading(true);

    try {
      // Simulate API call or processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success toast
      ShowToast('success', 'Rider details saved successfully');

      // Navigate back to RestaurantHome after a short delay
      setTimeout(() => {
        navigation.navigate('RestaurantHome');
      }, 500);
    } catch (error) {
      ShowToast('error', 'Failed to save rider details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RideWrapper navigation={navigation}>
      <StatusHeader
        title="Find Your Ride"
        isOnline={isOnline}
        goBack={true}
        onMenuPress={handleMenuPress}
        onToggleChange={handleToggleChange}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Input
              title="Rider Name"
              placeholder="Enter rider name"
              value={riderName}
              onChangeText={setRiderName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Input
              title="Phone Number"
              placeholder="Enter phone number"
              value={riderPhone}
              onChangeText={setRiderPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.buttonContainer}>
            <GradientButton
              title="Save"
              onPress={handleSave}
              loader={isLoading}
              disabled={isLoading}
              fontFamily={fonts.bold}
              fontSize={16}
              otherStyles={styles.saveButton}
            />
          </View>
        </View>
      </ScrollView>
    </RideWrapper>
  );
};

export default FindYourRide;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 30,
    ...GeneralStyles.paddingHorizontal,
  },
  saveButton: {
    borderRadius: 100,
    height: 50,
  },
});
