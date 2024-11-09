import React from 'react';
import Svg, { Text, Defs, LinearGradient, Stop } from 'react-native-svg';

const GradientText = (props) => {
  return (
    <Svg height="45" width="200">
      <Defs>
        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#34b8f5" stopOpacity="1" />
          <Stop offset="50%" stopColor="#b95ae5" stopOpacity="1" />
          <Stop offset="100%" stopColor="#fc5d79" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Text
        fill="url(#grad)"
        fontSize="40"
        fontWeight="bold"
        x="0"
        y="40"
      >
        {props.text||"Welcome"}
      </Text>
    </Svg>
  );
};

export default GradientText;
