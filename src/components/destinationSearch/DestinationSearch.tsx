import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SearchIcon, Navigation, Clock, MapPin } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { GOOGLE_API_KEY } from '../../contants/api';

export interface SearchHistoryItem {
  id: string;
  address: string;
  city: string;
  destination: string;
  latitude: number;
  longitude: number;
  state: string;
  country: string;
}

interface DestinationSearchProps {
  placeholder?: string;
  historyItems?: SearchHistoryItem[];
  onSearchChange?: (text: string) => void;
  onItemPress?: (item: SearchHistoryItem) => void;
  showCurrentLocation?: boolean;
  currentLocation?: SearchHistoryItem;
  inputValue?: string;
}

const DestinationSearch: React.FC<DestinationSearchProps> = ({
  placeholder = 'Search for Destination',
  historyItems = [],
  onSearchChange,
  onItemPress,
  showCurrentLocation = true,
  currentLocation,
  inputValue,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchHistoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const defaultHistory: SearchHistoryItem[] = [
  //   {
  //     id: '1',
  //     address: 'Puszkarska 7H',
  //     city: 'Cracow',
  //     destination: 'Bonarka for Business',
  //   },
  //   {
  //     id: '2',
  //     address: 'Kamieńskiego 11',
  //     city: 'Cracow',
  //     destination: 'Bonarka City Center',
  //   },
  // ];

  const displayHistory = historyItems || [];

  // Google Places Autocomplete API
  // const GOOGLE_API_KEY = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';

  // Forward geocoding - search places using Google Places Autocomplete
  // const searchPlaces = async (query: string): Promise<SearchHistoryItem[]> => {
  //   if (!query) return [];

  //   try {
  //     const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
  //       query,
  //     )}&key=${GOOGLE_API_KEY}&types=geocode&language=en`;

  //     const response = await fetch(url);
  //     const data = await response.json();

  //     if (
  //       data.status === 'OK' &&
  //       data.predictions &&
  //       Array.isArray(data.predictions)
  //     ) {
  //       return data.predictions.map((prediction: any, index: number) => {
  //         // Parse the description to extract address and city
  //         const descriptionParts = prediction.description.split(',');
  //         const mainText =
  //           prediction.structured_formatting?.main_text ||
  //           descriptionParts[0] ||
  //           '';
  //         const secondaryText =
  //           prediction.structured_formatting?.secondary_text ||
  //           descriptionParts.slice(1).join(',') ||
  //           '';

  //         // Extract city from secondary text or description
  //         const city =
  //           secondaryText.split(',')[0]?.trim() ||
  //           descriptionParts[1]?.trim() ||
  //           '';
  //         const address = mainText || descriptionParts[0]?.trim() || '';
  //         const destination = prediction.description || query;

  //         return {
  //           id: `search-${index}-${prediction.place_id}`,
  //           address: address,
  //           city: city,
  //           destination: destination,
  //         };
  //       });
  //     }
  //     return [];
  //   } catch (error) {
  //     console.error('Search error:', error);
  //     return [];
  //   }
  // };

  const getPlaceDetails = async (
    placeId: string,
  ): Promise<Partial<SearchHistoryItem> | null> => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component,geometry,name,formatted_address&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== 'OK') return null;

      const components = data.result.address_components;

      let city = '';
      let state = '';
      let country = '';

      components.forEach((c: any) => {
        if (c.types.includes('locality')) city = c.long_name;
        if (c.types.includes('administrative_area_level_1'))
          state = c.short_name;
        if (c.types.includes('country')) country = c.long_name;
      });

      const latitude = data.result.geometry.location.lat;
      const longitude = data.result.geometry.location.lng;
      const address = data.result.name || '';
      const destination = data.result.formatted_address;

      return {
        city,
        state,
        country,
        latitude,
        longitude,
        address,
        destination,
      };
    } catch (error) {
      console.error('Place Details error:', error);
      return null;
    }
  };

  const searchPlaces = async (query: string): Promise<SearchHistoryItem[]> => {
    if (!query) return [];

    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&key=${GOOGLE_API_KEY}&types=geocode&language=en`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && Array.isArray(data.predictions)) {
        // Fetch place details for each prediction
        const results: SearchHistoryItem[] = [];

        for (let i = 0; i < data.predictions.length; i++) {
          const prediction = data.predictions[i];
          const details = await getPlaceDetails(prediction.place_id);

          results.push({
            id: `search-${i}-${prediction.place_id}`,
            address: details?.address || prediction.description.split(',')[0],
            city: details?.city || '',
            state: details?.state || '',
            country: details?.country || '',
            latitude: details?.latitude || 0,
            longitude: details?.longitude || 0,
            destination: details?.destination || prediction.description,
          });
        }

        return results;
      }
      return [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  // Perform search with debounce
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchPlaces(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 500);
    },
    [performSearch],
  );

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchText(text);
      onSearchChange?.(text);

      // Clear search results if text is too short
      if (text.length < 3) {
        // Clear previous timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
          searchTimeoutRef.current = null;
        }
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      // Debounce search
      debouncedSearch(text);
    },
    [onSearchChange, debouncedSearch],
  );

  const handleItemPress = (item: SearchHistoryItem) => {
    onItemPress?.(item);

    setSearchText(item?.destination);
    setSearchResults([]);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (inputValue !== undefined) {
      setSearchText(inputValue);
    }
  }, [inputValue]);

  const isSearchingActive = searchText.length >= 3;
  const showSearchResults = isSearchingActive;
  const showLocationAndHistory = !isSearchingActive;

  // Render history item
  const renderHistoryItem = ({
    item,
    index,
  }: {
    item: SearchHistoryItem;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultContent}>
        <Text style={styles.historyLabel}>
          History - {item.address}, {item.city}
        </Text>
        <Text style={styles.resultDestination} numberOfLines={1}>
          {item.destination}
        </Text>
      </View>
      <Clock size={20} color={colors.c_666666} />
    </TouchableOpacity>
  );

  // Render separator for FlatList
  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        {/* <SearchIcon size={20} color={colors.c_666666} /> */}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.c_666666}
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearchChange}
        />
      </View>

      {/* Search Results */}
      {showSearchResults && (
        <>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <>
              {searchResults.map((item, index) => (
                <View key={item.id}>
                  {index > 0 && <View style={styles.separator} />}
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.resultContent}>
                      <Text style={styles.resultAddress}>
                        {item.address}, {item.city}
                      </Text>
                      <Text style={styles.resultDestination} numberOfLines={1}>
                        {item.destination}
                      </Text>
                    </View>
                    <Navigation size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          )}
        </>
      )}

      {/* Current Location and History */}
      {showLocationAndHistory && (
        <>
          {/* Current Location */}
          {showCurrentLocation && currentLocation && (
            <TouchableOpacity
              style={styles.currentLocationItem}
              onPress={() => handleItemPress(currentLocation)}
              activeOpacity={0.7}
            >
              <View style={styles.resultContent}>
                <Text style={styles.currentLocationLabel}>
                  Current Location - {currentLocation.address},{' '}
                  {currentLocation.city}
                </Text>
                <Text style={styles.resultDestination} numberOfLines={1}>
                  {currentLocation.destination}
                </Text>
              </View>
              <MapPin size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          {showCurrentLocation &&
            currentLocation &&
            displayHistory.length > 0 && <View style={styles.separator} />}

          {/* History Items */}
          <FlatList
            data={displayHistory}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={renderSeparator}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.historyListContainer}
          />
        </>
      )}
    </View>
  );
};

export default DestinationSearch;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: colors.white,
    // paddingTop: 20,
    paddingBottom: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 10,
    paddingHorizontal: 16,
    // paddingVertical: 12,
    height: 48,
    gap: 12,
    // marginBottom: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 3,
  },
  historyListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 13,
    // Android needs elevation:
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  currentLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  resultContent: {
    flex: 1,
    marginRight: 10,
  },
  resultAddress: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: 4,
  },
  resultDestination: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  historyLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 4,
  },
  currentLocationLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.primary,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.c_DDDDDD,
    marginVertical: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  noResultsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
});
