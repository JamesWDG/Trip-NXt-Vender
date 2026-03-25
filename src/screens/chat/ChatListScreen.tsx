import React, { useCallback, useEffect, useMemo } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import WrapperContainer from '../../components/wrapperContainer/WrapperContainer';
import {
  useLazyGetAllChatsQuery,
  useLazyGetChatRequestsQuery,
  useAcceptChatRequestMutation,
  useRejectChatRequestMutation,
} from '../../redux/services/chatService';
import type { ChatSummary } from '../../redux/services/chatService';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { socketClient } from '../../utils/socketClient';
import { clearChatUnread, initializeChatUnread } from '../../redux/slices/chatUnreadSlice';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import images from '../../config/images';
import { sanitizeChatMessageContent } from '../../utils/sanitizeChatMessageContent';

function toIsoTime(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string') return value;
  const d = value instanceof Date ? value : new Date(value as number | string);
  const t = d.getTime();
  if (Number.isNaN(t)) return undefined;
  return d.toISOString();
}

function normalizeLastMessagePayload(m: any) {
  if (m == null || typeof m !== 'object') return m;
  const rawContent = typeof m.content === 'string' ? m.content : '';
  return {
    id: m.id,
    chatId: m.chatId,
    content: sanitizeChatMessageContent(rawContent),
    messageType: m.messageType || 'text',
    senderId: m.senderId != null ? Number(m.senderId) : undefined,
    createdAt: toIsoTime(m.createdAt) ?? new Date().toISOString(),
  };
}

function formatLastMessagePreview(
  lastMessage: ChatSummary['lastMessage'],
  lastMessageAt?: string | null,
) {
  if (lastMessage?.content?.trim()) {
    if (lastMessage.messageType === 'image') return 'Photo';
    return lastMessage.content;
  }
  if (lastMessageAt) return 'Message';
  return 'No messages yet';
}

const formatTime = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const sameDay =
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString();
};

