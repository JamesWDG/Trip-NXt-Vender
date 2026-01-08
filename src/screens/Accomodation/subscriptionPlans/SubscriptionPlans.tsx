import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import PricingCard from '../../../components/pricingCard/PricingCard';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

interface Plan {
  id: string;
  planName: string;
  price: string;
  features: string[];
  isHighlighted?: boolean;
  hasBlueBorder?: boolean;
}

const SubscriptionPlans = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [selectedPlan, setSelectedPlan] = useState<string>('plus');

  const plans: Plan[] = [
    {
      id: 'basic',
      planName: 'Basic',
      price: '$99',
      features: [
        'Lorem Ipsum is simply',
        'It is long established',
        'Lorem Ipsum is simply',
        'It is long established',
      ],
    },
    {
      id: 'plus',
      planName: 'Plus',
      price: '$149',
      features: [
        'Lorem Ipsum is simply',
        'It is long established',
        'Lorem Ipsum is simply',
        'It is long established',
        'Lorem Ipsum is simply',
        'It is long established',
      ],
    },
    {
      isHighlighted: true,
      id: 'premium',
      planName: 'Premium',
      price: '$199',
      features: [
        'Lorem Ipsum is simply',
        'It is long established',
        'Lorem Ipsum is simply',
        'It is long established',
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleProcessed = () => {
    console.log('Processed button pressed');
    // navigation.navigate('NextScreen');
  };

  const renderPlanCard = ({ item, index }: { item: Plan; index: number }) => {
    return (
      <PricingCard
        planName={item.planName}
        price={item.price}
        features={item.features}
        isHighlighted={item.isHighlighted}
        hasBlueBorder={item.hasBlueBorder}
        onSelectPlan={() => handleSelectPlan(item.id)}
      />
    );
  };

  // Card width (280) + margin (8 on each side = 16)
  const CARD_WIDTH = 280;
  const CARD_MARGIN = 16;
  const ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN;

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });

  const onScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    // Fallback: scroll to the highest measured frame
    setTimeout(() => {
      // You can add a ref and scroll to index here if needed
    }, 100);
  };

  return (
    <WrapperContainer navigation={navigation} title="Our Plans">
      <View style={styles.container}>
        <Text style={styles.title}>Our Plans</Text>
        {/* Plans Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={plans}
            renderItem={renderPlanCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            initialScrollIndex={1}
            getItemLayout={getItemLayout}
            onScrollToIndexFailed={onScrollToIndexFailed}
            decelerationRate="fast"
            snapToAlignment="center"
            snapToInterval={ITEM_WIDTH}
          />
          {/* Processed Button */}
          <View style={styles.buttonContainer}>
            <GradientButtonForAccomodation
              title="Processed"
              onPress={handleProcessed}
              fontSize={16}
              fontFamily={fonts.bold}
            />
          </View>
        </View>
      </View>
    </WrapperContainer>
  );
};

export default SubscriptionPlans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  carouselContainer: {
    // flex: 1,
    justifyContent: 'center',
  },
  carouselContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    // backgroundColor: 'red',
    // height: 420,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    // backgroundColor: 'blue',
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 20,
    textAlign: 'center',
  },
});
