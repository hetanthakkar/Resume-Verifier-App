import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { Svg, Defs, LinearGradient, Stop, Rect, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = 220;

// Fixed gradient colors
const gradientColors = [
  ['#FF6B6B', '#FF8E8E'], // Red
  ['#4ECDC4', '#45B7A8'], // Teal
  ['#45AAF2', '#2D98DA'], // Blue
  ['#FF9FF3', '#F368E0'], // Pink
];

interface JobCardProps {
  jobId: string;
  jobTitle: string;
  postedDate: string;
  gradientColors: string[];
  onPress: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ jobId, jobTitle, postedDate, gradientColors, onPress }) => {
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

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.98],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[styles.jobCard, animatedStyle]}>
        <Svg height={CARD_HEIGHT} width={CARD_WIDTH}>
          <Defs>
            <LinearGradient id={`grad-${jobId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="1" />
              <Stop offset="100%" stopColor={gradientColors[1]} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#grad-${jobId})`} rx="12" ry="12" />
          <SvgText
            fill="white"
            fontSize="28"
            fontWeight="bold"
            x={CARD_WIDTH / 2}
            y={CARD_HEIGHT / 2 - 20}
            textAnchor="middle"
          >
            {jobTitle}
          </SvgText>
        </Svg>
        <View style={styles.jobDetails}>
          <Text style={styles.jobId}>Job ID: {jobId}</Text>
          <Text style={styles.postedDate}>Posted on {postedDate}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

interface JobPosting {
  id: string;
  title: string;
  date: string;
}

const JobPortals: React.FC = ({ navigation }) => {
  const jobPostings: JobPosting[] = [
    { id: '12345', title: 'Software Engineer', date: '2023-10-01' },
    { id: '67890', title: 'Marketing Specialist', date: '2023-09-25' },
    { id: '24680', title: 'Data Analyst', date: '2023-10-05' },
    { id: '13579', title: 'UX Designer', date: '2023-10-10' },
    { id: '97531', title: 'Product Manager', date: '2023-10-15' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.jobPostingsHeader}>
        <Text style={styles.jobPostingsTitle}>Job Postings</Text>
        <TouchableOpacity 
          style={styles.createJobButton}
          onPress={() => navigation.navigate("CreateJob")}
        >
          <Text style={styles.createJobButtonText}>Create Job</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={jobPostings}
        renderItem={({ item, index }) => (
          <JobCard
            onPress={()=>navigation.navigate("JobTab",{id:item.id,mode:"create"})}
            jobId={item.id}
            jobTitle={item.title}
            postedDate={item.date}
            gradientColors={gradientColors[index % gradientColors.length]}
            // onPress={() => navigation.navigate("JobDetails", { jobId: item.id })}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  jobPostingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  jobPostingsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    // opacity: 0.8
  },
  createJobButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    opacity: 0.8
  },
  createJobButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  jobCard: {
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  jobId: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  postedDate: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
});

export default JobPortals;