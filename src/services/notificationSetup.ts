import { Platform } from 'react-native';
import { store } from '../redux/store';
import { notificationApi } from '../redux/services/notificationService';

let messagingModule: any = null;
try {
  // @ts-ignore - optional dependency, may not be installed
  messagingModule = require('@react-native-firebase/messaging').default;
} catch {
  // @react-native-firebase/messaging not installed or not linked
}

/** Call once at app startup. */
export function setBackgroundMessageHandler(): void {
  if (!messagingModule) return;
  messagingModule().setBackgroundMessageHandler(async (remoteMessage: any) => {
    console.log('Background notification:', remoteMessage?.notification?.title, remoteMessage?.data);
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!messagingModule) return false;
  if (Platform.OS === 'ios') {
    const authStatus = await messagingModule().requestPermission();
    return authStatus === messagingModule!.AuthorizationStatus.AUTHORIZED ||
           authStatus === messagingModule!.AuthorizationStatus.PROVISIONAL;
  }
  return true;
}

export async function getFCMToken(): Promise<string | null> {
  if (!messagingModule) return null;
  try {
    const token = await messagingModule().getToken();
    if (token) console.log('[FCM Vendor] Token:', token);
    return token ?? null;
  } catch (e) {
    console.warn('FCM getToken error:', e);
    return null;
  }
}

/** Register current FCM token with backend. Call when vendor is logged in. */
export async function registerTokenWithBackend(fcmToken: string): Promise<boolean> {
  const masked = fcmToken ? `${fcmToken.substring(0, 24)}...${fcmToken.slice(-12)}` : '';
  console.log('[FCM Vendor] Saving FCM token to backend...', masked , fcmToken);
  try {
    const result = await (store.dispatch as any)(
      notificationApi.endpoints.registerFcmToken.initiate({ fcmToken })
    );
    const ok = !('error' in result) && 'data' in result;
    if (ok) {
      console.log('[FCM Vendor] FCM token saved successfully.');
    } else {
      console.warn('[FCM Vendor] FCM token save failed.', result);
    }
    return ok;
  } catch (e) {
    console.warn('[FCM Vendor] Register FCM token error:', e);
    return false;
  }
}

export function onForegroundMessage(callback: (message: any) => void): () => void {
  if (!messagingModule) return () => {};
  const unsub = messagingModule().onMessage(callback);
  return unsub;
}

export function onNotificationOpenedApp(callback: (message: any) => void): () => void {
  if (!messagingModule) return () => {};
  const unsub = messagingModule().onNotificationOpenedApp(callback);
  return unsub;
}

/** Call on app launch to check if app was opened from a notification. */
export async function getInitialNotification(): Promise<any | null> {
  if (!messagingModule) return null;
  return messagingModule().getInitialNotification();
}
