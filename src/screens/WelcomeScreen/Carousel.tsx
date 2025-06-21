import React, {forwardRef} from 'react';
import {View, Text, ScrollView, Dimensions, FlexAlignType, TextStyle, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const styles = {
  carouselContainer: {
    height: screenHeight * 0.5,
    justifyContent: 'center' as ViewStyle['justifyContent'],
    alignItems: 'center' as FlexAlignType,
  },
  carouselItem: {
    width: screenWidth - 40,
    justifyContent: 'center' as ViewStyle['justifyContent'],
    alignItems: 'center' as FlexAlignType,
    padding: 20,
    marginHorizontal: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center' as ViewStyle['justifyContent'],
    alignItems: 'center' as FlexAlignType,
    marginBottom: 20,
  },
  carouselTitle: {
    fontSize: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: '#1C1C1E',
    marginBottom: 15,
    textAlign: 'center' as TextStyle['textAlign'],
  },
  carouselText: {
    fontSize: 16,
    color: '#3A3A3C',
    textAlign: 'center' as TextStyle['textAlign'],
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row' as ViewStyle['flexDirection'],
    justifyContent: 'center' as ViewStyle['justifyContent'],
    alignItems: 'center' as FlexAlignType,
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
};

type CarouselItem = {
  colors: string[];
  icon: string;
  title: string;
  text: string;
};

type CarouselProps = {
  items: CarouselItem[];
  activeIndex: number;
  onScroll: (event: any) => void;
};

export const Carousel = forwardRef<ScrollView, CarouselProps>(({items, activeIndex, onScroll}, ref) => (
  <View style={styles.carouselContainer}>
    <ScrollView
      ref={ref}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}>
      {items.map((item, index) => (
        <View key={index} style={styles.carouselItem}>
          <LinearGradient colors={item.colors} style={styles.iconBackground}>
            <Ionicons name={item.icon} size={40} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.carouselTitle}>{item.title}</Text>
          <Text style={styles.carouselText}>{item.text}</Text>
        </View>
      ))}
    </ScrollView>
    <View style={styles.pagination}>
      {items.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === activeIndex ? styles.paginationDotActive : null,
          ]}
        />
      ))}
    </View>
  </View>
)); 