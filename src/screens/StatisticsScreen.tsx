import React from 'react';
import {SafeAreaView, ScrollView, View, Text, StyleSheet} from 'react-native';
import {Surface} from 'react-native-paper';

const SkillListCard = ({title, requiredSkills, matchedSkills}) => (
  <StatCard title={title}>
    {requiredSkills.map((skill, index) => {
      const matchedSkill = matchedSkills.find(
        m => m.skill.toLowerCase() === skill.toLowerCase(),
      );
      return (
        <View key={index} style={styles.skillRow}>
          <Text style={styles.skillName}>{skill}</Text>
          <Text
            style={[
              styles.matchStatus,
              matchedSkill ? styles.matched : styles.unmatched,
            ]}>
            {matchedSkill ? '✓ Match' : '✗ No Match'}
          </Text>
        </View>
      );
    })}
  </StatCard>
);

const StatCard = ({title, children}) => (
  <Surface style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </Surface>
);

const ProgressBar = ({percentage}) => (
  <View style={styles.progressBarContainer}>
    <View
      style={[styles.progressBar, {width: `${Math.min(percentage, 100)}%`}]}
    />
  </View>
);

const StatRow = ({label, value}) => (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const MatchList = ({items}) => (
  <View style={styles.matchList}>
    {items.map((item, index) => (
      <View key={index} style={styles.matchItem}>
        <Text style={styles.skillName}>{item.skill}</Text>
        <Text style={styles.skillProject}>{item.project}</Text>
        <Text style={styles.skillDescription}>{item.description}</Text>
      </View>
    ))}
  </View>
);

const ResumeStats = ({route}) => {
  const job = route.params.job;
  const {analysisData} = route.params;
  console.log('analysisData', analysisData);
  const data = analysisData;
  const {project_verification, profile_match, job_match} = data;

  // Format experience data
  const experienceItems = profile_match.results.experience.summary.map(exp => ({
    company: exp.company,
    title: exp.title,
    duration: exp.duration,
    score: exp.match_score.toFixed(1),
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Resume Analysis</Text>

        <StatCard title="Projects">
          {project_verification.projects.map((project, index) => (
            <View key={index} style={styles.projectItem}>
              <Text style={styles.projectName}>{project.name}</Text>
              <View style={styles.scoreContainer}>
                <ProgressBar
                  percentage={(project.verification_score / 10) * 100}
                />
                <Text style={styles.scoreText}>
                  {project.verification_score.toFixed(1)}
                </Text>
              </View>
            </View>
          ))}
        </StatCard>

        <StatCard title="Experience Verification">
          {experienceItems.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <Text style={styles.companyName}>{exp.company}</Text>
                <Text style={styles.duration}>{exp.duration}</Text>
              </View>
              <View style={styles.scoreContainer}>
                <ProgressBar percentage={(exp.score / 10) * 100} />
                <Text style={styles.scoreText}>{exp.score}</Text>
              </View>
            </View>
          ))}
        </StatCard>

        <SkillListCard
          title="Required Skills"
          requiredSkills={job.required_skills}
          matchedSkills={job_match.required_skills_matched}
        />

        <SkillListCard
          title="Preferred Skills"
          requiredSkills={job.preferred_skills}
          matchedSkills={job_match.preferred_skills_matched}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... existing styles remain the same ...
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollView: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 16,
  },
  // New styles for job match section
  jobMatchSummary: {
    gap: 12,
  },
  jobMatchDetail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  matchList: {
    gap: 16,
  },
  matchItem: {
    gap: 4,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    textTransform: 'capitalize',
  },
  skillProject: {
    fontSize: 14,
    color: '#34495e',
    fontWeight: '500',
  },
  skillDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  // ... rest of the existing styles ...
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  projectItem: {
    marginBottom: 16,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  experienceItem: {
    marginBottom: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  duration: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498db',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    width: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollView: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 16,
  },
  statRow: {
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  statDetail: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 4,
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  matchStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  matched: {
    color: '#2ecc71',
  },
  unmatched: {
    color: '#e74c3c',
  },
});

export default ResumeStats;
