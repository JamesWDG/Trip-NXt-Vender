import { FlatList, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import DocumentCard from '../../../components/documentCard/DocumentCard';
import images from '../../../config/images';

// Sample data - replace with actual data from API/state
const sampleDocuments = [
  {
    id: '1',
    image: images.license,
    title: 'Driving License',
    status: 'Approved' as const,
  },
  {
    id: '2',
    image: images.license,
    title: 'Captain Id',
    status: 'Approved' as const,
  },
  {
    id: '3',
    image: images.license,
    title: 'Vehicle Reg Document',
    status: 'Approved' as const,
  },
];

const Documents = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [documents] = useState(sampleDocuments); // Replace with actual state management

  const handleUploadPress = (documentId: string) => {
    // Handle upload action
    console.log('Upload pressed for document:', documentId);
    // navigation.navigate('UploadDocument', { documentId });
  };

  const handleCardPress = (documentId: string) => {
    // Handle card press - maybe show document details
    console.log('Card pressed for document:', documentId);
    // navigation.navigate('DocumentDetails', { documentId });
  };

  return (
    <WrapperContainer navigation={navigation} title="Documents">
      <FlatList
        data={documents}
        renderItem={({ item }) => (
          <DocumentCard
            image={item.image}
            title={item.title}
            status={item.status}
            onUploadPress={() => handleUploadPress(item.id)}
            onCardPress={() => handleCardPress(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </WrapperContainer>
  );
};

export default Documents;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
});
