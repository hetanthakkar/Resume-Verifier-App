import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const mockData = {
  overallScore: 85,
  projectQuality: 8.5,
  githubQuality: 750,
  linkedinMatching: 8.75,
  codeforcesRating: 1800,
  atsMatch: 80,
  education: 3.8,
  ranking: 3,
  technicalSkills: {
    languages: { JavaScript: 0.9, Python: 0.8, Java: 0.7 },
    frameworks: ['React', 'Node.js', 'Django'],
  },
  yearsOfExperience: 5,
  gpa: 3.8,
};

const languageData = [
  { name: 'Rust', proficiency: 0.861 },
  { name: 'TypeScript', proficiency: 0.671 },
  { name: 'Python', proficiency: 0.667 },
  { name: 'Kotlin', proficiency: 0.629 },
];

const InfoButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.infoButton}>
    <Icon name="information-outline" size={20} color="#6200ee" />
  </TouchableOpacity>
);

const showInfo = (message) => {
  Alert.alert('Info', message);
};

const SummaryRoute = () => (
  <ScrollView style={styles.scene}>
    <Text style={styles.headerText}>Summary of Resume</Text>

    <CardWithInfo
      title="Candidate Ranking"
      info="This shows how the candidate ranks compared to others applying for the same job at FAANG companies."
    >
      <Text style={styles.rankingText}>#{mockData.ranking} out of all candidates</Text>
    </CardWithInfo>

    <CardWithInfo
      title="Overall Score"
      info="Overall score based on various factors important for FAANG companies."
    >
      <ProgressBar progress={mockData.overallScore / 100} color="#6200ee" />
      <Text style={styles.scoreText}>{mockData.overallScore}%</Text>
    </CardWithInfo>

    <View style={styles.row}>
      <CardWithInfo
        title="ATS Match"
        info="How well the candidate's resume matches Applicant Tracking System criteria."
        halfCard
      >
        <ProgressBar progress={mockData.atsMatch / 100} color="#6200ee" />
        <Text style={styles.scoreText}>{mockData.atsMatch}%</Text>
      </CardWithInfo>

      <CardWithInfo
        title="Years of Experience"
        info="Total years of relevant professional experience."
        halfCard
      >
        <Text style={styles.scoreText}>{mockData.yearsOfExperience} years</Text>
      </CardWithInfo>
    </View>

    <CardWithInfo
      title="Technical Skills"
      info="Proficiency in various programming languages relevant to FAANG companies."
    >
      {languageData.map((language, index) => (
        <View key={index} style={styles.languageRow}>
          <Text style={styles.languageName}>{language.name}</Text>
          <Progress.Bar
            progress={language.proficiency}
            width={null}
            height={12}
            color="#6200ee"
            unfilledColor="#444"
            borderWidth={0}
            style={styles.progressBar}
          />
          <Text style={styles.percentageText}>
            {(language.proficiency * 100).toFixed(1)}%
          </Text>
        </View>
      ))}
    </CardWithInfo>

    <CardWithInfo
      title="Matched Skills"
      info="Key skills that match the job requirements for FAANG companies."
    >
      <View style={styles.skillsContainer}>
        {mockData.technicalSkills.frameworks.map((skill, index) => (
          <SkillBadge key={index} skill={skill} />
        ))}
        {Object.keys(mockData.technicalSkills.languages).map((language, index) => (
          <SkillBadge key={index} skill={language} />
        ))}
      </View>
    </CardWithInfo>

    <View style={styles.row}>
      <CardWithInfo
        title="GPA"
        info="Grade Point Average from the candidate's highest degree."
        halfCard
      >
        <Text style={styles.scoreText}>{mockData.gpa}</Text>
      </CardWithInfo>

      <CardWithInfo
        title="Project Quality"
        info="Quality of projects based on complexity, innovation, and impact."
        halfCard
      >
        <Text style={styles.scoreText}>{mockData.projectQuality}/10</Text>
      </CardWithInfo>
    </View>

    <View style={styles.row}>
      <CardWithInfo
        title="Codeforces Quality"
        info="Overall Codeforces profile quality based on repositories, commits, and engagement."
        halfCard
      >
        <Text style={styles.scoreText}>{mockData.githubQuality}</Text>
      </CardWithInfo>

      <CardWithInfo
        title="LinkedIn Match"
        info="How well the candidate's LinkedIn profile matches FAANG job requirements."
        halfCard
      >
        <Text style={styles.scoreText}>{mockData.linkedinMatching.toFixed(1)}/10</Text>
      </CardWithInfo>
    </View>

  </ScrollView>
);

const CardWithInfo = ({ title, info, children, halfCard }) => (
  <Card style={[styles.card, halfCard && styles.halfCard]}>
    <Card.Title
      title={title}
      right={() => <InfoButton onPress={() => showInfo(info)} />}
    />
    <Card.Content>{children}</Card.Content>
  </Card>
);

const SkillBadge = ({ skill }) => (
  <View style={styles.skillBadge}>
    <Text style={styles.skillText}>{skill}</Text>
  </View>
);

const RecruiterAnalysisDashboard = () => (
  <View style={{ flex: 1, marginTop: 50 }}>
    <SummaryRoute />
  </View>
);

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  card: {
    margin: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
  },
  halfCard: {
    flex: 1,
    margin: 4,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageName: {
    color: 'black',
    width: 100,
    fontSize: 14,
  },
  progressBar: {
    flex: 1,
    marginRight: 8,
  },
  percentageText: {
    color: 'black',
    fontSize: 14,
    width: 50,
    textAlign: 'right',
  },
  infoButton: {
    padding: 8,
  },
  rankingText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  skillText: {
    fontSize: 14,
    color: '#333',
  },
});

export default RecruiterAnalysisDashboard;
