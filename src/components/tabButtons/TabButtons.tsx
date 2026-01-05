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

const TABS = ['User', 'Vendor'];

const TabButtons = () => {
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

export default TabButtons;

const styles = StyleSheet.create({
  wrapper: {
    // paddingHorizontal: 20,
    // paddingVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 100,
    padding: 2,
    height: 50,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 100,
    overflow: 'hidden',
    // padding: 3,
  },
  tabRow: {
    flexDirection: 'row',
    position: 'relative',
  },
  tab: {
    paddingVertical: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    // borderWidth: 3,
    // borderColor: colors.white,
    zIndex: 2, // text above animated bg
  },
  tabText: {
    fontSize: 16,
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
