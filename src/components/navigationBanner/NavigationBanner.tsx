import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface NavigationBannerProps {
  text: string;
  icon?: React.ReactNode;
}

const NavigationBanner: React.FC<NavigationBannerProps> = ({ text, icon }) => {
  return (
    <LinearGradient
      colors={['#F47E20', '#EE4026']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {icon || <ArrowRight size={24} color={colors.white} />}
        <Text style={styles.text}>{text}</Text>
      </View>
    </LinearGradient>
  );
};

export default NavigationBanner;

const styles = StyleSheet.create({
  gradient: {
    marginTop: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 12,
    paddingHorizontal: 20,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
  },
});
