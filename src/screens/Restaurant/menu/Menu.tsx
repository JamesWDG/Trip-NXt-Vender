import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import MenuItemCard from '../../../components/menuItemCard/MenuItemCard';
import images from '../../../config/images';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

const Menu = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const menuItems = [
    {
      id: '1',
      image: images.placeholder,
      name: 'Pretzel Chicken Noodle Soup',
      description: 'Lorem Ipsum is simply dummy text',
      price: 24.0,
      rating: 4.8,
      reviewCount: 150,
    },
    {
      id: '2',
      image: images.placeholder,
      name: 'Crispy Chicken Burger',
      description: 'Lorem Ipsum is simply dummy text',
      price: 18.5,
      rating: 4.5,
      reviewCount: 89,
    },
    {
      id: '3',
      image: images.placeholder,
      name: 'Grilled Chicken Wrap',
      description: 'Lorem Ipsum is simply dummy text',
      price: 16.0,
      rating: 4.7,
      reviewCount: 120,
    },
    {
      id: '4',
      image: images.placeholder,
      name: 'BBQ Chicken Pizza',
      description: 'Lorem Ipsum is simply dummy text',
      price: 22.0,
      rating: 4.9,
      reviewCount: 200,
    },
    {
      id: '5',
      image: images.placeholder,
      name: 'Chicken Caesar Salad',
      description: 'Lorem Ipsum is simply dummy text',
      price: 15.5,
      rating: 4.6,
      reviewCount: 95,
    },
  ];

  const handleAddNewItems = () => {
    // Navigate to add menu screen
    navigation.navigate('AddMenu');
  };

  const handleMenuItemPress = (itemId: string) => {
    // Handle menu item press
    console.log('Menu item pressed:', itemId);
  };

  return (
    <WrapperContainer title="Menu" navigation={navigation}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Today's Menu</Text>
          <TouchableOpacity onPress={handleAddNewItems} activeOpacity={0.7}>
            <Text style={styles.addButtonText}>+ Add New Items</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items List */}
        <FlatList
          data={menuItems}
          renderItem={({ item }) => (
            <MenuItemCard
              image={item.image}
              name={item.name}
              description={item.description}
              price={item.price}
              rating={item.rating}
              reviewCount={item.reviewCount}
              onPress={() => handleMenuItemPress(item.id)}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </WrapperContainer>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_0162C0,
  },
  listContent: {
    paddingBottom: 20,
  },
});
