import React from 'react';
import { View, Text,TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ResumeListScreen = ({ navigation }) => {
  const recentScans = [
    { id: '1', name: 'John Doe', jobTitle: 'Software Engineer', date: '2024-08-20' },
    { id: '2', name: 'Jane Smith', jobTitle: 'Product Manager', date: '2024-08-19' },
    { id: '3', name: 'Mike Johnson', jobTitle: 'UX Designer', date: '2024-08-18' },
    { id: '4', name: 'Emily Brown', jobTitle: 'Data Analyst', date: '2024-08-17' },
  ];

  const gradientColors = [
    ['#FF6B6B', '#FF8E8E'], // Red
    ['#4ECDC4', '#45B7A8'], // Teal
    ['#45AAF2', '#2D98DA'], // Blue
    ['#FF9FF3', '#F368E0'], // Pink
  ];

  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate("PDFNavigator")}
      style={styles.itemContainer}
    >
      <LinearGradient
        colors={gradientColors[index % gradientColors.length]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.item}
      >
        <View style={styles.iconContainer}>
          <Feather name="file-text" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#FFFFFF" />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recently Scanned Resumes</Text>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search candidates..."
          placeholderTextColor="#999"
        />
      </View>
      
      <FlatList
        data={recentScans}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    // opacity: 0.8,
    marginBottom:20
  },
  listContainer: {
    paddingBottom: 24,
  },
  itemContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  jobTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#E1E1E6',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth:0.5,
    borderColor:'grey'
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});

export default ResumeListScreen;