import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Plus, Check } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import SelectInput from '../../../components/selectInput/SelectInput';
import BottomSheetComp from '../../../components/bottomSheetComp/BottomSheetComp';
import { BottomSheetComponentRef } from '../../../components/bottomSheetComp/BottomSheetComp';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

interface MenuItem {
  id: string;
  name: string;
}

const AddMenu = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedItems, setSelectedItems] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
  ]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const bottomSheetRef = useRef<BottomSheetComponentRef>(null);

  // Sample menu items - replace with actual data from API
  const menuItems: MenuItem[] = [
    { id: '1', name: 'Main Course' },
    { id: '2', name: 'Plain Rice' },
    { id: '3', name: 'Paneer Roti' },
    { id: '4', name: 'Sweet Dessert' },
    { id: '5', name: 'Mushroom Masala' },
    { id: '6', name: 'Butter Chicken' },
    { id: '7', name: 'Naan Bread' },
    { id: '8', name: 'Biryani' },
    { id: '9', name: 'Tandoori Chicken' },
    { id: '10', name: 'Dal Makhani' },
  ];

  const handleSelectPress = (index: number) => {
    setActiveIndex(index);
    bottomSheetRef.current?.open();
  };

  const handleItemSelect = (item: MenuItem) => {
    if (activeIndex !== null) {
      const newSelectedItems = [...selectedItems];
      newSelectedItems[activeIndex] = item.name;
      setSelectedItems(newSelectedItems);
      bottomSheetRef.current?.close();
      setActiveIndex(null);
    }
  };

  const handleAddNewItems = () => {
    // Handle add new items action
    console.log('Add New Items pressed');
    // TODO: Navigate to add new item screen or open modal
  };

  const handleNext = () => {
    // Validate that at least one item is selected
    // const hasSelectedItems = selectedItems.some(item => item !== '');

    // if (!hasSelectedItems) {
    //   // Show error or alert
    //   console.log('Please select at least one menu item');
    //   return;
    // }

    // Save menu items and navigate to menu image screen
    console.log('Selected items:', selectedItems);
    navigation.navigate('RestaurantStack', { screen: 'MenuImage' });
  };

  const renderMenuItem = (item: MenuItem) => {
    const isSelected =
      activeIndex !== null && selectedItems[activeIndex] === item.name;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.menuItem, isSelected && styles.selectedMenuItem]}
        onPress={() => handleItemSelect(item)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.menuItemText,
            isSelected && styles.selectedMenuItemText,
          ]}
        >
          {item.name}
        </Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Check size={12} color={colors.c_0162C0} strokeWidth={3} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer title="Add Menu" navigation={navigation}>
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Select Input Fields */}
          <View style={styles.inputsContainer}>
            {selectedItems.map((value, index) => (
              <View key={index} style={styles.inputWrapper}>
                <SelectInput
                  placeholder={`Select Menu Item ${index + 1}`}
                  value={value}
                  onPress={() => handleSelectPress(index)}
                />
              </View>
            ))}
          </View>

          {/* Add New Items Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddNewItems}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F47E20', '#EE4026']}
              style={styles.addButtonGradient}
            >
              <Plus size={20} color={colors.white} strokeWidth={2.5} />
              <Text style={styles.addButtonText}>Add New Items</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom Sheet for Menu Item Selection */}
        <BottomSheetComp
          ref={bottomSheetRef}
          snapPoints={['50%', '75%']}
          enablePanDownToClose={true}
        >
          <View style={styles.bottomSheetContainer}>
            <Text style={styles.bottomSheetTitle}>Select Menu Item</Text>
            <ScrollView
              style={styles.menuItemsList}
              showsVerticalScrollIndicator={false}
            >
              {menuItems.map(item => renderMenuItem(item))}
            </ScrollView>
          </View>
        </BottomSheetComp>
      </>
    </WrapperContainer>
  );
};

export default AddMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  inputsContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  addButton: {
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 100,
    overflow: 'hidden',
    height: 50,
    width: '100%',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 8,
    borderRadius: 100,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  nextButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  bottomSheetContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 20,
  },
  menuItemsList: {
    maxHeight: 400,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    marginBottom: 12,
  },
  selectedMenuItem: {
    backgroundColor: colors.c_0162C0,
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  selectedMenuItemText: {
    color: colors.white,
    fontFamily: fonts.medium,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
