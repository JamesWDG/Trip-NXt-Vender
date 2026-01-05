import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import images from '../../config/images';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface StatusHeaderProps {
  isOnline: boolean;
  onMenuPress?: () => void;
  onToggleChange?: (isOnline: boolean) => void;
  title?: string;
  goBack?: boolean;
}

const StatusHeader: React.FC<StatusHeaderProps> = ({
  isOnline,
  onMenuPress,
  onToggleChange,
  title = '',
  goBack = false,
}) => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
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

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Back Button or Hamburger Menu */}
      {goBack ? (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeftIcon color={colors.white} size={24} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Image source={images.hamburger} style={styles.hamburgerImage} />
        </TouchableOpacity>
      )}

      {/* Status Text */}
      <Text style={styles.statusText}>{title}</Text>

      {/* Toggle Switch */}
      <TouchableOpacity
        style={[
          styles.toggleContainer,
          isOnline ? styles.toggleOn : styles.toggleOff,
        ]}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.toggleKnob,
            isOnline ? styles.toggleKnobOn : styles.toggleKnobOff,
            toggleStyle,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default StatusHeader;

const makeStyles = (top: number) =>
  StyleSheet.create({
    container: {
      paddingTop: top + 10,
      paddingBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    menuButton: {
      padding: 5,
    },
    hamburgerImage: {
      width: 30,
      height: 25,
      tintColor: colors.white,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.c_F47E20,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    statusText: {
      fontSize: 24,
      fontFamily: fonts.bold,
      color: colors.white,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    toggleContainer: {
      width: 50,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      padding: 2,
    },
    toggleOn: {
      backgroundColor: colors.c_0162C0, // Blue when online
    },
    toggleOff: {
      backgroundColor: colors.c_F59523, // Orange when offline
    },
    toggleKnob: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.white,
    },
    toggleKnobOn: {
      // Knob position when on (right side) - handled by animation
    },
    toggleKnobOff: {
      // Knob position when off (left side) - handled by animation
    },
  });
