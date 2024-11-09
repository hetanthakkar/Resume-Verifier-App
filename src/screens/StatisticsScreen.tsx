import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, ProgressBar, Tooltip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const dummyData = {
  name: "John Doe",
  githubMetrics: {
    repositories: 25,
    linesOfCode: 150000
  },
  experience: 5,
  technicalSkills: [
    { name: "JavaScript", proficiency: 0.9 },
    { name: "Python", proficiency: 0.85 },
    { name: "React Native", proficiency: 0.8 },
    { name: "Node.js", proficiency: 0.75 },
    { name: "SQL", proficiency: 0.7 }
  ],
  projectQuality: 8.5,
  githubQuality: 750,
  linkedinProjectMatch: 8.5,
  linkedinExperienceMatch: 9.0,
  jobMatch: 8,
};

const InfoButton = ({ info }) => (
  <Tooltip content={<Text>{info}</Text>}>
    <TouchableOpacity style={styles.infoButton}>
      <Icon name="information-outline" size={20} color="#3498db" />
    </TouchableOpacity>
  </Tooltip>
);

const CardWithInfo = ({ title, info, icon, children }) => (
  <Card style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardTitleContainer}>
        <Icon name={icon} size={24} color="#3498db" style={styles.cardIcon} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <InfoButton info={info} />
    </View>
    <Card.Content>{children}</Card.Content>
  </Card>
);

const ResumeVerificationDashboard = () => (
  <LinearGradient colors={['#f5f7fa', '#e8ecf1']} style={styles.container}>
    <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Resume Analysis</Text>
      </View>

      <CardWithInfo
        title="Years of Experience"
        info="Total years of relevant professional experience."
        icon="briefcase-outline"
      >
        <Text style={styles.scoreText}>{dummyData.experience} years</Text>
      </CardWithInfo>

      <CardWithInfo
        title="Technical Skills"
        info="Proficiency in various programming languages based on GitHub activity."
        icon="code-tags"
      >
        {dummyData.technicalSkills.map((skill, index) => (
          <View key={index} style={styles.skillRow}>
            <Text style={styles.skillName}>{skill.name}</Text>
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={skill.proficiency}
                color="#3498db"
                style={styles.progressBar}
              />
            </View>
            <Text style={styles.percentageText}>
              {(skill.proficiency * 100).toFixed(0)}%
            </Text>
          </View>
        ))}
      </CardWithInfo>

      <CardWithInfo
        title="GitHub Metrics"
        info="Key metrics from the candidate's GitHub profile."
        icon="github"
      >
        <View style={styles.githubMetrics}>
          <View style={styles.metricItem}>
            <View style={styles.metricIconContainer}>
              <Icon name="code-braces" size={24} color="#3498db" />
            </View>
            <Text style={styles.metricValue}>{dummyData.githubMetrics.repositories}</Text>
            <Text style={styles.metricLabel}>Repositories</Text>
          </View>
          <View style={styles.metricItem}>
            <View style={styles.metricIconContainer}>
              <Icon name="code-tags" size={24} color="#3498db" />
            </View>
            <Text style={styles.metricValue}>
              {dummyData.githubMetrics.linesOfCode.toLocaleString()}
            </Text>
            <Text style={styles.metricLabel}>Lines of Code</Text>
          </View>
        </View>
      </CardWithInfo>

      <CardWithInfo
        title="Project Accuracy Match"
        info="How well the candidate's LinkedIn projects match the job requirements."
        icon="laptop"
      >
        <ProgressBar
          progress={dummyData.linkedinProjectMatch / 10}
          color="#3498db"
          style={styles.linkedinMatchBar}
        />
        <Text style={styles.matchText}>{dummyData.linkedinProjectMatch}/10</Text>
      </CardWithInfo>

      <CardWithInfo
        title="LinkedIn Experience Match"
        info="How well the candidate's LinkedIn experience matches the job requirements."
        icon="linkedin"
      >
        <ProgressBar
          progress={dummyData.linkedinExperienceMatch / 10}
          color="#3498db"
          style={styles.linkedinMatchBar}
        />
        <Text style={styles.matchText}>{dummyData.linkedinExperienceMatch}/10</Text>
      </CardWithInfo>

      <CardWithInfo
        title="Percentage Match with the Job"
        info="How well the candidate's resume matches the job requirements."
        icon="file"
      >
        <ProgressBar
          progress={dummyData.jobMatch / 10}
          color="#3498db"
          style={styles.linkedinMatchBar}
        />
        <Text style={styles.matchText}>{dummyData.jobMatch}/10</Text>
      </CardWithInfo>
    </ScrollView>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 20
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    width: 100,
    fontSize: 14,
    color: '#2c3e50',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  percentageText: {
    width: 50,
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'right',
  },
  githubMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  metricItem: {
    alignItems: 'center',
    width: '45%',
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 5,
  },
  metricLabel: {
    fontSize: 14,
    color: '#34495e',
    marginTop: 2,
  },
  infoButton: {
    padding: 8,
  },
  linkedinMatchBar: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  matchText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

export default ResumeVerificationDashboard;