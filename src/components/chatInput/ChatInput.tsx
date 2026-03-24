import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Camera, Send, Images } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface ChatInputProps {
  onSend: (message: string) => void;
  onAttachmentPress?: () => void;
  onCameraPress?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInput = ({
  onSend,
  onAttachmentPress,
  onCameraPress,
  placeholder = 'Write a message',
  disabled = false,
}: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, disabled && styles.inputDisabled]}
          placeholder={placeholder}
          placeholderTextColor={colors.c_666666}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          editable={!disabled}
        />
        <View style={styles.inputIconsContainer} pointerEvents={disabled ? 'none' : 'auto'}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onAttachmentPress}
            activeOpacity={0.7}
            disabled={disabled}
          >
            <Images size={20} color={colors.c_666666} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onCameraPress}
            activeOpacity={0.7}
            disabled={disabled}
          >
            <Camera size={20} color={colors.c_666666} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSend}
        activeOpacity={0.7}
        disabled={disabled || !message.trim()}
      >
        <Send size={20} color={colors.black} />
      </TouchableOpacity>
      <View style={styles.handle} />
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    marginRight: 12,
  },
  input: {
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 80,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    maxHeight: 100,
    minHeight: 44,
  },
  inputDisabled: {
    opacity: 0.55,
  },
  inputIconsContainer: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  handle: {
    position: 'absolute',
    bottom: 4,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.c_DDDDDD,
  },
});
