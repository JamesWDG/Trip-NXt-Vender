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

/**
 * e.g. "2 days ago", "5 minutes ago", "just now"
 */
export const formatRelativeTime = (
  createdAt: string | Date | null | undefined,
): string => {
  if (createdAt == null || createdAt === '') return '';
  const then = new Date(createdAt).getTime();
  if (Number.isNaN(then)) return '';
  const now = Date.now();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 0) return 'just now';
  if (diffSec < 60) return diffSec <= 5 ? 'just now' : `${diffSec} seconds ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return diffHr === 1 ? '1 hour ago' : `${diffHr} hours ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return diffWeek === 1 ? '1 week ago' : `${diffWeek} weeks ago`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return diffMonth <= 1 ? '1 month ago' : `${diffMonth} months ago`;
  const diffYear = Math.floor(diffDay / 365);
  return diffYear === 1 ? '1 year ago' : `${diffYear} years ago`;
};

/** e.g. ISO string → "05:02 am" */
export const formatTime12h = (
  input: string | Date | null | undefined,
): string => {
  if (input == null || input === '') return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const hour24 = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hour24 >= 12 ? 'pm' : 'am';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  const hh = hour12.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  return `${hh}:${mm} ${ampm}`;
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


