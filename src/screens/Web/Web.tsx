import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WebView from 'react-native-webview';

const Web = ({route}: {route: RouteProp<{Web: {url: string}}, 'Web'>}) => {
  return (
    <View style={styles.container}>
      {route.params.url && <WebView startInLoadingState={true} style={styles.webView} source={{uri: route.params.url}} />}
    </View>
  );
};

export default Web;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});