import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';

// Modern Score Card Component
const ScoreCard = ({title, score, color, subtitle}) => (
  <View style={[styles.scoreCard, {borderLeftColor: color}]}>
    <Text style={styles.scoreCardTitle}>{title}</Text>
    <Text style={[styles.scoreCardValue, {color}]}>{score}</Text>
    {subtitle && <Text style={styles.scoreCardSubtitle}>{subtitle}</Text>}
  </View>
);

// Simplified Requirement Card
const RequirementCard = ({title, isMatch, justification}) => (
  <View style={styles.requirementCard}>
    <View style={styles.requirementHeader}>
      <Icon 
        name={isMatch ? 'checkmark-circle' : 'close-circle'} 
        size={20} 
        color={isMatch ? '#10B981' : '#EF4444'} 
      />
      <Text style={styles.requirementTitle}>{title}</Text>
    </View>
    <Text style={styles.requirementText}>{justification}</Text>
  </View>
);

// Simplified Skill Card
const SkillCard = ({skill, project, description}) => (
  <View style={styles.skillCard}>
    <View style={styles.skillHeader}>
      <Text style={styles.skillName}>{skill}</Text>
      <View style={styles.projectBadge}>
        <Text style={styles.projectBadgeText}>{project}</Text>
      </View>
    </View>
    <Text style={styles.skillDescription}>{description}</Text>
  </View>
);

