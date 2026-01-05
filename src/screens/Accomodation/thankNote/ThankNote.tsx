import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import CustomTextInput from '../../../components/customTextInput/CustomTextInput';
import CustomTextArea from '../../../components/customTextArea/CustomTextArea';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import fonts from '../../../config/fonts';
import colors from '../../../config/colors';

const ThankNote = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Handle send message
    console.log('Send message', {
      name,
      email,
      subject,
      message,
    });
    navigation.navigate('Accomodation', { screen: 'MessageSent' });
    // Navigate to MessageSent screen
    // navigation.navigate('MessageSent');
  };

  return (
    <WrapperContainer title="Thank Note" navigation={navigation}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            {/* Your Name */}
            <CustomTextInput
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
            />

            {/* Email Address */}
            <CustomTextInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Subject */}
            <CustomTextInput
              placeholder="Subject"
              value={subject}
              onChangeText={setSubject}
            />

            {/* Message */}
            <CustomTextArea
              placeholder="Message"
              value={message}
              onChangeText={setMessage}
              numberOfLines={6}
            />

            {/* Send Button */}
            <GradientButtonForAccomodation
              title="Send"
              onPress={handleSend}
              fontSize={16}
              fontFamily={fonts.bold}
              otherStyles={styles.sendButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

export default ThankNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    marginTop: 30,
  },
  formContainer: {
    gap: 16,
  },
  sendButton: {
    marginTop: 8,
  },
});
