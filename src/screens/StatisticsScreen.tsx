import React from 'react';
import {SafeAreaView, ScrollView, View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Modern Stat Card Component
const StatCard = ({title, children, icon}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Icon name={icon} size={20} color="#3B82F6" />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

// Simplified Progress Bar
const ProgressBar = ({percentage, color = '#3B82F6'}) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, {width: `${Math.min(percentage, 100)}%`, backgroundColor: color}]} />
  </View>
);

// Project Item Component
const ProjectItem = ({project}) => (
  <View style={styles.projectItem}>
    <View style={styles.projectHeader}>
      <Text style={styles.projectName}>{project.name}</Text>
      <View style={[
        styles.scoreBadge,
        {backgroundColor: project.verification_score >= 8 ? '#D1FAE5' : '#FEF3C7'}
      ]}>
        <Text style={[
          styles.scoreText,
          {color: project.verification_score >= 8 ? '#065F46' : '#92400E'}
        ]}>
          {project.verification_score.toFixed(1)}
        </Text>
      </View>
    </View>
    <ProgressBar 
      percentage={(project.verification_score / 10) * 100}
      color={project.verification_score >= 8 ? '#10B981' : '#F59E0B'}
    />
  </View>
);

// Experience Item Component
const ExperienceItem = ({experience}) => (
  <View style={styles.experienceItem}>
    <View style={styles.experienceHeader}>
      <View style={styles.experienceInfo}>
        <Text style={styles.companyName}>{experience.company}</Text>
        <Text style={styles.duration}>{experience.duration}</Text>
      </View>
      <View style={[
        styles.scoreBadge,
        {backgroundColor: experience.score >= 7 ? '#D1FAE5' : '#FEF3C7'}
      ]}>
        <Text style={[
          styles.scoreText,
          {color: experience.score >= 7 ? '#065F46' : '#92400E'}
        ]}>
          {experience.score}
        </Text>
      </View>
    </View>
    <ProgressBar 
      percentage={(experience.score / 10) * 100}
      color={experience.score >= 7 ? '#10B981' : '#F59E0B'}
    />
  </View>
);

// Skill Match Component
const SkillMatch = ({skill, isMatched}) => (
  <View style={styles.skillItem}>
    <View style={styles.skillInfo}>
      <Icon 
        name={isMatched ? 'checkmark-circle' : 'close-circle'} 
        size={16} 
        color={isMatched ? '#10B981' : '#EF4444'} 
      />
      <Text style={styles.skillName}>{skill}</Text>
    </View>
    <Text style={[styles.matchStatus, {color: isMatched ? '#10B981' : '#EF4444'}]}>
      {isMatched ? 'Matched' : 'Not Matched'}
    </Text>
  </View>
);

// Main Component
const ResumeStats = ({route}) => {
  const job = route.params.job;
  const {analysisData} = route.params;
  const {project_verification, profile_match, job_match} = analysisData;

  // Calculate overall verification rate
  const verificationRate = parseFloat(project_verification.summary.verification_rate);
  
  // Format experience data
  const experienceItems = profile_match.results.experience.summary.map(exp => ({
    company: exp.company,
    title: exp.title,
    duration: exp.duration,
    score: exp.match_score.toFixed(1),
  }));

  // Calculate overall experience score
  const overallExperienceScore = experienceItems.reduce((sum, exp) => sum + parseFloat(exp.score), 0) / experienceItems.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resume Analysis</Text>
          <Text style={styles.headerSubtitle}>Comprehensive verification results</Text>
        </View>

        {/* Overall Stats */}
        <View style={styles.overallStats}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{verificationRate}%</Text>
            <Text style={styles.statLabel}>Verification Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{overallExperienceScore.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Experience Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{job_match.required_skills_matched.length}</Text>
            <Text style={styles.statLabel}>Skills Matched</Text>
          </View>
        </View>

        {/* Projects Section */}
        <StatCard title="Project Verification" icon="folder">
          {project_verification.projects.map((project, index) => (
            <ProjectItem key={index} project={project} />
          ))}
        </StatCard>

        {/* Experience Section */}
        <StatCard title="Experience Verification" icon="business">
          {experienceItems.map((exp, index) => (
            <ExperienceItem key={index} experience={exp} />
          ))}
        </StatCard>

        {/* Required Skills Section */}
        <StatCard title="Required Skills" icon="checkmark-circle">
          {job.required_skills.map((skill, index) => {
            const matchedSkill = job_match.required_skills_matched.find(
              m => m.skill.toLowerCase() === skill.toLowerCase(),
            );
            return (
              <SkillMatch 
                key={index} 
                skill={skill} 
                isMatched={!!matchedSkill} 
              />
            );
          })}
        </StatCard>

        {/* Preferred Skills Section */}
        {job.preferred_skills && job.preferred_skills.length > 0 && (
          <StatCard title="Preferred Skills" icon="star">
            {job.preferred_skills.map((skill, index) => {
              const matchedSkill = job_match.preferred_skills_matched.find(
                m => m.skill.toLowerCase() === skill.toLowerCase(),
              );
              return (
                <SkillMatch 
                  key={index} 
                  skill={skill} 
                  isMatched={!!matchedSkill} 
                />
              );
            })}
          </StatCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  overallStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  projectItem: {
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  experienceItem: {
    marginBottom: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  experienceInfo: {
    flex: 1,
    marginRight: 12,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  duration: {
    fontSize: 12,
    color: '#6B7280',
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  skillInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  skillName: {
    fontSize: 14,
    color: '#111827',
    textTransform: 'capitalize',
  },
  matchStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ResumeStats;
