import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { FC, useCallback, useState } from 'react';
import colors from '../../config/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../config/images';
import SwipeButton from 'rn-swipe-button';
import { IOption, options } from '../../contants/options';
import { height, width } from '../../config/constants';
import fonts from '../../config/fonts';
import { NavigationPropType } from '../../navigation/authStack/AuthStack';
import { useNavigation } from '@react-navigation/native';
import GeneralStyles from '../../utils/GeneralStyles';
import { useAppDispatch } from '../../store/hooks';
import { setActiveStack } from '../../redux/slices/navigationSlice';
const DashboardTabs: FC = () => {
  const navigation = useNavigation<NavigationPropType>();
  const dispatch = useAppDispatch();
  const [selectedOption, setSelectedOption] = useState<IOption[] | null>(
    options.map(ele => {
      return { ...ele, selected: false };
    }),
  );
  let forceResetLastButton: any = null;
  let forceCompleteCallback: any = null;
  const [finishSwipeAnimDuration, setFinishSwipeAnimDuration] = useState(400);

  const forceCompleteButtonCallback = useCallback(() => {
    setFinishSwipeAnimDuration(0);
    forceCompleteCallback();
  }, []);

  const forceResetButtonCallback = useCallback(() => {
    forceResetLastButton();
    setInterval(() => setFinishSwipeAnimDuration(400), 1000);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ImageBackground
          source={images.location}
          style={styles.locationImage}
          imageStyle={styles.bgImageStyles}
        >
          <Image
            source={images.splash}
            style={styles.tripNxtImage}
            resizeMode="contain"
          />

          <View style={GeneralStyles.alignItems}>
            <Text style={styles.getWhatYoureLookingForText}>
              Get What You’re
            </Text>
            <Text style={styles.getWhatYoureLookingForText}>
              Looking For–Fast
            </Text>
          </View>

          <View style={{ gap: 30, alignItems: 'center', marginTop: 50 }}>
            {selectedOption?.map((item, index) => {
              return (
                <SwipeButton
                  key={index}
                  containerStyles={styles.swipeButtonContainer}
                  onSwipeSuccess={() => {
                    setSelectedOption(
                      selectedOption?.map(ele => {
                        if (ele?.id == index) {
                          return { ...ele, selected: true };
                        }
                        return { ...ele, selected: ele?.selected };
                      }),
                    );
                    (navigation as any).navigate('Signup', {
                      flowDetails: {
                        user_type: item.type,
                        screenName: item.screenName,
                        stack: item.stack,
                      },
                    });
                    // Store navigation stack in Redux and navigate
                    // if (index === 0) {
                    //   dispatch(
                    //     setActiveStack({
                    //       stack: 'CabStack',
                    //     }),
                    //   );
                    //   navigation.reset({
                    //     index: 0,
                    //     routes: [
                    //       {
                    //         name: 'app',
                    //         state: {
                    //           routes: [
                    //             {
                    //               name: 'CabStack',
                    //               params: {
                    //                 screen: 'DriverRegistration',
                    //               },
                    //             },
                    //           ],
                    //           index: 0,
                    //         },
                    //       },
                    //     ],
                    //   });
                    //   // Book a Ride - reset to RestaurantStack (Ride functionality)
                    // } else if (index === 1) {
                    //   // Order Food - reset to RestaurantStack with RestaurantHome screen
                    //   dispatch(
                    //     setActiveStack({
                    //       stack: 'RestaurantStack',
                    //     }),
                    //   );
                    //   navigation.reset({
                    //     index: 0,
                    //     routes: [
                    //       {
                    //         name: 'app',
                    //         state: {
                    //           routes: [
                    //             {
                    //               name: 'RestaurantStack',
                    //               state: {
                    //                 routes: [
                    //                   {
                    //                     name: 'RestaurantDetails',
                    //                   },
                    //                 ],
                    //                 index: 0,
                    //               },
                    //             },
                    //           ],
                    //           index: 0,
                    //         },
                    //       },
                    //     ],
                    //   });
                    // } else if (index === 2) {
                    //   // Book Your Place - reset to AccomodationStack
                    //   // dispatch(
                    //   //   setActiveStack({
                    //   //     stack: 'Accomodation',
                    //   //   }),
                    //   // );
                    //   // navigation.reset({
                    //   //   index: 0,
                    //   //   routes: [
                    //   //     {
                    //   //       name: 'app',
                    //   //       state: {
                    //   //         routes: [
                    //   //           {
                    //   //             name: 'Accomodation',
                    //   //           },
                    //   //         ],
                    //   //         index: 0,
                    //   //       },
                    //   //     },
                    //   //   ],
                    //   // });
                    //   dispatch(
                    //     setActiveStack({
                    //       stack: 'Accomodation',
                    //     }),
                    //   );
                    //   navigation.reset({
                    //     index: 0,
                    //     routes: [
                    //       {
                    //         name: 'app',
                    //         state: {
                    //           routes: [
                    //             {
                    //               name: 'Accomodation',
                    //               params: {
                    //                 screen: 'Home',
                    //               },
                    //             },
                    //           ],
                    //           index: 0,
                    //         },
                    //       },
                    //     ],
                    //   });
                    // }
                  }}
                  onSwipeFail={() => {
                    console.log('onSwipeFail');
                    setSelectedOption(
                      selectedOption?.map(ele => {
                        if (ele?.id == index) {
                          return { ...ele, selected: false };
                        }
                        return { ...ele, selected: ele?.selected };
                      }),
                    );
                  }}
                  titleStyles={{
                    fontSize: 18,
                    fontWeight: '600',
                    position: 'absolute', // 👈 Always on top
                    alignSelf: 'center',
                    zIndex: 10, // 👈 Ensure it's above thumb and rail
                    color: item?.selected ? colors.white : colors.black,
                  }}
                  height={80}
                  finishRemainingSwipeAnimationDuration={
                    finishSwipeAnimDuration
                  }
                  railBackgroundColor={colors.white}
                  railStyles={{
                    // backgroundColor: colors.c_F47E20,
                    borderColor: item?.selected
                      ? colors.c_F47E20
                      : 'transparent',
                    height: 50,
                    borderWidth: 0,
                  }}
                  // swipeSuccessThreshold={100}
                  railFillBackgroundColor={colors.c_F47E20}
                  railFillBorderColor={item?.selected ? colors.c_F47E20 : 'red'}
                  // railBorderColor={item?.selected ? 'transparent' : 'blue'}
                  thumbIconImageSource={item?.image}
                  thumbIconStyles={{
                    width: 85,
                    height: 85,
                    borderWidth: 4,
                    position: 'absolute',
                    top: -15,
                    // left: 0,
                  }}
                  thumbIconBorderColor={
                    item?.selected ? colors.c_F47E20 : colors.primary
                  }
                  thumbIconBackgroundColor={colors.white}
                  title={item?.title}
                  width={width * 0.9}
                />
              );
            })}
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  tripNxtImage: {
    height: 165,
    width: 200,
    alignSelf: 'center',
    marginTop: 20,
  },
  bgImageStyles: {
    opacity: 0.09,
    height: 200,
    width: 150,
    // backgroundColor: 'red',
    top: height * 0.3,
    left: width * 0.3,
  },
  locationImage: {
    // minWidth: 150,
    // height: 200,
    alignItems: 'center',
    zIndex: 8,
    justifyContent: 'center',
    // backgroundColor: 'red',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  getWhatYoureLookingForText: {
    fontSize: 34,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
});
