import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
} from 'react-native';
import  { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import VehicleCard from '../../../components/vehicleCard/VehicleCard';
import images from '../../../config/images';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { width, height, ShowToast } from '../../../config/constants';
import { Plus } from 'lucide-react-native';
import DrawerModalCab from '../../../components/drawers/DrawerModalCab';
import { useAppSelector } from '../../../redux/store';
import { useGetCabVendorByUserIdQuery, useSetCabVendorStatusMutation } from '../../../redux/services/cabService';
import { BASE_URL } from '../../../contants/api';
// Package exports default at runtime; types only declare named exports
import * as RNGeolocation from 'react-native-geolocation-service';
const Geolocation = (RNGeolocation as { default?: typeof RNGeolocation }).default ?? RNGeolocation;

const ASSETS_BASE = BASE_URL.replace(/\/api\/v\d+$/, ''); // https://api.trip-nxt.com

const resolveVehicleImageSource = (vehicleImage: string | { uri: string } | null | undefined): { uri: string } | number => {
  if (!vehicleImage) return images.car;
  const uri = typeof vehicleImage === 'string' ? vehicleImage : vehicleImage?.uri;
  if (!uri) return images.car;
  const absoluteUri = uri.startsWith('http') ? uri : `${ASSETS_BASE}/${uri.replace(/^\//, '')}`;
  return { uri: absoluteUri };
};

const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location permission',
      message: 'Trip-NXt needs your location to mark you as online for rides.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const getCurrentLocationHelper = async (): Promise<{ latitude: number; longitude: number }> => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    throw new Error('Location permission denied');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  });
};

// Sample data - replace with actual data from API/state
const sampleVehicles: Array<{
  id: string;
  image: any;
  vehicleName: string;
  licensePlate: string;
  description: string;
}> = [
    // Uncomment below to see vehicle cards
    // {
    //   id: '1',
    //   image: images.car,
    //   vehicleName: 'Volkswagen Golf',
    //   licensePlate: 'UP16CC1234',
    //   description: 'Lorem Ipsum is simply dummy text of the printing and typesetting.',
    // },
  ];