// Job Match Tab - Simplified
const JobMatchTab = ({jobMatch}) => {
  const overallScore = ((jobMatch.required_skills_matched.length * 3 + 
    jobMatch.preferred_skills_matched.length + 
    (jobMatch.experience_match.meets_requirement ? 1 : 0) * 2 + 
    (jobMatch.education_match.meets_requirement ? 1 : 0) * 2) / 
    (3 * jobMatch.required_skills_matched.length + 
    jobMatch.preferred_skills_matched.length + 4)) * 10;

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Overall Score */}
      <View style={styles.overallScoreSection}>
        <Text style={styles.sectionTitle}>Overall Match</Text>
        <View style={styles.scoreGrid}>
          <ScoreCard 
            title="Match Score" 
            score={`${overallScore.toFixed(1)}/10`}
            color="#3B82F6"
            subtitle="Based on skills & requirements"
          />
          <ScoreCard 
            title="Skills Matched" 
            score={`${jobMatch.required_skills_matched.length}/${jobMatch.required_skills_matched.length + jobMatch.preferred_skills_matched.length}`}
            color="#10B981"
            subtitle="Required & preferred"
          />
        </View>
      </View>

      {/* Core Requirements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Requirements</Text>
        <RequirementCard
          title="Experience"
          isMatch={jobMatch.experience_match.meets_requirement}
          justification={jobMatch.experience_match.justification}
        />
        <RequirementCard
          title="Education"
          isMatch={jobMatch.education_match.meets_requirement}
          justification={jobMatch.education_match.justification}
        />
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Skills</Text>
        {jobMatch.required_skills_matched.map((skill, index) => (
          <SkillCard key={`req-${index}`} {...skill} />
        ))}
      </View>

      {jobMatch.preferred_skills_matched.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Skills</Text>
          {jobMatch.preferred_skills_matched.map((skill, index) => (
            <SkillCard key={`pref-${index}`} {...skill} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Projects Tab - Simplified
const ProjectsTab = ({projectVerification}) => {
  const verificationRate = parseFloat(projectVerification.summary.verification_rate);
  
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Summary Stats */}
      <View style={styles.overallScoreSection}>
        <Text style={styles.sectionTitle}>Project Verification</Text>
        <View style={styles.scoreGrid}>
          <ScoreCard 
            title="Verification Rate" 
            score={`${verificationRate}%`}
            color={verificationRate >= 80 ? '#10B981' : verificationRate >= 60 ? '#F59E0B' : '#EF4444'}
            subtitle="Projects verified"
          />
          <ScoreCard 
            title="Total Projects" 
            score={projectVerification.projects.length}
            color="#6B7280"
            subtitle="Portfolio items"
          />
        </View>
      </View>

      {/* Projects List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Details</Text>
        {projectVerification.projects.map((project, index) => (
          <View key={index} style={styles.projectCard}>
            <View style={styles.projectHeader}>
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectUrl}>{project.url}</Text>
              </View>
              <View style={[
                styles.verificationBadge,
                {backgroundColor: project.verification_score >= 8 ? '#D1FAE5' : '#FEF3C7'}
              ]}>
                <Text style={[
                  styles.verificationScore,
                  {color: project.verification_score >= 8 ? '#065F46' : '#92400E'}
                ]}>
                  {project.verification_score.toFixed(1)}
                </Text>
              </View>
            </View>
            
            <View style={styles.projectStatus}>
              <Icon 
                name={project.status === 'Verified' ? 'shield-checkmark' : 'time'} 
                size={16} 
                color={project.status === 'Verified' ? '#10B981' : '#F59E0B'} 
              />
              <Text style={styles.projectStatusText}>{project.status}</Text>
            </View>

            {project.languages && project.languages.length > 0 && (
              <View style={styles.languagesContainer}>
                <Text style={styles.languagesTitle}>Technologies:</Text>
                <View style={styles.languagesList}>
                  {project.languages.slice(0, 5).map((lang, idx) => (
                    <View key={idx} style={styles.languageTag}>
                      <Text style={styles.languageText}>{lang.name}</Text>
                    </View>
                  ))}
                  {project.languages.length > 5 && (
                    <Text style={styles.moreLanguages}>+{project.languages.length - 5} more</Text>
                  )}
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Experience Tab - Simplified
const ExperienceTab = ({profileMatch}) => {
  const experienceScore = profileMatch.results.overall_scores.experience_score;
  
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Overall Score */}
      <View style={styles.overallScoreSection}>
        <Text style={styles.sectionTitle}>Experience Analysis</Text>
        <View style={styles.scoreGrid}>
          <ScoreCard 
            title="Experience Score" 
            score={`${experienceScore.toFixed(1)}/10`}
            color={experienceScore >= 7 ? '#10B981' : experienceScore >= 5 ? '#F59E0B' : '#EF4444'}
            subtitle="Based on verification"
          />
          <ScoreCard 
            title="Companies" 
            score={profileMatch.results.experience.summary.length}
            color="#6B7280"
            subtitle="Work history"
          />
        </View>
      </View>

      {/* Experience Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work History</Text>
        {profileMatch.results.experience.summary.map((experience, index) => (
          <View key={index} style={styles.experienceCard}>
            <View style={styles.experienceHeader}>
              <View style={styles.experienceInfo}>
                <Text style={styles.companyName}>{experience.company}</Text>
                <Text style={styles.jobTitle}>{experience.title}</Text>
                <Text style={styles.duration}>{experience.duration}</Text>
              </View>
              <View style={[
                styles.matchScoreBadge,
                {backgroundColor: experience.match_score >= 7 ? '#D1FAE5' : '#FEF3C7'}
              ]}>
                <Text style={[
                  styles.matchScoreText,
                  {color: experience.match_score >= 7 ? '#065F46' : '#92400E'}
                ]}>
                  {experience.match_score.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Main Component
const RecruiterAnalysisDashboard = ({route}) => {
  const layout = useWindowDimensions();
  const {analysisData} = route.params;
  const {project_verification, profile_match, job_match} = analysisData;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'job_match',
      title: 'Job Match',
      icon: 'briefcase',
    },
    {
      key: 'projects',
      title: 'Projects',
      icon: 'folder',
    },
    {
      key: 'experience',
      title: 'Experience',
      icon: 'business',
    },
  ]);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'job_match':
        return <JobMatchTab jobMatch={job_match} />;
      case 'projects':
        return <ProjectsTab projectVerification={project_verification} />;
      case 'experience':
        return <ExperienceTab profileMatch={profile_match} />;
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      renderLabel={({route, focused}) => (
        <View style={styles.tabLabel}>
          <Icon 
            name={route.icon} 
            size={18} 
            color={focused ? '#3B82F6' : '#9CA3AF'} 
          />
          <Text style={[styles.tabText, focused && styles.tabTextFocused]}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  indicator: {
    backgroundColor: '#3B82F6',
    height: 3,
  },
  tabLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  tabTextFocused: {
    color: '#3B82F6',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  overallScoreSection: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  scoreGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scoreCardTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  scoreCardValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  scoreCardSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  requirementCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  requirementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  requirementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  requirementText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  skillCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
  },
  projectBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  projectBadgeText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  skillDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
    marginRight: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  projectUrl: {
    fontSize: 14,
    color: '#3B82F6',
  },
  verificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  verificationScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  projectStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  projectStatusText: {
    fontSize: 14,
    color: '#6B7280',
  },
  languagesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  languagesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  languagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  languageTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  languageText: {
    fontSize: 12,
    color: '#374151',
  },
  moreLanguages: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  experienceCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  experienceInfo: {
    flex: 1,
    marginRight: 12,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  duration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  matchScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  matchScoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RecruiterAnalysisDashboard;
