import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import DateTimePicker from '../../../components/dateTimePicker/DateTimePicker';
import DateTimeInput from '../../../components/dateTimePicker/DateTimeInput';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import {
  useAddRestaurantMutation,
  useUpdateRestaurantMutation,
} from '../../../redux/services/restaurantService';
import Loader from '../../../components/AppLoader/Loader';
import { ShowToast } from '../../../config/constants';
import moment from 'moment';
import Slider from '@react-native-community/slider';
import { useLazyStripeConnectQuery } from '../../../redux/services/authService';

type DayStatus = 'open' | 'close' | null;

interface DaySchedule {
  id?: number;
  day: string;
  status: DayStatus;
  open?: Date;
  close?: Date;
}

const ScheduleAndBank = ({ route }: { route: any }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [addRestaurant, { isLoading }] = useAddRestaurantMutation();
  const [stripeConnect] = useLazyStripeConnectQuery();
  const [updateRestaurant, { isLoading: updateLoader }] =
    useUpdateRestaurantMutation();
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'Monday', status: null },
    { day: 'Tuesday', status: null },
    { day: 'Wednesday', status: null },
    { day: 'Thursday', status: null },
    { day: 'Friday', status: null },
    { day: 'Saturday', status: null },
    { day: 'Sunday', status: null },
  ]);

  const [deliveryRadius, setDeliveryRadius] = useState(100); // in kilometers

  const prevData = route?.params?.state || {};
  const existingTimings = route?.params?.timings || null;
  const existingDeliveryRadius = route?.params?.deliveryRadius || null;
  const type = route?.params?.type || null;
  const restaurantId = route?.params?.id || null;

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedTimeType, setSelectedTimeType] = useState<
    'open' | 'close' | null
  >(null);

  const formatTime = (date?: Date): string => {
    if (!date) return '';
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${hours}:${formattedMinutes} ${period}`;
  };

  // console.log('existingTimings ===>', existingTimings);

  // const sliderWidth = useRef(0);
  // const sliderX = useRef(0);
  // const pan = useRef(new Animated.ValueXY()).current;

  const minRadius = 5;
  const maxRadius = 200;

  useEffect(() => {
    if (existingTimings && Array.isArray(existingTimings)) {
      setSchedule(prevSchedule => {
        const updatedSchedule = [...prevSchedule];

        existingTimings.forEach((timing: any) => {
          const dayIndex = updatedSchedule.findIndex(
            day => day.day.toLowerCase() === timing.day?.toLowerCase(),
          );

          if (dayIndex !== -1 && timing.open && timing.close) {
            const today = new Date();
            const [openHours, openMinutes] = timing.open.split(':').map(Number);
            const [closeHours, closeMinutes] = timing.close
              .split(':')
              .map(Number);

            const openTime = new Date(today);
            openTime.setHours(openHours, openMinutes || 0, 0);

            const closeTime = new Date(today);
            closeTime.setHours(closeHours, closeMinutes || 0, 0);

            updatedSchedule[dayIndex] = {
              ...updatedSchedule[dayIndex],
              id: timing?.id,
              status: 'open',
              open: openTime,
              close: closeTime,
            };
          }
        });

        return updatedSchedule;
      });
    }

    if (existingDeliveryRadius) {
      setDeliveryRadius(Number(existingDeliveryRadius));
    }
  }, [existingTimings, existingDeliveryRadius]);

  // useEffect(() => {
  //   // Initialize slider position based on deliveryRadius
  //   if (sliderWidth.current > 0) {
  //     const percentage = (deliveryRadius - minRadius) / (maxRadius - minRadius);
  //     const position = percentage * sliderWidth.current;
  //     pan.setValue({ x: position, y: 0 });
  //   }
  // }, []);

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderGrant: evt => {
  //       sliderX.current = evt.nativeEvent.locationX;
  //       pan.setOffset({
  //         x: (pan.x as any)._value,
  //         y: 0,
  //       });
  //     },
  //     onPanResponderMove: (evt, gestureState) => {
  //       const currentX = sliderX.current + gestureState.dx;
  //       const newX = Math.max(0, Math.min(currentX, sliderWidth.current));
  //       pan.setValue({ x: newX, y: 0 });

  //       // Calculate radius value
  //       const percentage = newX / sliderWidth.current;
  //       const radius = Math.round(
  //         minRadius + percentage * (maxRadius - minRadius),
  //       );
  //       setDeliveryRadius(radius);
  //     },
  //     onPanResponderRelease: () => {
  //       pan.flattenOffset();
  //     },
  //   }),
  // ).current;

  const handleDayStatusChange = (index: number, status: 'open' | 'close') => {
    const newSchedule = [...schedule];
    if (status === 'open') {
      // Toggle open status
      if (newSchedule[index].status === 'open') {
        // If already open, toggle it off
        newSchedule[index].status = null;
        newSchedule[index].open = undefined;
        newSchedule[index].close = undefined;
      } else {
        // Set status to open and show open time picker
        newSchedule[index].status = 'open';
        setSelectedDayIndex(index);
        setSelectedTimeType('open');
        setShowTimePicker(true);
      }
    } else {
      // For 'close' button, only set close time if day is already open
      if (newSchedule[index].status === 'open') {
        setSelectedDayIndex(index);
        setSelectedTimeType('close');
        setShowTimePicker(true);
      }
    }
    setSchedule(newSchedule);
  };

  const handleTimeConfirm = (date: Date) => {
    if (selectedDayIndex !== null && selectedTimeType) {
      const newSchedule = [...schedule];
      if (selectedTimeType === 'open') {
        newSchedule[selectedDayIndex].open = date;
        // If close time exists and is before open time, clear it
        if (
          newSchedule[selectedDayIndex].close &&
          newSchedule[selectedDayIndex].close! <= date
        ) {
          newSchedule[selectedDayIndex].close = undefined;
        }
      } else {
        const openTime = newSchedule[selectedDayIndex].open;
        // Validate that close time is after open time
        // if (openTime && date <= openTime) {
        //   ShowToast('error', 'Close time must be after open time');
        //   return;
        // }
        newSchedule[selectedDayIndex].close = date;
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
      if (selectedTimeType === 'open' && daySchedule.open) {
        return daySchedule.open;
      } else if (selectedTimeType === 'close' && daySchedule.close) {
        return daySchedule.close;
      }
    }
    return new Date();
  };

  const handleContinue = async () => {
    const hasAnyOpenDay = schedule.some(day => day.status === 'open');
    if (!hasAnyOpenDay) {
      ShowToast('error', 'Please set timing for at least one day');
      return;
    }

    const invalidDays = schedule.filter(
      day => day.status === 'open' && (!day.open || !day.close),
    );

    if (invalidDays.length > 0) {
      ShowToast(
        'error',
        `Please set both open and close times for ${invalidDays
          .map(d => d.day)
          .join(', ')}`,
      );
      return;
    }

    // for (const day of schedule) {
    //   if (day.status === 'open' && day.open && day.close) {
    //     if (day.close <= day.open) {
    //       ShowToast(
    //         'error',
    //         `Close time must be after open time on ${day.day}`,
    //       );
    //       return;
    //     }
    //   }
    // }

    if (deliveryRadius < 100 || deliveryRadius > maxRadius) {
      ShowToast(
        'error',
        `Delivery radius must be between 100 and ${maxRadius} km`,
      );
      return;
    }

    try {
      let data = new FormData();

      const { id, destination, ...cleanAddress } = prevData?.address || {};

      const selectedSchedule = schedule
        // .filter(day => day.status === 'open' && day.open && day.close)
        .map(day => ({
          // id: day?.id,
          day: day.day.toLowerCase(),
          open: day?.open ? moment(day.open).format('hh:mm:ss') : null,
          close: day?.close ? moment(day.close).format('hh:mm:ss') : null,
        }));

      // return console.log('Selected schedule:', selectedSchedule);

      data.append('name', prevData?.restaurantName);
      data.append('phoneNumber', prevData?.phoneNumber);
      data.append('location', JSON.stringify(cleanAddress));
      data.append('description', prevData?.about);
      data.append('logo', {
        uri: prevData?.logoImage,
        name: 'logo.jpg',
        type: 'image/jpeg',
      });
      data.append('banner', {
        uri: prevData?.coverImage,
        name: 'cover.jpg',
        type: 'image/jpeg',
      });
      data.append('timings', JSON.stringify(selectedSchedule));
      data.append('deliveryRadius', deliveryRadius.toString());

      // console.log('formData ===>', data);

      const res =
        type === 'edit'
          ? await updateRestaurant({ id: restaurantId, data: data }).unwrap()
          : await addRestaurant(data).unwrap();
      console.log('restaurant create/update response ===>', res, type);
      ShowToast(
        'success',
        type === 'edit'
          ? 'Restaurant updated successfully'
          : 'Restaurant created successfully',
      );
      if (res.success) {
        navigation.navigate('RestaurantStack', {
          screen: 'RestaurantHome',
        });
      }
    } catch (error) {
      ShowToast(
        'error',
        (error as { data: { message: string } })?.data?.message ||
        'Something went wrong',
      );
      console.log('error while creating/updating the restaurant', error);
    }
  };

  const handleConnectStripe = async () => {
    try {
      const res = await stripeConnect({}).unwrap();
      console.log('stripe connect response ===>', res);
      console.log('stripe connect response ===>', res.data.stripeVenderAccount.url);
      if (res.success) {
        // Linking.openURL(res.data.stripeVenderAccount.url);
        navigation.navigate('Web', { url: res.data.stripeVenderAccount.url });
      } else {
        ShowToast('error', res.message);
      }
    } catch (error) {
      ShowToast('error', 'Cannot connect to stripe.');
      console.log('error while connecting stripe', error);
    }
  };

  // const handleSliderLayout = (event: any) => {
  //   sliderWidth.current = event.nativeEvent.layout.width;
  //   const percentage = (deliveryRadius - minRadius) / (maxRadius - minRadius);
  //   const position = percentage * sliderWidth.current;
  //   pan.setValue({ x: position, y: 0 });
  // };

  return (
    <WrapperContainer
      showRight={false}
      title="Schedule & Bank Setup"
      navigation={navigation}
    >
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* <WebView
            style={{ width: '100%', height: 500,flex: 1 }}
            source={{ uri: stripeUrl || 'www.google.com'}}
          /> */}
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
                        daySchedule.status === 'open' &&
                        daySchedule.close &&
                        styles.statusButtonActive,
                        daySchedule.status !== 'open' &&
                        styles.statusButtonDisabled,
                      ]}
                      onPress={() => handleDayStatusChange(index, 'close')}
                      activeOpacity={0.7}
                      disabled={daySchedule.status !== 'open'}
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          daySchedule.status === 'open' &&
                          daySchedule.close &&
                          styles.statusButtonTextActive,
                          daySchedule.status !== 'open' &&
                          styles.statusButtonTextDisabled,
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
                      value={formatTime(daySchedule.open)}
                      onPress={() => {
                        setSelectedDayIndex(index);
                        setSelectedTimeType('open');
                        setShowTimePicker(true);
                      }}
                      mode="time"
                    />
                    <DateTimeInput
                      placeholder="Select Close Time"
                      value={formatTime(daySchedule.close)}
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
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={(deliveryRadius - minRadius) / (maxRadius - minRadius)}
              minimumTrackTintColor={colors.c_0162C0}
              maximumTrackTintColor={colors.c_F3F3F3}
              thumbTintColor={colors.white}
              onValueChange={value => {
                const radius = Math.round(
                  minRadius + value * (maxRadius - minRadius),
                );
                setDeliveryRadius(radius);
              }}
            />
            {/* <View
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
            </View> */}
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
              {isLoading || updateLoader ? (
                <Loader />
              ) : (
                <Text style={styles.continueButtonText}>
                  {type === 'edit' ? 'Update' : 'Create'}
                </Text>
              )}
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
              ? `Select ${selectedTimeType === 'open' ? 'Open' : 'Close'
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
  statusButtonDisabled: {
    opacity: 0.5,
  },
  statusButtonTextDisabled: {
    color: colors.c_666666,
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
  stripeWebViewContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'red',
  },
});
