import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import CustomTextInput from '../../../components/customTextInput/CustomTextInput';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import RestaurantTabButtons from '../../../components/restaurantTabButtons/RestaurantTabButtons';

const RestaurantProfile = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [formData, setFormData] = useState({
    restaurantName: '',
    contactNumber: '',
    address: '',
    description: '',
  });

  const handleSaveChanges = () => {
    // Handle save changes logic
    console.log('Save changes', formData);
    // You can add API call here
  };

  return (
    <WrapperContainer navigation={navigation} title="Profile">
      <View style={styles.tabContainer}>
        <Text style={styles.tabTitle}>Restaurant Information</Text>
        <RestaurantTabButtons
          data={[
            'Restaurant Info',
            'Subscritions',
            'Account Setting',
            'App Setting',
          ]}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Restaurant Name */}
        <View style={styles.inputContainer}>
          <CustomTextInput
            placeholder="Enter Restaurant Name"
            value={formData.restaurantName}
            onChangeText={text =>
              setFormData({ ...formData, restaurantName: text })
            }
            style={styles.input}
          />
        </View>

        {/* Contact Number */}
        <View style={styles.inputContainer}>
          <CustomTextInput
            placeholder="Enter Contact Number"
            value={formData.contactNumber}
            onChangeText={text =>
              setFormData({ ...formData, contactNumber: text })
            }
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        {/* Address */}
        <View style={styles.inputContainer}>
          <CustomTextInput
            placeholder="Enter Address"
            value={formData.address}
            onChangeText={text => setFormData({ ...formData, address: text })}
            style={styles.input}
          />
        </View>

        {/* About / Description */}
        <View style={styles.inputContainer}>
          <CustomTextInput
            placeholder="About / Description"
            value={formData.description}
            onChangeText={text =>
              setFormData({ ...formData, description: text })
            }
            multiline
            numberOfLines={5}
            style={styles.descriptionInput}
          />
        </View>

        {/* Save Changes Button */}
        <View style={styles.buttonContainer}>
          <GradientButtonForAccomodation
            title="Save Changes"
            onPress={handleSaveChanges}
            fontSize={16}
            fontFamily={fonts.bold}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default RestaurantProfile;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 12,
  },
  descriptionInput: {
    height: 120,
    borderRadius: 12,
    paddingTop: 16,
    textAlignVertical: 'top',
    backgroundColor: colors.c_F3F3F3,
  },
  buttonContainer: {
    marginTop: 8,
  },
  tabContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  tabTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
  },
});
