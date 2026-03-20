import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../components/wrapperContainer/WrapperContainer';
import { useLazyGetAllChatsQuery } from '../../redux/services/chatService';
import type { ChatSummary } from '../../redux/services/chatService';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { socketClient } from '../../utils/socketClient';
import {
  clearChatUnread,
  incrementChatUnread,
  initializeChatUnread,
} from '../../redux/slices/chatUnreadSlice';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import moment from 'moment';

const ChatListScreen = () => {
  const navigation = useNavigation<any>();
  const [getAllChats, { isLoading }] = useLazyGetAllChatsQuery();
  const [chats, setChats] = React.useState<ChatSummary[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const dispatch = useAppDispatch();
  const unreadByChatId = useAppSelector((s) => s.chatUnread?.unreadByChatId || {});
  const token = useAppSelector((s) => s.auth?.token);
  const currentUserId = useAppSelector((s) => (s.auth?.user?.id != null ? Number(s.auth.user.id) : null));

  const loadChats = React.useCallback(async () => {
    try {
      const response = await getAllChats(undefined).unwrap();
      setChats(response ?? []);
      dispatch(initializeChatUnread((response ?? []).map(chat => Number(chat.id))));
    } catch (error) {
      console.log('error loading chats', error);
    }
  }, [dispatch, getAllChats]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    let mounted = true;
    const handleChatUpdated = (updatedChat: any) => {
      if (!mounted || !updatedChat?.id) return;
      setChats(prev => {
        const chatId = Number(updatedChat.id);
        const existing = prev.findIndex(c => Number(c.id) === chatId);
        if (existing >= 0) {
          const clone = [...prev];
          clone[existing] = { ...clone[existing], ...updatedChat };
          clone.sort((a, b) => {
            const aTime = new Date(a.lastMessageAt || '').getTime() || 0;
            const bTime = new Date(b.lastMessageAt || '').getTime() || 0;
            return bTime - aTime;
          });
          return clone;
        }
        return [{ ...updatedChat }, ...prev];
      });
    };

    const handleNewMessage = (message: any) => {
      const msgChatId = Number(message?.chatId ?? message?.chat?.id ?? message?.chat);
      if (!msgChatId) return;
      const senderId = Number(message?.senderId ?? message?.sender?.id);

      setChats(prev => {
        const existing = prev.findIndex(c => Number(c.id) === msgChatId);
        if (existing < 0) return prev;
        const clone = [...prev];
        const base = clone[existing];
        clone[existing] = {
          ...base,
          lastMessage: {
            ...(base.lastMessage || {}),
            id: message?.id ?? Date.now(),
            content: message?.content || '',
            messageType: message?.messageType || 'text',
            createdAt: message?.createdAt || new Date().toISOString(),
            senderId: senderId || 0,
          },
          lastMessageAt: message?.createdAt || new Date().toISOString(),
        } as ChatSummary;
        clone.sort((a, b) => {
          const aTime = new Date(a.lastMessageAt || '').getTime() || 0;
          const bTime = new Date(b.lastMessageAt || '').getTime() || 0;
          return bTime - aTime;
        });
        return clone;
      });

      if (currentUserId && senderId && senderId !== currentUserId) {
        dispatch(incrementChatUnread(msgChatId));
      }
    };

    const setupSocket = async () => {
      if (!token || !currentUserId) return;
      try {
        await socketClient.connect(currentUserId, token);
        socketClient.onChatUpdated(handleChatUpdated);
        socketClient.onNewMessage(handleNewMessage);
      } catch (error) {
        console.log('chat list socket error', error);
      }
    };
    setupSocket();

    return () => {
      mounted = false;
      socketClient.offChatUpdated(handleChatUpdated);
      socketClient.offNewMessage(handleNewMessage);
    };
  }, [token, currentUserId, dispatch]);

  const displayName = (chat: ChatSummary) => {
    if (chat.isGroup && chat.groupName) return chat.groupName;
    const other = chat.otherUsers?.[0] || chat.users?.find((u: any) => u.id !== (chat as any)._currentUserId);
    return other?.name ?? 'Chat';
  };

  const displayAvatar = (chat: ChatSummary) => {
    if (chat.isGroup && chat.groupImage) return chat.groupImage;
    const other = chat.otherUsers?.[0] || chat.users?.find((u: any) => u.id !== (chat as any)._currentUserId);
    return other?.profilePicture ?? null;
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  }, [loadChats]);

  const filteredChats = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return chats;
    return chats.filter(chat => {
      const name = displayName(chat).toLowerCase();
      const preview = (chat.lastMessage?.content || '').toLowerCase();
      return name.includes(query) || preview.includes(query);
    });
  }, [chats, searchQuery]);

  const renderItem = ({ item }: { item: ChatSummary }) => {
    const name = displayName(item);
    const avatar = displayAvatar(item);
    const lastMsg = item.lastMessage?.content ?? 'No messages yet';
    const time = item.lastMessageAt ? moment(item.lastMessageAt).format('HH:mm') : '';
    const unread = unreadByChatId[Number(item.id)] || 0;

    return (
      <TouchableOpacity
        style={styles.chatRow}
        onPress={() => {
          dispatch(clearChatUnread(Number(item.id)));
          navigation.navigate('ChatConversation', {
            chatId: item.id,
            chatData: JSON.stringify(item),
            chatName: name,
          });
        }}
        activeOpacity={0.7}
      >
        <View style={styles.avatarWrap}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            {time ? <Text style={styles.time}>{time}</Text> : null}
          </View>
          <Text style={styles.preview} numberOfLines={1}>{lastMsg}</Text>
        </View>
        {unread > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread > 99 ? '99+' : String(unread)}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer navigation={navigation} title="Messages">
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.searchWrap}>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search chats..."
              placeholderTextColor={colors.c_999999}
              style={styles.searchInput}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <FlatList
            data={filteredChats}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  {searchQuery.trim() ? 'No chats match your search' : 'No conversations yet'}
                </Text>
              </View>
            }
          />
        </>
      )}
    </WrapperContainer>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
    backgroundColor: colors.c_F6F6F6,
    paddingHorizontal: 14,
    color: colors.c_2B2B2B,
    fontFamily: fonts.normal,
    fontSize: 14,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  avatarWrap: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.c_007DFC,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    flex: 1,
  },
  time: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  preview: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.c_EE4026,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    alignSelf: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 11,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
});
