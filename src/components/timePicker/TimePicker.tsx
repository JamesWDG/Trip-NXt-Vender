import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface TimePickerProps {
  onTimeSelect: (time: string) => void;
  initialTime?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  onTimeSelect,
  initialTime,
}) => {
  // Parse initial time if provided (format: "12:00 AM" or "1:30 PM")
  const parseInitialTime = (time?: string) => {
    if (!time) return { hour: 12, minute: 0, period: 'AM' as const };
    
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      const hour = parseInt(match[1], 10);
      const minute = parseInt(match[2], 10);
      const period = match[3].toUpperCase() as 'AM' | 'PM';
      return { hour, minute, period };
    }
    return { hour: 12, minute: 0, period: 'AM' as const };
  };

  const initial = parseInitialTime(initialTime);
  const [selectedHour, setSelectedHour] = useState<number>(initial.hour);
  const [selectedMinute, setSelectedMinute] = useState<number>(initial.minute);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(initial.period);

  useEffect(() => {
    if (initialTime) {
      const parsed = parseInitialTime(initialTime);
      setSelectedHour(parsed.hour);
      setSelectedMinute(parsed.minute);
      setSelectedPeriod(parsed.period);
    }
  }, [initialTime]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const formatTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${hour}:${formattedMinute} ${period}`;
  };

  const handleHourChange = (hour: number) => {
    setSelectedHour(hour);
    onTimeSelect(formatTime(hour, selectedMinute, selectedPeriod));
  };

  const handleMinuteChange = (minute: number) => {
    setSelectedMinute(minute);
    onTimeSelect(formatTime(selectedHour, minute, selectedPeriod));
  };

  const handlePeriodChange = (period: 'AM' | 'PM') => {
    setSelectedPeriod(period);
    onTimeSelect(formatTime(selectedHour, selectedMinute, period));
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeDisplay}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {hours.map((hour, index) => (
            <TouchableOpacity
              key={hour}
              style={[
                styles.timeItem,
                selectedHour === hour && styles.selectedTimeItem,
              ]}
              onPress={() => handleHourChange(hour)}>
              <Text
                style={[
                  styles.timeText,
                  selectedHour === hour && styles.selectedTimeText,
                ]}>
                {hour.toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.separator}>:</Text>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {minutes.map((minute, index) => (
            <TouchableOpacity
              key={minute}
              style={[
                styles.timeItem,
                selectedMinute === minute && styles.selectedTimeItem,
              ]}
              onPress={() => handleMinuteChange(minute)}>
              <Text
                style={[
                  styles.timeText,
                  selectedMinute === minute && styles.selectedTimeText,
                ]}>
                {minute.toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.periodContainer}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'AM' && styles.selectedPeriodButton,
            ]}
            onPress={() => handlePeriodChange('AM')}>
            <Text
              style={[
                styles.periodText,
                selectedPeriod === 'AM' && styles.selectedPeriodText,
              ]}>
              AM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'PM' && styles.selectedPeriodButton,
            ]}
            onPress={() => handlePeriodChange('PM')}>
            <Text
              style={[
                styles.periodText,
                selectedPeriod === 'PM' && styles.selectedPeriodText,
              ]}>
              PM
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  scrollView: {
    maxHeight: 200,
    width: 80,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  timeItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedTimeItem: {
    backgroundColor: colors.c_0162C0,
  },
  timeText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  selectedTimeText: {
    color: colors.white,
    fontFamily: fonts.bold,
  },
  separator: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  periodContainer: {
    gap: 8,
  },
  periodButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.c_F3F3F3,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedPeriodButton: {
    backgroundColor: colors.c_0162C0,
  },
  periodText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  selectedPeriodText: {
    color: colors.white,
    fontFamily: fonts.bold,
  },
});

