import { baseApi } from './api';

interface ChatSummary {
  id: number;
  otherUser: {
    id: number;
    name: string;
    profilePicture: string | null;
  };
  lastMessage: {
    id: number;
    type: 'text' | 'image';
    text: string | null;
    imageUrl: string | null;
    createdAt: string;
  } | null;
  unreadCount: number;
}

interface Message {
  id: number;
  chatId: number;
  senderId: number;
  type: 'text' | 'image';
  text: string | null;
  imageUrl: string | null;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getOrCreateChat: builder.mutation<any, { userId: number }>({
      query: body => ({
        url: '/chat/chats',
        method: 'POST',
        body,
      }),
    }),
    listChats: builder.query<ChatSummary[], void>({
      query: () => ({
        url: '/chat/chats',
        method: 'GET',
      }),
    }),
    getMessages: builder.query<Message[], { chatId: number; before?: number; limit?: number }>({
      query: ({ chatId, before, limit }) => ({
        url: `/chat/chats/${chatId}/messages`,
        method: 'GET',
        params: { before, limit },
      }),
    }),
    sendMessage: builder.mutation<
      Message,
      { chatId: number; type: 'text' | 'image'; text?: string; imageUrl?: string }
    >({
      query: ({ chatId, ...body }) => ({
        url: `/chat/chats/${chatId}/messages`,
        method: 'POST',
        body,
      }),
    }),
    markRead: builder.mutation<void, { chatId: number; lastReadMessageId: number }>({
      query: ({ chatId, lastReadMessageId }) => ({
        url: `/chat/chats/${chatId}/read`,
        method: 'POST',
        body: { lastReadMessageId },
      }),
    }),
    uploadChatImage: builder.mutation<{ url: string }, { formData: FormData }>({
      query: ({ formData }) => ({
        url: '/uploads/chat-image',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetOrCreateChatMutation,
  useListChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkReadMutation,
  useUploadChatImageMutation,
} = chatApi;

