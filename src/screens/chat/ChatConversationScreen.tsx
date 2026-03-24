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
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import { Camera, Paperclip } from 'lucide-react-native';
import WrapperContainer from '../../components/wrapperContainer/WrapperContainer';
import {
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  useUploadChatImageMutation,
  type MessageType,
  type ChatSummary,
} from '../../redux/services/chatService';
import { useAppSelector } from '../../redux/store';
import { socketClient } from '../../utils/socketClient';
import { resolveChatMediaUrl } from '../../utils/chatMediaUrl';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import moment from 'moment';

type Params = { chatId: string | number; chatData?: string; chatName?: string };

const ChatConversationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: Params }, 'params'>>();
  const { chatId: chatIdParam, chatData: chatDataStr, chatName } = route.params ?? {};
  const chatId = Number(chatIdParam);

  const parsedChatData = React.useMemo((): ChatSummary | null => {
    if (!chatDataStr) return null;
    try {
      return JSON.parse(chatDataStr) as ChatSummary;
    } catch {
      return null;
    }
  }, [chatDataStr]);

  const token = useAppSelector((s) => s.auth?.token);
  const user = useAppSelector((s) => s.auth?.user);
  const userId = user?.id != null ? Number(user.id) : null;

  const messagingBlocked =
    !!parsedChatData &&
    !parsedChatData.isGroup &&
    parsedChatData.requestStatus === 'pending' &&
    userId != null &&
    Number(parsedChatData.requestedBy) === userId;

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const [getMessages, { isLoading: loadingMessages }] = useLazyGetMessagesQuery();
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [uploadChatImage] = useUploadChatImageMutation();

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

  const sendImageMessage = useCallback(
    async (imageUrl: string) => {
      if (!chatId || !imageUrl.trim() || messagingBlocked) return;
      const optimistic: MessageType = {
        id: -Date.now(),
        chatId,
        senderId: userId!,
        content: imageUrl.trim(),
        messageType: 'image',
        sender: user
          ? {
              id: userId!,
              name: (user as any).name ?? '',
              profilePicture: (user as any).profilePicture ?? null,
            }
          : undefined,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);

      try {
        if (socketClient.isConnected()) {
          socketClient.sendMessage({
            chatId,
            content: imageUrl.trim(),
            messageType: 'image',
            senderId: userId || undefined,
          });
        } else {
          const result = await sendMessage({
            chatId,
            content: imageUrl.trim(),
            messageType: 'image',
          }).unwrap();
          setMessages((prev) =>
            prev.map((m) =>
              m.id === optimistic.id
                ? { ...m, id: result.id, createdAt: result.createdAt, messageType: 'image' }
                : m
            )
          );
        }
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        Alert.alert('Error', 'Could not send image.');
      }
    },
    [chatId, messagingBlocked, userId, user, sendMessage]
  );

  const pickAndSendImage = useCallback(
    async (fromCamera: boolean) => {
      if (!chatId || messagingBlocked || imageUploading) return;
      try {
        const image = fromCamera
          ? await ImagePicker.openCamera({
              mediaType: 'photo',
              compressImageMaxWidth: 1600,
              compressImageMaxHeight: 1600,
              compressImageQuality: 0.82,
              includeBase64: false,
            })
          : await ImagePicker.openPicker({
              mediaType: 'photo',
              compressImageMaxWidth: 1600,
              compressImageMaxHeight: 1600,
              compressImageQuality: 0.82,
              includeBase64: false,
            });

        const formData = new FormData();
        formData.append('image', {
          uri: image.path,
          type: image.mime || 'image/jpeg',
          name: image.filename || 'chat.jpg',
        } as any);

        setImageUploading(true);
        const uploaded = await uploadChatImage(formData).unwrap();
        const url = uploaded?.url?.trim();
        if (!url) throw new Error('Upload failed');
        await sendImageMessage(url);
      } catch (e: any) {
        if (e?.code === 'E_PICKER_CANCELLED') return;
        console.log('pick/upload image', e);
        Alert.alert('Error', e?.data?.message || e?.message || 'Could not send image');
      } finally {
        setImageUploading(false);
      }
    },
    [chatId, messagingBlocked, imageUploading, uploadChatImage, sendImageMessage]
  );

  useEffect(() => {
    if (!userId || !token || !chatId || Number.isNaN(chatId)) return;

    let mounted = true;
    const init = async () => {
      try {
        await socketClient.connect(String(userId), token);
        socketClient.joinChat(chatId);
      } catch (e) {
        // connection failed
      }
    };
    init();

    const handleNewMessage = (message: any) => {
      if (!mounted) return;
      const msgChatId = message.chatId ?? message.chat?.id ?? message.chat;
      if (Number(msgChatId) !== chatId) return;
      const senderFromMsg = Number(message.senderId ?? message.sender?.id);
      const contentNorm = String(message.content ?? '').trim();
      const incomingType = message?.messageType || 'text';

      setMessages((prev) => {
        const withoutMatchingOptimistic = prev.filter((m) => {
          if (m.id >= 0) return true;
          const sameSender = Number(m.senderId) === senderFromMsg;
          const sameText = String(m.content ?? '').trim() === contentNorm;
          const sameType = (m.messageType || 'text') === incomingType;
          return !(sameSender && sameText && sameType);
        });
        const exists = withoutMatchingOptimistic.some((m) => m.id === message.id);
        if (exists) {
          return withoutMatchingOptimistic.map((m) => (m.id === message.id ? { ...m, ...message } : m));
        }
        return [...withoutMatchingOptimistic, message];
      });
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    const handleMessageError = () => {
      if (!mounted) return;
      setMessages((prev) => {
        const lastNeg = [...prev].reverse().find((m) => m.id < 0);
        if (!lastNeg) return prev;
        return prev.filter((m) => m.id !== lastNeg.id);
      });
    };

    socketClient.onNewMessage(handleNewMessage);
    socketClient.onMessageError(handleMessageError);

    return () => {
      mounted = false;
      socketClient.leaveChat(chatId);
      socketClient.offNewMessage(handleNewMessage);
      socketClient.offMessageError(handleMessageError);
    };
  }, [userId, token, chatId]);

  const onSend = async () => {
    const text = inputText.trim();
    if (!text || !chatId || Number.isNaN(chatId) || messagingBlocked) return;
    setInputText('');

    const optimistic: MessageType = {
      id: -Date.now(),
      chatId,
      senderId: userId!,
      content: text,
      messageType: 'text',
      sender: user
        ? {
            id: userId!,
            name: (user as any).name ?? '',
            profilePicture: (user as any).profilePicture ?? null,
          }
        : undefined,
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

  const renderMessage = ({ item }: { item: MessageType }) => {
    const isImage = item.messageType === 'image' && !!item.content?.trim();
    return (
      <View style={[styles.msgRow, isOwn(item) ? styles.msgRowRight : styles.msgRowLeft]}>
        <View style={[styles.bubble, isOwn(item) ? styles.bubbleSent : styles.bubbleReceived]}>
          {isImage ? (
            <Image
              source={{ uri: resolveChatMediaUrl(item.content) }}
              style={styles.msgImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={[styles.msgText, isOwn(item) ? styles.msgTextSent : styles.msgTextReceived]}>
              {item.content}
            </Text>
          )}
          <Text style={[styles.timeText, isOwn(item) ? styles.timeTextSent : styles.timeTextReceived]}>
            {moment(item.createdAt).format('HH:mm')}
          </Text>
        </View>
      </View>
    );
  };

  const title = chatName ?? 'Chat';
  const inputLocked = messagingBlocked || imageUploading;

  return (
    <WrapperContainer navigation={navigation} title={title}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {imageUploading ? (
          <View style={styles.uploadBanner}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.uploadBannerText}>Sending image…</Text>
          </View>
        ) : null}

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
            ListHeaderComponent={
              messagingBlocked ? (
                <View style={styles.pendingNote}>
                  <Text style={styles.pendingNoteText}>
                    Waiting for the other person to accept your chat request before you can send messages.
                  </Text>
                </View>
              ) : null
            }
          />
        )}

        <View style={styles.attachRow}>
          <TouchableOpacity
            style={styles.attachBtn}
            onPress={() => void pickAndSendImage(false)}
            disabled={inputLocked}
          >
            <Paperclip size={22} color={colors.c_666666} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attachBtn}
            onPress={() => void pickAndSendImage(true)}
            disabled={inputLocked}
          >
            <Camera size={22} color={colors.c_666666} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, inputLocked && styles.inputDisabled]}
            placeholder={messagingBlocked ? 'Chat not accepted yet' : 'Type a message...'}
            placeholderTextColor={colors.c_999999}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={2000}
            editable={!inputLocked}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!inputText.trim() || sending || inputLocked) && styles.sendBtnDisabled,
            ]}
            onPress={onSend}
            disabled={!inputText.trim() || sending || inputLocked}
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
  uploadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: colors.c_F6F6F6,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  uploadBannerText: {
    marginLeft: 8,
    fontFamily: fonts.normal,
    fontSize: 13,
    color: colors.c_666666,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  pendingNote: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: colors.c_F6F6F6,
    borderRadius: 10,
  },
  pendingNoteText: {
    fontFamily: fonts.normal,
    fontSize: 13,
    color: colors.c_666666,
    textAlign: 'center',
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
  msgImage: {
    width: 200,
    height: 220,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
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
  attachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: colors.c_F3F3F3,
    backgroundColor: colors.white,
  },
  attachBtn: {
    padding: 8,
    marginRight: 4,
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
  inputDisabled: {
    opacity: 0.55,
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
