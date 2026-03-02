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
  TextInput,
  Modal,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
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
import { useAppSelector, useAppDispatch } from '../../../redux/store';
import { updateRegistrationData } from '../../../redux/slices/registrationSlice';
import { useGetCabVendorByUserIdQuery, useSetCabVendorStatusMutation, useUpdateCabVendorMutation } from '../../../redux/services/cabService';
import { BASE_URL } from '../../../contants/api';

const ASSETS_BASE = BASE_URL.replace(/\/api\/v\d+$/, ''); // e.g. https://api.trip-nxt.com or http://192.168.1.171:5003

/** Rewrite localhost/127.0.0.1 image URLs so device/emulator can load them (localhost on device is not your machine). */
const resolveImageUri = (uri: string | null | undefined): string | null => {
  if (!uri || typeof uri !== 'string') return null;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(uri)) {
    return uri.replace(/^(https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?)/, ASSETS_BASE.replace(/\/$/, ''));
  }
  if (!uri.startsWith('http')) return `${ASSETS_BASE}/${uri.replace(/^\//, '')}`;
  return uri;
};

const resolveVehicleImageSource = (vehicleImage: string | { uri: string } | null | undefined): { uri: string } | number => {
  if (!vehicleImage) return images.car;
  const uri = typeof vehicleImage === 'string' ? vehicleImage : vehicleImage?.uri;
  if (!uri) return images.car;
  const absoluteUri = resolveImageUri(uri) ?? uri;
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

  let Geolocation: { getCurrentPosition: (s: (p: any) => void, e: (err: any) => void, o: object) => void };
  try {
    const RNGeolocation = require('react-native-geolocation-service');
    Geolocation = (RNGeolocation as { default?: typeof RNGeolocation }).default ?? RNGeolocation;
  } catch (_) {
    throw new Error(
      'Location service unavailable. Please clean and rebuild the app (see console for steps).'
    );
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
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const { data: response, isLoading, refetch } = useGetCabVendorByUserIdQuery(
    Number(user?.id) || 0,
    {
      skip: !user?.id,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );
  const [setCabVendorStatus, { isLoading: isUpdatingStatus }] = useSetCabVendorStatusMutation();
  const [updateCabVendor, { isLoading: isUpdatingCab }] = useUpdateCabVendorMutation();
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
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [editForm, setEditForm] = useState({
    vehicleModal: cabVendor?.vehicleModal || '',
    vehicleYear: cabVendor?.vehicleYear ? String(cabVendor.vehicleYear) : '',
    vehicleColor: cabVendor?.vehicleColor || '',
    vehicleNumber: cabVendor?.vehicleNumber || '',
  });

  useEffect(() => {
    if (cabVendor) {
      setEditForm({
        vehicleModal: cabVendor.vehicleModal || '',
        vehicleYear: cabVendor.vehicleYear ? String(cabVendor.vehicleYear) : '',
        vehicleColor: cabVendor.vehicleColor || '',
        vehicleNumber: cabVendor.vehicleNumber || '',
      });
    }
  }, [cabVendor?.vehicleModal, cabVendor?.vehicleYear, cabVendor?.vehicleColor, cabVendor?.vehicleNumber]);

  const onPressAddVehicle = () => {
    navigation.navigate('DriverRegistration');
  };

  const onPressFindARide = () => {
    navigation.navigate('RideRequest');
  };

  const prefillRegistrationFromCab = () => {
    if (!cabVendor) return;
    dispatch(updateRegistrationData({
      cabVendorId: cabVendor.id,
      // Driver
      fullName: cabVendor.user?.name ?? '',
      dob: cabVendor.dob ?? '',
      phoneNumber: cabVendor.user?.phoneNumber ?? '',
      email: cabVendor.user?.email ?? '',
      address: cabVendor.location?.street ?? '',
      passportPhoto: cabVendor.passportPhoto ?? null,
      // Driver docs
      driverLicenseFront: cabVendor.driverLicenseFront ?? null,
      driverLicenseBack: cabVendor.driverLicenseBack ?? null,
      // Vehicle docs
      vehicleInsuranceFront: cabVendor.vehicleInsuranceFront ?? null,
      vehicleInsuranceBack: cabVendor.vehicleInsuranceBack ?? null,
      // Vehicle
      vehicleType: cabVendor.vehicleType ?? '',
      vehicleModal: cabVendor.vehicleModal ?? '',
      vehicleYear: cabVendor.vehicleYear ? String(cabVendor.vehicleYear) : '',
      vehicleNumber: cabVendor.vehicleNumber ?? '',
      vehicleColor: cabVendor.vehicleColor ?? '',
      vehicleImage: cabVendor.vehicleImage ?? null,
    }));
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const openPreview = (uri: string | null | undefined) => {
    const resolved = resolveImageUri(uri);
    if (resolved) setPreviewImage(resolved);
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

  // Continuous location tracking when online so backend can track cab vendor
  const LOCATION_UPDATE_INTERVAL_MS = 12 * 1000;
  const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOnline || !cabVendor?.id) {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
      return;
    }
    const updateLocation = () => {
      getCurrentLocationHelper()
        .then(({ latitude, longitude }) => {
          setCabVendorStatus({
            cabId: cabVendor.id,
            status: 'online',
            latitude,
            longitude,
          }).unwrap().catch(() => {});
        })
        .catch(() => {});
    };
    locationIntervalRef.current = setInterval(updateLocation, LOCATION_UPDATE_INTERVAL_MS);
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
  }, [isOnline, cabVendor?.id]);

  const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value || 'N/A'}</Text>
    </View>
  );

  console.log(cabVendor ,vehicles, "cabVendorcabVendorcabVendor")

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
              onPress={() => openPreview(cabVendor?.vehicleImage)}
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
              {isEditingVehicle ? (
                <>
                  <InfoRow label="Type" value={cabVendor?.vehicleType} />
                  <View style={styles.editRow}>
                    <Text style={styles.infoLabel}>Model:</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editForm.vehicleModal}
                      onChangeText={(text) => setEditForm({ ...editForm, vehicleModal: text })}
                      placeholder="Vehicle model"
                    />
                  </View>
                  <View style={styles.editRow}>
                    <Text style={styles.infoLabel}>Year:</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editForm.vehicleYear}
                      onChangeText={(text) => setEditForm({ ...editForm, vehicleYear: text })}
                      keyboardType="numeric"
                      placeholder="Year"
                    />
                  </View>
                  <View style={styles.editRow}>
                    <Text style={styles.infoLabel}>Color:</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editForm.vehicleColor}
                      onChangeText={(text) => setEditForm({ ...editForm, vehicleColor: text })}
                      placeholder="Color"
                    />
                  </View>
                  <View style={styles.editRow}>
                    <Text style={styles.infoLabel}>Plate Number:</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editForm.vehicleNumber}
                      onChangeText={(text) => setEditForm({ ...editForm, vehicleNumber: text })}
                      placeholder="Plate number"
                    />
                  </View>
                  <View style={styles.editActionsRow}>
                    <TouchableOpacity
                      style={[styles.editButton, styles.editCancelButton]}
                      onPress={() => {
                        setIsEditingVehicle(false);
                        if (cabVendor) {
                          setEditForm({
                            vehicleModal: cabVendor.vehicleModal || '',
                            vehicleYear: cabVendor.vehicleYear ? String(cabVendor.vehicleYear) : '',
                            vehicleColor: cabVendor.vehicleColor || '',
                            vehicleNumber: cabVendor.vehicleNumber || '',
                          });
                        }
                      }}
                    >
                      <Text style={styles.editCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editButton, styles.editSaveButton]}
                      disabled={isUpdatingCab}
                      onPress={async () => {
                        if (!cabVendor?.id) return;
                        const yearNum = parseInt(editForm.vehicleYear, 10);
                        const formData = new FormData();
                        formData.append('vehicleModal', editForm.vehicleModal);
                        formData.append('vehicleYear', !Number.isNaN(yearNum) ? String(yearNum) : '');
                        formData.append('vehicleColor', editForm.vehicleColor);
                        formData.append('vehicleNumber', editForm.vehicleNumber);
                        try {
                          await updateCabVendor({ id: cabVendor.id, formData } as any).unwrap();
                          ShowToast('success', 'Vehicle details updated');
                          setIsEditingVehicle(false);
                          refetch();
                        } catch (e: any) {
                          ShowToast('error', e?.data?.message || e?.message || 'Failed to update vehicle');
                        }
                      }}
                    >
                      {isUpdatingCab ? (
                        <ActivityIndicator color={colors.white} size="small" />
                      ) : (
                        <Text style={styles.editSaveText}>Save</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <InfoRow label="Type" value={cabVendor?.vehicleType} />
                  <InfoRow label="Model" value={cabVendor?.vehicleModal} />
                  <InfoRow label="Year" value={cabVendor?.vehicleYear} />
                  <InfoRow label="Color" value={cabVendor?.vehicleColor} />
                  <InfoRow label="Plate Number" value={cabVendor?.vehicleNumber} />
               
                </>
              )}

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
                    <TouchableOpacity activeOpacity={0.8} onPress={() => openPreview(cabVendor.passportPhoto)}>
                      <Image
                        source={{ uri: resolveImageUri(cabVendor.passportPhoto) ?? cabVendor.passportPhoto }}
                        style={styles.docImage}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.emptyDoc}><Text style={styles.emptyDocText}>N/A</Text></View>
                  )}
                </View>
                <View style={styles.docItem}>
                  <Text style={styles.docLabel}>License Front</Text>
                  {cabVendor?.driverLicenseFront ? (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => openPreview(cabVendor.driverLicenseFront)}>
                      <Image
                        source={{ uri: resolveImageUri(cabVendor.driverLicenseFront) ?? cabVendor.driverLicenseFront }}
                        style={styles.docImage}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.emptyDoc}><Text style={styles.emptyDocText}>N/A</Text></View>
                  )}
                </View>
                <View style={styles.docItem}>
                  <Text style={styles.docLabel}>License Back</Text>
                  {cabVendor?.driverLicenseBack ? (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => openPreview(cabVendor.driverLicenseBack)}>
                      <Image
                        source={{ uri: resolveImageUri(cabVendor.driverLicenseBack) ?? cabVendor.driverLicenseBack }}
                        style={styles.docImage}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.emptyDoc}><Text style={styles.emptyDocText}>N/A</Text></View>
                  )}
                </View>
                <View style={styles.docItem}>
                  <Text style={styles.docLabel}>Insurance Front</Text>
                  {cabVendor?.vehicleInsuranceFront ? (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => openPreview(cabVendor.vehicleInsuranceFront)}>
                      <Image
                        source={{ uri: resolveImageUri(cabVendor.vehicleInsuranceFront) ?? cabVendor.vehicleInsuranceFront }}
                        style={styles.docImage}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.emptyDoc}><Text style={styles.emptyDocText}>N/A</Text></View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.statusSection}>
              <Text style={styles.detailsTitle}>Driver status</Text>
              <Text style={styles.statusLabel}>{isOnline ? 'You are online (location shared with app)' : 'You are offline'}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('FcmToken')} style={styles.fcmLink}>
               
              </TouchableOpacity>
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
              {!!cabVendor && (
                <>
                  <TouchableOpacity
                    style={[styles.findARideButton, styles.editVehicleButton]}
                    onPress={() => {
                      prefillRegistrationFromCab();
                      navigation.navigate('DriverRegistration');
                    }}
                  >
                    <Text style={styles.findARideText}>Edit Driver</Text>
                  </TouchableOpacity>
              
                </>
              )}
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

      {previewImage && (
        <Modal
          visible={true}
          transparent
          onRequestClose={() => setPreviewImage(null)}
        >
          <TouchableOpacity
            style={styles.previewOverlay}
            activeOpacity={1}
            onPress={() => setPreviewImage(null)}
          >
            <Image
              source={{ uri: previewImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
      )}
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
  fcmLink: {
    marginTop: 6,
    marginBottom: 4,
  },
  fcmLinkText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.c_0162C0,
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
  editVehicleButton: {
    backgroundColor: colors.c_666666,
    marginBottom: 10,
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
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: width * 0.9,
    height: height * 0.8,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    marginLeft: 10,
  },
  inlineEditButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inlineEditText: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
  },
  editActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editCancelButton: {
    backgroundColor: colors.c_F3F3F3,
  },
  editSaveButton: {
    backgroundColor: colors.c_0162C0,
  },
  editCancelText: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.c_666666,
  },
  editSaveText: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
