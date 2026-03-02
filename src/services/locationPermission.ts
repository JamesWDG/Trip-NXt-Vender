import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

const LOCATION_SETTINGS_MSG =
  'Location permission is required to receive ride requests and go online. Please enable it in Settings.';

/**
 * Request location permission on app open.
 * If user denies (or has denied before), show alert with "Open Settings" to navigate to app settings.
 */
export async function requestLocationPermissionAndPromptSettings(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted) return true;

      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Trip-NXt Vendor needs your location to receive ride requests and mark you online.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow',
        }
      );

      if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

      // Denied or NEVER_ASK_AGAIN: show alert to open Settings
      Alert.alert(
        'Location Permission',
        LOCATION_SETTINGS_MSG,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    } catch (err) {
      console.warn('Location permission error:', err);
      Alert.alert(
        'Location Permission',
        LOCATION_SETTINGS_MSG,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
  }

  // iOS: use geolocation-service to trigger permission; if denied, prompt for Settings
  return new Promise((resolve) => {
    let Geolocation: { getCurrentPosition: (s: (p: any) => void, e: (err: any) => void, o: object) => void };
    try {
      const RNGeolocation = require('react-native-geolocation-service');
      Geolocation = RNGeolocation.default ?? RNGeolocation;
    } catch {
      resolve(true);
      return;
    }
    Geolocation.getCurrentPosition(
      () => resolve(true),
      (error: any) => {
        if (error?.code === 1) {
          // PERMISSION_DENIED
          Alert.alert(
            'Location Permission',
            LOCATION_SETTINGS_MSG,
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Open Settings', onPress: () => { Linking.openSettings(); resolve(false); } },
            ]
          );
        } else {
          resolve(false);
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
    );
  });
}
