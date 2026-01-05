import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Plus, X } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import CustomTextInput from '../../../components/customTextInput/CustomTextInput';
import CustomTextArea from '../../../components/customTextArea/CustomTextArea';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';

const MenuImage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedCategory, setSelectedCategory] = useState<string>('Starters');
  const [newCategory, setNewCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = ['Starters', 'Mains', 'Drinks', 'Desserts'];

  const handleAddNewItems = () => {
    // Navigate to RideDetails screen
    navigation.navigate('RestaurantStack', { screen: 'RideDetails' });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // TODO: Add category to list
      console.log('Adding category:', newCategory);
      setNewCategory('');
    }
  };

  const handleEditItem = () => {
    // Handle edit item action
    console.log('Edit item pressed');
    // TODO: Load item data for editing
  };

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: false,
      includeBase64: false,
    })
      .then(image => {
        setSelectedImage(image.path);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('ImagePicker Error: ', error);
        }
      });
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    // Validate and save
    // if (!itemName.trim() || !price.trim()) {
    //   Alert.alert('Error', 'Please fill in all required fields');
    //   return;
    // }

    // Save item data
    console.log('Saving item:', {
      category: selectedCategory,
      itemName,
      price,
      description,
      image: selectedImage,
    });

    navigation.navigate('RestaurantStack', { screen: 'RestaurantHome' });
    // Show success message
    // Alert.alert('Success', 'Item saved successfully!', [
    //   {
    //     text: 'OK',
    //     onPress: () => {
    //       // Navigate back to menu after success
    //       navigation.navigate('RideDetails');
    //     },
    //   },
    // ]);
  };

  return (
    <WrapperContainer title="Edit Product" navigation={navigation}>
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
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

          {/* Categories Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>

            {/* Category Buttons */}
            <View style={styles.categoryButtonsContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category &&
                      styles.categoryButtonActive,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category &&
                        styles.categoryButtonTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Add Category Input */}
            <View style={styles.addCategoryContainer}>
              <View style={styles.addCategoryInputWrapper}>
                <Plus size={20} color={colors.c_666666} />
                <TextInput
                  style={styles.addCategoryInput}
                  placeholder="Add Category"
                  placeholderTextColor={colors.c_666666}
                  value={newCategory}
                  onChangeText={setNewCategory}
                  onSubmitEditing={handleAddCategory}
                />
              </View>
            </View>
          </View>

          {/* Existing Item Card */}
          <View style={styles.itemCard}>
            <View style={styles.itemCardContent}>
              <View style={styles.itemCardInfo}>
                <Text style={styles.itemCardName}>Burger</Text>
                <Text style={styles.itemCardDetails}>$10 • Available</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditItem}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add / Edit Item Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add / Edit Item</Text>

            {/* Item Name Input */}
            <View style={styles.inputWrapper}>
              <CustomTextInput
                placeholder="Item Name"
                value={itemName}
                onChangeText={setItemName}
                style={styles.input}
              />
            </View>

            {/* Price Input */}
            <View style={styles.inputWrapper}>
              <CustomTextInput
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputWrapper}>
              <CustomTextArea
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                numberOfLines={4}
                style={styles.textArea}
              />
            </View>

            {/* Photo Upload Area */}
            <TouchableOpacity
              style={styles.photoUploadArea}
              onPress={handleImagePicker}
              activeOpacity={0.7}
            >
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={handleRemoveImage}
                    activeOpacity={0.8}
                  >
                    <X size={16} color={colors.white} />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.photoUploadText}>
                  Click to Upload Photo
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Action Buttons */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    </WrapperContainer>
  );
};

export default MenuImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
  },
  addButton: {
    marginBottom: 30,
    borderRadius: 100,
    overflow: 'hidden',
    height: 50,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    // paddingHorizontal: 20,
    borderRadius: 100,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 16,
  },
  categoryButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: colors.c_F3F3F3,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
  },
  categoryButtonActive: {
    backgroundColor: colors.c_0162C0,
    borderColor: colors.c_0162C0,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  addCategoryContainer: {
    marginTop: 8,
  },
  addCategoryInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 100,
    paddingHorizontal: 16,
    height: 50,
    gap: 12,
  },
  addCategoryInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  itemCard: {
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  itemCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCardInfo: {
    flex: 1,
  },
  itemCardName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 4,
  },
  itemCardDetails: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  editButton: {
    backgroundColor: colors.black,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 4,
    width: 70,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderTopWidth: 1,
    borderTopColor: colors.c_0162C0,
    borderStyle: 'dashed',
  },
  separatorIcon: {
    marginHorizontal: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.c_0162C0,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 12,
  },
  textArea: {
    borderRadius: 12,
  },
  photoUploadArea: {
    minHeight: 50,
    maxHeight: 150,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.c_DDDDDD,
    borderRadius: 100,
    backgroundColor: colors.c_F3F3F3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  photoUploadText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.c_EE4026,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    // paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: colors.white,

    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFF3CD',
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
