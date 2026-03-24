import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { resolveChatMediaUrl } from '../../utils/chatMediaUrl';

interface ChatMessageProps {
  message: string;
  messageType?: string;
  isSent: boolean;
  time?: string;
  showAvatar?: boolean;
}

const ChatMessage = ({
  message,
  messageType = 'text',
  isSent,
  time: _time,
  showAvatar = false,
}: ChatMessageProps) => {
  const isImage = messageType === 'image' && !!message?.trim();
  const imageUri = isImage ? resolveChatMediaUrl(message) : '';

  return (
    <View
      style={[
        styles.container,
        isSent ? styles.sentContainer : styles.receivedContainer,
      ]}
    >
      {!isSent && (
        <View style={styles.avatarContainer}>
          <View style={styles.avatarDot} />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isImage && styles.imageBubble,
          isSent ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        {isImage ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={[
              styles.messageText,
              isSent ? styles.sentText : styles.receivedText,
            ]}
          >
            {message}
          </Text>
        )}
      </View>
      {isSent && (
        <View style={styles.statusDotContainer}>
          <View style={styles.statusDot} />
        </View>
      )}
    </View>
  );
};

export default ChatMessage;

const IMAGE_MAX_W = 220;
const IMAGE_MAX_H = 280;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  sentContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatarContainer: {
    marginRight: 8,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarDot: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: colors.c_666666,
  },
  statusDotContainer: {
    marginLeft: 6,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: colors.c_666666,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: '78%',
  },
  imageBubble: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  sentBubble: {
    backgroundColor: colors.c_007DFC,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: colors.c_F3F3F3,
    borderBottomLeftRadius: 4,
  },
  messageImage: {
    width: IMAGE_MAX_W,
    height: IMAGE_MAX_H,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
  },
  messageText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    lineHeight: 20,
  },
  sentText: {
    color: colors.white,
  },
  receivedText: {
    color: colors.black,
  },
});