const ChatListScreen = () => {
  const navigation = useNavigation<any>();
  const { bottom: insetBottom } = useSafeAreaInsets();
  const [getAllChats, { isLoading }] = useLazyGetAllChatsQuery();
  const [getChatRequests] = useLazyGetChatRequestsQuery();
  const [acceptRequest, { isLoading: acceptBusy }] = useAcceptChatRequestMutation();
  const [rejectRequest, { isLoading: rejectBusy }] = useRejectChatRequestMutation();
  const [chats, setChats] = React.useState<ChatSummary[]>([]);
  const [chatRequests, setChatRequests] = React.useState<ChatSummary[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const dispatch = useAppDispatch();
  const unreadByChatId = useAppSelector((s) => s.chatUnread?.unreadByChatId || {});
  const token = useAppSelector((s) => s.auth?.token);
  const currentUserId = useAppSelector((s) => (s.auth?.user?.id != null ? Number(s.auth.user.id) : null));

  const requestBusy = acceptBusy || rejectBusy;

  const loadChats = React.useCallback(async () => {
    try {
      const [response, incoming] = await Promise.all([
        getAllChats(undefined).unwrap(),
        getChatRequests(undefined).unwrap(),
      ]);
      setChats(response ?? []);
      setChatRequests(incoming ?? []);
      dispatch(initializeChatUnread((response ?? []).map((chat) => Number(chat.id))));
    } catch (error) {
      console.log('error loading chats', error);
    }
  }, [dispatch, getAllChats, getChatRequests]);

  useFocusEffect(
    useCallback(() => {
      void loadChats();
    }, [loadChats]),
  );

  useEffect(() => {
    let mounted = true;
    const handleChatUpdated = (updatedChat: any) => {
      if (!mounted || !updatedChat?.id) return;
      setChats((prev) => {
        const chatId = Number(updatedChat.id);
        const existing = prev.findIndex((c) => Number(c.id) === chatId);
        if (existing >= 0) {
          const clone = [...prev];
          const base = clone[existing];
          const normalizedLast =
            updatedChat.lastMessage != null
              ? normalizeLastMessagePayload(updatedChat.lastMessage)
              : base.lastMessage;
          const atFromUpdate = toIsoTime(updatedChat.lastMessageAt);
          const atFromMsg = normalizedLast && typeof normalizedLast === 'object' ? (normalizedLast as any).createdAt : null;
          const lastMessageAt = atFromUpdate ?? atFromMsg ?? base.lastMessageAt ?? null;

          const membersRaw = updatedChat.Users ?? updatedChat.users;
          let users = base.users;
          let otherUsers = base.otherUsers;
          if (Array.isArray(membersRaw) && currentUserId != null) {
            users = membersRaw;
            otherUsers = membersRaw.filter((u: { id: number }) => Number(u.id) !== currentUserId);
          }

          clone[existing] = {
            ...base,
            ...updatedChat,
            users,
            otherUsers,
            lastMessage: (normalizedLast as ChatSummary['lastMessage']) ?? base.lastMessage,
            lastMessageAt,
          };
          clone.sort((a, b) => {
            const aTime = new Date(a.lastMessageAt || a.lastMessage?.createdAt || '').getTime() || 0;
            const bTime = new Date(b.lastMessageAt || b.lastMessage?.createdAt || '').getTime() || 0;
            return bTime - aTime;
          });
          return clone;
        }
        Promise.resolve().then(() => {
          void loadChats();
        });
        return prev;
      });
    };

    const handleNewMessage = (message: any) => {
      const msgChatId = Number(message?.chatId ?? message?.chat?.id ?? message?.chat);
      if (!msgChatId) return;

      setChats((prev) => {
        const existing = prev.findIndex((c) => Number(c.id) === msgChatId);
        if (existing < 0) {
          Promise.resolve().then(() => {
            void loadChats();
          });
          return prev;
        }
        const clone = [...prev];
        const base = clone[existing];
        const createdAt = toIsoTime(message?.createdAt) ?? new Date().toISOString();
        clone[existing] = {
          ...base,
          lastMessage: normalizeLastMessagePayload({
            ...message,
            chatId: msgChatId,
            createdAt,
          }) as ChatSummary['lastMessage'],
          lastMessageAt: createdAt,
        };
        clone.sort((a, b) => {
          const aTime = new Date(a.lastMessageAt || a.lastMessage?.createdAt || '').getTime() || 0;
          const bTime = new Date(b.lastMessageAt || b.lastMessage?.createdAt || '').getTime() || 0;
          return bTime - aTime;
        });
        return clone;
      });

      /* Unread from chat-updated (user room); new-message only reaches joined chat rooms. */
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
  }, [token, currentUserId, loadChats]);

  const getOtherParticipant = useCallback(
    (chat: ChatSummary) => {
      if (chat.otherUsers?.[0]) return chat.otherUsers[0];
      const uid = currentUserId;
      if (uid == null) return chat.users?.[0];
      return chat.users?.find(u => Number(u.id) !== uid) ?? chat.users?.[0];
    },
    [currentUserId],
  );

  const displayName = (chat: ChatSummary) => {
    if (chat.isGroup && chat.groupName) return chat.groupName;
    const other = getOtherParticipant(chat);
    return other?.name ?? 'Chat';
  };

  const displayAvatar = (chat: ChatSummary) => {
    if (chat.isGroup && chat.groupImage) return chat.groupImage;
    const other = getOtherParticipant(chat);
    return other?.profilePicture ?? null;
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  }, [loadChats]);

  const filteredChats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return chats;
    return chats.filter((chat) => {
      const otherUser = getOtherParticipant(chat);
      const title = (chat.isGroup ? chat.groupName || '' : otherUser?.name || '').toLowerCase();
      const subtitle = formatLastMessagePreview(chat.lastMessage, chat.lastMessageAt).toLowerCase();
      return title.includes(query) || subtitle.includes(query);
    });
  }, [chats, searchQuery, getOtherParticipant]);

  const renderItem = ({ item }: { item: ChatSummary }) => {
    const name = displayName(item);
    const avatar = displayAvatar(item);
    const pendingOutgoing =
      !item.isGroup &&
      item.requestStatus === 'pending' &&
      currentUserId != null &&
      Number(item.requestedBy) === currentUserId;
    const lastMsg = pendingOutgoing
      ? 'Waiting for them to accept your request'
      : formatLastMessagePreview(item.lastMessage, item.lastMessageAt);
    const time = formatTime(item.lastMessageAt || item.lastMessage?.createdAt || null);
    const unread = unreadByChatId[Number(item.id)] || 0;

    return (
      <TouchableOpacity
        style={styles.chatRow}
        onPress={() => {
          dispatch(clearChatUnread(Number(item.id)));
          const otherUser = getOtherParticipant(item);
          const title = item.isGroup ? item.groupName || 'Group Chat' : otherUser?.name || 'Chat';
          navigation.navigate('ChatConversation', {
            chatId: item.id,
            chatData: item,
            chatName: title,
            name: title,
            avatar: otherUser?.profilePicture ? { uri: otherUser.profilePicture } : images.avatar,
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
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {time ? <Text style={styles.time}>{time}</Text> : null}
          </View>
          <Text style={styles.preview} numberOfLines={1}>
            {lastMsg}
          </Text>
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
      <View style={styles.flexOne}>
        {isLoading && chats.length === 0 ? (
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
              ListHeaderComponent={
                chatRequests.length > 0 ? (
                  <View style={styles.requestsSection}>
                    <Text style={styles.requestsTitle}>Chat requests</Text>
                    {chatRequests.map((req) => {
                      const cid = Number(req.id);
                      const reqName = req.requestInitiator?.name ?? 'Someone';
                      return (
                        <View key={cid} style={styles.requestRow}>
                          <View style={styles.requestBody}>
                            <Text style={styles.requestName} numberOfLines={1}>
                              {reqName}
                            </Text>
                            <Text style={styles.requestSub} numberOfLines={2}>
                              Wants to start a chat with you
                            </Text>
                          </View>
                          <View style={styles.requestBtns}>
                            <TouchableOpacity
                              style={[styles.reqBtn, styles.reqBtnOutline]}
                              disabled={requestBusy}
                              onPress={async () => {
                                try {
                                  await rejectRequest({ chatId: cid }).unwrap();
                                  setChatRequests((prev) => prev.filter((r) => Number(r.id) !== cid));
                                  await loadChats();
                                } catch (e) {
                                  console.log('reject chat request', e);
                                }
                              }}
                            >
                              <Text style={styles.reqBtnOutlineText}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.reqBtn, styles.reqBtnPrimary]}
                              disabled={requestBusy}
                              onPress={async () => {
                                try {
                                  const accepted = await acceptRequest({ chatId: cid }).unwrap();
                                  setChatRequests((prev) => prev.filter((r) => Number(r.id) !== cid));
                                  await loadChats();
                                  const otherUser =
                                    accepted?.otherUsers?.[0] ||
                                    accepted?.users?.find((u) => Number(u.id) !== currentUserId);
                                  const title = otherUser?.name || reqName;
                                  navigation.navigate('ChatConversation', {
                                    chatId: accepted?.id ?? cid,
                                    chatData: accepted ?? req,
                                    chatName: title,
                                    name: title,
                                    avatar: otherUser?.profilePicture
                                      ? { uri: otherUser.profilePicture }
                                      : images.avatar,
                                  });
                                } catch (e) {
                                  console.log('accept chat request', e);
                                }
                              }}
                            >
                              <Text style={styles.reqBtnPrimaryText}>Accept</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : null
              }
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
                  <Text style={styles.emptyTitle}>No chats found</Text>
                  <Text style={styles.emptySubtitle}>
                    {searchQuery.trim()
                      ? 'Try another name or keyword.'
                      : 'Start a chat to see conversations here.'}
                  </Text>
                </View>
              }
            />
          </>
        )}

        <TouchableOpacity
          style={[styles.fab, { bottom: Math.max(insetBottom, 12) + 16 }]}
          onPress={() => navigation.navigate('UserListScreen')}
          activeOpacity={0.85}
          accessibilityLabel="Start new chat"
        >
          <Plus color={colors.white} size={28} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </WrapperContainer>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.c_007DFC,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 4.5,
  },
  requestsSection: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  requestsTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F6F6F6,
  },
  requestBody: {
    flex: 1,
    marginRight: 8,
  },
  requestName: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.c_2B2B2B,
  },
  requestSub: {
    marginTop: 4,
    fontFamily: fonts.normal,
    fontSize: 12,
    color: colors.c_666666,
  },
  requestBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reqBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  reqBtnOutline: {
    backgroundColor: colors.c_F3F3F3,
  },
  reqBtnPrimary: {
    backgroundColor: colors.c_007DFC,
  },
  reqBtnOutlineText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.c_666666,
  },
  reqBtnPrimaryText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 88,
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
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.c_2B2B2B,
  },
  emptySubtitle: {
    marginTop: 6,
    textAlign: 'center',
    fontFamily: fonts.normal,
    fontSize: 13,
    color: colors.c_666666,
  },
});
