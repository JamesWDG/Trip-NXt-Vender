import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageSourcePropType,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon, X } from 'lucide-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../../redux/store';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import images from '../../config/images';
import ChatInput from '../../components/chatInput/ChatInput';
import ChatMessage from '../../components/chatMessage/ChatMessage';
import { socketClient } from '../../utils/socketClient';
import { useLazyGetUserQuery } from '../../redux/services/authService';
import {
  ChatSummary,
  MessageType,
  useCreateSingleChatMutation,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  useUploadChatImageMutation,
} from '../../redux/services/chatService';

type LocalMessage = {
  id: number | string;
  chatId: number;
  senderId: number;
  content: string;
  text: string;
  messageType?: string;
  isSent: boolean;
  isOptimistic?: boolean;
  isError?: boolean;
  createdAt?: string;
  updatedAt?: string;
  sender?: MessageType['sender'];
};

export type ChatConversationParams = {
  chatId?: string | number;
  chatData?: string | ChatSummary;
  chatName?: string;
  name?: string;
  avatar?: ImageSourcePropType;
  receiverId?: string | number;
};

function parseRouteChatData(raw: unknown): ChatSummary | null {
  if (raw == null) return null;
  if (typeof raw === 'object' && raw !== null && 'id' in (raw as object)) {
    return raw as ChatSummary;
  }
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as ChatSummary;
    } catch {
      return null;
    }
  }
  return null;
}

const ChatConversationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { top, bottom } = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const p = (route.params ?? {}) as ChatConversationParams;
  const initialChatId = useMemo(() => {
    if (p.chatId == null || p.chatId === '') return null;
    const n = Number(p.chatId);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [p.chatId]);

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [chatId, setChatId] = useState<number | null>(initialChatId);
  const authUser = useAppSelector(s => s.auth?.user);
  const [viewerId, setViewerId] = useState<number | null>(
    authUser?.id != null ? Number(authUser.id) : null,
  );
  const [chatData, setChatData] = useState<ChatSummary | null>(() => parseRouteChatData(p.chatData));

  const flatListRef = useRef<FlatList>(null);
  const token = useAppSelector(s => s.auth?.token);
  const contactName =
    p.name ?? p.chatName ?? chatData?.otherUsers?.[0]?.name ?? 'Chat';
  const contactAvatar: ImageSourcePropType = p.avatar ?? images.avatar;
  const receiverId = p.receiverId != null && p.receiverId !== '' ? Number(p.receiverId) : null;

  const isPendingDirect =
    !!chatData &&
    !chatData.isGroup &&
    chatData.requestStatus === 'pending' &&
    viewerId != null &&
    Number(chatData.requestedBy) === viewerId;
  const messagingBlocked = isPendingDirect;

  const [getProfile] = useLazyGetUserQuery();
  const [createSingleChat] = useCreateSingleChatMutation();
  const [getMessages] = useLazyGetMessagesQuery();
  const [sendMessage] = useSendMessageMutation();
  const [uploadChatImage] = useUploadChatImageMutation();
  const [imageUploading, setImageUploading] = useState(false);
  const [viewingImageUri, setViewingImageUri] = useState<string | null>(null);

  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const mapServerMessage = useCallback(
    (message: any): LocalMessage => {
      const senderId = Number(message?.senderId ?? message?.sender?.id);
      const isSent = viewerId ? senderId === viewerId : false;
      return {
        id: message?.id ?? String(Date.now()),
        chatId: Number(message?.chatId ?? message?.chat?.id ?? chatId ?? 0),
        senderId,
        content: message?.content ?? '',
        text: message?.content ?? '',
        messageType: message?.messageType || 'text',
        isSent,
        createdAt: message?.createdAt,
        updatedAt: message?.updatedAt,
        sender: message?.sender,
      };
    },
    [viewerId, chatId],
  );

  useEffect(() => {
    const setupUser = async () => {
      if (viewerId) return;
      try {
        const res = await getProfile(undefined).unwrap();
        const userId = Number((res as any)?.data?.id ?? (res as any)?.id);
        if (!Number.isNaN(userId) && userId > 0) {
          setViewerId(userId);
        }
      } catch (error) {
        console.log('error fetching profile', error);
      }
    };
    setupUser();
  }, [getProfile, viewerId]);

  useEffect(() => {
    const setupChat = async () => {
      if (chatId || receiverId == null || Number.isNaN(receiverId)) return;
      try {
        const res = await createSingleChat({ otherUserId: receiverId, direct: true }).unwrap();
        setChatId(res?.id ?? null);
        setChatData(res ?? null);
      } catch (error) {
        console.log('error creating chat', error);
      }
    };
    setupChat();
  }, [chatId, createSingleChat, receiverId]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!chatId) return;
      try {
        const res = await getMessages({ chatId, page: 1, limit: 50 }).unwrap();
        setMessages((res?.messages ?? []).map(mapServerMessage));
      } catch (error) {
        console.log('error loading messages', error);
      }
    };
    loadMessages();
  }, [chatId, getMessages, mapServerMessage]);

  useEffect(() => {
    let isMounted = true;
    const handleNewMessage = (message: any) => {
      const msgChatId = Number(message?.chatId ?? message?.chat?.id);
      if (!msgChatId || msgChatId !== chatId) return;
      const senderFromMsg = Number(message?.senderId ?? message?.sender?.id);
      const contentNorm = String(message?.content ?? '').trim();
      setMessages(prev => {
        const mapped = mapServerMessage(message);
        const incomingType = message?.messageType || 'text';
        const withoutDupOptimistic = prev.filter(m => {
          if (!m.isOptimistic) return true;
          const sameSender = Number(m.senderId) === senderFromMsg;
          const sameText = String(m.content ?? '').trim() === contentNorm;
          const sameType = (m.messageType || 'text') === incomingType;
          return !(sameSender && sameText && sameType);
        });
        const existing = withoutDupOptimistic.findIndex(m => String(m.id) === String(mapped.id));
        if (existing >= 0) {
          const clone = [...withoutDupOptimistic];
          clone[existing] = mapped;
          return clone;
        }
        return [...withoutDupOptimistic, mapped];
      });
    };
    const handleMessageError = () => {
      setMessages(prev => {
        const lastOptimistic = [...prev].reverse().find(m => m.isOptimistic);
        if (!lastOptimistic) return prev;
        return prev.filter(m => m.id !== lastOptimistic.id);
      });
    };

    const initSocket = async () => {
      if (!chatId || !viewerId || !token) return;
      try {
        await socketClient.connect(viewerId, token);
        if (!isMounted) return;
        socketClient.joinChat(chatId);
        socketClient.onNewMessage(handleNewMessage);
        socketClient.onMessageError(handleMessageError);
      } catch (error) {
        console.log('socket init error', error);
      }
    };
    initSocket();

    return () => {
      isMounted = false;
      socketClient.offNewMessage(handleNewMessage);
      socketClient.offMessageError(handleMessageError);
      if (chatId) socketClient.leaveChat(chatId);
    };
  }, [chatId, mapServerMessage, token, viewerId]);

  const sendImageMessage = useCallback(
    async (imageUrl: string) => {
      if (!chatId || !imageUrl.trim() || messagingBlocked) return;
      const tempId = `temp-${Date.now()}`;
      const optimistic: LocalMessage = {
        id: tempId,
        chatId,
        senderId: viewerId || 0,
        content: imageUrl.trim(),
        text: imageUrl.trim(),
        messageType: 'image',
        isSent: true,
        isOptimistic: true,
      };
      setMessages(prev => [...prev, optimistic]);

      try {
        if (socketClient.isConnected()) {
          socketClient.sendMessage({
            chatId,
            content: imageUrl.trim(),
            messageType: 'image',
            senderId: viewerId || undefined,
          });
        } else {
          const saved = await sendMessage({
            chatId,
            content: imageUrl.trim(),
            messageType: 'image',
          }).unwrap();
          const mapped = mapServerMessage(saved);
          setMessages(prev => prev.map(m => (m.id === tempId ? mapped : m)));
        }
      } catch (error) {
        setMessages(prev =>
          prev.map(m => (m.id === tempId ? { ...m, isOptimistic: false, isError: true } : m)),
        );
        console.log('send image error', error);
        Alert.alert('Error', 'Could not send image. Please try again.');
      }
    },
    [chatId, messagingBlocked, viewerId, sendMessage, mapServerMessage],
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

        const path = image.path;
        const formData = new FormData();
        formData.append('image', {
          uri: path,
          type: image.mime || 'image/jpeg',
          name: image.filename || 'chat.jpg',
        } as any);

        setImageUploading(true);
        const uploaded = await uploadChatImage(formData).unwrap();
        const url = uploaded?.url?.trim();
        if (!url) {
          throw new Error('Upload failed');
        }
        await sendImageMessage(url);
      } catch (e: any) {
        if (e?.code === 'E_PICKER_CANCELLED') {
          return;
        }
        console.log('pick/upload image', e);
        Alert.alert('Error', e?.data?.message || e?.message || 'Could not send image');
      } finally {
        setImageUploading(false);
      }
    },
    [chatId, messagingBlocked, imageUploading, uploadChatImage, sendImageMessage],
  );

  const handleSend = async (message: string) => {
    if (!chatId || !message.trim() || messagingBlocked) return;
    const tempId = `temp-${Date.now()}`;
    const optimistic: LocalMessage = {
      id: tempId,
      chatId,
      senderId: viewerId || 0,
      content: message.trim(),
      text: message.trim(),
      isSent: true,
      messageType: 'text',
      isOptimistic: true,
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      if (socketClient.isConnected()) {
        socketClient.sendMessage({
          chatId,
          content: message.trim(),
          messageType: 'text',
          senderId: viewerId || undefined,
        });
      } else {
        const saved = await sendMessage({
          chatId,
          content: message.trim(),
          messageType: 'text',
        }).unwrap();
        const mapped = mapServerMessage(saved);
        setMessages(prev => prev.map(m => (m.id === tempId ? mapped : m)));
      }
    } catch (error) {
      setMessages(prev =>
        prev.map(m => (m.id === tempId ? { ...m, isOptimistic: false, isError: true } : m)),
      );
      console.log('send message error', error);
    }
  };

  const openImagePreview = useCallback((uri: string) => {
    if (uri) {
      Keyboard.dismiss();
      setViewingImageUri(uri);
    }
  }, []);

  const closeImagePreview = useCallback(() => {
    setViewingImageUri(null);
  }, []);

  const renderMessage = useCallback(
    ({ item }: { item: LocalMessage }) => (
      <ChatMessage
        message={item.text || item.content}
        messageType={item.messageType || 'text'}
        isSent={item.isSent}
        time={item.createdAt}
        showAvatar={!item.isSent}
        onImagePress={openImagePreview}
      />
    ),
    [openImagePreview],
  );

  return (
    <View style={styles.container}>
      <View style={[headerStyles.headerContainer, styles.header]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeftIcon color={colors.white} size={24} />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <Image source={contactAvatar} style={styles.profileImage} />
          <View style={styles.greenDot} />
        </View>

        <Text style={styles.contactName} numberOfLines={1}>
          {contactName}
        </Text>
      </View>

      {messagingBlocked ? (
        <View style={styles.pendingBanner}>
          <Text style={styles.pendingBannerText}>
            Waiting for the other person to accept your chat request before you can message.
          </Text>
        </View>
      ) : null}

      <View style={styles.messagesContainer}>
        {imageUploading ? (
          <View style={styles.uploadBanner}>
            <ActivityIndicator size="small" color={colors.c_F47E20} />
            <Text style={styles.uploadBannerText}>Sending image…</Text>
          </View>
        ) : null}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: bottom + 80 + keyboardHeight },
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />
      </View>

      <View
        style={[
          styles.inputContainer,
          { paddingBottom: bottom, marginBottom: keyboardHeight },
        ]}
      >
        <ChatInput
          onSend={handleSend}
          onAttachmentPress={() => void pickAndSendImage(false)}
          onCameraPress={() => void pickAndSendImage(true)}
          disabled={messagingBlocked || imageUploading}
          placeholder={messagingBlocked ? 'Chat not accepted yet' : 'Write a message'}
        />
      </View>

      <Modal
        visible={!!viewingImageUri}
        animationType="fade"
        transparent
        statusBarTranslucent
        onRequestClose={closeImagePreview}
      >
        <View style={[styles.imageViewerRoot, { paddingTop: top }]}>
          <TouchableOpacity
            style={styles.imageViewerDismissArea}
            activeOpacity={1}
            onPress={closeImagePreview}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
          >
            {viewingImageUri ? (
              <View style={styles.imageViewerImageWrap} pointerEvents="box-none">
                <View pointerEvents="none" style={styles.imageViewerImageInner}>
                  <Image
                    source={{ uri: viewingImageUri }}
                    style={styles.imageViewerImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageViewerClose}
            onPress={closeImagePreview}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            accessibilityRole="button"
            accessibilityLabel="Close image"
          >
            <X size={28} color={colors.white} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ChatConversationScreen;

const makeHeaderStyles = (top: number) =>
  StyleSheet.create({
    headerContainer: {
      paddingTop: top + 10,
      paddingBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.c_F3F3F3,
    },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.white,
  },
  backButton: {
    backgroundColor: colors.c_F47E20,
    padding: 8,
    borderRadius: 100,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    marginLeft: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greenDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.white,
  },
  contactName: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
    marginLeft: 12,
  },
  pendingBanner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.c_F6F6F6,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  pendingBannerText: {
    fontFamily: fonts.normal,
    fontSize: 13,
    color: colors.c_666666,
    textAlign: 'center',
  },
  messagesContainer: {
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
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputContainer: {
    backgroundColor: 'transparent',
  },
  imageViewerRoot: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.94)',
  },
  imageViewerDismissArea: {
    flex: 1,
  },
  imageViewerClose: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 2,
    padding: 8,
  },
  imageViewerImageWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  imageViewerImageInner: {
    width: '100%',
    flex: 1,
    minHeight: 240,
  },
  imageViewerImage: {
    width: '100%',
    height: '100%',
    minHeight: 240,
  },
});
