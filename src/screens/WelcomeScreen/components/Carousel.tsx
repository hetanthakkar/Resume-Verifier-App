import React, {forwardRef} from 'react';
import {View, Text, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from '../styles';

export const Carousel = forwardRef(({items, activeIndex, onScroll}, ref) => (
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
