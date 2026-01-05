import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import WrapperContainer from '../../components/wrapperContainer/WrapperContainer';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../navigation/authStack/AuthStack';
import NotificationItem from '../../components/notificationItem/NotificationItem';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';

interface NotificationData {
  id: string;
  message: string;
  isRead: boolean;
}

const Notification = () => {
  const navigation = useNavigation<NavigationPropType>();

  // Sample notification data
  const newNotifications: NotificationData[] = [
    {
      id: '1',
      message:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isRead: false,
    },
    {
      id: '2',
      message:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isRead: false,
    },
    {
      id: '3',
      message:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isRead: false,
    },
    {
      id: '4',
      message:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isRead: false,
    },
    {
      id: '5',
      message:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isRead: false,
    },
  ];

  const yesterdayNotifications: NotificationData[] = [
    {
      id: '6',
      message:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isRead: true,
    },
    {
      id: '7',
      message:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isRead: true,
    },
    {
      id: '8',
      message:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isRead: true,
    },
    {
      id: '9',
      message:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isRead: true,
    },
    {
      id: '10',
      message:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isRead: true,
    },
  ];

  const renderNotificationItem = ({ item }: { item: NotificationData }) => (
    <NotificationItem
      message={item.message}
      isRead={item.isRead}
      onPress={() => {
        // Handle notification press
        console.log('Notification pressed:', item.id);
      }}
    />
  );

  return (
    <WrapperContainer navigation={navigation} title="Notifications">
      <FlatList
        data={[1]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollContent}
        keyExtractor={item => item.toString()}
        renderItem={() => {
          return (
            <>
              {/* New Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>New</Text>
                  {newNotifications.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {newNotifications.length}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={[styles.card, GeneralStyles.shadow]}>
                  <FlatList
                    data={newNotifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={[
                            styles.card,
                            GeneralStyles.shadow,
                            styles.emptyCard,
                          ]}
                        >
                          <Text style={styles.emptyText}>
                            No new notifications
                          </Text>
                        </View>
                      );
                    }}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                  />
                </View>
              </View>
              {/* Yesterday Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Yesterday</Text>
                </View>

                <View style={[styles.card, GeneralStyles.shadow]}>
                  <FlatList
                    data={yesterdayNotifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={[
                            styles.card,
                            GeneralStyles.shadow,
                            styles.emptyCard,
                          ]}
                        >
                          <Text style={styles.emptyText}>No notifications</Text>
                        </View>
                      );
                    }}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                  />
                </View>
              </View>
            </>
          );
        }}
      />
    </WrapperContainer>
  );
};

export default Notification;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  badge: {
    backgroundColor: colors.c_EE4026,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  separator: {
    height: 1,
    backgroundColor: colors.c_F3F3F3,
    marginHorizontal: 16,
  },
});
