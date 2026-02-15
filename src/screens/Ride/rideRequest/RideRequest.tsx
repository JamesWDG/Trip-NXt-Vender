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
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, MapPin, User, Navigation, CheckCircle, Clock, DollarSign } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';

const { width, height } = Dimensions.get('window');

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



const calculateBearing = (startLat: number, startLng: number, destLat: number, destLng: number) => {
    const startLatRad = (startLat * Math.PI) / 180;
    const startLngRad = (startLng * Math.PI) / 180;
    const destLatRad = (destLat * Math.PI) / 180;
    const destLngRad = (destLng * Math.PI) / 180;

    const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
    const x =
        Math.cos(startLatRad) * Math.sin(destLatRad) -
        Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
    const brng = Math.atan2(y, x);
    const brngDeg = (brng * 180) / Math.PI;
    return (brngDeg + 360) % 360;
};

// Simulate a road path by adding intermediate waypoints
const generateSimulatedPath = (start: { latitude: number; longitude: number }, end: { latitude: number; longitude: number }) => {
    const path = [start];
    const latDiff = end.latitude - start.latitude;
    const lngDiff = end.longitude - start.longitude;

    // Add 3 intermediate points with slight offsets to simulate turning corners
    path.push({
        latitude: start.latitude + latDiff * 0.2,
        longitude: start.longitude + lngDiff * 0.1,
    });
    path.push({
        latitude: start.latitude + latDiff * 0.5,
        longitude: start.longitude + lngDiff * 0.5,
    });
    path.push({
        latitude: start.latitude + latDiff * 0.8,
        longitude: start.longitude + lngDiff * 0.9,
    });

    path.push(end);
    return path;
};

// Dummy data generator
const generateDummyRides = () => {
    const baseLat = 40.7128; // New York
    const baseLng = -74.0060;

    return Array.from({ length: 5 }).map((_, i) => ({
        id: `ride-${i + 1}`,
        user: `User ${i + 1}`,
        rating: (4 + Math.random()).toFixed(1),
        price: `$${(15 + Math.random() * 20).toFixed(2)}`,
        distance: `${(2 + Math.random() * 5).toFixed(1)} miles`,
        pickup: {
            latitude: baseLat + (Math.random() - 0.5) * 0.05,
            longitude: baseLng + (Math.random() - 0.5) * 0.05,
            address: `Pickup St ${i + 1}, NY`,
        },
        dropoff: {
            latitude: baseLat + (Math.random() - 0.5) * 0.05,
            longitude: baseLng + (Math.random() - 0.5) * 0.05,
            address: `Dropoff Ave ${i + 1}, NY`,
        },
    }));
};

const RideRequest = () => {
    const navigation = useNavigation();
    const mapRef = useRef<MapView>(null);
    const driverMarkerRef = useRef<any>(null);

    // State
    const [rides, setRides] = useState(generateDummyRides());
    const [acceptedRide, setAcceptedRide] = useState<any>(null);
    const [driverLocation, setDriverLocation] = useState({
        latitude: 40.7128,
        longitude: -74.0060,
    });
    const [status, setStatus] = useState<'searching' | 'accepted' | 'in_progress' | 'completed'>('searching');
    const [simulationInterval, setSimulationInterval] = useState<any | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [driverRotation, setDriverRotation] = useState(0);



    // Initial map region
    const initialRegion = {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    useEffect(() => {
        return () => {
            if (simulationInterval) clearInterval(simulationInterval);
        };
    }, [simulationInterval]);

    const handleAcceptRide = (ride: any) => {
        setAcceptedRide(ride);
        setStatus('accepted');
        setRides([]); // Clear other rides

        // Zoom to fit driver and pickup
        setTimeout(() => {
            mapRef.current?.fitToCoordinates([
                driverLocation,
                ride.pickup
            ], {
                edgePadding: { top: 50, right: 50, bottom: 200, left: 50 },
                animated: true,
            });
        }, 500);
    };

    const handleDeclineRide = (id: string) => {
        setRides(prev => prev.filter(r => r.id !== id));
    };

    const startRideSimulation = () => {
        if (!acceptedRide) return;
        setStatus('in_progress');

        const path = generateSimulatedPath(driverLocation, acceptedRide.dropoff);
        let currentPointIndex = 0;
        const duration = 2000; // Duration to move between each point

        const interval = setInterval(() => {
            if (currentPointIndex >= path.length - 1) {
                clearInterval(interval);
                setTimeout(() => {
                    setStatus('completed');
                    setShowSummary(true);
                }, 500);
                return;
            }

            const currentPoint = path[currentPointIndex];
            const nextPoint = path[currentPointIndex + 1];

            // Calculate rotation
            const bearing = calculateBearing(
                currentPoint.latitude,
                currentPoint.longitude,
                nextPoint.latitude,
                nextPoint.longitude
            );
            setDriverRotation(bearing);

            // Animate to next point
            if (driverMarkerRef.current) {
                driverMarkerRef.current.animateMarkerToCoordinate(nextPoint, duration);
            }

            // Update location state for other components if needed (though visual is handled by marker)
            setDriverLocation(nextPoint);

            currentPointIndex++;
        }, duration);

        setSimulationInterval(interval);
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
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => handleAcceptRide(item)}
                >
                    <Text style={styles.acceptText}>Accept</Text>
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
                initialRegion={initialRegion}
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
                        <Polyline
                            coordinates={[driverLocation, acceptedRide.pickup, acceptedRide.dropoff]}
                            strokeColor={colors.c_0162C0}
                            strokeWidth={3}
                        />
                    </>
                )}
            </MapView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <ChevronLeft color={colors.black} size={28} />
            </TouchableOpacity>

            {status === 'searching' && (
                <View style={styles.listContainer}>
                    <Text style={styles.title}>Available Rides</Text>
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

            {status === 'accepted' && (
                <View style={styles.statusPanel}>
                    <Text style={styles.statusText}>Heading to Pickup...</Text>
                    <TouchableOpacity style={styles.startButton} onPress={startRideSimulation}>
                        <Text style={styles.startButtonText}>Start Ride</Text>
                        <Navigation color={colors.white} size={20} />
                    </TouchableOpacity>
                </View>
            )}

            {status === 'in_progress' && (
                <View style={styles.statusPanel}>
                    <Text style={styles.statusText}>Ride in Progress...</Text>
                </View>
            )}
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
        flex: 0.48,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    declineButton: {
        backgroundColor: colors.c_F3F3F3,
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
