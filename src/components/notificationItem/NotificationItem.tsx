import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Bell } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface NotificationItemProps {
  message: string;
  isRead?: boolean;
  onPress?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  message,
  isRead = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, !isRead && styles.unreadContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <View style={[styles.iconWrapper, !isRead && styles.iconWrapperUnread]}>
          <Bell size={20} color={!isRead ? colors.c_0162C0 : colors.c_666666} />
        </View>
        {!isRead && <View style={styles.redDot} />}
      </View>
      <View style={styles.messageContainer}>
        <Text
          style={[styles.message, !isRead && styles.unreadMessage]}
          numberOfLines={2}
        >
          {message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  unreadContainer: {
    backgroundColor: colors.c_F6F6F6,
  },
  iconContainer: {
    position: 'relative',
    marginTop: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.c_F3F3F3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperUnread: {
    backgroundColor: colors.c_0162C0 + '15', // 15% opacity
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.c_EE4026,
    borderWidth: 2,
    borderColor: colors.white,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    lineHeight: 20,
  },
  unreadMessage: {
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
});
