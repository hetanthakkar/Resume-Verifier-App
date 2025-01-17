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
import {styles} from './styles';
import {DIMENSIONS} from '../../constants/theme';
import {truncateText} from '../../utils/helper';

interface JobCardProps {
  job: Job;
  gradientColors: string[];
  onPress: () => void;
}

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
          styles.jobCard,
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

        <View style={styles.jobDetails}>
          <Text style={styles.jobInfo} numberOfLines={1} ellipsizeMode="tail">
            {truncateText(job.company_name, 30)}
          </Text>
          <TouchableOpacity onPress={copyJobId} style={styles.copyButton}>
            <Text style={styles.copyButtonText}>Copy Job ID</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
export default JobCard;
