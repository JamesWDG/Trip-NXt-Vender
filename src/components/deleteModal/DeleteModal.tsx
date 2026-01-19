import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Trash2 } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

export interface DeleteModalRef {
  open: () => void;
  close: () => void;
}

interface DeleteModalProps {
  title?: string;
  message?: string;
  onDelete?: () => void;
  deleteButtonText?: string;
  cancelButtonText?: string;
  image?: any; // Image source for delete icon/image
}

const DeleteModal = forwardRef<DeleteModalRef, DeleteModalProps>(
  (
    {
      title = 'Delete Item',
      message = 'Are you sure you want to delete this item? This action cannot be undone.',
      onDelete,
      deleteButtonText = 'Delete',
      cancelButtonText = 'Cancel',
      image,
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => {
        setVisible(true);
      },
      close: () => {
        setVisible(false);
      },
    }));

    const handleDelete = () => {
      onDelete?.();
      setVisible(false);
    };

    const handleCancel = () => {
      setVisible(false);
    };

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Delete Icon/Image */}
            <View style={styles.iconContainer}>
              {image ? (
                <Image source={image} style={styles.image} resizeMode="contain" />
              ) : (
                <View style={styles.iconWrapper}>
                  <Trash2 size={48} color={colors.red} strokeWidth={2} />
                </View>
              )}
            </View>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Message */}
            <Text style={styles.message}>{message}</Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteButtonText}>{deleteButtonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

DeleteModal.displayName = 'DeleteModal';

export default DeleteModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.c_F3F3F3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.c_F3F3F3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  deleteButton: {
    flex: 1,
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
