import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import images from '../../config/images';
import { SearchIcon } from 'lucide-react-native';
import fonts from '../../config/fonts';

interface Params {
  placeholder: string;
  title?: string;
  otherStyles?: ViewStyle;
  navigation?: any;
  filter?: boolean;
  onFocus?: () => void;
}
const SearchWithFilters = ({
  placeholder,
  title,
  otherStyles,
  navigation,
  filter = true,
  onFocus,
}: Params) => {
  const handleFilterPress = () => {
    navigation?.navigate('AdvancedFilter');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <SearchIcon size={24} color={colors.c_666666} />
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor={colors.c_666666}
          onFocus={onFocus}
          editable={true}
        />
      </View>

      {filter ? (
        <TouchableOpacity
          style={styles.filterIconContainer}
          onPress={handleFilterPress}
        >
          <Image source={images.filter} style={styles.filterIcon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchWithFilters;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.normal,
    height: 40,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: 100,
    height: 48,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // 0x26 in hex ≈ 0.15 opacity
    shadowRadius: 12,

    // Android shadow
    elevation: 6,
  },
  filterIcon: {},
  filterIconContainer: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 100,
    // iOS shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // 0x26 in hex ≈ 0.15 opacity
    shadowRadius: 12,

    // Android shadow
    elevation: 6,
  },
});
