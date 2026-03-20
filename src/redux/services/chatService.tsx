import { baseApi } from './api';

export interface ChatSummary {
  id: number;
  isGroup: boolean;
  groupName: string | null;
  groupImage: string | null;
  groupDescription: string | null;
  lastMessage: {
    id: number;
    content: string;
    messageType: string;
    createdAt: string;
    senderId: number;
  } | null;
  lastMessageAt: string | null;
  users: Array<{ id: number; name: string; profilePicture: string | null; email?: string }>;
  otherUsers?: Array<{ id: number; name: string; profilePicture: string | null; email?: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface MessageType {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file';
  sender?: { id: number; name: string; profilePicture: string | null; email?: string };
  createdAt: string;
  updatedAt?: string;
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAllChats: builder.query<ChatSummary[], void>({
      query: () => ({
        url: '/chat/get-all-chats',
        method: 'GET',
      }),
      transformResponse: (res: { data?: ChatSummary[] }) => res?.data ?? res ?? [],
    }),
    getChat: builder.query<ChatSummary, number>({
      query: chatId => ({
        url: `/chat/get-chat/${chatId}`,
        method: 'GET',
      }),
      transformResponse: (res: { data?: ChatSummary }) => res?.data ?? res,
    }),
    createSingleChat: builder.mutation<ChatSummary, { otherUserId: number }>({
      query: body => ({
        url: '/chat/create-single-chat',
        method: 'POST',
        body,
      }),
      transformResponse: (res: { data?: ChatSummary }) => res?.data ?? res,
    }),
    getMessages: builder.query<
      { messages: MessageType[]; pagination: { currentPage: number; totalPages: number; totalMessages: number; hasMore: boolean } },
      { chatId: number; page?: number; limit?: number }
    >({
      query: ({ chatId, page = 1, limit = 20 }) => ({
        url: '/chat/get-messages',
        method: 'GET',
        params: { chatId, page, limit },
      }),
      transformResponse: (res: { data?: { messages: MessageType[]; pagination: any } }) => res?.data ?? res ?? { messages: [], pagination: { hasMore: false } },
    }),
    sendMessage: builder.mutation<MessageType, { chatId: number; content: string; messageType?: string; receiverId?: number }>({
      query: body => ({
        url: '/chat/send-message',
        method: 'POST',
        body,
      }),
      transformResponse: (res: { data?: MessageType }) => res?.data ?? res,
      invalidatesTags: ['Chat'],
    }),
  }),
});

export const {
  useLazyGetAllChatsQuery,
  useGetChatQuery,
  useCreateSingleChatMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;

