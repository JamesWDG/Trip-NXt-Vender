import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatUnreadState {
  unreadByChatId: Record<number, number>;
}

const initialState: ChatUnreadState = {
  unreadByChatId: {},
};

const chatUnreadSlice = createSlice({
  name: 'chatUnread',
  initialState,
  reducers: {
    initializeChatUnread: (state, action: PayloadAction<number[]>) => {
      action.payload.forEach(chatId => {
        if (!(chatId in state.unreadByChatId)) {
          state.unreadByChatId[chatId] = 0;
        }
      });
    },
    incrementChatUnread: (state, action: PayloadAction<number>) => {
      const chatId = action.payload;
      state.unreadByChatId[chatId] = (state.unreadByChatId[chatId] || 0) + 1;
    },
    clearChatUnread: (state, action: PayloadAction<number>) => {
      state.unreadByChatId[action.payload] = 0;
    },
    clearAllChatUnread: state => {
      state.unreadByChatId = {};
    },
  },
});

export const {
  initializeChatUnread,
  incrementChatUnread,
  clearChatUnread,
  clearAllChatUnread,
} = chatUnreadSlice.actions;

export default chatUnreadSlice.reducer;
