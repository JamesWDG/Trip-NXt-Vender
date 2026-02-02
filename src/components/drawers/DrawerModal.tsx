import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircleX, CircleXIcon, LogOut } from 'lucide-react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import images from '../../config/images';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import LinearGradient from 'react-native-linear-gradient';
import { navigationRef } from '../../config/constants';
import IconsWithTitle from '../iconsWithTitle/IconsWithTitle';
import IconWithTitleAndDivider from '../iconWithTitleAndDivider/IconWithTitleAndDivider';
import { NavigationPropType } from '../../navigation/authStack/AuthStack';
import { useAppDispatch } from '../../redux/store';
import { setLogout } from '../../redux/slices/authSlice';

const upperTabData = [
  {
    id: 1,
    name: 'Home',
    image: images.drawer_home,
  },
  {
    id: 2,
    name: 'Help',
    image: images.help,
  },
  {
    id: 3,
    name: 'Notifications',
    image: images.bell,
  },
  {
    id: 4,
    name: 'Profile',
    image: images.user_circle,
  },
];

const importantLinksData = [
  {
    id: 0,
    name: 'Switch Apps',
    image: images.user_circle,
    navigation: (navigation: NavigationPropType) => {
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'auth',
                state: {
                  routes: [{ name: 'DashboardTabs' }],
                  index: 0,
                },
              },
            ],
          }),
        );
      }
    },
  },
  {
    id: 1,
    name: 'Booking Wallet',
    image: images.calender,
    navigation: (navigation: NavigationPropType) =>
      navigation.navigate('Accomodation', { screen: 'Payment' }),
  },
  {
    id: 2,
    name: 'My Calender',
    image: images.payment,
    navigation: (navigation: NavigationPropType) =>
      navigation.navigate('Accomodation', { screen: 'MyCalender' }),
  },
  // {
  //   id: 3,
  //   name: 'Messages',
  //   image: images.messages,
  //   navigation: (navigation: NavigationPropType) =>
  //     navigation.navigate('Accomodation', { screen: 'MessagesSent' }),
  // },
  {
    id: 4,
    name: 'Thank You Note',
    image: images.heart,
    navigation: (navigation: NavigationPropType) =>
      navigation.navigate('Accomodation', { screen: 'ThankNote' }),
  },
];

const generalData = [
  {
    id: 1,
    name: 'Privacy Policy',
    image: images.settings,
    navigation: (navigation: NavigationPropType) =>
      navigation.navigate('PrivacyPolicy'),
  },
  {
    id: 2,
    name: 'FAQs',
    image: images.faq,
    navigation: (navigation: NavigationPropType) => navigation.navigate('FAQs'),
  },
  {
    id: 4,
    name: 'Contact Us',
    image: images.settings,
    navigation: (navigation: NavigationPropType) =>
      navigation.navigate('ContactUs'),
  },
  {
    id: 3,
    name: 'Settings',
    image: images.settings,
  },
];
interface IDrawerModal {
  visible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}
const DrawerModal = ({ visible, setIsModalVisible }: IDrawerModal) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationPropType>();
  const dispatch = useAppDispatch();
  const renderHorizontalTabs = ({
    item,
  }: {
    item: (typeof upperTabData)[0];
  }) => {
    return <IconsWithTitle image={item.image} title={item.name} />;
  };
  const renderVerticalTabs = ({ item }: { item: (typeof upperTabData)[0] }) => {
    return (
      <IconWithTitleAndDivider
        image={item.image}
        title={item.name}
        divider={true}
        dividerColor={colors.c_111111}
        onPress={() => {
          if (item.navigation) {
            setIsModalVisible(false);
            setTimeout(() => {
              item.navigation(navigation);
            }, 100);
          }
        }}
      />
    );
  };
  return (
    <Modal
      visible={visible}
      onRequestClose={() => setIsModalVisible(false)}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingTop: insets.top }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <CircleXIcon size={24} color={colors.white} />
            </TouchableOpacity>
            {/* Primary Navigation Icons */}
            <View style={styles.primaryNavContainer}>
              <FlatList
                scrollEnabled={false}
                data={upperTabData}
                renderItem={renderHorizontalTabs}
                keyExtractor={item => item.id.toString()}
                horizontal
                contentContainerStyle={styles.primaryNavContent}
              />
            </View>
            {/* My Credits */}
            <View style={styles.creditContainer}>
              <View style={styles.creditLeft}>
                <Image source={images.card} style={styles.cardIcon} />
                <Text style={styles.creditText}>My Credits</Text>
              </View>
              <Text style={styles.creditAmount}>60.00</Text>
            </View>
            {/* Important Links Section */}
            <Text style={styles.sectionTitle}>Important Links</Text>
            <View style={styles.linksContainer}>
              <FlatList
                scrollEnabled={false}
                data={importantLinksData}
                renderItem={renderVerticalTabs}
                keyExtractor={item => item.id.toString()}
              />
            </View>
            {/* General Section */}
            <Text style={styles.sectionTitle}>General</Text>
            <View style={styles.linksContainer}>
              <FlatList
                scrollEnabled={false}
                data={generalData}
                renderItem={renderVerticalTabs}
                keyExtractor={item => item.id.toString()}
              />
            </View>
            {/* Log Out Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                if (navigationRef.isReady()) {
                  dispatch(setLogout())
                  navigationRef.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'auth',
                          state: {
                            routes: [{ name: 'Login' }],
                            index: 0,
                          },
                        },
                      ],
                    }),
                  );
                }
              }}
            >
              <LinearGradient
                colors={['#F47E20', '#EE4026']}
                style={styles.logoutGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <LogOut size={20} color={colors.white} />
                <Text style={styles.logoutText}>Log Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DrawerModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    // maxHeight: '90%',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  primaryNavContainer: {
    marginBottom: 20,
  },
  primaryNavContent: {
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  creditContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    marginBottom: 30,
  },
  creditLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 24,
    height: 24,
  },
  creditText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  creditAmount: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 15,
    marginTop: 10,
  },
  linksContainer: {
    marginBottom: 10,
  },
  enterCodeButton: {
    marginTop: 30,
    marginBottom: 16,
    borderRadius: 100,
    overflow: 'hidden',
    width: '100%',
  },
  enterCodeGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  enterCodeText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  logoutButton: {
    marginTop: 0,

    borderRadius: 11000,
    // overflow: 'hidden',
    // width: '100%',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    // paddingVertical: 15,
    // paddingHorizontal: 20,
    borderRadius: 100000,
    width: 140,
    height: 50,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
