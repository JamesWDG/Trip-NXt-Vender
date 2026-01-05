import { createNavigationContainerRef } from '@react-navigation/native';
import { Dimensions, Platform } from 'react-native';

export const { width, height } = Dimensions.get('window');
export const isIOS = (): boolean => {
    return Platform.OS === 'ios';
}
export const navigationRef = createNavigationContainerRef();

export function textDotDot(mytextvar: string, maxlimit: number) {
    return mytextvar.length > maxlimit
        ? mytextvar.substring(0, maxlimit - 3) + '...'
        : mytextvar;
}