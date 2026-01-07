import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { TabStackArray } from '../../contants/tabsStack';
import { useAppSelector } from '../../store/hooks';
import { selectActiveStack } from '../../redux/slices/navigationSlice';

const TabBars = (props: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets();
  const mainContainer = useMemo(() => mainContainerStyle(bottom), [bottom]);
  const activeStack = useAppSelector(selectActiveStack);

  // Get current route and nested route name
  const currentRoute = props.state.routes[props.state.index];
  // console.log('currentRoute', currentRoute);
  const tabName = currentRoute?.name;
  const nestedRouteName = getFocusedRouteNameFromRoute(currentRoute);
  // console.log('currentRoute', currentRoute);

  console.log('nestedRouteName', nestedRouteName, tabName);
  // Dynamically get all navigation names from TabStackArray
  const MAIN_TABS = TabStackArray.map(tab => tab.navigation);

  // Dynamically get all home screens from TabStackArray
  const SHOW_TAB_BAR_ROUTES = TabStackArray.map(tab => tab.homeScreen).filter(
    (screen): screen is string => screen !== undefined,
  );

  // Check if current screen (nestedRouteName) exists in tabsArray as homeScreen
  const isHomeScreen =
    nestedRouteName && SHOW_TAB_BAR_ROUTES.includes(nestedRouteName);

  // Check if current screen (nestedRouteName) exists in tabsArray as navigation
  const isScreenInTabsArray =
    nestedRouteName && MAIN_TABS.includes(nestedRouteName);

  // Check if current tab is one of the main tabs (dynamically from TabStackArray)
  const isMainTab = tabName && MAIN_TABS.includes(tabName);

  // Check if current tab's navigation matches any tab in array (handle RestaurantHome -> RestaurantStack mapping)
  const isTabInArray = TabStackArray.some(tab => {
    const routeName =
      tab.navigation === 'RestaurantHome' ? 'RestaurantStack' : tab.navigation;
    return routeName === tabName;
  });

  // Show tab bar if:
  // 1. Current screen is a home screen in tabsArray
  // 2. OR current screen is a navigation name in tabsArray
  // 3. OR current tab is in tabsArray and nested route is not set (initial screen = home)
  // 4. OR current tab matches any tab in tabsArray
  const shouldShow = TabStackArray.some(
    tab => tab.navigation === nestedRouteName || tab.navigation === tabName,
  );

  // console.log('shouldShow ===>', shouldShow);
  // Hide tab bar if none of the conditions are met
  if (!shouldShow) {
    return null;
  }

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
          ).map((tab, index) => {
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
    gap: 8,
    flex: 1,
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
