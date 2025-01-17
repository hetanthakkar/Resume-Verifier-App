import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export const DIMENSIONS = {
  CARD_WIDTH: width - 32,
  CARD_HEIGHT: 220,
};

export const GRADIENT_COLORS = [
  ['#FF6B6B', '#FF8E8E'], // Red
  ['#4ECDC4', '#45B7A8'], // Teal
  ['#45AAF2', '#2D98DA'], // Blue
  ['#FF9FF3', '#F368E0'], // Pink
];
