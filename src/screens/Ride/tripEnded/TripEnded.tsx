import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import StatusHeader from '../../../components/statusHeader/StatusHeader';

const TripEnd = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isOnline, setIsOnline] = useState(false);

  const handleMenuPress = () => {
    // Handle hamburger menu press
    // You can add drawer navigation or other menu actions here
  };

  const handleToggleChange = (newValue: boolean) => {
    setIsOnline(newValue);
    // Handle online/offline status change
    // You can add API calls or other logic here
  };
  return (
    <RideWrapper navigation={navigation}>
      <StatusHeader title="Ride Number" isOnline={false} />
    </RideWrapper>
  );
};

export default TripEnd;

const styles = StyleSheet.create({});
