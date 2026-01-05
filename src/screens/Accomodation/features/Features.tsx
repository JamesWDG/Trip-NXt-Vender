import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import { useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import FeatureItem from '../../../components/featureItem/FeatureItem';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import {
  Wifi,
  Bed,
  Tv,
  Bath,
  UtensilsCrossed,
  Flame,
  Coffee,
  Laptop,
  Waves,
  Droplet,
  Zap,
  Dumbbell,
  ChefHat,
  Utensils,
  Waves as Beach,
  Cloud,
  Heart,
  Shield,
  HeartPulse,
} from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

interface Feature {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
}

const Features = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set(),
  );
  const [selectedSpecials, setSelectedSpecials] = useState<Set<string>>(
    new Set(),
  );
  const [selectedSafety, setSelectedSafety] = useState<Set<string>>(new Set());
  const [showMoreSafety, setShowMoreSafety] = useState(false);

  const features: Feature[] = [
    { id: 'wifi', icon: Wifi, label: 'Wifi' },
    { id: 'beds', icon: Bed, label: 'Beds' },
    { id: 'tv', icon: Tv, label: 'TV' },
    { id: 'bath', icon: Bath, label: 'Bath' },
    { id: 'bar', icon: UtensilsCrossed, label: 'Bar' },
    { id: 'heating', icon: Flame, label: 'Heating' },
    { id: 'coffee', icon: Coffee, label: 'Coffee' },
    { id: 'work', icon: Laptop, label: 'Work' },
  ];

  const specialsFeatures: Feature[] = [
    { id: 'pool', icon: Waves, label: 'Pool' },
    { id: 'hotTub', icon: Droplet, label: 'Hot Tub' },
    { id: 'firePit', icon: Zap, label: 'Fire Pit' },
    { id: 'gym', icon: Dumbbell, label: 'Gym' },
    { id: 'bbqGrill', icon: ChefHat, label: 'Bbq Grill' },
    { id: 'dining', icon: Utensils, label: 'Dining' },
    { id: 'beach', icon: Beach, label: 'Beach' },
  ];

  const safetyItems: Feature[] = [
    { id: 'smoke', icon: Cloud, label: 'Smoke' },
    { id: 'aidKit', icon: HeartPulse, label: 'Aid Kit' },
    { id: 'fireEx', icon: Shield, label: 'Fire Ex' },
    { id: 'aed', icon: Heart, label: 'AED' },
  ];

  const toggleFeature = (
    id: string,
    set: Set<string>,
    setter: (set: Set<string>) => void,
  ) => {
    const newSet = new Set(set);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setter(newSet);
  };

  const handleNext = () => {
    navigation.navigate('Accomodation', { screen: 'UploadPhoto' });
    console.log('Selected Features:', {
      features: Array.from(selectedFeatures),
      specials: Array.from(selectedSpecials),
      safety: Array.from(selectedSafety),
    });
    // navigation.navigate('NextScreen');
  };

  const renderFeatureGrid = (
    items: Feature[],
    selectedSet: Set<string>,
    onToggle: (id: string) => void,
  ) => {
    return (
      <View style={styles.gridContainer}>
        {items.map(item => (
          <FeatureItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isSelected={selectedSet.has(item.id)}
            onPress={() => onToggle(item.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <WrapperContainer navigation={navigation} title="Features">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          {renderFeatureGrid(features, selectedFeatures, id =>
            toggleFeature(id, selectedFeatures, setSelectedFeatures),
          )}
        </View>

        {/* Specials Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specials Features</Text>
          {renderFeatureGrid(specialsFeatures, selectedSpecials, id =>
            toggleFeature(id, selectedSpecials, setSelectedSpecials),
          )}
        </View>

        {/* Safety Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Items?</Text>
          {renderFeatureGrid(safetyItems, selectedSafety, id =>
            toggleFeature(id, selectedSafety, setSelectedSafety),
          )}
          {!showMoreSafety && (
            <TouchableOpacity
              style={styles.showMoreContainer}
              onPress={() => setShowMoreSafety(true)}
            >
              <Text style={styles.showMoreText}>Show More</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <GradientButtonForAccomodation
            title="Next"
            onPress={handleNext}
            fontSize={16}
            fontFamily={fonts.bold}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default Features;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  showMoreContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  showMoreText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_0162C0,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
