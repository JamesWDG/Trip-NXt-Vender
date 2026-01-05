import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import { MessageCircle, Phone } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import StatusHeader from '../../../components/statusHeader/StatusHeader';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';

interface RiderDetailsProps {
  onClose?: () => void;
}

const RiderDetails: React.FC<RiderDetailsProps> = ({ onClose }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const bottomSheetRef = useRef<BottomSheetComponentRef>(null);
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // Open bottom sheet when component mounts
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
    // Close bottom sheet and navigate back to home
    bottomSheetRef.current?.close();
    setTimeout(() => {
      onClose?.();
      navigation.navigate('RestaurantHome');
    }, 300);
  };

  const handleOrderComplete = () => {
    // Navigate to order screen
    bottomSheetRef.current?.close();
    setTimeout(() => {
      onClose?.();
      navigation.navigate('Orders');
    }, 300);
  };

  const handleChangeFrom = () => {
    // Handle change from location
    console.log('Change From pressed');
  };

  const handleChangeTo = () => {
    // Handle change to location
    console.log('Change To pressed');
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
  return (
    <RideWrapper navigation={navigation}>
      <StatusHeader
        title="Rider Details"
        isOnline={isOnline}
        goBack={true}
        onMenuPress={handleMenuPress}
        onToggleChange={handleToggleChange}
      />

      <BottomSheetComponent
        ref={bottomSheetRef}
        snapPoints={['85%', '90%']}
        enablePanDownToClose={true}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>Rider Details</Text>

          {/* Rider Information */}
          <View style={styles.riderInfo}>
            <Image
              source={images.avatar}
              style={styles.riderImage}
              resizeMode="cover"
            />
            <View style={styles.riderDetails}>
              <Text style={styles.riderName}>Lorem Ipsum</Text>
              <View style={styles.phoneContainer}>
                <Phone size={16} color={colors.c_666666} />
                <Text style={styles.phoneNumber}>123 456 7890</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={handleMessage}
                activeOpacity={0.8}
              >
                <MessageCircle size={20} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.callButton}
                onPress={handleCall}
                activeOpacity={0.8}
              >
                <Phone size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Vehicle Information */}
          <View style={styles.vehicleInfo}>
            <Image
              source={images.placeholder}
              style={styles.vehicleImage}
              resizeMode="contain"
            />
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleName}>Volkswagen Golf</Text>
              <Text style={styles.licensePlate}>UP16CC1234</Text>
            </View>
          </View>

          {/* Journey Details */}
          <View style={styles.journeySection}>
            <Text style={styles.journeyTitle}>Journey Details</Text>

            {/* From Location */}
            <View style={styles.locationField}>
              <View style={styles.locationDot} />
              <View style={styles.locationContent}>
                <Text style={styles.locationLabel}>From:</Text>
                <Text style={styles.locationText}>Lorem Ipsum Dummy Text</Text>
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={handleChangeFrom}
                activeOpacity={0.8}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* To Location */}
            <View style={styles.locationField}>
              <View style={styles.locationDot} />
              <View style={styles.locationContent}>
                <Text style={styles.locationLabel}>To:</Text>
                <Text style={styles.locationText}>Lorem Ipsum Dummy Text</Text>
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={handleChangeTo}
                activeOpacity={0.8}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleOrderComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>Order Complete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default RiderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 24,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  riderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.c_F3F3F3,
  },
  riderDetails: {
    flex: 1,
    marginLeft: 16,
  },
  riderName: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneNumber: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.c_0162C0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    padding: 16,
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
  },
  vehicleImage: {
    width: 100,
    height: 60,
  },
  vehicleDetails: {
    flex: 1,
    marginLeft: 16,
  },
  vehicleName: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.c_0162C0,
  },
  journeySection: {
    marginBottom: 32,
  },
  journeyTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 16,
  },
  locationField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.c_F47E20,
    marginRight: 12,
  },
  locationContent: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.c_DDDDDD,
    borderRadius: 8,
  },
  changeButtonText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.c_B40000,
    borderRadius: 100,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  completeButton: {
    flex: 1,
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
});
