import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { FC, useCallback, useState } from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import Counter from '../../../components/counter/Counter';
import DateInput from '../../../components/dateInput/DateInput';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import { DateTimePicker } from '../../../components/dateTimePicker';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';

/** Parse "2:30 PM" / "11:00 AM" to Date (today at that time) */
const parseTimeToDate = (timeStr: string): Date => {
  if (!timeStr || !timeStr.trim()) {
    return new Date(new Date().setHours(15, 0, 0, 0)); // default 3:00 PM
  }
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match) {
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const period = (match[3] || '').toUpperCase();
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
  }
  return new Date(new Date().setHours(15, 0, 0, 0));
};

/** Format Date to "2:30 PM" */
const formatDateToTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

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
  serviceFee: string;
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
  const [selectedTimeType, setSelectedTimeType] = useState<'checkIn' | 'checkOut' | null>(null);

  const getInitialTimeDate = useCallback((): Date => {
    if (selectedTimeType === 'checkIn') {
      return parseTimeToDate(checkInTime || '3:00 PM');
    }
    if (selectedTimeType === 'checkOut') {
      return parseTimeToDate(checkOutTime || '11:00 AM');
    }
    return new Date(new Date().setHours(15, 0, 0, 0));
  }, [selectedTimeType, checkInTime, checkOutTime]);

  const handleTimeConfirm = useCallback(
    (date: Date) => {
      const formatted = formatDateToTime(date);
      if (selectedTimeType === 'checkIn') {
        setCheckInTime(formatted);
      } else if (selectedTimeType === 'checkOut') {
        setCheckOutTime(formatted);
      }
      setShowTimePicker(false);
      setSelectedTimeType(null);
    },
    [selectedTimeType]
  );

  const handleCheckInPress = () => {
    setSelectedTimeType('checkIn');
    setShowTimePicker(true);
  };

  const handleCheckOutPress = () => {
    setSelectedTimeType('checkOut');
    setShowTimePicker(true);
  };

  const handleTimePickerClose = () => {
    setShowTimePicker(false);
    setSelectedTimeType(null);
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
        phoneNumber: route.params.phoneNumber,
        serviceFee: route.params.serviceFee
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

      {/* Native-style Time Picker Modal (react-native-date-picker) */}
      <DateTimePicker
        visible={showTimePicker}
        onClose={handleTimePickerClose}
        onConfirm={handleTimeConfirm}
        mode="time"
        initialDate={getInitialTimeDate()}
        title={
          selectedTimeType === 'checkIn'
            ? 'Select Check-In Time'
            : selectedTimeType === 'checkOut'
              ? 'Select Check-Out Time'
              : 'Select Time'
        }
        confirmText="Done"
      />
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
});
