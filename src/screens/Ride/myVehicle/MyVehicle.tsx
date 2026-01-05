import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import VehicleCard from '../../../components/vehicleCard/VehicleCard';
import images from '../../../config/images';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { width, height } from '../../../config/constants';
import { Plus } from 'lucide-react-native';
import DrawerModalCab from '../../../components/drawers/DrawerModalCab';

// Sample data - replace with actual data from API/state
const sampleVehicles: Array<{
  id: string;
  image: any;
  vehicleName: string;
  licensePlate: string;
  description: string;
}> = [
  // Uncomment below to see vehicle cards
  // {
  //   id: '1',
  //   image: images.car,
  //   vehicleName: 'Volkswagen Golf',
  //   licensePlate: 'UP16CC1234',
  //   description: 'Lorem Ipsum is simply dummy text of the printing and typesetting.',
  // },
];

const MyVehicle = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [vehicles] = useState(sampleVehicles); // Replace with actual state management

  const [showMenu, setShowMenu] = useState(false);
  const onPressAddVehicle = () => {
    // Navigate to Add Vehicle screen
    // navigation.navigate('AddVehicle');
  };

  const onPressVehicle = (vehicle: any) => {
    // Navigate to vehicle details or update screen
    // navigation.navigate('VehicleDetails', { vehicle });
  };

  return (
    <WrapperContainer
      title="My Vehicle"
      navigation={navigation}
      goBack={false}
      onMenuPress={() => setShowMenu(true)}
    >
      <FlatList
        data={vehicles}
        ListEmptyComponent={() => {
          return (
            <>
              {/* Blue Banner */}
              <View style={styles.bannerContainer}>
                <Text style={styles.bannerTitle}>
                  Please Register Your vehicle.
                </Text>
                <Text style={styles.bannerSubtitle}>
                  You will be able to view your registered{'\n'}vehicle details
                  here
                </Text>
              </View>
              {/* Illustration */}
              <View style={styles.illustrationContainer}>
                <Image
                  source={images.empty_car}
                  style={styles.illustration}
                  resizeMode="contain"
                />
              </View>
            </>
          );
        }}
        renderItem={({ item }) => (
          <VehicleCard
            image={item.image}
            vehicleName={item.vehicleName}
            licensePlate={item.licensePlate}
            description={item.description}
            onPress={() => onPressVehicle(item)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={onPressAddVehicle}
        activeOpacity={0.8}
      >
        <Plus color={colors.white} size={24} />
      </TouchableOpacity>

      <DrawerModalCab visible={showMenu} setIsModalVisible={setShowMenu} />
    </WrapperContainer>
  );
};

export default MyVehicle;

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
  },
  bannerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  illustration: {
    width: width * 0.9,
    height: height * 0.4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 120,
  },
  addButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
});
