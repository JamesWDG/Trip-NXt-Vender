import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
} from 'react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

let TABS = ['User', 'Vendor', 'Food'];

const RestaurantTabButtons = ({ data }: { data: string[] }) => {
  TABS = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const handlePress = (index: number) => {
    setActiveIndex(index);
    const tabWidth = containerWidth / TABS.length;

    Animated.spring(translateX, {
      toValue: tabWidth * index,
      useNativeDriver: true,
    }).start();
  };

  const tabWidth = containerWidth / TABS.length;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container} onLayout={handleLayout}>
        {/* Animated background that slides under the active tab */}
        <Animated.View
          style={[
            styles.activeBg,
            {
              width: tabWidth,
              transform: [{ translateX }],
            },
          ]}
        />

        {/* Tab Buttons */}
        <View style={styles.tabRow}>
          {TABS.map((tab, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => handlePress(index)}
              style={[styles.tab, { width: tabWidth }]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeIndex === index ? colors.white : colors.black,
                    fontFamily: activeIndex === index ? fonts.bold : fonts.bold,
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default RestaurantTabButtons;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.c_F47E20,
    padding: 2,
  },
  container: {
    // padding: 5, // ✅ 5px space between border and tab area
    overflow: 'hidden',
    height: 40,
  },
  tabRow: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    height: 40,
  },
  tab: {
    // paddingVertical: 10,
    height: '100%',
    // margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    zIndex: 2, // text above animated bg
    // backgroundColor: 'red',
  },
  tabText: {
    fontSize: 11,
  },
  activeBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.c_F47E20,
    borderRadius: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 1,
  },
});
