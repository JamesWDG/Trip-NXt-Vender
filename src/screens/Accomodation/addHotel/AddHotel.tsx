import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import { width } from '../../../config/constants';
import GeneralStyles from '../../../utils/GeneralStyles';
import CustomTextInput from '../../../components/customTextInput/CustomTextInput';
import CustomTextArea from '../../../components/customTextArea/CustomTextArea';

const AddHotel = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [selectedCategory, setSelectedCategory] = useState<
    'Budget' | 'Standard' | 'Luxury'
  >('Standard');
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [rentPerDay, setRentPerDay] = useState('');
  const [description, setDescription] = useState('');

  const categories = ['Budget', 'Standard', 'Luxury'];

  const handleNext = () => {
  
    navigation.navigate('Accomodation', { screen: 'PeopleStays' });
  };

  return (
    <WrapperContainer title="Add Hotel" navigation={navigation}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Segmented Control */}
          <View style={styles.segmentedControl}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.segmentButton,
                  GeneralStyles.shadow,
                  selectedCategory === category && styles.segmentButtonActive,
                ]}
                onPress={() => setSelectedCategory(category as any)}
              >
                <View style={styles.segmentIcon} />
                <Text
                  style={[
                    styles.segmentText,
                    selectedCategory === category && styles.segmentTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input Fields */}
          <View style={styles.inputsContainer}>
            {/* Hotel Name */}
            <CustomTextInput
              placeholder="Enter Hotel Name"
              value={hotelName}
              onChangeText={setHotelName}
            />

            {/* Hotel Address */}
            <CustomTextInput
              placeholder="Enter Hotel Address"
              value={hotelAddress}
              onChangeText={setHotelAddress}
            />

            {/* Rent per day */}
            <CustomTextInput
              placeholder="$ Enter Rent per day"
              value={rentPerDay}
              onChangeText={setRentPerDay}
              keyboardType="numeric"
            />

            {/* Description */}
            <CustomTextArea
              placeholder="Enter Description"
              value={description}
              onChangeText={setDescription}
              numberOfLines={4}
            />

            <GradientButtonForAccomodation
              title="Next"
              onPress={handleNext}
              fontSize={16}
              fontFamily={fonts.bold}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

export default AddHotel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
    marginTop: 30,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.white,
    height: 70,
  },
  segmentButtonActive: {
    backgroundColor: colors.c_0162C0,
  },
  segmentIcon: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 2,
    position: 'absolute',
    top: -25,
    left: 30,
    right: 0,
    bottom: 0,
    borderColor: colors.white,
    backgroundColor: colors.c_F3F3F3,
    marginBottom: 8,
  },
  segmentText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  segmentTextActive: {
    color: colors.white,
    fontFamily: fonts.bold,
  },
  inputsContainer: {
    gap: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.c_F3F3F3,
  },
});
