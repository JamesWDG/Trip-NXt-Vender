import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { width } from '../../../config/constants';

const RulesAndRegulations = () => {
  const navigation = useNavigation<NavigationPropType>();

  const handleAgreed = () => {
    // Handle agreed action - navigate to next screen or perform action
    console.log('User agreed to rules and regulations');
    navigation.navigate('Accomodation', { screen: 'Congratulations' });
  };

  return (
    <WrapperContainer title="Rules And Regulations" navigation={navigation}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* First Text Block */}
          <View style={styles.textBlock}>
            <Text style={styles.heading}>
              Lorem Ipsum is simply dummy text of the printing?
            </Text>
            <Text style={styles.bodyText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </Text>
          </View>

          {/* Second Text Block */}
          <View style={styles.textBlock}>
            <Text style={styles.heading}>
              Lorem Ipsum is simply dummy text of printing?
            </Text>
            <Text style={styles.bodyText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </Text>
          </View>

          {/* Third Text Block */}
          <View style={styles.textBlock}>
            <Text style={styles.heading}>Dummy text of the printing?</Text>
            <Text style={styles.bodyText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </Text>
          </View>
          <GradientButtonForAccomodation
            title="Agreed"
            onPress={handleAgreed}
            fontSize={16}
            fontFamily={fonts.bold}
          />
        </ScrollView>

        {/* Agreed Button */}
      </View>
    </WrapperContainer>
  );
};

export default RulesAndRegulations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Space for button
  },
  textBlock: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
    lineHeight: 26,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    lineHeight: 22,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.c_F3F3F3,
  },
});
