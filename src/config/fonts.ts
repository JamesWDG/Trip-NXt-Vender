import { isIOS } from "./constants";

const fonts = Object.freeze({
    normal: isIOS() ? 'Poppins-Regular' : 'Poppins-Regular',
    medium: isIOS() ? 'Poppins-Medium' : 'Poppins-Medium',
    semibold: isIOS() ? 'Poppins-SemiBold' : 'Poppins-Regular',
    bold: isIOS() ? 'Poppins-Bold' : 'Poppins-Bold',
});

export default fonts;