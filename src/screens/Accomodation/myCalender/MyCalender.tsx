import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import { useNavigation } from '@react-navigation/native';
import DateInput from '../../../components/dateInput/DateInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { width } from '../../../config/constants';
import CalendarRangePicker from '../../../components/calendarRangePicker/CalendarRangePicker';
import { formatDate } from '../../../utils/utility';
import MyHotelsCard from '../../../components/myHotelsCard/MyHotelsCard';
import fonts from '../../../config/fonts';
import colors from '../../../config/colors';
import HotelCard from '../../../components/hotelCard/HotelCard';
import images from '../../../config/images';

const MyCalender = () => {
  const navigation = useNavigation<NavigationPropType>();
  const { top } = useSafeAreaInsets();
  const [checkInDate, setCheckInDate] = useState<string>(''); // Display format
  const [checkOutDate, setCheckOutDate] = useState<string>(''); // Display format
  const [checkInDateRaw, setCheckInDateRaw] = useState<string>(''); // YYYY-MM-DD format
  const [checkOutDateRaw, setCheckOutDateRaw] = useState<string>(''); // YYYY-MM-DD format
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const handleDateRangeSelect = (startDate: string, endDate: string) => {
    if (startDate) {
      setCheckInDateRaw(startDate);
      setCheckInDate(formatDate(startDate));
    }
    if (endDate) {
      setCheckOutDateRaw(endDate);
      setCheckOutDate(formatDate(endDate));
    } else if (startDate && !endDate) {
      // Only start date selected, clear end date
      setCheckOutDateRaw('');
      setCheckOutDate('');
    }
  };
  return (
    <WrapperContainer title="My Calender" navigation={navigation}>
      {/* Check In / Check Out Fields */}
      <View style={styles.dateInputsContainer}>
        <DateInput
          placeholder="Check In"
          value={checkInDate}
          onPress={() => setShowCalendar(true)}
          otherStyles={styles.dateInput}
        />
        <DateInput
          placeholder="Check Out"
          value={checkOutDate}
          onPress={() => setShowCalendar(true)}
          otherStyles={styles.dateInput}
        />
      </View>

      <FlatList
        data={[1]}
        showsVerticalScrollIndicator={false}
        renderItem={() => {
          return (
            <>
              {/* MyHotelsCard List */}
              <FlatList
                data={[1, 2, 3]}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.toString()}
                renderItem={({ item }) => (
                  <MyHotelsCard
                    title="My Hotels"
                    monthLabel="Month"
                    date="December 2023"
                    badgeCount={item}
                    onPress={() => {
                      // Handle card press
                    }}
                  />
                )}
                contentContainerStyle={styles.cardsContainer}
              />

              <FlatList
                contentContainerStyle={styles.contentContainerStyles}
                style={styles.contentContainerStyles}
                showsVerticalScrollIndicator={false}
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                renderItem={({ item }) => (
                  <View style={styles.hotelCardContainer}>
                    <HotelCard
                      image={images.apartment}
                      hotelName="Lux Hotel Casino"
                      price="$180"
                      rating={4.5}
                      beds={3}
                      baths={2}
                      parking={2}
                      location="Kingdom Tower, Brazil"
                      onPress={() => {
                        navigation.navigate('Accomodation', {
                          screen: 'HotelBooking',
                        });
                        /* handle navigation */
                      }}
                    />
                  </View>
                )}
              />
            </>
          );
        }}
        keyExtractor={item => item.toString()}
        contentContainerStyle={styles.cardContainer}
      />

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => setShowCalendar(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.calendarContainer}
            >
              {/* Calendar */}
              {showCalendar && (
                <CalendarRangePicker
                  onDateRangeSelect={handleDateRangeSelect}
                  initialStartDate={checkInDateRaw || undefined}
                  initialEndDate={checkOutDateRaw || undefined}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default MyCalender;

const styles = StyleSheet.create({
  dateInputsContainer: {
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    alignSelf: 'center',
    marginTop: 30,
  },
  dateInput: {
    marginBottom: 0,
    flex: 1,
    width: '48%',
  },
  cardsContainer: {
    paddingVertical: 16,
    paddingLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  hotelCardContainer: { paddingHorizontal: 16 },
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
    color: colors.black,
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
  calendarContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  contentContainerStyles: {
    gap: 20,
    paddingHorizontal: 5,
  },
  cardContainer: {
    paddingBottom: 120,
  },
});
