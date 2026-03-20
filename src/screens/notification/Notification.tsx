import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import WrapperContainer from '../../components/wrapperContainer/WrapperContainer';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../navigation/authStack/AuthStack';
import NotificationItem from '../../components/notificationItem/NotificationItem';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';
import { useLazyGetAllNotificationsQuery } from '../../redux/services/notificationService';

type ApiNotification = {
  id: number;
  userId: number;
  type: string;
  title: string;
  body: string;
  data: { status?: string; orderId?: string; bookingId?: string };
  read: boolean;
  entityType: string;
  entityId: number;
  createdAt: string;
  updatedAt: string;
};

const Notification = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [getAllNotifications, { isLoading, data }] = useLazyGetAllNotificationsQuery();

  const list = useMemo(() => {
    const raw = Array.isArray(data?.data?.list) ? data.data.list : (data as { data?: ApiNotification[] })?.data;
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  useEffect(() => {
    getAllNotifications(undefined);
  }, []);

  return (
    <WrapperContainer navigation={navigation} title="Notifications">
      {isLoading ? (
        <View style={[GeneralStyles.flex, GeneralStyles.justifyContent, GeneralStyles.alignItems]}>
          <ActivityIndicator size="large" color={colors.c_0162C0} />
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={[styles.card, GeneralStyles.shadow, styles.emptyCard]}>
              <Text style={styles.emptyText}>No notifications</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <NotificationItem
              message={`${item.title}\n${item.body}`}
              isRead={item.read}
            />
          )}
        />
      )}
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
    height: 12,
  },
});
