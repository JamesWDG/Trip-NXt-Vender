import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import DateTimePicker from '../../../components/dateTimePicker/DateTimePicker';
import DateTimeInput from '../../../components/dateTimePicker/DateTimeInput';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

type DayStatus = 'open' | 'close' | null;

interface DaySchedule {
  day: string;
  status: DayStatus;
  openTime?: Date;
  closeTime?: Date;
}

const ScheduleAndBank = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'Monday', status: null },
    { day: 'Tuesday', status: null },
    { day: 'Wednesday', status: null },
    { day: 'Thursday', status: null },
    { day: 'Friday', status: null },
    { day: 'Saturday', status: null },
    { day: 'Sunday', status: null },
  ]);

  const [deliveryRadius, setDeliveryRadius] = useState(5); // in kilometers

  // Time picker modal state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedTimeType, setSelectedTimeType] = useState<
    'open' | 'close' | null
  >(null);

  // Format time for display
  const formatTime = (date?: Date): string => {
    if (!date) return '';
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${hours}:${formattedMinutes} ${period}`;
  };

  const sliderWidth = useRef(0);
  const sliderX = useRef(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const minRadius = 1;
  const maxRadius = 50;

  useEffect(() => {
    // Initialize slider position based on deliveryRadius
    if (sliderWidth.current > 0) {
      const percentage = (deliveryRadius - minRadius) / (maxRadius - minRadius);
      const position = percentage * sliderWidth.current;
      pan.setValue({ x: position, y: 0 });
    }
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        sliderX.current = evt.nativeEvent.locationX;
        pan.setOffset({
          x: (pan.x as any)._value,
          y: 0,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        const currentX = sliderX.current + gestureState.dx;
        const newX = Math.max(0, Math.min(currentX, sliderWidth.current));
        pan.setValue({ x: newX, y: 0 });

        // Calculate radius value
        const percentage = newX / sliderWidth.current;
        const radius = Math.round(
          minRadius + percentage * (maxRadius - minRadius),
        );
        setDeliveryRadius(radius);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  const handleDayStatusChange = (index: number, status: 'open' | 'close') => {
    const newSchedule = [...schedule];
    if (newSchedule[index].status === status) {
      // If clicking the same status, toggle it off
      newSchedule[index].status = null;
      newSchedule[index].openTime = undefined;
      newSchedule[index].closeTime = undefined;
    } else {
      // Set status and show time picker
      newSchedule[index].status = status;
      setSelectedDayIndex(index);
      setSelectedTimeType(status);
      setShowTimePicker(true);
    }
    setSchedule(newSchedule);
  };

  const handleTimeConfirm = (date: Date) => {
    if (selectedDayIndex !== null && selectedTimeType) {
      const newSchedule = [...schedule];
      if (selectedTimeType === 'open') {
        newSchedule[selectedDayIndex].openTime = date;
      } else {
        newSchedule[selectedDayIndex].closeTime = date;
      }
      setSchedule(newSchedule);
    }
  };

  const handleTimePickerClose = () => {
    setShowTimePicker(false);
    setSelectedDayIndex(null);
    setSelectedTimeType(null);
  };

  const handleSetCloseTime = (index: number) => {
    setSelectedDayIndex(index);
    setSelectedTimeType('close');
    setShowTimePicker(true);
  };

  const getInitialDate = (): Date => {
    if (selectedDayIndex !== null && selectedTimeType) {
      const daySchedule = schedule[selectedDayIndex];
      if (selectedTimeType === 'open' && daySchedule.openTime) {
        return daySchedule.openTime;
      } else if (selectedTimeType === 'close' && daySchedule.closeTime) {
        return daySchedule.closeTime;
      }
    }
    return new Date();
  };

  const handleContinue = () => {
    // Save schedule details, navigate to subscription screen
    console.log('Schedule details:', {
      schedule,
      deliveryRadius,
    });
    navigation.navigate('SubscriptionPlans');
  };

  const handleConnectStripe = () => {
    navigation.navigate('StripeConnection');
  };

  const handleSliderLayout = (event: any) => {
    sliderWidth.current = event.nativeEvent.layout.width;
    const percentage = (deliveryRadius - minRadius) / (maxRadius - minRadius);
    const position = percentage * sliderWidth.current;
    pan.setValue({ x: position, y: 0 });
  };

  return (
    <WrapperContainer title="Schedule & Bank Setup" navigation={navigation}>
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Schedule & Bank Setup</Text>
            <Text style={styles.subtitle}>
              Step 2: Configure Hours & Payment Info
            </Text>
          </View>

          {/* Restaurant Timing Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restaurant Timing</Text>
            {schedule.map((daySchedule, index) => (
              <View key={daySchedule.day} style={styles.dayContainer}>
                <View style={styles.dayRow}>
                  <Text style={styles.dayText}>{daySchedule.day}</Text>
                  <View style={styles.dayButtons}>
                    <TouchableOpacity
                      style={[
                        styles.statusButton,
                        daySchedule.status === 'open' &&
                          styles.statusButtonActive,
                      ]}
                      onPress={() => handleDayStatusChange(index, 'open')}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          daySchedule.status === 'open' &&
                            styles.statusButtonTextActive,
                        ]}
                      >
                        Open
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.statusButton,
                        daySchedule.status === 'close' &&
                          styles.statusButtonActive,
                      ]}
                      onPress={() => handleDayStatusChange(index, 'close')}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          daySchedule.status === 'close' &&
                            styles.statusButtonTextActive,
                        ]}
                      >
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {daySchedule.status === 'open' && (
                  <View style={styles.timeContainer}>
                    <DateTimeInput
                      placeholder="Select Open Time"
                      value={formatTime(daySchedule.openTime)}
                      onPress={() => {
                        setSelectedDayIndex(index);
                        setSelectedTimeType('open');
                        setShowTimePicker(true);
                      }}
                      mode="time"
                    />
                    <DateTimeInput
                      placeholder="Select Close Time"
                      value={formatTime(daySchedule.closeTime)}
                      onPress={() => handleSetCloseTime(index)}
                      mode="time"
                    />
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Delivery Radius Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Radius</Text>
            <View
              style={styles.sliderContainer}
              onLayout={handleSliderLayout}
              {...panResponder.panHandlers}
            >
              <View style={styles.sliderTrack}>
                <Animated.View
                  style={[
                    styles.sliderFill,
                    {
                      width: pan.x.interpolate({
                        inputRange: [0, sliderWidth.current || 300],
                        outputRange: [0, sliderWidth.current || 300],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.sliderHandle,
                    {
                      transform: [{ translateX: pan.x }],
                    },
                  ]}
                />
              </View>
            </View>
            <View style={styles.sliderValueContainer}>
              <Text style={styles.sliderValue}>{deliveryRadius}</Text>
              <Text style={styles.sliderUnit}> km</Text>
            </View>
            <Text style={styles.sliderDescription}>
              Adjust delivery area (in kilometers)
            </Text>
          </View>

          {/* Stripe Connection Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Setup</Text>
            <TouchableOpacity
              style={styles.stripeButton}
              onPress={handleConnectStripe}
              activeOpacity={0.8}
            >
              <View style={styles.stripeButtonContent}>
                <Text style={styles.stripeButtonText}>Connect to Stripe</Text>
                <Text style={styles.stripeButtonSubtext}>
                  Securely connect your Stripe account
                </Text>
              </View>
              <Text style={styles.stripeButtonArrow}>→</Text>
            </TouchableOpacity>
          </View>
          {/* Continue Button */}
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                Continue To Subscription
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Time Picker Modal */}
        <DateTimePicker
          visible={showTimePicker}
          onClose={handleTimePickerClose}
          onConfirm={handleTimeConfirm}
          mode="time"
          initialDate={getInitialDate()}
          title={
            selectedDayIndex !== null
              ? `Select ${
                  selectedTimeType === 'open' ? 'Open' : 'Close'
                } Time for ${schedule[selectedDayIndex]?.day}`
              : 'Select Time'
          }
        />
      </>
    </WrapperContainer>
  );
};

export default ScheduleAndBank;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 16,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
    flex: 1,
  },
  dayButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timeContainer: {
    marginTop: 12,
    gap: 12,
  },
  statusButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.c_F3F3F3,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
  },
  statusButtonActive: {
    backgroundColor: colors.c_0162C0,
    borderColor: colors.c_0162C0,
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  statusButtonTextActive: {
    color: colors.white,
  },
  sliderContainer: {
    marginBottom: 12,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: 6,
    backgroundColor: colors.c_0162C0,
    borderRadius: 3,
    position: 'absolute',
    left: 0,
  },
  sliderHandle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.c_2B2B2B,
    position: 'absolute',
    marginLeft: -12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  sliderUnit: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginLeft: 4,
  },
  sliderDescription: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  stripeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  stripeButtonContent: {
    flex: 1,
  },
  stripeButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 4,
  },
  stripeButtonSubtext: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  stripeButtonArrow: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
  },
  bottomButtonContainer: {
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: colors.white,
  },
  continueButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
