import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { width } from '../../config/constants';
import GeneralStyles from '../../utils/GeneralStyles';
import images from '../../config/images';

interface VehicleCardProps {
  image: ImageSourcePropType;
  vehicleName: string;
  licensePlate: string;
  description: string;
  onPress?: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  image,
  vehicleName,
  licensePlate,
  description,
  onPress,
}) => {
  const [imageError, setImageError] = useState(false);
  const source = imageError ? images.car : image;

  return (
    <TouchableOpacity
      style={[styles.card, GeneralStyles.shadow]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={source}
          style={styles.vehicleImage}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.vehicleName}>{vehicleName}</Text>
        <Text style={styles.licensePlate}>{licensePlate}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default VehicleCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: colors.c_DDDDDD,
  },
  imageContainer: {
    width: 120,
    height: 100,
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  vehicleName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 6,
  },
  licensePlate: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    lineHeight: 18,
  },
});
