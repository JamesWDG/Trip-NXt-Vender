import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import fonts from '../../config/fonts';
import Divider from '../divider/Divider';

interface Params {
  image: string;
  title: string;
  divider?: boolean | string;
  dividerColor?: string;
  onPress: () => void;
  /** Total unread (e.g. chat threads); shown only when > 0. */
  badgeCount?: number;
}
const IconWithTitleAndDivider = ({
  image,
  title,
  divider,
  dividerColor = '',
  onPress,
  badgeCount,
}: Params) => {
  const showBadge = typeof badgeCount === 'number' && badgeCount > 0;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={image as ImageSourcePropType} />
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {showBadge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : String(badgeCount)}</Text>
          </View>
        ) : null}
      </View>
      {divider && <Divider height={0.5} color={dividerColor} width="100%" />}
    </TouchableOpacity>
  );
};

export default IconWithTitleAndDivider;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: '100%',
    paddingVertical: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.normal,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: '#EE4026',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 11,
  },
});
