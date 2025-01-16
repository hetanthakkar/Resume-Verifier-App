import React, {useState, useEffect, useCallback} from 'react';
import Svg, {Text, Defs, LinearGradient, Stop} from 'react-native-svg';
import {Text as RNText, View, Platform} from 'react-native';

const GradientText = ({
  text = 'Skill Verify',
  fontSize = 40,
  fontFamily = Platform.OS === 'ios' ? 'System' : 'Roboto',
  horizontalPadding = 10,
  verticalPadding = 15,
  leftMargin = 20,
}) => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [isLayoutMeasured, setIsLayoutMeasured] = useState(false);

  const measureText = useCallback(
    event => {
      const {width, height} = event.nativeEvent.layout;
      const adjustedWidth = Math.ceil(width + horizontalPadding * 2);
      const adjustedHeight = Math.ceil(height + verticalPadding * 2);

      if (
        dimensions.width !== adjustedWidth ||
        dimensions.height !== adjustedHeight
      ) {
        setDimensions({
          width: adjustedWidth,
          height: adjustedHeight,
        });
        setIsLayoutMeasured(true);
      }
    },
    [dimensions, horizontalPadding, verticalPadding],
  );

  useEffect(() => {
    setIsLayoutMeasured(false);
  }, [text, fontSize]);

  return (
    <View
      style={{
        minHeight: fontSize + verticalPadding * 2,
        marginLeft: leftMargin,
        width: dimensions.width || 'auto',
      }}>
      <RNText
        style={{
          fontSize,
          fontWeight: 'bold',
          fontFamily,
          position: 'absolute',
          opacity: 0,
          width: 'auto',
        }}
        onLayout={measureText}>
        {text}
      </RNText>

      {isLayoutMeasured && (
        <Svg
          height={dimensions.height}
          width={dimensions.width}
          style={{marginTop: -verticalPadding / 2}}
          preserveAspectRatio="xMinYMid meet">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#34b8f5" stopOpacity="1" />
              <Stop offset="50%" stopColor="#b95ae5" stopOpacity="1" />
              <Stop offset="100%" stopColor="#fc5d79" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Text
            fill="url(#grad)"
            fontSize={fontSize}
            fontWeight="bold"
            fontFamily={fontFamily}
            x={horizontalPadding}
            y={dimensions.height - verticalPadding}
            textAnchor="start"
            textLength={dimensions.width - horizontalPadding * 2}
            lengthAdjust="spacingAndGlyphs">
            {text}
          </Text>
        </Svg>
      )}
    </View>
  );
};

export default GradientText;
