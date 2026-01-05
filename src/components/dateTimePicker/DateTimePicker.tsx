import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

export type PickerMode = 'date' | 'time' | 'datetime';

interface DateTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  mode?: PickerMode;
  initialDate?: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  mode = 'time',
  initialDate = new Date(),
  minimumDate,
  maximumDate,
  title,
  confirmText = 'Done',
  cancelText = 'Cancel',
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  useEffect(() => {
    if (visible && initialDate) {
      setSelectedDate(initialDate);
    }
  }, [visible, initialDate]);

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onClose();
  };

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${hours}:${formattedMinutes} ${period}`;
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatDateTime = (date: Date): string => {
    return `${formatDate(date)} ${formatTime(date)}`;
  };

  const getDisplayValue = (): string => {
    if (mode === 'date') {
      return formatDate(selectedDate);
    } else if (mode === 'time') {
      return formatTime(selectedDate);
    } else {
      return formatDateTime(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {title ||
                `Select ${
                  mode === 'date'
                    ? 'Date'
                    : mode === 'time'
                    ? 'Time'
                    : 'Date & Time'
                }`}
            </Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.pickerContainer}>
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              mode={mode}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              theme={'auto'}
              locale="en"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateTimePicker;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_DDDDDD,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_0162C0,
  },
  pickerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
