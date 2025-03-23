import {Platform} from 'react-native';

export const carouselItems = [
  {
    title: 'Share Safely',
    text: 'Find a supportive community where you can openly discuss your mental health challenges in a completely anonymous environment.',
    icon: 'shield-checkmark-outline',
    colors: ['#FF2D55', '#FF3B30'],
  },
  {
    title: 'Connect & Heal',
    text: 'Get matched with others experiencing similar mental health challenges and build meaningful connections through shared experiences.',
    icon: 'people-outline',
    colors: ['#5856D6', '#007AFF'],
  },
  {
    title: 'Grow Together',
    text: 'Track your progress, share coping strategies, and support each other on the journey toward better mental well-being.',
    icon: 'leaf-outline',
    colors: ['#34C759', '#30B0C7'],
  },
];

export const API_URL = Platform.select({
  ios: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
});
