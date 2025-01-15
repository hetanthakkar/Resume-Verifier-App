import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IonIcons from 'react-native-vector-icons/Ionicons';
import GradientText from './gradienttext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const WelcomeScreen = ({navigation}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef();
  const carouselItems = [
    {
      title: 'Experience Check',
      text: 'Say goodbye to fake job stories. Our AI verifies work history and employment details to ensure authenticity in your hiring process.',
      icon: 'git-compare-outline',
      colors: ['#FF2D55', '#FF3B30'],
    },
    {
      title: 'Project Check',
      text: 'No more made-up projects. We analyze portfolio submissions and validate technical claims to give you a clear picture of real-world experience.',
      icon: 'document-text-outline',
      colors: ['#5856D6', '#007AFF'],
    },
    {
      title: 'Real Coding Skills',
      text: 'No more overhyped coding claims. Our adaptive assessments evaluate practical abilities and code quality to reveal true technical proficiency.',
      icon: 'bar-chart-outline',
      colors: ['#34C759', '#30B0C7'],
    },
  ];

  const handleScroll = event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };
  useEffect(() => {
    const checkOnboarding = async () => {
      // AsyncStorage.clear()
    };
    checkOnboarding();
  });
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F0F0F3']} style={styles.background}>
        <View style={styles.header}>
          <GradientText />
        </View>
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}>
            {carouselItems.map((item, index) => (
              <View key={index} style={styles.carouselItem}>
                <LinearGradient
                  colors={item.colors}
                  style={styles.iconBackground}>
                  <Ionicons name={item.icon} size={40} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.carouselTitle}>{item.title}</Text>
                <Text style={styles.carouselText}>{item.text}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {carouselItems.map((_, index) => (
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
        <View style={styles.buttonContainer}>
          {Platform.OS === 'ios' ? (
            <>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => console.log('Continue with Apple')}>
                <FontAwesome
                  name="apple"
                  size={20}
                  color="#000"
                  style={styles.icon}
                />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => navigation.navigate('Login')}>
                <IonIcons
                  name="mail-open"
                  size={20}
                  color="#000"
                  style={styles.icon}
                />
                <Text style={styles.socialButtonText}>
                  Continue with Work Email
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => console.log('Continue with Google')}>
                <FontAwesome
                  name="google"
                  size={20}
                  color="#DB4437"
                  style={styles.icon}
                />
                <Text style={styles.socialButtonText}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.socialButtonText}>
                  Continue with Work Email
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginTop: 10,
  },
  carouselContainer: {
    height: screenHeight * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    width: screenWidth - 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  carouselTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 15,
    textAlign: 'center',
  },
  carouselText: {
    fontSize: 16,
    color: '#3A3A3C',
    textAlign: 'center',
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    padding: 15,
    marginBottom: 15,
    // borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 15,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default WelcomeScreen;
