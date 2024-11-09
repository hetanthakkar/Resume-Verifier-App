import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Card } from 'react-native-paper';

const mockData = {
  overallScore: 85,
  projectQuality: 8.5,
  githubQuality: {
    score: 750,
    repos: 15,
    commits: 500,
    forks: 20,
    followers: 100,
  },
  linkedinMatching: {
    projects: 9,
    experience: 8.5,
  },
  codeforcesRating: 1800,
  atsMatch: {
    score: 80,
    brokenLinks: 1,
    grammarMistakes: 3,
  },
  yearsOfExperience: 5,
  gpa: 3.8,
  ranking: 3,
};

const AnalysisCard = ({ title, children }) => (
  <Card style={styles.card}>
    <Card.Title title={title} titleStyle={styles.cardTitle} />
    <Card.Content>{children}</Card.Content>
  </Card>
);

const RecruiterAnalysisDashboard = () => {
  return (
    <ScrollView style={styles.container}>
            <View style={styles.header}>
        <Text style={styles.headerText}>Detailed View</Text>
      </View>
      <AnalysisCard title="Experience Match Analysis">
        <View style={styles.row}>
          <Text style={styles.label}>Years of Experience:</Text>
          <Text style={styles.value}>{mockData.yearsOfExperience}</Text>
        </View>
        <Text style={styles.explanation}>
          {mockData.yearsOfExperience} years indicates a mid-level developer with substantial practical knowledge.
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>GPA:</Text>
          <Text style={styles.value}>{mockData.gpa}</Text>
        </View>
        <Text style={styles.explanation}>
          A GPA of {mockData.gpa} demonstrates strong academic performance and a solid theoretical foundation.
        </Text>
      </AnalysisCard>

      <AnalysisCard title="Project Match Analysis">
        <View style={styles.row}>
          <Text style={styles.label}>Score:</Text>
          <Text style={styles.value}>{mockData.projectQuality}/10</Text>
        </View>
        <Text style={styles.explanation}>
          Indicates high-quality work aligning well with FAANG standards. Key factors: clean code architecture, modern technologies, and challenging problem-solving.
        </Text>
      </AnalysisCard>

      <AnalysisCard title="GitHub Profile Analysis">
        <View style={styles.row}>
          <Text style={styles.label}>GitHub Quality Score:</Text>
          <Text style={styles.value}>{mockData.githubQuality.score}</Text>
        </View>
        <Text style={styles.explanation}>Factors considered:</Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>Repositories: {mockData.githubQuality.repos}</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>Total Commits: {mockData.githubQuality.commits}</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>Forks: {mockData.githubQuality.forks}</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>Followers: {mockData.githubQuality.followers}</Text>
        </View>
        <Text style={styles.explanation}>
          This profile demonstrates active engagement in open-source and personal projects, highly valued by FAANG companies.
        </Text>
      </AnalysisCard>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  
  // Header styles
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 20,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  
  // Card styles
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: 0.25,
  },
  
  // Row layout styles
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  
  // Text styles
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    letterSpacing: 0.15,
  },
  value: {
    fontSize: 16,
    color: '#34495E',
    letterSpacing: 0.15,
  },
  explanation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  
  // List styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingVertical: 2,
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
    color: '#007AFF',
    lineHeight: 20,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
});

export default RecruiterAnalysisDashboard;