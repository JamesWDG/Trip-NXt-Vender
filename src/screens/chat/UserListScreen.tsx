import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../components/wrapperContainer/WrapperContainer';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { useAppSelector } from '../../redux/store';
import { useSearchUsersQuery } from '../../redux/services/authService';
import { useCreateSingleChatMutation } from '../../redux/services/chatService';

type UserItem = {
  id: number;
  name: string;
  email?: string;
  profilePicture?: string | null;
};

const UserListScreen = () => {
  const navigation = useNavigation<any>();
  const myId = useAppSelector((s) => (s.auth?.user?.id != null ? Number(s.auth.user.id) : null));
  const [searchQ, setSearchQ] = useState('');
  const { data: users = [], isLoading, isFetching } = useSearchUsersQuery(
    { q: searchQ.trim(), limit: 80 },
    { skip: false },
  );
  const [createSingleChat, { isLoading: opening }] = useCreateSingleChatMutation();

  const rawList = Array.isArray(users) ? users : [];
  const list = myId != null ? rawList.filter((u: UserItem) => Number(u.id) !== myId) : rawList;

  const onPickUser = async (item: UserItem) => {
    try {
      const chat = await createSingleChat({ otherUserId: Number(item.id), direct: true }).unwrap();
      navigation.navigate('ChatConversation', {
        chatId: chat.id,
        chatData: JSON.stringify(chat),
        chatName: item.name?.trim() || item.email || 'Chat',
      });
    } catch (e: any) {
      console.log('create chat', e);
    }
  };

  return (
    <WrapperContainer navigation={navigation} title="New message" goBack>
      <View style={styles.inner}>
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email"
            placeholderTextColor={colors.c_999999}
            value={searchQ}
            onChangeText={setSearchQ}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={list}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => onPickUser(item)}
                disabled={opening}
                activeOpacity={0.7}
              >
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {(item.name || item.email || '?').charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name?.trim() || item.email || 'User'}
                  </Text>
                  {item.email ? (
                    <Text style={styles.email} numberOfLines={1}>
                      {item.email}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  {isFetching ? 'Loading…' : searchQ.trim() ? 'No users match your search' : 'No users to show'}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </WrapperContainer>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchWrap: {
    marginBottom: 12,
    marginTop: 8,
  },
  searchInput: {
    height: 44,
    backgroundColor: colors.c_F6F6F6,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.c_007DFC,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
  },
  email: {
    fontSize: 13,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginTop: 2,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
});
