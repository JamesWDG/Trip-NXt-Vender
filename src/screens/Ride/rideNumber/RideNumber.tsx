import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import StatusHeader from '../../../components/statusHeader/StatusHeader';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import { MessageCircle, Phone, Clock, MapPin } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import NavigationBanner from '../../../components/navigationBanner/NavigationBanner';

const RideNumber = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isOnline, setIsOnline] = useState(true);
  const bottomSheetRef = useRef<BottomSheetComponentRef>(null);

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
    const timer = setTimeout(() => {
      bottomSheetRef.current?.open();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleMessage = () => {
    // Handle message action
    console.log('Message pressed');
  };

  const handleCall = () => {
    // Handle call action
    console.log('Call pressed');
  };

  const handleCancel = () => {
    // Handle cancel action
    console.log('Cancel pressed');
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Pickup');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <RideWrapper navigation={navigation}>
      <StatusHeader
        title="Ride Number"
        isOnline={isOnline}
        onMenuPress={handleMenuPress}
        onToggleChange={handleToggleChange}
      />

      {/* Navigation Instruction Banner */}
      <NavigationBanner text="250m Turn right at 105 William St, Chicago, US" />

      {/* Bottom Sheet with Action Buttons */}
      <BottomSheetComponent
        ref={bottomSheetRef}
        snapPoints={['25%']}
        enableDynamicSizing={false}
        showBackdrop={false}
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.actionButtonsContainer}>
            {/* Message Button */}
            <TouchableOpacity
              style={styles.messageButton}
              onPress={handleMessage}
              activeOpacity={0.7}
            >
              <MessageCircle size={20} color={colors.white} />
            </TouchableOpacity>

            {/* Call Button */}
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <Phone size={20} color={colors.white} />
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default RideNumber;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.c_F3F3F3,
  },
  mapContent: {
    flex: 1,
    position: 'relative',
  },
  destinationMarker: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.c_0162C0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.c_0162C0,
    borderWidth: 2,
    borderColor: colors.white,
  },
  carMarker: {
    position: 'absolute',
    top: '50%',
    left: '30%',
    width: 50,
    height: 50,
  },
  carIcon: {
    width: '100%',
    height: '100%',
    tintColor: colors.c_F59523,
  },
  timeBadge: {
    position: 'absolute',
    bottom: '20%',
    right: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.c_0162C0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  timeBadgeText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  messageButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.c_0162C0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  callButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.c_F59523,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.c_0162C0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
