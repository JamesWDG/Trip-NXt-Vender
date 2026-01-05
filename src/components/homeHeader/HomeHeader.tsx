import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import images from '../../config/images';
import { BellIcon, ShoppingBag, User2Icon } from 'lucide-react-native';
import colors from '../../config/colors';

interface HomeHeaderProps {
  navigation?: any;
  onPress: () => void;
  bag?: boolean;
}

const HomeHeader = ({ navigation, onPress, bag = true }: HomeHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const HomeHeaderStyle = useMemo(() => HomeHeaderStyles(top), [top]);

  const handleNotificationPress = () => {
    navigation?.navigate('Notifications');
  };

  const handleProfilePress = () => {
    navigation?.navigate('Profile');
  };

  return (
    <View style={HomeHeaderStyle.container}>
      <TouchableOpacity onPress={onPress}>
        <Image source={images.hamburger} style={styles.hamburgerImage} />
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleNotificationPress}>
          <BellIcon fill={colors.white} color={colors.white} size={25} />
        </TouchableOpacity>
        {bag ? (
          <TouchableOpacity>
            <ShoppingBag color={colors.white} size={25} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.userIconStyles}
          onPress={handleProfilePress}
        >
          <User2Icon fill={colors.white} color={colors.white} size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;

const HomeHeaderStyles = (top: number) =>
  StyleSheet.create({
    container: {
      paddingTop: top,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      //   paddingHorizontal: 20,
    },
  });

const styles = StyleSheet.create({
  hamburgerImage: {
    width: 30,
    height: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  userIconStyles: {
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 100,
    padding: 5,
  },
});
