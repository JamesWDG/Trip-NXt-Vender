import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { incrementChatUnread } from '../redux/slices/chatUnreadSlice';
import { socketClient } from '../utils/socketClient';

/**
 * Keeps chat unread counts in sync while logged in. Listens to `chat-updated` on the user socket room
 * (backend emits to `user:<id>`), so counts update even when Messages list is not mounted.
 */
export function ChatSocketBridge() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(s => s.auth?.token);
  const userId = useAppSelector(s => (s.auth?.user?.id != null ? Number(s.auth.user.id) : null));
  const processedRef = useRef(new Set<string>());

  useEffect(() => {
    let mounted = true;

    const handleChatUpdated = (updatedChat: any) => {
      if (!mounted || !updatedChat?.id || userId == null) return;
      const chatId = Number(updatedChat.id);
      const lm = updatedChat?.lastMessage;
      if (!lm || typeof lm !== 'object') return;
      const msgId = lm.id != null ? String(lm.id) : '';
      if (!msgId) return;
      const senderId = lm.senderId != null ? Number(lm.senderId) : NaN;
      if (Number.isNaN(senderId) || senderId === userId) return;

      const key = `${chatId}:${msgId}`;
      if (processedRef.current.has(key)) return;
      processedRef.current.add(key);
      if (processedRef.current.size > 600) {
        processedRef.current.clear();
      }
      dispatch(incrementChatUnread(chatId));
    };

    const run = async () => {
      if (!token || userId == null) return;
      try {
        await socketClient.connect(userId, token);
        if (!mounted) return;
        socketClient.onChatUpdated(handleChatUpdated);
      } catch (e) {
        console.log('[ChatSocketBridge] connect error', e);
      }
    };
    void run();

    return () => {
      mounted = false;
      socketClient.offChatUpdated(handleChatUpdated);
    };
  }, [dispatch, token, userId]);

  return null;
}
