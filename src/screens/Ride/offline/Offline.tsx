import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import StatusHeader from '../../../components/statusHeader/StatusHeader';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import { AlertCircle } from 'lucide-react-native';

const Offline = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isOnline, setIsOnline] = useState(false);
  const openRefModal = useRef<BottomSheetComponentRef>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      openRefModal.current?.open();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
      navigation.navigate('RideNumber');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <RideWrapper navigation={navigation}>
      <StatusHeader
        isOnline={isOnline}
        onMenuPress={handleMenuPress}
        onToggleChange={handleToggleChange}
        title={'Offline'}
      />
      <BottomSheetComponent ref={openRefModal}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Offline Banner */}
          <View style={styles.offlineBanner}>
            <View style={styles.offlineIndicator}>
              <View style={styles.offlineCircle}>
                <Text style={styles.offlineO}>O</Text>
              </View>
              <View style={styles.offlineTextContainer}>
                <Text style={styles.offlineText}>OFF</Text>
                <Text style={styles.offlineText}>LINE</Text>
              </View>
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>You are Offline</Text>
              <View style={styles.warningContainer}>
                <AlertCircle size={16} color={colors.white} />
                <Text style={styles.warningText}>
                  Your subscription is not active. Please renew to go online.
                </Text>
              </View>
            </View>
          </View>

          {/* User Profile Section */}
          <View style={styles.profileContainer}>
            <Image
              source={images.ronald_adams}
              style={styles.profileAvatar}
              resizeMode="cover"
            />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>Ronald Adam</Text>
              <Text style={styles.profileRole}>Driver</Text>
            </View>
            <View style={styles.earningsContainer}>
              <Text style={styles.earningsAmount}>$325.00</Text>
              <Text style={styles.earningsLabel}>Earned</Text>
            </View>
          </View>

          {/* Statistics Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Today Rides</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>$0</Text>
              <Text style={styles.statLabel}>Today Earning</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>---:---</Text>
              <Text style={styles.statLabel}>Expiry Date</Text>
            </View>
          </View>
        </ScrollView>
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default Offline;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 60,
  },
  offlineBanner: {
    backgroundColor: colors.c_EE4026,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  offlineCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineO: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_F59523,
  },
  offlineTextContainer: {
    alignItems: 'flex-start',
  },
  offlineText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.white,
    lineHeight: 14,
  },
  bannerContent: {
    flex: 1,
    gap: 8,
  },
  bannerTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.white,
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.white,
    gap: 12,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.c_F3F3F3,
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  profileRole: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  earningsContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  earningsAmount: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  earningsLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    textAlign: 'center',
  },
});
