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
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import Navigation from './src/navigation';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
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
