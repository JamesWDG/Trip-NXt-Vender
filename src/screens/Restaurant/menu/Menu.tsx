import {
  FlatList,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import MenuItemCard from '../../../components/menuItemCard/MenuItemCard';
import images from '../../../config/images';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { useDeleteMenuItemMutation, useLazyGetMenuItemsQuery } from '../../../redux/services/restaurantService';
import { ShowToast } from '../../../config/constants';
import { MenuItemValidationParams } from '../../../utils/validations';
import DeleteModal, { DeleteModalRef } from '../../../components/deleteModal/DeleteModal';

const Menu = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [getMenuItems] = useLazyGetMenuItemsQuery();
  const deleteModalRef = useRef<DeleteModalRef>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [deleteMenuItem, { isLoading }] = useDeleteMenuItemMutation();
  
  const onDeleteItem = (id: number) => {
    setSelectedItemId(id);
    deleteModalRef.current?.open();
  }

  const handleDeleteItem = async (id: number) => {
    try {
      const res = await deleteMenuItem(id).unwrap();
      console.log('res deleting menu item: ', res);
      ShowToast('success', 'Item deleted successfully');
      fetchMenuItems();
    } catch (error) {
      ShowToast('error', 'Failed to delete item');
    }
  }
  const fetchMenuItems = async () => {
    try {
      const res = await getMenuItems({}).unwrap();
      console.log('menu items: ', res);
      setMenuItems(res.data);
    } catch (error) {
      console.log('error fetching menu items: ', error);
      ShowToast('error', 'Failed to fetch menu items');
    }
  }

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      fetchMenuItems();
    });
    return () => {
      subscribe();
    };
  }, [])
  const handleAddNewItems = () => {
    // Navigate to add menu screen
    navigation.navigate('MenuImage', { type: 'add' });
  };

  const handleMenuItemPress = (itemId: string) => {
    // Handle menu item press
    console.log('Menu item pressed:', itemId);
  };

  return (
    <WrapperContainer title="Menu" navigation={navigation} onBackPress={() => navigation.navigate('RestaurantStack', { screen: 'RestaurantHome' })}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Today's Menu</Text>
          <TouchableOpacity onPress={handleAddNewItems} activeOpacity={0.7}>
            <Text style={styles.addButtonText}>+ Add New Items</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items List */}
        <SectionList
          sections={menuItems}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{marginTop: 10}}>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <MenuItemCard
              id={item.id}
              category={item.category}
              image={item.image}
              name={item.name}
              description={item.description}
              price={item.price}
              rating={item.rating || 0}
              reviewCount={item.reviewCount || 0}
              extraToppings={item.toppings || []}
              onPress={() => handleMenuItemPress(item.id)}
              onDelete={onDeleteItem}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <DeleteModal ref={deleteModalRef} onDelete={() => handleDeleteItem(selectedItemId as number)}/>
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
