import React from 'react';
import Svg, { Text, Defs, LinearGradient, Stop } from 'react-native-svg';

// Define the base colors array
const baseColors = [
//   { r: 255, g: 59, b: 48 },   // Orange
//   { r: 255, g: 204, b: 0 },   // Yellow
//   { r: 0, g: 199, b: 190 },   // Teal
//   { r: 48, g: 176, b: 199 },  // Light Blue
  { r: 50, g: 173, b: 230 },  // Blue
//   { r: 88, g: 86, b: 214 },   // Purple
];

// Function to blend a color with grey
const blendWithGrey = (color, greyRatio = 0.5) => {
  const grey = { r: 128, g: 128, b: 128 }; // Standard grey color
  return {
    r: Math.round(color.r * (1 - greyRatio) + grey.r * greyRatio),
    g: Math.round(color.g * (1 - greyRatio) + grey.g * greyRatio),
    b: Math.round(color.b * (1 - greyRatio) + grey.b * greyRatio),
  };
};

// Convert RGB color object to a hex color string
const rgbToHex = ({ r, g, b }) => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

const GradientText = (props) => {
  // Create gradient stops with greyish tones
  const gradientStops = baseColors.map((color, index) => (
    <Stop
      key={index}
      offset={`${(index / (baseColors.length - 1)) * 100}%`}
      stopColor={rgbToHex(blendWithGrey(color, 0.3))}
      stopOpacity="1"
    />
  ));

  return (
    <Svg height="45" width="200">
      <Defs>
        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          {gradientStops}
        </LinearGradient>
      </Defs>
      <Text
        fill="url(#grad)"
        fontSize="30"
        fontWeight="bold"
        x="0"
        y="40"
      >
        {props.text || "Job Postings"}
      </Text>
    </Svg>
  );
};

export default GradientText;
