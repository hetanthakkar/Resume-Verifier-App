import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Animated,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {mentalHealthCategories} from '../../../utils/mentalHealthCategories';

interface CategoryPickerProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  animation: Animated.Value;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelectCategory,
  animation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState<any>(null);

  const selectedCategoryObj = mentalHealthCategories.find(
    cat => cat.id === selectedCategory,
  );

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setShowInfo(false);
  };

  const selectCategory = (categoryId: string) => {
    onSelectCategory(categoryId);
    closeModal();
  };

  const showCategoryInfo = (category: any) => {
    setSelectedCategoryInfo(category);
    setShowInfo(true);
  };

  // Render a category item in the list
  const renderCategoryItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => selectCategory(item.id)}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => showCategoryInfo(item)}>
        <Ionicons name="information-circle-outline" size={22} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render the info screen for a selected category
  const renderInfoScreen = () => {
    if (!selectedCategoryInfo) return null;

    return (
      <View style={styles.infoContainer}>
        <View style={styles.infoHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowInfo(false)}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.infoTitle}>{selectedCategoryInfo.name}</Text>
          <View style={{width: 24}} />
        </View>

        <ScrollView style={styles.infoScroll}>
          <Text style={styles.infoDescription}>
            {selectedCategoryInfo.description}
          </Text>
          <Text style={styles.examplesTitle}>Common examples:</Text>

          {selectedCategoryInfo.examples.map(
            (example: string, index: number) => (
              <View key={index} style={styles.exampleItem}>
                <Ionicons name="ellipse" size={8} color="#007AFF" />
                <Text style={styles.exampleText}>{example}</Text>
              </View>
            ),
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => selectCategory(selectedCategoryInfo.id)}>
          <Text style={styles.selectButtonText}>Select This Category</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Main render method
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.label}>Select Challenge Category</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={openModal}>
        <Text style={styles.selectedText}>
          {selectedCategoryObj ? selectedCategoryObj.name : 'Select a category'}
        </Text>
        <Ionicons name="chevron-down" size={22} color="#007AFF" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Challenge Category</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={mentalHealthCategories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              style={styles.categoryList}
            />
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7FAFC',
  },
  selectedText: {
    fontSize: 16,
    color: '#4A5568',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  closeButton: {
    padding: 8,
  },
  categoryList: {
    maxHeight: '80%',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryName: {
    fontSize: 16,
    color: '#4A5568',
  },
  infoButton: {
    padding: 8,
  },
  infoContainer: {
    padding: 16,
    flex: 1,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // backgroundColor: 'white',
    // zIndex: 100,
    height: 500,
    top: 500,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    flex: 1,
  },
  infoScroll: {
    flex: 1,
  },
  infoDescription: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
    marginBottom: 20,
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 8,
    backgroundColor: '#F7FAFC',
    padding: 8,
    borderRadius: 6,
  },
  exampleText: {
    fontSize: 15,
    color: '#4A5568',
    marginLeft: 8,
    flex: 1,
  },
  selectButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
