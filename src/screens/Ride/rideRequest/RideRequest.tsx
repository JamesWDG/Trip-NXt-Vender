import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    Dimensions,
    Image,
    Modal,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronLeft, MapPin, User, Navigation, CheckCircle, Clock, DollarSign } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import {
  useLazyGetRideByIdQuery,
  useLazyGetVendorActiveRideQuery,
  useLazyGetAvailableRidesQuery,
  useAcceptRideMutation,
  useCounterOfferMutation,
  useUpdateRideStatusMutation,
} from '../../../redux/services/rideService';
import type { RidePayload } from '../../../redux/services/rideService';
import { formatUsd, RS_PER_USD } from '../../../utils/currency';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_API_KEY = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';

const OrderSummaryModal = ({ visible, ride, onComplete }: { visible: boolean; ride: any; onComplete: () => void }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onComplete}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <CheckCircle size={50} color={colors.green} style={{ marginBottom: 10 }} />
                        <Text style={styles.modalTitle}>Ride Completed!</Text>
                        <Text style={styles.modalSubtitle}>You have arrived at your destination</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Clock size={20} color={colors.c_666666} />
                                <Text style={styles.summaryLabel}>15 min</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <DollarSign size={20} color={colors.c_666666} />
                                <Text style={styles.summaryLabel}>{ride?.price}</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <MapPin size={20} color={colors.c_666666} />
                                <Text style={styles.summaryLabel}>{ride?.distance}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.addressContainer}>
                        <View style={styles.addressItem}>
                            <View style={[styles.dot, { backgroundColor: colors.c_0162C0 }]} />
                            <Text style={styles.addressText} numberOfLines={2}>{ride?.pickup.address}</Text>
                        </View>
                        <View style={styles.verticalLine} />
                        <View style={styles.addressItem}>
                            <View style={[styles.dot, { backgroundColor: colors.red }]} />
                            <Text style={styles.addressText} numberOfLines={2}>{ride?.dropoff.address}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.fareContainer}>
                        <Text style={styles.fareLabel}>Total Fare</Text>
                        <Text style={styles.fareAmount}>{ride?.price}</Text>
                    </View>

                    <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
                        <Text style={styles.completeButtonText}>Back to Dashboard</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};




/** Map API RidePayload to the shape the UI card expects */
function mapRideToCard(ride: RidePayload): any {
  const fare = ride.negotiatedFare ?? ride.offeredFare;
  return {
    id: String(ride.id),
    user: ride.user?.name ?? 'User',
    rating: '4.5',
    price: formatUsd(fare),
    distance: '',
    pickup: {
      latitude: ride.pickup.lat,
      longitude: ride.pickup.lng,
      address: ride.pickup.address ?? 'Pickup',
    },
    dropoff: {
      latitude: ride.dropoff.lat,
      longitude: ride.dropoff.lng,
      address: ride.dropoff.address ?? 'Drop-off',
    },
    _payload: ride,
  };
}

