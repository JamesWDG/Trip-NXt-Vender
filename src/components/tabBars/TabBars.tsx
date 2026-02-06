import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { TabStackArray } from '../../contants/tabsStack';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { selectActiveStack } from '../../redux/slices/navigationSlice';
import { useLazyGetUserQuery } from '../../redux/services/authService';
import { setUserRole } from '../../redux/slices/authSlice';

const TabBars = (props: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets();
  const mainContainer = useMemo(() => mainContainerStyle(bottom), [bottom]);
  const activeStack = useAppSelector(selectActiveStack);
  const [getUser] = useLazyGetUserQuery();
  const dispatch = useAppDispatch();

  const fetchUser = async () => {
    try {
      const res = await getUser(undefined).unwrap();
      if (res.success) {
        dispatch(setUserRole(res.data.role));
      }
    } catch (error) {
      console.log('error ===>', error);
    }
  }

  useEffect(() => {
    fetchUser();
  },[])


  return (
    <View style={[mainContainer.container, styles.box]}>
      <LinearGradient
        colors={['#F47E20', '#EE4026']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.tabContainer}>
          {TabStackArray.filter(
            tab => tab.flow === 'mixed' || tab.flow === activeStack,
          ).map(tab => {
            // Handle case where RestaurantHome tab navigation doesn't match BottomStack tab name
            const routeName =
              tab.navigation === 'RestaurantHome'
                ? 'RestaurantStack'
                : tab.navigation;
            const route = props.state.routes.find(r => r.name === routeName);
            const isFocused =
              route && props.state.index === props.state.routes.indexOf(route);

            return (
              <TouchableOpacity
                key={tab.navigation}
                style={styles.tab}
                onPress={() => {
                  if (route) {
                    const event = props.navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      props.navigation.navigate(routeName);
                    }
                  }
                }}
              >
                <Image
                  source={tab.image}
                  style={styles.image}
                  tintColor={colors.white}
                />
                <Text style={styles.tabText}>{tab.name}</Text>
                {isFocused && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

export default TabBars;

const mainContainerStyle = (bottom: number) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: bottom + 5,
      // width: '100%',
      left: 0,
      right: 0,
      height: 64,
    },
  });
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderRadius: 100,
  },
  image: {
    height: 17,
    width: 17,
  },
  box: {
    marginHorizontal: 20,
    borderRadius: 100,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, // 0.35 ≈ 0x59 opacity
    shadowRadius: 12,

    // Shadow for Android
    elevation: 8, // tweak this for matching intensity
  },
  tabContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    // gap: 8,
    // flex: 1,
  },
  tabText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: colors.white,
    borderRadius: 2,
  },
});
