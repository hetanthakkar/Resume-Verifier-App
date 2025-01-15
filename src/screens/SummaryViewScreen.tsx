import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import {Card} from 'react-native-paper';
import data from '../static_data/data';
import job from '../static_data/job';
const MatchMetricsBar = ({label, value}) => (
  <View style={styles.metricBar}>
    <View style={styles.metricLabelContainer}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value.toFixed(1)}%</Text>
    </View>
    <View style={styles.progressBarBackground}>
      <View
        style={[
          styles.progressBarFill,
          {
            width: `${value}%`,
            backgroundColor:
              value >= 70 ? '#4CAF50' : value >= 40 ? '#FFA000' : '#F44336',
          },
        ]}
      />
    </View>
  </View>
);

const JobDetailsHeader = ({job}) => {
  return (
    <View style={styles.header}>
      <View style={styles.jobTitleSection}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.companyName}>{job.company}</Text>
        <Text style={styles.location}>{job.location}</Text>
      </View>

      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Experience</Text>
        <Text style={styles.detailValue}>{job.required_experience}</Text>
      </View>

      <View style={styles.skillsSection}>
        <View style={styles.skillGroup}>
          <Text style={styles.skillLabel}>Required Skills</Text>
          <View style={styles.skillTags}>
            {job.required_skills.map((skill, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const RequirementCard = ({title, isMatch, justification}) => (
  <Card style={styles.requirementCard}>
    <View style={styles.requirementHeader}>
      <Text style={styles.requirementTitle}>{title}</Text>
      <View
        style={[
          styles.requirementBadge,
          {backgroundColor: isMatch ? '#4CAF50' : '#F44336'},
        ]}>
        <Text style={styles.requirementBadgeText}>
          {isMatch ? 'Met' : 'Not Met'}
        </Text>
      </View>
    </View>
    <Text style={styles.requirementJustification}>{justification}</Text>
  </Card>
);
const SkillMatchCard = ({skill, project, description}) => (
  <Card style={styles.skillCard}>
    <Text style={styles.skillName}>{skill}</Text>
    <Text style={styles.skillProject}>{project}</Text>
    <Text style={styles.skillDescription}>{description}</Text>
  </Card>
);

// New Job Match Tab component
const JobMatchTab = ({jobMatch}) => {
  return (
    <ScrollView style={styles.tabContent}>
      <View style={styles.requirementsSection}>
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

      <View style={styles.skillsSection}>
        <Text style={styles.sectionTitle}>Required Skills</Text>
        {jobMatch.required_skills_matched.map((skill, index) => (
          <SkillMatchCard key={`req-${index}`} {...skill} />
        ))}
      </View>

      <View style={styles.skillsSection}>
        <Text style={styles.sectionTitle}>Preferred Skills</Text>
        {jobMatch.preferred_skills_matched.map((skill, index) => (
          <SkillMatchCard key={`pref-${index}`} {...skill} />
        ))}
      </View>
    </ScrollView>
  );
};
const ExperienceCard = ({experience, detailedMetrics}) => (
  <Card style={styles.experienceCard}>
    <Text style={styles.companyName}>{experience.company}</Text>
    <Text style={styles.jobTitle}>{experience.title}</Text>
    <Text style={styles.duration}>{experience.duration}</Text>

    <View style={styles.metricsContainer}>
      <Text style={styles.metricsTitle}>Match Metrics</Text>
      <View style={styles.overallScoreContainer}>
        <Text style={styles.overallScoreLabel}>Overall Match Score</Text>
        <Text
          style={[
            styles.overallScoreValue,
            {
              color:
                detailedMetrics.overall_score >= 7
                  ? '#4CAF50'
                  : detailedMetrics.overall_score >= 5
                  ? '#FFA000'
                  : '#F44336',
            },
          ]}>
          {detailedMetrics.overall_score.toFixed(2)}
        </Text>
      </View>

      <View style={styles.detailedMetrics}>
        <MatchMetricsBar
          label="Company Match"
          value={detailedMetrics.detailed_scores.company_match}
        />
        <MatchMetricsBar
          label="Title Match"
          value={detailedMetrics.detailed_scores.title_match}
        />
        <MatchMetricsBar
          label="Date Match"
          value={detailedMetrics.detailed_scores.date_match}
        />
        <MatchMetricsBar
          label="Location Match"
          value={detailedMetrics.detailed_scores.location_match}
        />
        <MatchMetricsBar
          label="Responsibilities"
          value={detailedMetrics.detailed_scores.responsibilities_match}
        />
      </View>
    </View>
  </Card>
);

const ProjectCard = ({project}) => (
  <Card style={styles.projectCard}>
    <View style={styles.projectHeader}>
      <View style={styles.projectTitleContainer}>
        <Text style={styles.projectName}>{project.name}</Text>
        <Text style={styles.projectUrl}>{project.url}</Text>
      </View>
      <View style={styles.projectScoreBadge}>
        <Text style={styles.projectScoreText}>
          {project.verification_score.toFixed(1)}
        </Text>
      </View>
    </View>

    <View style={styles.projectStatusContainer}>
      <Text style={styles.projectStatusLabel}>Status:</Text>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              project.status === 'Verified' ? '#E8F5E9' : '#FFF3E0',
          },
        ]}>
        <Text
          style={[
            styles.projectStatusValue,
            {color: project.status === 'Verified' ? '#2E7D32' : '#EF6C00'},
          ]}>
          {project.status}
        </Text>
      </View>
    </View>

    {project.details.match_justification && (
      <Text style={styles.matchJustification}>
        {project.details.match_justification}
      </Text>
    )}

    {project.details?.repository_statistics?.languages &&
      Object.entries(project.details.repository_statistics.languages).length >
        0 && (
        <View style={styles.languagesContainer}>
          <Text style={styles.languagesTitle}>Technologies Used</Text>
          <View style={styles.languages}>
            {Object.entries(
              project.details.repository_statistics.languages,
            ).map(([lang, bytes]) => (
              <View key={lang} style={styles.languageItem}>
                <Text style={styles.languageName}>{lang}</Text>
                <Text style={styles.languageBytes}>
                  {(bytes / 1024).toFixed(1)}KB
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
  </Card>
);

const ProjectsTab = ({projectVerification}) => {
  return (
    <ScrollView style={styles.tabContent}>
      {projectVerification.projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </ScrollView>
  );
};

const ExperienceTab = ({profileMatch}) => {
  return (
    <ScrollView style={styles.tabContent}>
      {profileMatch.results.experience.detailed.map((exp, index) => (
        <ExperienceCard
          key={index}
          experience={{
            company: exp.resume_data.company_name,
            title: exp.resume_data.job_title,
            duration: `${exp.resume_data.start_date} - ${exp.resume_data.end_date}`,
          }}
          detailedMetrics={exp.match_metrics}
        />
      ))}
    </ScrollView>
  );
};

const RecruiterAnalysisDashboard = ({route}) => {
  const layout = useWindowDimensions();
  const {analysisData} = route.params;
  const data = analysisData;
  const {project_verification, profile_match, job_match} = data;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'job_match',
      title: 'Job Match',
      score: jobMatch => {
        const reqCount = job_match.required_skills_matched.length;
        const prefCount = job_match.preferred_skills_matched.length;
        const requirementScore =
          (job_match.experience_match.meets_requirement ? 1 : 0) +
          (job_match.education_match.meets_requirement ? 1 : 0);
        return (
          ((reqCount * 3 + prefCount + requirementScore * 2) /
            (3 * reqCount + prefCount + 4)) *
          10
        );
      },
    },
    {
      key: 'projects',
      title: 'Projects',
      score:
        project_verification.summary.verification_rate === '100.0%' ? 10 : 7,
    },
    {
      key: 'experience',
      title: 'Experience',
      score: profile_match.results.overall_scores.experience_score,
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
  const getScoreColor = score => {
    if (score >= 8) return '#4CAF50';
    if (score >= 6) return '#FFA000';
    return '#F44336';
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      renderLabel={({route, focused}) => (
        <View style={styles.tabLabel}>
          <Text style={[styles.tabText, focused && styles.tabTextFocused]}>
            {route.title}
          </Text>
          <View
            style={[
              styles.scoreChip,
              {
                backgroundColor: getScoreColor(
                  typeof route.score === 'function'
                    ? route.score(job_match)
                    : route.score,
                ),
              },
            ]}>
            <Text style={styles.scoreText}>
              {(typeof route.score === 'function'
                ? route.score(job_match)
                : route.score
              ).toFixed(1)}
            </Text>
          </View>
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  overallScore: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    minWidth: 120,
  },
  overallScoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  overallScoreLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tabBar: {
    backgroundColor: '#FFF',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  indicator: {
    backgroundColor: '#2196F3',
    height: 3,
  },
  tabLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  tabTextFocused: {
    color: '#2196F3',
  },
  scoreChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  projectCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  projectUrl: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 12,
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  languages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  languageItem: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4,
  },
  languageName: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  languageBytes: {
    fontSize: 12,
    color: '#666',
  },
  experienceCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  metricsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  overallScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  overallScoreLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailedMetrics: {
    gap: 12,
  },
  metricBar: {
    gap: 4,
  },
  metricLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  projectSummary: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  requirementsSection: {
    gap: 12,
    marginBottom: 24,
  },
  skillsSection: {
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  requirementCard: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
  },
  requirementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  requirementBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  requirementBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  requirementJustification: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  skillCard: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  skillProject: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  skillDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  projectCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  projectTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  projectUrl: {
    fontSize: 14,
    color: '#2196F3',
  },
  projectScoreBadge: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectScoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  projectStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  projectStatusLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  projectStatusValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  matchJustification: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  languagesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  languagesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  languages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageItem: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 6,
    alignItems: 'center',
  },
  languageName: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  languageBytes: {
    fontSize: 13,
    color: '#666',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  jobTitleSection: {
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 18,
    color: '#2196F3',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  jobDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  skillsSection: {
    marginTop: 8,
  },
  skillGroup: {
    marginBottom: 12,
  },
  skillLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#1976D2',
  },
});

export default RecruiterAnalysisDashboard;
