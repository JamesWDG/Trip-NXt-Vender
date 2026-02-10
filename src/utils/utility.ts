import { GOOGLE_API_KEY } from "../contants/api";

/**
 * Convert 12h time string to 24h for API (MySQL TIME expects HH:mm or HH:mm:ss).
 * e.g. "3:00 PM" -> "15:00:00", "11:00 AM" -> "11:00:00"
 */
export const time12hTo24h = (time12: string): string => {
  if (!time12 || !time12.trim()) return '15:00:00';
  const match = time12.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '15:00:00';
  let hour = parseInt(match[1], 10);
  const minute = match[2].padStart(2, '0');
  const period = (match[3] || '').toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  const h = hour.toString().padStart(2, '0');
  return `${h}:${minute}:00`;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    return `${monthNames[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`;
};

export const DEFAULT_LOCATION: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
} = {
    latitude: 37.0902,
    longitude: -95.7129,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};


export const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`,
        );

        const data = await response.json();

        if (!data.results || data.results.length === 0) return null;

        const result = data.results[0];
        const addressComponents = result.address_components;

        const getComponent = (type: string) =>
            addressComponents.find((c: any) => c.types.includes(type))?.long_name ||
            '';

        return {
            id: result.place_id,
            latitude,
            longitude,
            address: getComponent('locality') || getComponent('administrative_area_level_2'),
            city: getComponent('locality'),
            state: getComponent('administrative_area_level_1'),
            country: getComponent('country'),
            destination: result.formatted_address,
        };
    } catch (error) {
        console.log('Reverse geocode error:', error);
        return null;
    }
};


