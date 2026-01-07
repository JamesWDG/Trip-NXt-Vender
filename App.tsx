import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import React from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import Navigation from './src/navigation';
import { persistor, store } from './src/redux/store';
import Toast from 'react-native-toast-message';
import ToastConfig from './src/config/Toast';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppContent />
          <Toast config={ToastConfig} position="top" bottomOffset={40} />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return <Navigation />;
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
