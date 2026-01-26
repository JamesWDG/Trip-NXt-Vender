import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import FeatureItem from '../../../components/featureItem/FeatureItem';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { useLazyGetFeaturesItemsQuery } from '../../../redux/services/hotelService';
import { ShowToast } from '../../../config/constants';

interface Feature {
  title: string;
  data: {
    id: number;
    name: string;
    image: string;
    type: string;
  }[]
}

interface FeaturesRouteParams {
  category: string;
  postalCode: string;
  website: string;
  phoneNumber: string;
  bathrooms: number,
  bedrooms: number,
  beds: number,
  checkInTime: string,
  checkOutTime: string,
  guests: number,
  hotelName: string,
  hotelAddress: string,
  rentPerDay: string,
  rentPerHour: string,
  description: string,
  features: number[];
}

const Features = ({ route }: { route: RouteProp<{ Features: FeaturesRouteParams }, 'Features'> }) => {
  const navigation = useNavigation<NavigationPropType>();
  const [showMoreSafety, setShowMoreSafety] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [fetchFeatures] = useLazyGetFeaturesItemsQuery();

  const fetchFeaturesList = async () => {
    try {
      const res = await fetchFeatures({}).unwrap();
      console.log('features list: ', res);
      setFeatures(res.data);
    } catch (error) {
      console.log('error fetching features list: ', error);
      ShowToast('error', 'Failed to fetch features list');
    }
  }

  useEffect(() => {
    fetchFeaturesList();
    console.log("Route: ", route.params)
  }, [])

  const handleToggle = (recordId: number) => {
    setIds(ids.includes(recordId) ? ids.filter(id => id !== recordId) : [...ids, recordId]);
  }

  const handleNext = () => {
    navigation.navigate('Accomodation', {
      screen: 'UploadPhoto', params: {
        bathrooms: route.params.bathrooms,
        bedrooms: route.params.bedrooms,
        beds: route.params.beds,
        checkInTime: route.params.checkInTime,
        checkOutTime: route.params.checkOutTime,
        guests: route.params.guests,
        hotelName: route.params.hotelName,
        hotelAddress: route.params.hotelAddress,
        rentPerDay: route.params.rentPerDay,
        rentPerHour: route.params.rentPerHour,
        description: route.params.description,
        features: ids.join(','),
        category: route.params.category,
        postalCode: route.params.postalCode,
        website: route.params.website,
        phoneNumber: route.params.phoneNumber
      }
    });
    console.log('Selected Features:');
    // navigation.navigate('NextScreen');
  };

  const renderFeatureGrid = (
    items: Feature['data'],
  ) => {
    return (
      <View style={styles.gridContainer}>
        {items.map(item => (
          <FeatureItem
            key={item.id}
            icon={item.image}
            label={item.name}
            isSelected={ids.includes(item.id)}
            onPress={() => handleToggle(item.id)}
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
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
        </View> */}

        {/* Specials Features Section */}
        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>Specials Features</Text> */}
          {
            features.map((feature, index) => (
              <View style={styles.section} key={index.toString()}>
                <Text style={styles.sectionTitle}>{feature.title}</Text>
                {renderFeatureGrid(feature.data)}
              </View>
            ))
          }
        </View>

        {/* Safety Items Section */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Items?</Text>
          {!showMoreSafety && (
            <TouchableOpacity
              style={styles.showMoreContainer}
              onPress={() => setShowMoreSafety(true)}
            >
              <Text style={styles.showMoreText}>Show More</Text>
            </TouchableOpacity>
          )}
        </View> */}

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
    // marginBottom: 32,
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
    alignItems: 'flex-start',
    gap: Dimensions.get('window').width * 0.02,
    // justifyContent: 'space-between',
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
    marginTop: 10,
  },
});
