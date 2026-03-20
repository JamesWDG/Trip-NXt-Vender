import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import WrapperContainer from '../../components/wrapperContainer/WrapperContainer';
import {
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  type MessageType,
  type ChatSummary,
} from '../../redux/services/chatService';
import { useAppSelector } from '../../redux/store';
import { socketClient } from '../../utils/socketClient';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import moment from 'moment';

type Params = { chatId: string | number; chatData?: string; chatName?: string };

const ChatConversationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: Params }, 'params'>>();
  const { chatId: chatIdParam, chatData: chatDataStr, chatName } = route.params ?? {};
  const chatId = Number(chatIdParam);

  const token = useAppSelector((s) => s.auth?.token);
  const user = useAppSelector((s) => s.auth?.user);
  const userId = user?.id != null ? Number(user.id) : null;

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const [getMessages, { isLoading: loadingMessages }] = useLazyGetMessagesQuery();
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();

  const fetchMessages = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      if (!chatId || Number.isNaN(chatId)) return;
      setLoading(true);
      try {
        const res = await getMessages({ chatId, page: pageNum, limit: 20 }).unwrap();
        const list = res?.messages ?? [];
        const pagination = res?.pagination;
        setHasMore(pagination?.hasMore ?? false);
        setPage(pageNum);
        if (append) {
          setMessages((prev) => [...(list as MessageType[]), ...prev]);
        } else {
          setMessages(list as MessageType[]);
        }
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    },
    [chatId, getMessages]
  );

  useEffect(() => {
    if (chatId && !Number.isNaN(chatId)) fetchMessages(1, false);
  }, [chatId]);

  // Socket: connect, join room, listen new-message
  useEffect(() => {
    if (!userId || !token || !chatId || Number.isNaN(chatId)) return;

    let mounted = true;
    const init = async () => {
      try {
        await socketClient.connect(String(userId), token);
        socketClient.joinChat(chatId);
      } catch (e) {
        // connection failed, continue without real-time
      }
    };
    init();

    const handleNewMessage = (message: any) => {
      if (!mounted) return;
      const msgChatId = message.chatId ?? message.chat?.id ?? message.chat;
      if (Number(msgChatId) !== chatId) return;
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (exists) {
          return prev.map((m) => (m.id === message.id ? { ...m, ...message } : m));
        }
        return [...prev, message];
      });
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    socketClient.onNewMessage(handleNewMessage);

    return () => {
      mounted = false;
      socketClient.leaveChat(chatId);
      socketClient.offNewMessage(handleNewMessage);
    };
  }, [userId, token, chatId]);

  const onSend = async () => {
    const text = inputText.trim();
    if (!text || !chatId || Number.isNaN(chatId)) return;
    setInputText('');

    const optimistic: MessageType = {
      id: -Date.now(),
      chatId,
      senderId: userId!,
      content: text,
      messageType: 'text',
      sender: user ? { id: userId!, name: (user as any).name ?? '', profilePicture: (user as any).profilePicture ?? null } : undefined,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      if (socketClient.isConnected()) {
        socketClient.sendMessage({
          chatId,
          content: text,
          messageType: 'text',
          senderId: userId || undefined,
        });
      } else {
        const result = await sendMessage({ chatId, content: text }).unwrap();
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? { ...m, id: result.id, createdAt: result.createdAt } : m))
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
  };

  const isOwn = (m: MessageType) => Number(m.senderId) === userId;

  const renderMessage = ({ item }: { item: MessageType }) => (
    <View style={[styles.msgRow, isOwn(item) ? styles.msgRowRight : styles.msgRowLeft]}>
      <View style={[styles.bubble, isOwn(item) ? styles.bubbleSent : styles.bubbleReceived]}>
        <Text style={[styles.msgText, isOwn(item) ? styles.msgTextSent : styles.msgTextReceived]}>
          {item.content}
        </Text>
        <Text style={[styles.timeText, isOwn(item) ? styles.timeTextSent : styles.timeTextReceived]}>
          {moment(item.createdAt).format('HH:mm')}
        </Text>
      </View>
    </View>
  );

  const title = chatName ?? 'Chat';

  return (
    <WrapperContainer navigation={navigation} title={title}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {(loading && page === 1) || loadingMessages ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderMessage}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.c_999999}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnDisabled]}
            onPress={onSend}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.sendBtnText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

export default ChatConversationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgRow: {
    marginBottom: 10,
  },
  msgRowLeft: {
    alignItems: 'flex-start',
  },
  msgRowRight: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleSent: {
    backgroundColor: colors.c_007DFC,
    borderBottomRightRadius: 4,
  },
  bubbleReceived: {
    backgroundColor: colors.c_F3F3F3,
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 15,
    fontFamily: fonts.normal,
  },
  msgTextSent: {
    color: colors.white,
  },
  msgTextReceived: {
    color: colors.c_2B2B2B,
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
  },
  timeTextSent: {
    color: 'rgba(255,255,255,0.8)',
  },
  timeTextReceived: {
    color: colors.c_666666,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.c_F3F3F3,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.c_F3F3F3,
    fontSize: 15,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: colors.c_007DFC,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    minHeight: 40,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.semibold,
  },
});
