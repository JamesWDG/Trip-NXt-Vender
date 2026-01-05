import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import GeneralStyles from '../../utils/GeneralStyles';
import { LucideIcon } from 'lucide-react-native';

interface ContactInfoCardProps {
  icon: React.ComponentType<any>;
  text: string;
  isHighlighted?: boolean;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  icon: Icon,
  text,
  isHighlighted = false,
}) => {
  return (
    <View
      style={[
        styles.card,
        GeneralStyles.shadow,
        isHighlighted && styles.highlightedCard,
      ]}
    >
      <View style={styles.iconContainer}>
        <Icon
          size={24}
          color={isHighlighted ? colors.white : colors.c_2B2B2B}
        />
      </View>
      <Text style={[styles.text, isHighlighted && styles.highlightedText]}>
        {text}
      </Text>
    </View>
  );
};

export default ContactInfoCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  highlightedCard: {
    backgroundColor: colors.c_0162C0,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.c_F3F3F3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'absolute',
    top: -30,
    left: '50%',
    transform: [{ translateX: -10 }],
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
    textAlign: 'center',
  },
  highlightedText: {
    color: colors.white,
  },
});
