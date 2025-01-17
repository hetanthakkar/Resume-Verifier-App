import {Platform} from 'react-native';

export const carouselItems = [
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

export const API_URL = Platform.select({
  ios: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
});
