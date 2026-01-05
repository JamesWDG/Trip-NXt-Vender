import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../navigation/authStack/AuthStack';
import WrapperContainer from '../../components/wrapperContainer/WrapperContainer';

const Faqs = () => {
  const navigation = useNavigation<NavigationPropType>();
  return (
    <WrapperContainer navigation={navigation} title="FAQS">
      <></>
    </WrapperContainer>
  );
};

export default Faqs;

const styles = StyleSheet.create({});