const MyVehicle = () => {
  const navigation = useNavigation<NavigationPropType>();
  const user = useAppSelector(state => state.auth.user);

  const { data: response, isLoading, refetch } = useGetCabVendorByUserIdQuery(Number(user?.id) || 0, {
    skip: !user?.id
  });
  const [setCabVendorStatus, { isLoading: isUpdatingStatus }] = useSetCabVendorStatusMutation();
  const [isOnline, setIsOnline] = useState(false);

  const cabVendor = response?.data;
  const vehicles = cabVendor ? [{
    id: String(cabVendor.id),
    image: resolveVehicleImageSource(cabVendor.vehicleImage),
    vehicleName: `${cabVendor.vehicleModal} (${cabVendor.vehicleType})`,
    licensePlate: cabVendor.vehicleNumber,
    description: `Year: ${cabVendor.vehicleYear}, Color: ${cabVendor.vehicleColor}`,
  }] : [];

  const [showMenu, setShowMenu] = useState(false);

  const onPressAddVehicle = () => {
    navigation.navigate('DriverRegistration');
  };

  const onPressFindARide = () => {
    navigation.navigate('RideRequest');
  };

  const onPressMarkAsOnline = async () => {
    if (!cabVendor?.id) {
      ShowToast('error', 'Vehicle not found');
      return;
    }
    try {
      
      const { latitude, longitude } = await getCurrentLocationHelper();
      console.log("latitude", latitude);
      console.log("longitude", longitude);
      await setCabVendorStatus({
        cabId: cabVendor.id,
        status: 'online',
        latitude,
        longitude,
      }).unwrap();
      setIsOnline(true);
      ShowToast('success', 'You are now online');
    } catch (e: any) {
      console.log(e , "Eeeeeeeeeeeee")
      ShowToast('error', e?.data?.message || e?.message || 'Failed to go online');
    }
  };

  const onPressMarkAsOffline = async () => {
    if (!cabVendor?.id) return;
    try {
      let latitude = 0;
      let longitude = 0;
      try {
        const loc = await getCurrentLocationHelper();
        latitude = loc.latitude;
        longitude = loc.longitude;
      } catch {
        // use 0,0 if location unavailable
      }
      await setCabVendorStatus({
        cabId: cabVendor.id,
        status: 'offline',
        latitude,
        longitude,
      }).unwrap();
      setIsOnline(false);
      ShowToast('success', 'You are now offline');
    } catch (e: any) {
      ShowToast('error', e?.data?.message || e?.message || 'Failed to go offline');
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value || 'N/A'}</Text>
    </View>
  );

  console.log(":::::::::::::::::::", vehicles)
  return (
    <WrapperContainer
      title="My Vehicle"
      navigation={navigation}
      goBack={false}
      onMenuPress={() => setShowMenu(true)}
    >
      <FlatList
        data={vehicles}
        ListEmptyComponent={() => {
          if (isLoading) return null;
          return (
            <>
              {/* Blue Banner */}
              <View style={styles.bannerContainer}>
                <Text style={styles.bannerTitle}>
                  Please Register Your vehicle.
                </Text>
                <Text style={styles.bannerSubtitle}>
                  You will be able to view your registered{'\n'}vehicle details
                  here
                </Text>
              </View>
              {/* Illustration */}
              <View style={styles.illustrationContainer}>
                <Image
                  source={images.empty_car}
                  style={styles.illustration}
                  resizeMode="contain"
                />
              </View>
            </>
          );
        }}
        renderItem={({ item }) => (
          <View>
            <VehicleCard
              image={item.image}
              vehicleName={item.vehicleName}
              licensePlate={item.licensePlate}
              description={item.description}
            />

            {/* Detailed Info Section */}
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>Driver Details</Text>
              <InfoRow label="Full Name" value={cabVendor?.user?.name} />
              <InfoRow label="Email" value={cabVendor?.user?.email} />
              <InfoRow label="Phone" value={cabVendor?.user?.phoneNumber} />
              <InfoRow label="Date of Birth" value={cabVendor?.dob} />
              <InfoRow label="Status" value={cabVendor?.status?.toUpperCase()} />

              <View style={styles.divider} />

              <Text style={styles.detailsTitle}>Vehicle Specifications</Text>
              <InfoRow label="Type" value={cabVendor?.vehicleType} />
              <InfoRow label="Model" value={cabVendor?.vehicleModal} />
              <InfoRow label="Year" value={cabVendor?.vehicleYear} />
              <InfoRow label="Color" value={cabVendor?.vehicleColor} />
              <InfoRow label="Plate Number" value={cabVendor?.vehicleNumber} />

              <View style={styles.divider} />

              <Text style={styles.detailsTitle}>Location Info</Text>
              <InfoRow label="City" value={cabVendor?.location?.city} />
              <InfoRow label="Street" value={cabVendor?.location?.street} />

              <View style={styles.divider} />

              <Text style={styles.detailsTitle}>Documents</Text>
              <View style={styles.docsGrid}>
                <View style={styles.docItem}>
                  <Text style={styles.docLabel}>Passport</Text>
                  {cabVendor?.passportPhoto ? (
                    <Image source={{ uri: cabVendor.passportPhoto }} style={styles.docImage} />
                  ) : (
                    <View style={styles.emptyDoc}><Text style={styles.emptyDocText}>N/A</Text></View>
                  )}
                </View>
                <View style={styles.docItem}>
                  <Text style={styles.docLabel}>License Front</Text>
                  {cabVendor?.driverLicenseFront ? (
                    <Image source={{ uri: cabVendor.driverLicenseFront }} style={styles.docImage} />
                  ) : (
                    <View style={styles.emptyDoc}><Text style={styles.emptyDocText}>N/A</Text></View>
                  )}
                </View>
                <View style={styles.docItem}>
                  <Text style={styles.docLabel}>License Back</Text>
                  {cabVendor?.driverLicenseBack ? (
                    <Image source={{ uri: cabVendor.driverLicenseBack }} style={styles.docImage} />
                  ) : (
                    <View style={styles.emptyDoc}><Text style={styles.emptyDocText}>N/A</Text></View>
                  )}
                </View>
                <View style={styles.docItem}>
                  <Text style={styles.docLabel}>Insurance Front</Text>
                  {cabVendor?.vehicleInsuranceFront ? (
                    <Image source={{ uri: cabVendor.vehicleInsuranceFront }} style={styles.docImage} />
                  ) : (
                    <View style={styles.emptyDoc}><Text style={styles.emptyDocText}>N/A</Text></View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.statusSection}>
              <Text style={styles.detailsTitle}>Driver status</Text>
              <Text style={styles.statusLabel}>{isOnline ? 'You are online' : 'You are offline'}</Text>
              {isOnline ? (
                <TouchableOpacity
                  style={[styles.findARideButton, styles.offlineButton]}
                  onPress={onPressMarkAsOffline}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <ActivityIndicator color={colors.white} size="small" />
                  ) : (
                    <Text style={styles.findARideText}>Mark as offline</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.findARideButton}
                  onPress={onPressMarkAsOnline}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <ActivityIndicator color={colors.white} size="small" />
                  ) : (
                    <Text style={styles.findARideText}>Mark as online</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.findARideContainer}>
              <TouchableOpacity
                style={styles.findARideButton}
                onPress={onPressFindARide}
              >
                <Text style={styles.findARideText}>Find a Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={refetch}
      />

      {!cabVendor && !isLoading && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onPressAddVehicle}
          activeOpacity={0.8}
        >
          <Plus color={colors.white} size={24} />
        </TouchableOpacity>
      )}

      <DrawerModalCab visible={showMenu} setIsModalVisible={setShowMenu} />
    </WrapperContainer>
  );
};

export default MyVehicle;

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
  },
  bannerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  illustration: {
    width: width * 0.9,
    height: height * 0.4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 120,
  },
  addButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
  statusSection: {
    marginTop: 20,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_666666,
    marginBottom: 10,
  },
  offlineButton: {
    backgroundColor: colors.c_666666,
  },
  findARideContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  findARideButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    width: '100%',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  findARideText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  detailsSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
    marginTop: 10,
  },
  detailsTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
    marginBottom: 12,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.c_F3F3F3,
    marginVertical: 12,
  },
  docsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  docItem: {
    width: '48%',
    marginBottom: 10,
  },
  docLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.c_666666,
    marginBottom: 4,
  },
  docImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.c_F3F3F3,
  },
  emptyDoc: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.c_F3F3F3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    borderStyle: 'dashed',
  },
  emptyDocText: {
    fontSize: 12,
    color: colors.c_666666,
  },
});
