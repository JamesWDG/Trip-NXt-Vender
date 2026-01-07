import { createNavigationContainerRef } from '@react-navigation/native';
import { Dimensions, Platform } from 'react-native';
import Toast from 'react-native-toast-message';

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

export const ShowToast = (type: 'success' | 'error', message: string) => {
    return Toast.show({
        type,
        text1: message,
    });
}