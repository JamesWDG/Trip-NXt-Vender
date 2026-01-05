import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import BottomSheetComp, {
  BottomSheetComponentRef,
} from '../bottomSheetComp/BottomSheetComp';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface Country {
  code: string;
  name: string;
}

const countries: Country[] = [
  { code: 'US', name: 'USA' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KE', name: 'Kenya' },
  { code: 'EG', name: 'Egypt' },
];

interface CountryPickerProps {
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
  bottomSheetRef: React.RefObject<BottomSheetComponentRef | null>;
}

const CountryPicker: React.FC<CountryPickerProps> = ({
  selectedCountry,
  onCountrySelect,
  bottomSheetRef,
}) => {
  const handleCountryPress = (country: Country) => {
    onCountrySelect(country.name);
    bottomSheetRef.current?.close();
  };

  const renderCountryItem = ({ item }: { item: Country }) => {
    const isSelected = selectedCountry === item.name;
    return (
      <TouchableOpacity
        style={[styles.countryItem, isSelected && styles.selectedCountryItem]}
        onPress={() => handleCountryPress(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.countryName, isSelected && styles.selectedText]}>
          {item.name}
        </Text>
        {isSelected && <View style={styles.checkmark} />}
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheetComp
      ref={bottomSheetRef}
      snapPoints={['50%', '75%']}
      enablePanDownToClose={true}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Select Country</Text>
        <FlatList
          data={countries}
          renderItem={renderCountryItem}
          keyExtractor={item => item.code}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </BottomSheetComp>
  );
};

export default CountryPicker;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    marginBottom: 8,
  },
  selectedCountryItem: {
    backgroundColor: colors.c_0162C0,
  },
  countryName: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  selectedText: {
    color: colors.white,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

