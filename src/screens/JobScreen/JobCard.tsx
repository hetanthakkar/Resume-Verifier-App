import React, {useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import {
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

interface Job {
  id: number;
  title: string;
  company_name: string;
}

interface JobCardProps {
  job: Job;
  gradientColors: string[];
  onPress: () => void;
}

const {width} = Dimensions.get('window');
const DIMENSIONS = {
  CARD_WIDTH: width - 32,
  CARD_HEIGHT: 220,
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const JobCard: React.FC<JobCardProps> = ({job, gradientColors, onPress}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const copyJobId = () => {
    Clipboard.setString(job.id.toString());
    Alert.alert('Success', 'Job ID copied to clipboard');
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}>
      <Animated.View
        style={[
          {
            height: DIMENSIONS.CARD_HEIGHT,
            width: DIMENSIONS.CARD_WIDTH,
            marginBottom: 20,
            borderRadius: 12,
            overflow: 'hidden',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          {
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.98],
                }),
              },
            ],
          },
        ]}>
        <Svg height={DIMENSIONS.CARD_HEIGHT} width={DIMENSIONS.CARD_WIDTH}>
          <Defs>
            <LinearGradient
              id={`grad-${job.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%">
              <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="1" />
              <Stop
                offset="100%"
                stopColor={gradientColors[1]}
                stopOpacity="1"
              />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#grad-${job.id})`}
            rx="12"
            ry="12"
          />

          {/* Title text split into multiple lines if needed */}
          {job.title
            .split(' ')
            .reduce(
              (acc: JSX.Element[], word: string, i: number, arr: string[]) => {
                const lineLength = 20;
                const currentLine = Math.floor(i / 4);
                const y = DIMENSIONS.CARD_HEIGHT / 2 - 20 + currentLine * 35;

                if (i % 4 === 0) {
                  const lineText = arr.slice(i, i + 4).join(' ');
                  acc.push(
                    <SvgText
                      key={i}
                      fill="white"
                      fontSize="28"
                      fontWeight="bold"
                      x={DIMENSIONS.CARD_WIDTH / 2}
                      y={y}
                      textAnchor="middle">
                      {truncateText(lineText, lineLength)}
                    </SvgText>,
                  );
                }
                return acc;
              },
              [],
            )}
        </Svg>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: 'white',
              fontWeight: '600',
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {truncateText(job.company_name, 30)}
          </Text>
          <TouchableOpacity
            onPress={copyJobId}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
              }}>
              Copy Job ID
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
export default JobCard; 