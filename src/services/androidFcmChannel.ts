import { Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

/** Must match `com.google.firebase.messaging.default_notification_channel_id` in AndroidManifest. */
export const FCM_DEFAULT_CHANNEL_ID = 'tripnxt_fcm_default';

/** Creates the default channel FCM uses for notification payloads (Android 8+). */
export async function ensureFcmDefaultAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await notifee.createChannel({
    id: FCM_DEFAULT_CHANNEL_ID,
    name: 'General',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });
}
