import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { useLazyGetStripeVendorStatusQuery } from '../../redux/services/vendorService';

const Web = ({route}: {route: RouteProp<{Web: {url: string}}, 'Web'>}) => {
  const navigation = useNavigation();
  const [successVisible, setSuccessVisible] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const hasSyncedRef = useRef(false);
  const [refreshVendorStatus] = useLazyGetStripeVendorStatusQuery();

  const handleNavChange = async (navState: any) => {
    const url: string = navState?.url || '';
    // When Stripe redirects back to our backend return URL, sync vendor account then show success.
    if (url.includes('/subscription/stripe-vender-account/return') && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      setSyncing(true);
      try {
        await refreshVendorStatus().unwrap();
      } catch (e) {
        // Onboarding completed on Stripe; DB sync may fail (e.g. user not found). Still show success.
      } finally {
        setSyncing(false);
        setSuccessVisible(true);
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        {syncing && (
          <View style={styles.syncingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.syncingText}>Updating your account…</Text>
          </View>
        )}
        {route.params.url && (
          <WebView
            startInLoadingState={true}
            originWhitelist={['*']}
            style={styles.webView}
            source={{uri: route.params.url}}
            onNavigationStateChange={handleNavChange}
          />
        )}
      </View>

      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalMessage}>
              Your Stripe vendor account has been connected successfully.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setSuccessVisible(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Web;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  syncingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    zIndex: 1,
  },
  syncingText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  webView: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 16,
  },
  modalButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontFamily: fonts.medium,
    fontSize: 14,
  },
});