import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../navigation/authStack/AuthStack';
import WrapperContainer from '../../components/wrapperContainer/WrapperContainer';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { Check } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setRegion, type RegionType } from '../../redux/slices/regionSlice';

const REGIONS: { id: RegionType; label: string }[] = [
  { id: 'USD', label: 'United States' },
  { id: 'NGN', label: 'Nigeria' },
];

const ChooseRegion = () => {
  const navigation = useNavigation<NavigationPropType>();
  const selectedRegion = useAppSelector(state => state.region.selectedRegion);
  const dispatch = useAppDispatch();

  const selectRegion = (region: RegionType) => {
    dispatch(setRegion(region));
  };

  return (
    <WrapperContainer navigation={navigation} title="Choose Region">
      <View style={styles.content}>
        {REGIONS.map(region => (
          <TouchableOpacity
            key={region.id}
            style={[
              styles.regionCard,
              selectedRegion === region.id && styles.regionCardSelected,
            ]}
            onPress={() => selectRegion(region.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.regionLabel,
                selectedRegion === region.id && styles.regionLabelSelected,
              ]}
            >
              {region.label}
            </Text>
            {selectedRegion === region.id && (
              <Check size={22} color={colors.white} strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </WrapperContainer>
  );
};

export default ChooseRegion;

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  regionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  regionCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.c_0162C0,
  },
  regionLabel: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.c_2B2B2B,
  },
  regionLabelSelected: {
    color: colors.white,
  },
});