type RideRequestParams = { rideId?: number };
const RideRequest = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<{ params?: RideRequestParams }, 'params'>>();
    const rideIdFromParams = route.params?.rideId;
    const mapRef = useRef<MapView>(null);
    const driverMarkerRef = useRef<any>(null);

    const [getRideById, { data: singleRide, isLoading: loadingSingle }] = useLazyGetRideByIdQuery();
    const [getVendorActiveRide, { data: activeRideData }] = useLazyGetVendorActiveRideQuery();
    const [getAvailableRides, { data: availableRides, isLoading: loadingAvailable }] = useLazyGetAvailableRidesQuery();
    const [acceptRide, { isLoading: accepting }] = useAcceptRideMutation();
    const [counterOffer, { isLoading: countering }] = useCounterOfferMutation();
    const [updateRideStatus, { isLoading: updatingStatus }] = useUpdateRideStatusMutation();

    const [rides, setRides] = useState<any[]>([]);
    const [acceptedRide, setAcceptedRide] = useState<any>(null);
    const [activeRide, setActiveRide] = useState<RidePayload | null>(null);
    const [driverLocation, setDriverLocation] = useState({
        latitude: 40.7128,
        longitude: -74.0060,
    });
    const [status, setStatus] = useState<'searching' | 'accepted' | 'to_pickup' | 'in_progress' | 'completed'>('searching');
    const [reachedPickup, setReachedPickup] = useState(false);
    const [arrivedMarked, setArrivedMarked] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [driverRotation, setDriverRotation] = useState(0);
    const [counterOfferModal, setCounterOfferModal] = useState<{ rideId: number; offeredFare: number } | null>(null);
    const [counterAdjustment, setCounterAdjustment] = useState(0);




    // Map region state – start with default, update when we get user location so map shows "my location"
    const [mapRegion, setMapRegion] = useState({
        latitude: 24.86,
        longitude: 67.01,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    // Fetch vendor's active (booked) ride – so we show "Ride booked" when user has accepted
    useEffect(() => {
        getVendorActiveRide();
        const t = setInterval(() => getVendorActiveRide(), 8000);
        return () => clearInterval(t);
    }, [getVendorActiveRide]);

    useEffect(() => {
        if (activeRideData && typeof activeRideData === 'object' && 'id' in activeRideData) {
            const ride = activeRideData as RidePayload;
            setActiveRide(ride);
            const card = mapRideToCard(ride);
            if (ride.status === 'accepted') {
                setAcceptedRide(card);
                setStatus('accepted');
                setArrivedMarked(false);
            } else if (ride.status === 'driver_arrived') {
                setAcceptedRide(card);
                setStatus('accepted');
                setReachedPickup(true);
                setArrivedMarked(true);
            } else if (ride.status === 'ongoing') {
                setAcceptedRide(card);
                setStatus('in_progress');
            }
        } else if (activeRideData === null) {
            setActiveRide(null);
            setAcceptedRide(null);
            setStatus('searching');
            setReachedPickup(false);
            setArrivedMarked(false);
        }
    }, [activeRideData]);

    // Load rides: from FCM (single rideId) or available list (vendor location)
    useEffect(() => {
        if (rideIdFromParams) {
            getRideById(rideIdFromParams);
        } else {
            let cancelled = false;
            (async () => {
                try {
                    const Geolocation = require('react-native-geolocation-service')?.default ?? require('react-native-geolocation-service');
                    Geolocation.getCurrentPosition(
                        (pos: any) => {
                            if (cancelled) return;
                            const lat = pos.coords.latitude;
                            const lng = pos.coords.longitude;
                            const newLoc = { latitude: lat, longitude: lng };
                            setDriverLocation(newLoc);
                            setMapRegion({
                                latitude: lat,
                                longitude: lng,
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            });
                            getAvailableRides({ latitude: lat, longitude: lng });
                        },
                        () => {
                            if (!cancelled) getAvailableRides({ latitude: 24.86, longitude: 67.01 });
                        },
                        { enableHighAccuracy: true, timeout: 10000 }
                    );
                } catch (_) {
                    if (!cancelled) getAvailableRides({ latitude: 24.86, longitude: 67.01 });
                }
            })();
            return () => { cancelled = true; };
        }
    }, [rideIdFromParams]);

    useEffect(() => {
        if (singleRide && rideIdFromParams) {
            setRides([mapRideToCard(singleRide)]);
        }
    }, [singleRide, rideIdFromParams]);

    useEffect(() => {
        if (Array.isArray(availableRides) && availableRides.length > 0 && !rideIdFromParams) {
            const activeId = activeRide?.id;
            const list = activeId
                ? availableRides.filter((r) => r.id !== activeId).map(mapRideToCard)
                : availableRides.map(mapRideToCard);
            setRides(list);
        }
    }, [availableRides, rideIdFromParams, activeRide?.id]);

    // Live driver location when going to pickup or to dropoff (Bykea-style: real map, no animation)
    useEffect(() => {
        if (status !== 'to_pickup' && status !== 'in_progress') return;
        const Geolocation = require('react-native-geolocation-service')?.default ?? require('react-native-geolocation-service');
        const watchId = Geolocation.watchPosition(
            (pos: any) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setDriverLocation({ latitude: lat, longitude: lng });
            },
            () => {},
            { enableHighAccuracy: true, distanceFilter: 10 }
        );
        return () => { Geolocation.clearWatch(watchId); };
    }, [status]);

    const handleAcceptRide = async (ride: any) => {
        const payload = ride._payload as RidePayload | undefined;
        const id = payload?.id ?? parseInt(ride.id, 10);
        if (!id) return;
        try {
            const result = await acceptRide(id).unwrap();
            if (result) {
                setAcceptedRide(ride);
                setStatus('accepted');
                setRides([]);
                setTimeout(() => {
                    mapRef.current?.fitToCoordinates([
                        driverLocation,
                        ride.pickup,
                    ], { edgePadding: { top: 50, right: 50, bottom: 200, left: 50 }, animated: true });
                }, 500);
            }
        } catch (e) {
            Alert.alert('Error', (e as any)?.data?.message ?? 'Could not accept ride');
        }
    };

    const handleDeclineRide = (id: string) => {
        setRides(prev => prev.filter(r => r.id !== id));
    };

    const centerOnMyLocation = () => {
        setMapRegion(prev => ({
            ...prev,
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        }));
    };

    const handleCounterOffer = (ride: any) => {
        const payload = ride._payload as RidePayload | undefined;
        const id = payload?.id ?? parseInt(ride.id, 10);
        if (id) {
            setCounterOfferModal({ rideId: id, offeredFare: payload?.offeredFare ?? 0 });
            setCounterAdjustment(0);
        }
    };

    const submitCounterOffer = async () => {
        if (!counterOfferModal) return;
        const base = counterOfferModal.offeredFare;
        const proposedFareInRs = Math.max(50, base + counterAdjustment * 2);
        try {
            await counterOffer({ rideId: counterOfferModal.rideId, proposedFare: proposedFareInRs }).unwrap();
            setCounterOfferModal(null);
            setCounterAdjustment(0);
            setRides(prev => prev.filter(r => r._payload?.id !== counterOfferModal.rideId));
        } catch (e) {
            Alert.alert('Error', (e as any)?.data?.message ?? 'Counter offer failed');
        }
    };

    /** Leg 1: Show map with directions to pickup. Driver moves in real life; we show live location + route (Bykea-style). */
    const startMovingToPickup = () => {
        if (!acceptedRide) return;
        setStatus('to_pickup');
        setReachedPickup(true);
        // Fit map to show driver + pickup so route is visible
        setTimeout(() => {
            mapRef.current?.fitToCoordinates(
                [driverLocation, acceptedRide.pickup],
                { edgePadding: { top: 80, right: 60, bottom: 200, left: 60 }, animated: true }
            );
        }, 300);
    };

    /** Mark that driver has arrived at pickup (Bykea: "Arrived" button). */
    const markArrived = async () => {
        if (!activeRide || !acceptedRide) return;
        try {
            await updateRideStatus({ rideId: activeRide.id, status: 'driver_arrived' }).unwrap();
            setActiveRide((prev) => (prev ? { ...prev, status: 'driver_arrived' } : null));
            setArrivedMarked(true);
        } catch (e) {
            Alert.alert('Error', (e as any)?.data?.message ?? 'Failed to mark arrived');
        }
    };

    /** Leg 2: Show map with directions to dropoff. Driver drives in real life; vendor taps "Complete ride" when done (Bykea-style). */
    const startRideWithUser = async () => {
        if (!acceptedRide) return;
        if (activeRide && (activeRide.status === 'accepted' || activeRide.status === 'driver_arrived')) {
            try {
                await updateRideStatus({ rideId: activeRide.id, status: 'ongoing' }).unwrap();
                setActiveRide((prev) => (prev ? { ...prev, status: 'ongoing' } : null));
            } catch (e) {
                Alert.alert('Error', (e as any)?.data?.message ?? 'Failed to start ride');
                return;
            }
        }
        setReachedPickup(false);
        setStatus('in_progress');
        setTimeout(() => {
            mapRef.current?.fitToCoordinates(
                [driverLocation, acceptedRide.pickup, acceptedRide.dropoff],
                { edgePadding: { top: 80, right: 60, bottom: 200, left: 60 }, animated: true }
            );
        }, 300);
    };

    const completeRide = async () => {
        const rideId = acceptedRide?._payload?.id ?? activeRide?.id;
        if (!rideId) return;
        try {
            await updateRideStatus({ rideId: Number(rideId), status: 'completed' }).unwrap();
            setStatus('completed');
            setShowSummary(true);
        } catch (e) {
            Alert.alert('Error', (e as any)?.data?.message ?? 'Failed to complete ride');
        }
    };

    const renderRideItem = ({ item }: { item: any }) => (
        <View style={styles.rideCard}>
            <View style={styles.rideHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <User size={20} color={colors.white} />
                    </View>
                    <View>
                        <Text style={styles.userName}>{item.user}</Text>
                        <Text style={styles.rating}>★ {item.rating}</Text>
                    </View>
                </View>
                <Text style={styles.price}>{item.price}</Text>
            </View>

            <View style={styles.locationInfo}>
                <View style={styles.locationRow}>
                    <MapPin size={16} color={colors.c_0162C0} />
                    <Text style={styles.address} numberOfLines={1}>{item.pickup.address}</Text>
                </View>
                <View style={styles.locationLine} />
                <View style={styles.locationRow}>
                    <MapPin size={16} color={colors.red} />
                    <Text style={styles.address} numberOfLines={1}>{item.dropoff.address}</Text>
                </View>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.button, styles.declineButton]}
                    onPress={() => handleDeclineRide(item.id)}
                >
                    <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.counterButton]}
                    onPress={() => handleCounterOffer(item)}
                >
                    <Text style={styles.counterText}>Counter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => handleAcceptRide(item)}
                    disabled={accepting}
                >
                    <Text style={styles.acceptText}>{accepting ? '...' : 'Accept'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={mapRegion}
                onRegionChangeComplete={setMapRegion}
            >
                {/* Driver Marker */}
                <Marker
                    ref={driverMarkerRef}
                    coordinate={driverLocation}
                    title="You"
                    rotation={driverRotation}
                    flat={true}
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <Image
                        source={images.car}
                        style={{
                            width: 40,
                            height: 40,
                            resizeMode: 'contain',
                            transform: [{ rotate: `${driverRotation}deg` }]
                        }}
                    />
                </Marker>

                {/* Pickup/Dropoff Markers - Only show relevant ones */}
                {status === 'searching' && rides.map(ride => (
                    <Marker
                        key={ride.id}
                        coordinate={ride.pickup}
                        pinColor={colors.c_0162C0}
                        title={`Pickup: ${ride.user}`}
                    />
                ))}

                {acceptedRide && (
                    <>
                        <Marker coordinate={acceptedRide.pickup} pinColor="green" title="Pickup" />
                        <Marker coordinate={acceptedRide.dropoff} pinColor="red" title="Dropoff" />
                        {status === 'to_pickup' && (
                            <MapViewDirections
                                origin={driverLocation}
                                destination={acceptedRide.pickup}
                                apikey={GOOGLE_MAPS_API_KEY}
                                strokeColor={colors.c_0162C0}
                                strokeWidth={4}
                                onReady={(result) => {
                                    mapRef.current?.fitToCoordinates(result.coordinates, {
                                        edgePadding: { top: 80, right: 60, bottom: 200, left: 60 },
                                        animated: true,
                                    });
                                }}
                            />
                        )}
                        {status === 'in_progress' && (
                            <MapViewDirections
                                origin={driverLocation}
                                destination={acceptedRide.dropoff}
                                apikey={GOOGLE_MAPS_API_KEY}
                                strokeColor={colors.c_0162C0}
                                strokeWidth={4}
                                onReady={(result) => {
                                    mapRef.current?.fitToCoordinates(result.coordinates, {
                                        edgePadding: { top: 80, right: 60, bottom: 200, left: 60 },
                                        animated: true,
                                    });
                                }}
                            />
                        )}
                        {status === 'accepted' && (
                            <Polyline
                                coordinates={[driverLocation, acceptedRide.pickup, acceptedRide.dropoff]}
                                strokeColor={colors.c_0162C0}
                                strokeWidth={2}
                            />
                        )}
                    </>
                )}
            </MapView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <ChevronLeft color={colors.black} size={28} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.myLocationButton} onPress={centerOnMyLocation}>
                <MapPin color={colors.c_0162C0} size={24} />
                <Text style={styles.myLocationText}>My location</Text>
            </TouchableOpacity>

            {status === 'searching' && !activeRide && (
                <View style={styles.listContainer}>
                    <Text style={styles.title}>Available Rides</Text>
                    {(loadingSingle || (loadingAvailable && !rideIdFromParams)) && rides.length === 0 ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={colors.c_0162C0} />
                            <Text style={{ fontFamily: fonts.medium, color: colors.black, marginTop: 8 }}>Loading rides...</Text>
                        </View>
                    ) : rides.length === 0 && !loadingSingle ? (
                        <Text style={{ fontFamily: fonts.medium, color: colors.black, marginLeft: 20 }}>No ride requests nearby. Stay online to receive requests.</Text>
                    ) : null}
                    <FlatList
                        data={rides}
                        renderItem={renderRideItem}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        snapToInterval={width * 0.85 + 20}
                        decelerationRate="fast"
                    />
                </View>
            )}

            {status === 'accepted' && !reachedPickup && (
                <View style={styles.statusPanel}>
                    <Text style={[styles.statusText, { fontSize: 12, marginBottom: 4 }]}>Ride booked</Text>
                    <Text style={styles.statusText}>Go to pickup. Tap when you’re moving.</Text>
                    <TouchableOpacity style={styles.startButton} onPress={startMovingToPickup}>
                        <Text style={styles.startButtonText}>Start moving to pickup</Text>
                        <Navigation color={colors.white} size={20} />
                    </TouchableOpacity>
                </View>
            )}

            {status === 'to_pickup' && !arrivedMarked && (
                <View style={styles.statusPanel}>
                    <Text style={[styles.statusText, { fontSize: 12, marginBottom: 4 }]}>Heading to pickup</Text>
                    <Text style={styles.statusText}>Follow the route. Tap when you have arrived at pickup.</Text>
                    <TouchableOpacity style={styles.startButton} onPress={markArrived} disabled={updatingStatus}>
                        <Text style={styles.startButtonText}>{updatingStatus ? '...' : 'Arrived'}</Text>
                        <Navigation color={colors.white} size={20} />
                    </TouchableOpacity>
                </View>
            )}

            {(status === 'to_pickup' || status === 'accepted') && arrivedMarked && (
                <View style={styles.statusPanel}>
                    <Text style={[styles.statusText, { fontSize: 12, marginBottom: 4 }]}>User can get in</Text>
                    <Text style={styles.statusText}>Start ride to dropoff.</Text>
                    <TouchableOpacity style={styles.startButton} onPress={startRideWithUser} disabled={updatingStatus}>
                        <Text style={styles.startButtonText}>{updatingStatus ? 'Starting...' : 'Start ride'}</Text>
                        <Navigation color={colors.white} size={20} />
                    </TouchableOpacity>
                </View>
            )}

            {status === 'in_progress' && (
                <View style={styles.statusPanel}>
                    <Text style={[styles.statusText, { fontSize: 12, marginBottom: 4 }]}>Ride in progress</Text>
                    <Text style={styles.statusText}>Follow the route to dropoff. Tap when you have completed the ride.</Text>
                    <TouchableOpacity style={styles.startButton} onPress={completeRide} disabled={updatingStatus}>
                        <Text style={styles.startButtonText}>{updatingStatus ? '...' : 'Complete ride'}</Text>
                        <CheckCircle color={colors.white} size={20} />
                    </TouchableOpacity>
                </View>
            )}
            {/* Counter Offer Modal – Bykea style: +/-2 buttons */}
            <Modal visible={!!counterOfferModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.counterModalContent}>
                        <Text style={styles.counterModalTitle}>Counter offer ($)</Text>
                        <Text style={[styles.counterModalTitle, { fontSize: 14, marginTop: 4 }]}>
                            User offered {counterOfferModal ? formatUsd(counterOfferModal.offeredFare) : '—'}. Min {formatUsd(50)}.
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 16 }}>
                            <TouchableOpacity
                                style={styles.counterPlusMinusBtn}
                                onPress={() => setCounterAdjustment((a) => a - 1)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.counterPlusMinusText}>−2</Text>
                            </TouchableOpacity>
                            <Text style={[styles.counterModalTitle, { marginHorizontal: 20, minWidth: 80, textAlign: 'center' }]}>
                                {counterOfferModal ? formatUsd(Math.max(50, counterOfferModal.offeredFare + counterAdjustment * 2)) : '—'}
                            </Text>
                            <TouchableOpacity
                                style={styles.counterPlusMinusBtn}
                                onPress={() => setCounterAdjustment((a) => a + 1)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.counterPlusMinusText}>+2</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.counterModalActions}>
                            <TouchableOpacity
                                style={styles.counterModalCancel}
                                onPress={() => { setCounterOfferModal(null); setCounterAdjustment(0); }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.counterModalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.counterModalSend}
                                onPress={submitCounterOffer}
                                disabled={countering}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.counterModalSendText}>{countering ? 'Sending...' : 'Send'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Order Summary Modal */}
            <OrderSummaryModal
                visible={showSummary}
                ride={acceptedRide}
                onComplete={() => {
                    setShowSummary(false);
                    navigation.goBack();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: colors.white,
        padding: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    myLocationButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.white,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    myLocationText: {
        fontSize: 14,
        fontFamily: fonts.medium,
        color: colors.c_0162C0,
    },
    listContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
    },
    title: {
        fontSize: 18,
        fontFamily: fonts.bold,
        color: colors.black,
        marginLeft: 20,
        marginBottom: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    listContent: {
        paddingHorizontal: 10,
    },
    rideCard: {
        backgroundColor: colors.white,
        width: width * 0.85,
        marginHorizontal: 10,
        borderRadius: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    rideHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.c_C4C4C4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontFamily: fonts.bold,
        color: colors.black,
    },
    rating: {
        fontSize: 12,
        fontFamily: fonts.medium,
        color: colors.c_999999,
    },
    price: {
        fontSize: 18,
        fontFamily: fonts.bold,
        color: colors.c_0162C0,
    },
    locationInfo: {
        marginBottom: 15,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    address: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        fontFamily: fonts.normal,
        color: colors.c_484848,
    },
    locationLine: {
        width: 2,
        height: 15,
        backgroundColor: colors.c_C4C4C4,
        marginLeft: 7,
        marginVertical: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    declineButton: {
        backgroundColor: colors.c_F3F3F3,
    },
    counterButton: {
        backgroundColor: colors.c_DDDDDD,
    },
    counterText: {
        color: colors.black,
        fontFamily: fonts.bold,
        fontSize: 12,
    },
    acceptButton: {
        backgroundColor: colors.c_0162C0,
    },
    declineText: {
        color: colors.c_666666,
        fontFamily: fonts.bold,
        fontSize: 14,
    },
    acceptText: {
        color: colors.white,
        fontFamily: fonts.bold,
        fontSize: 14,
    },
    counterModalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
    },
    counterModalTitle: {
        fontSize: 18,
        fontFamily: fonts.bold,
        color: colors.black,
        marginBottom: 12,
    },
    counterModalInput: {
        borderWidth: 1,
        borderColor: colors.c_DDDDDD,
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
    },
    counterPlusMinusBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.c_0162C0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    counterPlusMinusText: {
        fontSize: 18,
        fontFamily: fonts.bold,
        color: colors.white,
    },
    counterModalActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    counterModalCancel: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: colors.c_F3F3F3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    counterModalCancelText: {
        fontSize: 15,
        fontFamily: fonts.bold,
        color: colors.c_666666,
    },
    counterModalSend: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: colors.c_0162C0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    counterModalSendText: {
        fontSize: 15,
        fontFamily: fonts.bold,
        color: colors.white,
    },
    statusPanel: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statusText: {
        fontSize: 18,
        fontFamily: fonts.bold,
        color: colors.black,
        marginBottom: 15,
    },
    startButton: {
        backgroundColor: colors.c_0162C0,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    startButtonText: {
        color: colors.white,
        fontFamily: fonts.bold,
        fontSize: 16,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: fonts.bold,
        color: colors.black,
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: fonts.medium,
        color: colors.c_999999,
    },
    summaryCard: {
        width: '100%',
        backgroundColor: colors.c_F6F6F6,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    summaryLabel: {
        fontSize: 14,
        fontFamily: fonts.bold,
        color: colors.c_484848,
    },
    addressContainer: {
        width: '100%',
        marginBottom: 20,
    },
    addressItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        fontFamily: fonts.medium,
        color: colors.c_484848,
        lineHeight: 20,
    },
    verticalLine: {
        width: 1,
        height: 20,
        backgroundColor: colors.c_C4C4C4,
        marginLeft: 4.5,
        marginVertical: 4,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: colors.c_F3F3F3,
        marginBottom: 20,
    },
    fareContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    fareLabel: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: colors.c_666666,
    },
    fareAmount: {
        fontSize: 24,
        fontFamily: fonts.bold,
        color: colors.c_0162C0,
    },
    completeButton: {
        width: '100%',
        backgroundColor: colors.c_0162C0,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    completeButtonText: {
        fontSize: 16,
        fontFamily: fonts.bold,
        color: colors.white,
    },
});

export default RideRequest;
