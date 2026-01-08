import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { DEFAULT_LOCATION, reverseGeocode } from '../../../utils/utility';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import colors from '../../../config/colors';
import { ChevronLeftIcon } from 'lucide-react-native';
import fonts from '../../../config/fonts';

interface MapRouteParams {
  location?: {
    latitude: number;
    longitude: number;
  };
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
  }) => void;
}

const Map = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const params = route.params as MapRouteParams | undefined;
  //   const initialLocation = params?.location || DEFAULT_LOCATION;

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleSave = async () => {
    if (params?.onLocationSelect) {
      const addressData = await reverseGeocode(
        selectedLocation.latitude,
        selectedLocation.longitude,
      );

      if (addressData) {
        params.onLocationSelect(addressData);
      }
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={DEFAULT_LOCATION}
        onPress={handleMapPress}
      >
        <Marker
          coordinate={selectedLocation}
          draggable
          onDragEnd={e => {
            setSelectedLocation({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
          title="Selected Location"
          description={`Lat: ${selectedLocation.latitude.toFixed(
            6,
          )}, Lng: ${selectedLocation.longitude.toFixed(6)}`}
        />
      </MapView>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ChevronLeftIcon size={28} color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 100,
    top: 50,
    left: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  saveButton: {
    position: 'absolute',
    backgroundColor: colors.primary,
    borderRadius: 100,
    bottom: 40,
    left: 20,
    right: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
