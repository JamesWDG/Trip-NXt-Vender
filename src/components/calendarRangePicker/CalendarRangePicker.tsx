import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Calendar, CalendarList } from 'react-native-calendars';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface CalendarRangePickerProps {
  onDateRangeSelect?: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const CalendarRangePicker = ({
  onDateRangeSelect,
  initialStartDate,
  initialEndDate,
}: CalendarRangePickerProps) => {
  const [startDate, setStartDate] = useState<string | undefined>(
    initialStartDate,
  );
  const [endDate, setEndDate] = useState<string | undefined>(initialEndDate);

  // Update when props change
  useEffect(() => {
    if (initialStartDate) {
      setStartDate(initialStartDate);
    }
    if (initialEndDate) {
      setEndDate(initialEndDate);
    }
  }, [initialStartDate, initialEndDate]);

  const onDayPress = (day: any) => {
    const dateString = day.dateString;

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(dateString);
      setEndDate(undefined);
      onDateRangeSelect?.(dateString, '');
    } else if (startDate && !endDate) {
      // Complete the range
      if (dateString < startDate) {
        // If selected date is before start, swap them
        setEndDate(startDate);
        setStartDate(dateString);
        onDateRangeSelect?.(dateString, startDate);
      } else {
        setEndDate(dateString);
        onDateRangeSelect?.(startDate, dateString);
      }
    }
  };

  // Create marked dates object for calendar
  const getMarkedDates = () => {
    const marked: any = {};

    if (startDate) {
      marked[startDate] = {
        startingDay: true,
        color: colors.c_0162C0,
        textColor: colors.white,
      };
    }

    if (endDate) {
      marked[endDate] = {
        endingDay: true,
        color: colors.c_0162C0,
        textColor: colors.white,
      };

      // Mark dates in between
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const current = new Date(start);
        current.setDate(current.getDate() + 1);

        while (current < end) {
          const dateString = current.toISOString().split('T')[0];
          marked[dateString] = {
            color: colors.c_F3F3F3,
            textColor: colors.black,
          };
          current.setDate(current.getDate() + 1);
        }
      }
    }

    return marked;
  };

  // Get current month and year for display
  const getCurrentMonthYear = () => {
    const dateToUse = startDate ? new Date(startDate) : new Date();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${monthNames[dateToUse.getMonth()]}, ${dateToUse.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthYear}>{getCurrentMonthYear()}</Text>
        <CalendarIcon size={20} color={colors.black} />
      </View>

      <Calendar
        current={startDate || new Date().toISOString().split('T')[0]}
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        markingType="period"
        theme={{
          backgroundColor: colors.white,
          calendarBackground: colors.white,
          textSectionTitleColor: colors.black,
          selectedDayBackgroundColor: colors.c_0162C0,
          selectedDayTextColor: colors.white,
          todayTextColor: colors.c_0162C0,
          dayTextColor: colors.black,
          textDisabledColor: colors.c_CFD1D3,
          dotColor: colors.c_0162C0,
          selectedDotColor: colors.white,
          arrowColor: colors.c_0162C0,
          monthTextColor: colors.black,
          indicatorColor: colors.c_0162C0,
          textDayFontFamily: fonts.normal,
          textMonthFontFamily: fonts.bold,
          textDayHeaderFontFamily: fonts.medium,
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
        style={styles.calendar}
      />
    </View>
  );
};

export default CalendarRangePicker;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  calendar: {
    borderRadius: 8,
  },
});
