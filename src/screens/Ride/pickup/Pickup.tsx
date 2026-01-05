import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import StatusHeader from '../../../components/statusHeader/StatusHeader';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import {
  MessageCircle,
  Phone,
  Clock,
  Check,
  Star,
  X,
} from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import NavigationBanner from '../../../components/navigationBanner/NavigationBanner';

type RideScreen = 'initial' | 'second' | 'rideDetails' | 'startRide';

const Pickup = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isOnline, setIsOnline] = useState(true);
  const [showArrivedModal, setShowArrivedModal] = useState(false);
  const [showRideCompleteModal, setShowRideCompleteModal] = useState(false);
  const [currentRideScreen, setCurrentRideScreen] =
    useState<RideScreen>('initial');
  const [rating, setRating] = useState(4);
  const [feedback, setFeedback] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const bottomSheetRef = useRef<BottomSheetComponentRef>(null);
  const paymentSheetRef = useRef<BottomSheetComponentRef>(null);
  const screenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rideCompleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleMenuPress = () => {
    // Handle hamburger menu press
  };

  const handleToggleChange = (newValue: boolean) => {
    setIsOnline(newValue);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomSheetRef.current?.open();
      // After 3 seconds, show second screen
      screenTimerRef.current = setTimeout(() => {
        setCurrentRideScreen('second');
      }, 3000);
    }, 300);
    return () => {
      clearTimeout(timer);
      if (screenTimerRef.current) {
        clearTimeout(screenTimerRef.current);
      }
    };
  }, []);

  const handleMessage = () => {
    console.log('Message pressed');
  };

  const handleCall = () => {
    console.log('Call pressed');
  };

  const handleArrived = () => {
    setShowArrivedModal(true);
  };

  const handleYes = () => {
    setShowArrivedModal(false);
    setCurrentRideScreen('rideDetails');
    // After 10 seconds, show start ride screen
    if (rideCompleteTimerRef.current) {
      clearTimeout(rideCompleteTimerRef.current);
    }
    rideCompleteTimerRef.current = setTimeout(() => {
      setCurrentRideScreen('startRide');
    }, 10000);
  };

  const handleNo = () => {
    setShowArrivedModal(false);
  };

  const handleStartRide = () => {
    // This is handled by timer in handleYes
    setCurrentRideScreen('startRide');
  };

  const handleRideCompleteYes = () => {
    setShowRideCompleteModal(false);
    setTimeout(() => {
      paymentSheetRef.current?.open();
    }, 300);
  };

  const handleComplete = () => {
    // Open Ride Complete modal
    setShowRideCompleteModal(true);
  };

  const handleRideCompleteNo = () => {
    setShowRideCompleteModal(false);
  };

  const handleSubmit = () => {
    // Handle submit action
    console.log('Submit pressed', { rating, feedback, paymentMethod });
    paymentSheetRef.current?.close();
    bottomSheetRef.current?.close();

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'app',
          state: {
            routes: [
              {
                name: 'CabStack',
                state: {
                  routes: [
                    {
                      name: 'MyVehicle',
                    },
                  ],
                  index: 0,
                },
              },
            ],
            index: 0,
          },
        },
      ],
    });

    setTimeout(() => {}, 300);
  };

  useEffect(() => {
    return () => {
      if (rideCompleteTimerRef.current) {
        clearTimeout(rideCompleteTimerRef.current);
      }
      if (screenTimerRef.current) {
        clearTimeout(screenTimerRef.current);
      }
    };
  }, []);

  return (
    <RideWrapper navigation={navigation}>
      <StatusHeader
        title="Pickup"
        isOnline={isOnline}
        onMenuPress={handleMenuPress}
        onToggleChange={handleToggleChange}
      />

      {/* Navigation Instruction Banner */}
      <NavigationBanner text="250m Turn right at 105 William St, Chicago, US" />

      {/* Arrived Confirmation Modal */}
      <Modal
        visible={showArrivedModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleNo}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Arrived</Text>
            <Text style={styles.modalQuestion}>
              Are you at the pickup location?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalYesButton}
                onPress={handleYes}
                activeOpacity={0.7}
              >
                <Text style={styles.modalYesButtonText}>YES</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNo}
                activeOpacity={0.7}
                style={styles.modalNoButtonContainer}
              >
                <LinearGradient
                  colors={['#F47E20', '#EE4026']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalNoButton}
                >
                  <Text style={styles.modalNoButtonText}>NO</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Single Bottom Sheet with Multiple Screens */}
      <BottomSheetComponent
        ref={bottomSheetRef}
        snapPoints={
          currentRideScreen === 'rideDetails'
            ? ['60%']
            : currentRideScreen === 'startRide'
            ? ['30%']
            : ['25%']
        }
        enableDynamicSizing={false}
        showBackdrop={currentRideScreen === 'rideDetails'}
      >
        {currentRideScreen === 'initial' || currentRideScreen === 'second' ? (
          // Screen 1 & 2: Action Buttons
          <View style={styles.bottomSheetContent}>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={handleMessage}
                activeOpacity={0.7}
              >
                <MessageCircle size={20} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.callButton}
                onPress={handleCall}
                activeOpacity={0.7}
              >
                <Phone size={20} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.arrivedButton}
                onPress={handleArrived}
                activeOpacity={0.7}
              >
                <Text style={styles.arrivedButtonText}>Arrived</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : currentRideScreen === 'rideDetails' ? (
          // Screen 3: Ride Details
          <ScrollView
            style={styles.rideDetailsContainer}
            contentContainerStyle={styles.rideDetailsContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.locationSection}>
              <View style={styles.locationDot} />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Pickup Location</Text>
                <Text style={styles.locationValue}>Lorem Ipsum Dummy Text</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.infoSection}>
              <View style={styles.locationDot} />
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>ETA</Text>
                  <Text style={styles.infoValue}>10 mins to Reach</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Distance</Text>
                  <Text style={styles.infoValue}>2 km away</Text>
                </View>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.locationSection}>
              <View style={styles.locationDot} />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Drop off Location</Text>
                <Text style={styles.locationValue}>Lorem Ipsum Dummy Text</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.bookingInfoRow}>
              <View style={styles.bookingInfoItem}>
                <Text style={styles.bookingInfoLabel}>Booking Type</Text>
                <Text style={styles.bookingInfoValue}>NOW</Text>
              </View>
              <View style={styles.bookingInfoItem}>
                <Text style={styles.bookingInfoLabel}>Payment</Text>
                <Text style={styles.bookingInfoValue}>CASH</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.startRideButton}
              onPress={handleStartRide}
              activeOpacity={0.7}
            >
              <View style={styles.startRideIconContainer}>
                <Check size={20} color={colors.primary} />
              </View>
              <Text style={styles.startRideButtonText}>Start Ride</Text>
              <View></View>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          // Screen 4: Start Ride with Complete Button
          <View style={styles.startRideSheetContent}>
            <View style={styles.startRideMapContainer}>
              <View style={styles.startRideMapContent}>
                <View style={styles.startRideTimeBadge}>
                  <Clock size={16} color={colors.white} />
                  <View style={styles.startRideTimeTextContainer}>
                    <Text style={styles.startRideTimeValue}>20 Mins</Text>
                    <Text style={styles.startRideTimeLabel}>To Reach</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.startRideActionButtons}>
              <TouchableOpacity
                style={styles.startRideMessageButton}
                onPress={handleMessage}
                activeOpacity={0.7}
              >
                <MessageCircle size={20} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.startRideCallButton}
                onPress={handleCall}
                activeOpacity={0.7}
              >
                <Phone size={20} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.startRideCompleteButton}
                onPress={handleComplete}
                activeOpacity={0.7}
              >
                <Text style={styles.startRideCompleteButtonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </BottomSheetComponent>

      {/* Ride Complete Modal */}
      <Modal
        visible={showRideCompleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleRideCompleteNo}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ride Complete</Text>
            <Text style={styles.modalQuestion}>
              Are you at the drop off location?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalYesButton}
                onPress={handleRideCompleteYes}
                activeOpacity={0.7}
              >
                <Text style={styles.modalYesButtonText}>YES</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRideCompleteNo}
                activeOpacity={0.7}
                style={styles.modalNoButtonContainer}
              >
                <LinearGradient
                  colors={['#F47E20', '#EE4026']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalNoButton}
                >
                  <Text style={styles.modalNoButtonText}>NO</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Details & Rate & Review Bottom Sheet */}
      <BottomSheetComponent
        ref={paymentSheetRef}
        snapPoints={['80%']}
        enableDynamicSizing={false}
      >
        <ScrollView
          style={styles.paymentContainer}
          contentContainerStyle={styles.paymentContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Section */}
          <View style={styles.paymentProfileContainer}>
            <Image
              source={images.ronald_adams}
              style={styles.paymentProfileAvatar}
              resizeMode="cover"
            />
            <View style={styles.paymentProfileDetails}>
              <Text style={styles.paymentProfileName}>Ronald Adam</Text>
              <Text style={styles.paymentProfileRole}>User</Text>
            </View>
          </View>

          {/* Separator */}
          <View style={styles.paymentSeparator} />

          {/* Payment Details */}
          <Text style={styles.paymentSectionTitle}>Payment Details</Text>
          <View style={styles.paymentSummaryRow}>
            <View style={styles.paymentSummaryItem}>
              <Text style={styles.paymentSummaryLabel}>Final Cost</Text>
              <Text style={styles.paymentSummaryValue}>$25.00</Text>
            </View>
            <View style={styles.paymentSummaryItem}>
              <Text style={styles.paymentSummaryLabel}>Amount Received</Text>
              <Text style={styles.paymentSummaryValue}>$25.00</Text>
            </View>
            <View style={styles.paymentSummaryItem}>
              <Text style={styles.paymentSummaryLabel}>Balance</Text>
              <Text style={styles.paymentSummaryValue}>$00.00</Text>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.paymentMethodContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethodOption,
                paymentMethod === 'cash' && styles.paymentMethodSelected,
              ]}
              onPress={() => setPaymentMethod('cash')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.paymentRadio,
                  paymentMethod === 'cash' && styles.paymentRadioSelected,
                ]}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === 'cash' && styles.paymentMethodTextSelected,
                ]}
              >
                Cash
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentMethodOption,
                paymentMethod === 'online' && styles.paymentMethodSelected,
              ]}
              onPress={() => setPaymentMethod('online')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.paymentRadio,
                  paymentMethod === 'online' && styles.paymentRadioSelected,
                ]}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === 'online' &&
                    styles.paymentMethodTextSelected,
                ]}
              >
                Online Paid
              </Text>
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <View style={styles.paymentSeparator} />

          {/* Rate & Review */}
          <Text style={styles.paymentSectionTitle}>Rate & Review</Text>
          <Text style={styles.paymentDescription}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum.
          </Text>

          {/* Star Rating */}
          <View style={styles.starRatingContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <Star
                  size={32}
                  color={star <= rating ? colors.c_EE4026 : colors.c_DDDDDD}
                  fill={star <= rating ? colors.c_EE4026 : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Input */}
          <TextInput
            style={styles.feedbackInput}
            placeholder="Your Feedback"
            placeholderTextColor={colors.c_666666}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>Submit Now</Text>
          </TouchableOpacity>

          {/* Complete Button */}
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            activeOpacity={0.7}
          >
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default Pickup;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.c_F3F3F3,
  },
  mapContent: {
    flex: 1,
    position: 'relative',
  },
  destinationMarker: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.c_0162C0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.c_0162C0,
    borderWidth: 2,
    borderColor: colors.white,
  },
  carMarker: {
    position: 'absolute',
    top: '50%',
    left: '30%',
    width: 50,
    height: 50,
  },
  carIcon: {
    width: '100%',
    height: '100%',
    tintColor: colors.c_F59523,
  },
  timeBadge: {
    position: 'absolute',
    bottom: '20%',
    right: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.c_0162C0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  timeBadgeText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  messageButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.c_0162C0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  callButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.c_F59523,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  arrivedButton: {
    flex: 1,
    height: 56,
    borderRadius: 100,
    backgroundColor: colors.c_0162C0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  arrivedButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 16,
    padding: 24,
    width: '85%',

    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    zIndex: 10000,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    // opacity: 0.65,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
  },
  modalQuestion: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalYesButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  modalYesButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  modalNoButtonContainer: {
    flex: 1,
    height: 50,
  },
  modalNoButton: {
    borderRadius: 12,
    // paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  modalNoButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  // Ride Details Bottom Sheet Styles
  rideDetailsContainer: {
    flex: 1,
  },
  rideDetailsContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.c_0162C0,
    marginTop: 6,
  },
  locationTextContainer: {
    flex: 1,
    gap: 4,
  },
  locationLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_0162C0,
  },
  locationValue: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  separator: {
    height: 1,
    backgroundColor: colors.c_DDDDDD,
    marginVertical: 16,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  bookingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  bookingInfoItem: {
    flex: 1,
    gap: 4,
  },
  bookingInfoLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  bookingInfoValue: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  startRideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    paddingVertical: 10,
    paddingLeft: 10,
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startRideIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startRideButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  // Start Ride Bottom Sheet Styles
  startRideSheetContent: {
    flex: 1,
  },
  startRideMapContainer: {
    // height: 200,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.c_F3F3F3,
  },
  startRideMapContent: {
    flex: 1,
    position: 'relative',
  },
  startRideCarMarker: {
    position: 'absolute',
    top: '40%',
    left: '35%',
    width: 60,
    height: 60,
  },
  startRideCarIcon: {
    width: '100%',
    height: '100%',
    tintColor: colors.c_F59523,
  },
  startRideTimeBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.c_0162C0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  startRideTimeTextContainer: {
    gap: 2,
  },
  startRideTimeValue: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  startRideTimeLabel: {
    fontSize: 10,
    fontFamily: fonts.normal,
    color: colors.white,
  },
  startRideActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 12,
  },
  startRideMessageButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.c_0162C0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startRideCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.c_F59523,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startRideCompleteButton: {
    flex: 1,
    height: 56,
    borderRadius: 100,
    backgroundColor: colors.c_0162C0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startRideCompleteButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  // Payment Details Styles
  paymentContainer: {
    flex: 1,
  },
  paymentContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  paymentProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  paymentProfileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.c_F3F3F3,
  },
  paymentProfileDetails: {
    flex: 1,
    gap: 4,
  },
  paymentProfileName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  paymentProfileRole: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  paymentSeparator: {
    height: 1,
    backgroundColor: colors.c_DDDDDD,
    marginVertical: 16,
  },
  paymentSectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 16,
  },
  paymentSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentSummaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  paymentSummaryLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  paymentSummaryValue: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  paymentMethodOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  paymentMethodSelected: {
    borderColor: colors.c_EE4026,
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.c_DDDDDD,
  },
  paymentRadioSelected: {
    borderColor: colors.c_EE4026,
    backgroundColor: colors.c_EE4026,
  },
  paymentMethodText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  paymentMethodTextSelected: {
    color: colors.c_EE4026,
  },
  paymentDescription: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 16,
    lineHeight: 20,
  },
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  feedbackInput: {
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  submitButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  completeButton: {
    backgroundColor: colors.c_F59523,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
