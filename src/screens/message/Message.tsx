import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface ChatMessageProps {
  message: string;
  isSent: boolean;
  time?: string;
  showAvatar?: boolean;
}

const ChatMessage = ({
  message,
  isSent,
  time,
  showAvatar = false,
}: ChatMessageProps) => {
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
          isSent ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isSent ? styles.sentText : styles.receivedText,
          ]}
        >
          {message}
        </Text>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
    // maxWidth: '85%',
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
    maxWidth: '70%',
  },
  sentBubble: {
    backgroundColor: colors.c_007DFC,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: colors.c_F3F3F3,
    borderBottomLeftRadius: 4,
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
