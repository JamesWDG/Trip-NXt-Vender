import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { getFCMToken, requestNotificationPermission } from '../../../services/notificationSetup';
import { useRegisterFcmTokenMutation } from '../../../redux/services/notificationService';

const FcmTokenScreen = () => {
  const navigation = useNavigation<any>();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registerFcmToken, { isLoading: registering }] = useRegisterFcmTokenMutation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const granted = await requestNotificationPermission();
        if (!granted && !cancelled) {
          setError('Notification permission denied');
          setToken(null);
          return;
        }
        const t = await getFCMToken();
        if (!cancelled) {
          setToken(t ?? null);
          if (!t) setError('Could not get FCM token. Check Firebase setup.');
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to get token');
          setToken(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleRegister = async () => {
    if (!token) return;
    try {
      await registerFcmToken({ fcmToken: token }).unwrap();
      console.log('[FCM Vendor] FCM token saved from FcmToken screen.');
      const shareResult = await Share.share({
        message: token,
        title: 'FCM Token',
      });
    } catch (e: any) {
      console.warn('Register FCM token failed:', e);
    }
  };

  const handleCopy = () => {
    if (!token) return;
    Share.share({ message: token, title: 'FCM Token' });
  };

  return (
    <WrapperContainer
      title="FCM Token"
      navigation={navigation}
      goBack
    >
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.c_0162C0} style={styles.loader} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : token ? (
          <>
            <Text style={styles.label}>Your FCM token (for push notifications):</Text>
            <Text style={styles.token} selectable>{token}</Text>
            <TouchableOpacity style={styles.btn} onPress={handleCopy} activeOpacity={0.8}>
              <Text style={styles.btnText}>Share / Copy token</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={handleRegister}
              disabled={registering}
              activeOpacity={0.8}
            >
              {registering ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={[styles.btnText, styles.btnTextWhite]}>Register with backend</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.error}>No token available</Text>
        )}
      </View>
    </WrapperContainer>
  );
};

export default FcmTokenScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loader: {
    marginTop: 40,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_666666,
    marginBottom: 8,
  },
  token: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    backgroundColor: colors.c_F3F3F3,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_EE4026,
    marginTop: 20,
  },
  btn: {
    backgroundColor: colors.c_F3F3F3,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimary: {
    backgroundColor: colors.c_0162C0,
  },
  btnText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
  },
  btnTextWhite: {
    color: colors.white,
  },
});
