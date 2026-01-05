import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { width } from '../../config/constants';
import GeneralStyles from '../../utils/GeneralStyles';

type DocumentStatus = 'Approved' | 'Pending' | 'Rejected';

interface DocumentCardProps {
  image: ImageSourcePropType;
  title: string;
  status: DocumentStatus;
  onUploadPress?: () => void;
  onCardPress?: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  image,
  title,
  status,
  onUploadPress,
  onCardPress,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Approved':
        return '#00C853'; // Green color for approved
      case 'Pending':
        return colors.c_F59523; // Orange for pending
      case 'Rejected':
        return colors.c_EE4026; // Red for rejected
      default:
        return colors.c_666666;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, GeneralStyles.shadow]}
      onPress={onCardPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={styles.documentImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status: </Text>
          <Text style={[styles.statusValue, { color: getStatusColor() }]}>
            {status}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={onUploadPress}
          activeOpacity={0.8}
        >
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default DocumentCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.c_0162C0,
  },
  imageContainer: {
    width: 100,
    height: 120,
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  documentImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  statusValue: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  uploadButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
