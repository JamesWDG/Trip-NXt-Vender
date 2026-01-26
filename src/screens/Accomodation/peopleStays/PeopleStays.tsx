import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useState } from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import Counter from '../../../components/counter/Counter';
import DateInput from '../../../components/dateInput/DateInput';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import TimePicker from '../../../components/timePicker/TimePicker';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';

interface PeopleStaysRouteParams {
  hotelName: string;
  hotelAddress: string;
  rentPerDay: string;
  rentPerHour: string;
  description: string;
  category: string;
  postalCode: string;
  website: string;
  phoneNumber: string;
}

const PeopleStays: FC<{ route: RouteProp<{ PeopleStays: PeopleStaysRouteParams }, 'PeopleStays'> }> = ({ route }) => {
  const navigation = useNavigation<NavigationPropType>();
  const [guests, setGuests] = useState(1);
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [checkOutTime, setCheckOutTime] = useState<string>('');
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [selectedTimeType, setSelectedTimeType] = useState<
    'checkIn' | 'checkOut' | null
  >(null);

  const handleTimeSelect = (time: string) => {
    const fTime = time.split(' ')[0];
    if (selectedTimeType === 'checkIn') {
      setCheckInTime(fTime);
    } else if (selectedTimeType === 'checkOut') {
      setCheckOutTime(fTime);
    }
  };

  const handleCheckInPress = () => {
    setSelectedTimeType('checkIn');
    setShowTimePicker(true);
  };

  const handleCheckOutPress = () => {
    setSelectedTimeType('checkOut');
    setShowTimePicker(true);
  };

  const handleNext = () => {
    // Handle next action
    console.log('Next pressed', {
      guests,
      bedrooms,
      beds,
      bathrooms,
      checkInTime,
      checkOutTime,
    });
    navigation.navigate('Accomodation', {
      screen: 'Features', params: {
        hotelName: route.params.hotelName,
        hotelAddress: route.params.hotelAddress,
        rentPerDay: route.params.rentPerDay,
        rentPerHour: route.params.rentPerHour,
        description: route.params.description,
        guests,
        bedrooms,
        beds,
        bathrooms,
        checkInTime,
        checkOutTime,
        category: route.params.category,
        postalCode: route.params.postalCode,
        website: route.params.website,
        phoneNumber: route.params.phoneNumber
      }
    });
  }

  return (
    <WrapperContainer navigation={navigation} title="People Stays">
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Title */}
          <Text style={styles.title}>How Many People Can Stay Here?</Text>

          {/* Counter Section */}
          <View style={[styles.counterSection, GeneralStyles.shadow]}>
            <Counter
              label="Guests"
              value={guests}
              onDecrease={() => setGuests(Math.max(1, guests - 1))}
              onIncrease={() => setGuests(guests + 1)}
              min={1}
            />
            <View style={styles.separator} />
            <Counter
              label="Bedrooms"
              value={bedrooms}
              onDecrease={() => setBedrooms(Math.max(1, bedrooms - 1))}
              onIncrease={() => setBedrooms(bedrooms + 1)}
              min={1}
            />
            <View style={styles.separator} />
            <Counter
              label="Beds"
              value={beds}
              onDecrease={() => setBeds(Math.max(1, beds - 1))}
              onIncrease={() => setBeds(beds + 1)}
              min={1}
            />
            <View style={styles.separator} />
            <Counter
              label="Bathrooms"
              value={bathrooms}
              onDecrease={() => setBathrooms(Math.max(1, bathrooms - 1))}
              onIncrease={() => setBathrooms(bathrooms + 1)}
              min={1}
            />
          </View>

          {/* Time Inputs */}
          <View style={styles.dateInputsContainer}>
            <DateInput
              placeholder="Check-In"
              value={checkInTime}
              onPress={handleCheckInPress}
              otherStyles={styles.dateInput}
            />
            <DateInput
              placeholder="Check-Out"
              value={checkOutTime}
              onPress={handleCheckOutPress}
              otherStyles={styles.dateInput}
            />
          </View>

          {/* Next Button */}
          <GradientButtonForAccomodation
            title="Next"
            onPress={handleNext}
            fontSize={16}
            fontFamily={fonts.bold}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select{' '}
                {selectedTimeType === 'checkIn' ? 'Check-In' : 'Check-Out'} Time
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timePickerContainer}>
              <TimePicker
                onTimeSelect={handleTimeSelect}
                initialTime={
                  selectedTimeType === 'checkIn' ? checkInTime : checkOutTime
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default PeopleStays;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 24,
    textAlign: 'center',
  },
  counterSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 0.5,
    // borderColor: colors.c_0162C0,
    marginBottom: 24,
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    backgroundColor: colors.c_F3F3F3,
    marginHorizontal: 16,
  },
  dateInputsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  dateInput: {
    marginBottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
  },
  timePickerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
});
