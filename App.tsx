import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import PdfViewer from './pdfviewer.tsx'
import SummarView from './summary.tsx'
import DetailView from './detailed.tsx'
const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '0',
    title: 'PDF View',
    description: 'Adjust your system to speed up your checkout.',
    component: PdfViewer,
  },
  {
    id: '1',
    title: 'Summary View',
    description: 'Faster checkouts with customized settings.',
    component: SummarView,
  },
  {
    id: '2',
    title: 'Detailed View',
    description: 'Get a quick overview of your settings.',
    component: DetailView,
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.pdfContainer}>
        <item.component />
      </View>
    </View>
  );

  const handleTabPress = (index) => {
    flatListRef.current?.scrollToIndex({ index: index, animated: true });
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={{alignItems:'center'}}
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.floor(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(newIndex);
        }}
      />
      <View style={styles.tabContainer}>
        {onboardingData.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.tab,
              currentIndex === index && styles.selectedTab
            ]}
            onPress={() => handleTabPress(index)}
          >
            <Text style={[
              styles.tabText,
              currentIndex === index && styles.selectedTabText
            ]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width: width,
    height: '100%',
  },
  pdfContainer: {
    flex: 1,
    width: width,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 5,
    width: width * 0.9,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedTab: {
    backgroundColor: '#5D3FD3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedTabText: {
    color: '#FFFFFF',
  },
});

export default OnboardingScreen;