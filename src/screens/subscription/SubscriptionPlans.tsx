import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Check, Sparkles } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationPropType } from '../../navigation/authStack/AuthStack';
import WrapperContainer from '../../components/wrapperContainer/WrapperContainer';
import GradientButtonForAccomodation from '../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import {useIAP} from 'react-native-iap';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_MARGIN = 16;
const ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN;

const FEATURES = [
  'Unlimited AI Generations',
  'Better Memory',
  'Chat Styles',
  'Higher Limits',
];

interface PlanItem {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
}

const PLANS: PlanItem[] = [
  { id: 'monthly', name: 'Monthly Plan', price: '$21.99', period: '/Month' },
  {
    id: 'annual',
    name: 'Annual Plan',
    price: '$89.99',
    period: '/Month',
    badge: 'Best Value',
  },
];

const PlanCard = ({
  item,
  isSelected,
  onPress,
}: {
  item: PlanItem;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const {connected, subscriptions, fetchProducts, requestPurchase} = useIAP();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  const CardContent = () => (
    <>
      {isSelected ? (
        <View style={styles.selectedBadge}>
          <View style={styles.selectedCheck}>
            <Check size={14} color={colors.white} strokeWidth={3} />
          </View>
        </View>
      ) : (
        item.badge && (
          <View style={styles.badgeContainer}>
            <View style={styles.badgeOutline}>
              <Sparkles size={12} color={colors.c_0162C0} />
              <Text style={styles.badgeTextOutline}>{item.badge}</Text>
            </View>
          </View>
        )
      )}
      <Text style={styles.planLabel}>{item.name}</Text>
      <Text style={styles.planPrice}>
        {item.price}
        <Text style={styles.planPeriod}>{item.period}</Text>
      </Text>
      <View style={styles.featuresSection}>
        {FEATURES.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            {isSelected ? (
              <LinearGradient
                colors={['#0162C0', '#0A8AE8']}
                style={styles.checkIcon}
              >
                <Check size={12} color={colors.white} strokeWidth={3} />
              </LinearGradient>
            ) : (
              <View style={styles.checkIconDefault}>
                <Check size={12} color={colors.white} strokeWidth={3} />
              </View>
            )}
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </>
  );
  useEffect(() => {
    if (connected) {
      fetchProducts({skus: ['bronze'], type: 'subs'});
    }
  }, [connected]);
  useEffect(() => {
    if (subscriptions) {
      console.log('subscriptions: ', subscriptions);
    }
  }, [subscriptions]);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}
      >
        {isSelected ? (
          <LinearGradient
            colors={['#0162C0', '#0A8AE8']}
            style={styles.cardBorderGradient}
          >
            <View style={styles.cardInner}>
              <CardContent />
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.card}>
            <CardContent />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const SubscriptionPlans = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('monthly');

  const handleBuySubscription = () => {
    // Add your subscription logic here
  };

  const renderPlanCard = ({ item }: { item: PlanItem }) => (
    <PlanCard
      item={item}
      isSelected={selectedPlanId === item.id}
      onPress={() => setSelectedPlanId(item.id)}
    />
  );

  return (
    <WrapperContainer navigation={navigation} title="Subscription">
      <LinearGradient
        colors={['#E8E4F3', '#F5F3FA']}
        style={styles.gradientBg}
      >
        <View style={styles.carouselContainer}>
          <FlatList
            data={PLANS}
            renderItem={renderPlanCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            snapToAlignment="center"
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            getItemLayout={(_, index) => ({
              length: ITEM_WIDTH,
              offset: ITEM_WIDTH * index,
              index,
            })}
          />
        </View>

        <View style={styles.buttonContainer}>
          <GradientButtonForAccomodation
            title="Buy Subscription"
            onPress={handleBuySubscription}
            fontSize={16}
            fontFamily={fonts.bold}
          />
        </View>
      </LinearGradient>
    </WrapperContainer>
  );
};

export default SubscriptionPlans;

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
  },
  carouselContainer: {
    flex: 1,
  },
  carouselContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH - CARD_MARGIN) / 2,
    paddingVertical: 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_MARGIN,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardBorderGradient: {
    borderRadius: 30,
    padding: 3,
    ...Platform.select({
      ios: {
        shadowColor: colors.c_0162C0,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  cardInner: {
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 24,
    overflow: 'hidden',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  badgeOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.c_0162C0,
  },
  badgeTextOutline: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
  },
  selectedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  selectedCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.c_079D48,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.c_079D48,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  planLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_999999,
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.black,
    letterSpacing: -0.5,
  },
  planPeriod: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  featuresSection: {
    marginTop: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkIconDefault: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.c_2B2B2B,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
});
