import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import ContactInfoCard from '../../../components/contactInfoCard/ContactInfoCard';
import CustomTextInput from '../../../components/customTextInput/CustomTextInput';
import CustomTextArea from '../../../components/customTextArea/CustomTextArea';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import { Phone, Mail } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

const ContactUs = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendNow = () => {
   
    // navigation.navigate('MessageSent');
  };

  return (
    <WrapperContainer navigation={navigation} title="Contact Us">
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Contact Information Cards */}
          <View style={styles.contactCardsContainer}>
            <ContactInfoCard
              icon={Phone}
              text="+1 234-302-3404"
              isHighlighted={false}
            />
            <View style={styles.cardSpacer} />
            <ContactInfoCard
              icon={Mail}
              text="abc@gmail.com"
              isHighlighted={true}
            />
          </View>

          {/* Contact Form Heading */}
          <Text style={styles.formHeading}>Contact Form</Text>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <CustomTextInput
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
            />

            <CustomTextInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomTextInput
              placeholder="Subject"
              value={subject}
              onChangeText={setSubject}
            />

            <CustomTextArea
              placeholder="Message"
              value={message}
              onChangeText={setMessage}
              numberOfLines={6}
            />

            <GradientButtonForAccomodation
              title="Send Now"
              onPress={handleSendNow}
              fontSize={16}
              fontFamily={fonts.bold}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  contactCardsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  cardSpacer: {
    width: 16,
  },
  formHeading: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 20,
  },
  formContainer: {
    gap: 16,
  },
});
