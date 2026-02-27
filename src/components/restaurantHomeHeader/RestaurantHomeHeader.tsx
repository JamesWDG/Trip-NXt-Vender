import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import images from '../../config/images';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface RestaurantHomeHeaderProps {
  isOnline: boolean;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onToggleChange?: (isOnline: boolean) => void;
  profileImage?: any;
  notificationCount?: number;
  title?: string;
}

const RestaurantHomeHeader: React.FC<RestaurantHomeHeaderProps> = ({
  isOnline,
  onMenuPress,
  onNotificationPress,
  onToggleChange,
  profileImage = images.avatar,
  notificationCount = 0,
  title = '',
}) => {
  const { top } = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(top), [top]);
  const toggleValue = useSharedValue(isOnline ? 1 : 0);

  React.useEffect(() => {
    toggleValue.value = withSpring(isOnline ? 1 : 0);
  }, [isOnline]);

  const toggleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: toggleValue.value * 22 }],
    };
  });

  const handleToggle = () => {
    const newValue = !isOnline;
    onToggleChange?.(newValue);
  };

  return (
    <View style={styles.container}>
      {/* Hamburger Menu */}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Image source={images.hamburger} style={styles.hamburgerImage} />
      </TouchableOpacity>

      {/* Title Text */}
      <Text style={styles.titleText}>{title}</Text>

      {/* Right Side Icons */}
      <View style={styles.rightContainer}>
        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Bell size={24} color={colors.white} strokeWidth={2} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Online Toggle */}
        <View style={styles.toggleWrapper}>
          <TouchableOpacity
            style={[
              styles.toggleContainer,
              isOnline ? styles.toggleOn : styles.toggleOff,
            ]}
            onPress={handleToggle}
            activeOpacity={0.8}
          >
            <Animated.View style={[styles.toggleKnob, toggleStyle]} />
          </TouchableOpacity>
          {/* <Text style={styles.onlineText}>Online</Text> */}
        </View>

        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <Image source={profileImage} style={styles.profileImage} />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>
      </View>
    </View>
  );
};

export default RestaurantHomeHeader;

const makeStyles = (top: number) =>
  StyleSheet.create({
    container: {
      paddingTop: top + 10,
      paddingBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingHorizontal: 20,
      zIndex: 100,
    },
    menuButton: {
      padding: 5,
    },
    hamburgerImage: {
      width: 30,
      height: 25,
      tintColor: colors.white,
    },
    titleText: {
      fontSize: 20,
      fontFamily: fonts.bold,
      color: colors.white,
      flex: 1,
      marginLeft: 12,
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    notificationButton: {
      position: 'relative',
      padding: 4,
    },
    badge: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: colors.c_F59523,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
      borderWidth: 2,
      borderColor: colors.white,
    },
    badgeText: {
      fontSize: 9,
      fontFamily: fonts.bold,
      color: colors.white,
    },
    toggleWrapper: {
      alignItems: 'center',
      gap: 4,
    },
    toggleContainer: {
      width: 50,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      padding: 2,
    },
    toggleOn: {
      backgroundColor: colors.c_0162C0,
    },
    toggleOff: {
      backgroundColor: colors.c_F59523,
    },
    toggleKnob: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.white,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    onlineText: {
      fontSize: 10,
      fontFamily: fonts.medium,
      color: colors.white,
    },
    profileContainer: {
      position: 'relative',
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.white,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.c_079D48,
      borderWidth: 2,
      borderColor: colors.white,
    },
  });
