import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import StatusHeader from '../../../components/statusHeader/StatusHeader';

const FindYourRide = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isOnline, setIsOnline] = useState(true);

  const handleMessage = () => {
    // Handle message action
    console.log('Message pressed');
  };

  const handleMenuPress = () => {
    // Handle hamburger menu press
    // You can add drawer navigation or other menu actions here
  };
  const handleToggleChange = (newValue: boolean) => {
    setIsOnline(newValue);
    // Handle online/offline status change
    // You can add API calls or other logic here
  };

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('RiderDetails');
    }, 3000);
  }, []);
  return (
    <RideWrapper navigation={navigation}>
      <StatusHeader
        title="Find Your Ride"
        isOnline={isOnline}
        goBack={true}
        onMenuPress={handleMenuPress}
        onToggleChange={handleToggleChange}
      />
      <></>
    </RideWrapper>
  );
};

export default FindYourRide;

const styles = StyleSheet.create({});
