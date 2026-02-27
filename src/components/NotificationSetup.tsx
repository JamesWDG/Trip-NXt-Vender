import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import {
  setBackgroundMessageHandler,
  requestNotificationPermission,
  getFCMToken,
  registerTokenWithBackend,
  onForegroundMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '../services/notificationSetup';

let backgroundHandlerSet = false;

export function NotificationSetup() {
  const token = useSelector((s: RootState) => s.auth?.token);
  const lastRegisteredToken = useRef<string | null>(null);

  useEffect(() => {
    if (!backgroundHandlerSet) {
      setBackgroundMessageHandler();
      backgroundHandlerSet = true;
    }
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
      if (ok) lastRegisteredToken.current = fcmToken;
    })();
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    const unsubForeground = onForegroundMessage((remoteMessage) => {
      console.log('Foreground notification:', remoteMessage?.notification?.title, remoteMessage?.data);
    });
    const unsubOpened = onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app:', remoteMessage?.data);
    });
    getInitialNotification().then((msg) => {
      if (msg) console.log('App opened from notification:', msg?.data);
    });
    return () => {
      unsubForeground();
      unsubOpened();
    };
  }, []);

  return null;
}
