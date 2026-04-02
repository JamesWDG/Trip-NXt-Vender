import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import {
  requestNotificationPermission,
  getFCMToken,
  registerTokenWithBackend,
  onForegroundMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '../services/notificationSetup';
import { ensureFcmDefaultAndroidChannel } from '../services/androidFcmChannel';
import { navigationRef } from '../config/constants';

export function NotificationSetup() {
  const token = useSelector((s: RootState) => s.auth?.token);
  const lastRegisteredToken = useRef<string | null>(null);

  useEffect(() => {
    ensureFcmDefaultAndroidChannel().catch(() => {});
  }, []);

  useEffect(() => {
    if (!token) {
      lastRegisteredToken.current = null;
      return;
    }
    let cancelled = false;
    (async () => {
      const granted = await requestNotificationPermission();
      if (!granted || cancelled) return;
      const fcmToken = await getFCMToken();
      if (!fcmToken || cancelled || fcmToken === lastRegisteredToken.current) return;
      console.log('[FCM Vendor] Registering token with backend');
      const ok = await registerTokenWithBackend(fcmToken);
      if (ok) {
        lastRegisteredToken.current = fcmToken;
        console.log('[FCM Vendor] FCM token registered and saved.');
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const navigateToRideRequest = (rideId: string | number) => {
    const id = typeof rideId === 'string' ? parseInt(rideId, 10) : rideId;
    if (Number.isNaN(id)) return;
    if (navigationRef.isReady()) {
      (navigationRef as any).navigate('app', {
        screen: 'CabStack',
        params: { screen: 'RideRequest', params: { rideId: id } },
      });
    }
  };

  useEffect(() => {
    const unsubForeground = onForegroundMessage((remoteMessage) => {
      console.log('Foreground notification:', remoteMessage?.notification);
      const data = remoteMessage?.data;
      if (data?.type === 'ride_request' && (data?.rideId != null)) {
        navigateToRideRequest(data.rideId);
      }
    });
    const unsubOpened = onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app:', remoteMessage?.data);
      const data = remoteMessage?.data;
      if (data?.type === 'ride_request' && (data?.rideId != null)) {
        navigateToRideRequest(data.rideId);
      }
    });
    getInitialNotification().then((msg) => {
      if (msg) {
        console.log('App opened from notification:', msg?.data);
        const data = msg?.data;
        if (data?.type === 'ride_request' && (data?.rideId != null)) {
          navigateToRideRequest(data.rideId);
        }
      }
    });
    return () => {
      unsubForeground();
      unsubOpened();
    };
  }, []);

  return null;
}
