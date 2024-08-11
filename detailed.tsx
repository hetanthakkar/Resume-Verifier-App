import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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

const languageData = [
  { name: 'Rust', proficiency: 0.861 },
  { name: 'TypeScript', proficiency: 0.671 },
  { name: 'Python', proficiency: 0.667 },
  { name: 'Kotlin', proficiency: 0.629 },
];

const AccordionCard = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Card.Title 
          title={title} 
          right={() => <Text>{expanded ? '▲' : '▼'}</Text>}
          rightStyle={{ marginRight: 10 }}
        />
      </TouchableOpacity>
      {expanded && <Card.Content>{children}</Card.Content>}
    </Card>
  );
};

const RecruiterAnalysisDashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <AccordionCard title="Overall Score Breakdown">
        <Text style={styles.detailText}>
          Overall Score: {mockData.overallScore}%
        </Text>
        <Text style={styles.explanationText}>
          This score is a weighted average of all factors, with emphasis on
          technical skills, project quality, and GitHub contributions. The
          candidate's score indicates strong potential for FAANG-level
          performance.
        </Text>
      </AccordionCard>

      <AccordionCard title="Technical Skills Analysis">
        {languageData.map((language, index) => (
          <View key={index}>
            <Text style={styles.detailText}>
              {language.name}: {(language.proficiency * 100).toFixed(1)}%
            </Text>
            <Text style={styles.explanationText}>
              {language.name === 'Rust' &&
                'Exceptional proficiency in Rust, a language valued for systems programming and performance-critical applications.'}
              {language.name === 'TypeScript' &&
                'Strong TypeScript skills, crucial for large-scale JavaScript applications common in FAANG companies.'}
              {language.name === 'Python' &&
                'Solid Python skills, essential for data analysis, backend development, and scripting tasks.'}
              {language.name === 'Kotlin' &&
                'Good Kotlin proficiency, valuable for Android development and server-side applications.'}
            </Text>
          </View>
        ))}
      </AccordionCard>

      <AccordionCard title="Experience and Education">
        <Text style={styles.detailText}>
          Years of Experience: {mockData.yearsOfExperience}
        </Text>
        <Text style={styles.explanationText}>
          {mockData.yearsOfExperience} years of experience indicates a mid-level
          developer with substantial practical knowledge. This level of
          experience is typically sufficient for many FAANG positions.
        </Text>
        <Text style={styles.detailText}>GPA: {mockData.gpa}</Text>
        <Text style={styles.explanationText}>
          A GPA of {mockData.gpa} is considered excellent and demonstrates
          strong academic performance. This suggests the candidate has a solid
          theoretical foundation in computer science.
        </Text>
      </AccordionCard>

      <AccordionCard title="Project Quality Analysis">
        <Text style={styles.detailText}>
          Score: {mockData.projectQuality}/10
        </Text>
        <Text style={styles.explanationText}>
          This score is based on the complexity, innovation, and impact of the
          candidate's projects. A score of {mockData.projectQuality}/10
          indicates high-quality work that aligns well with FAANG standards. Key
          factors: clean code architecture, use of modern technologies, and
          solving challenging problems.
        </Text>
      </AccordionCard>

      <AccordionCard title="GitHub Profile Analysis">
        <Text style={styles.detailText}>
          GitHub Quality Score: {mockData.githubQuality.score}
        </Text>
        <Text style={styles.explanationText}>
          This score reflects the overall quality and activity of the GitHub
          profile. Factors considered:
        </Text>
        <Text>
          • Repositories: {mockData.githubQuality.repos} (diverse project
          portfolio)
        </Text>
        <Text>
          • Total Commits: {mockData.githubQuality.commits} (consistent coding
          activity)
        </Text>
        <Text>
          • Forks: {mockData.githubQuality.forks} (project impact and
          collaboration)
        </Text>
        <Text>
          • Followers: {mockData.githubQuality.followers} (community
          recognition)
        </Text>
        <Text style={styles.explanationText}>
          This GitHub profile demonstrates active engagement in open-source and
          personal projects, which is highly valued by FAANG companies.
        </Text>
      </AccordionCard>

      <AccordionCard title="LinkedIn Profile Match">
        <Text style={styles.detailText}>
          Projects Match: {mockData.linkedinMatching.projects}/10
        </Text>
        <Text style={styles.detailText}>
          Experience Match: {mockData.linkedinMatching.experience}/10
        </Text>
        <Text style={styles.explanationText}>
          The LinkedIn profile shows strong alignment with FAANG job
          requirements. The high project match indicates relevant project
          experience, while the experience match suggests a career trajectory
          that fits well with FAANG expectations.
        </Text>
      </AccordionCard>

      <AccordionCard title="Codeforces Rating Analysis">
        <Text style={styles.detailText}>
          Rating: {mockData.codeforcesRating}
        </Text>
        <Text style={styles.explanationText}>
          A Codeforces rating of {mockData.codeforcesRating} is considered very
          good. This demonstrates strong problem-solving skills and algorithmic
          thinking, which are crucial for passing FAANG technical interviews.
        </Text>
      </AccordionCard>

      <AccordionCard title="ATS (Applicant Tracking System) Match">
        <Text style={styles.detailText}>Score: {mockData.atsMatch.score}%</Text>
        <Text style={styles.explanationText}>
          This high ATS match score indicates that the candidate's resume is
          well-optimized for automated screening systems used by FAANG
          companies. It suggests that the resume contains relevant keywords and
          properly formatted information.
        </Text>
        <Text>Areas for improvement:</Text>
        <Text>
          • Broken Links: {mockData.atsMatch.brokenLinks} (should be fixed)
        </Text>
        <Text>
          • Grammar Mistakes: {mockData.atsMatch.grammarMistakes} (minor issues
          to address)
        </Text>
      </AccordionCard>

      <AccordionCard title="Overall Ranking">
        <Text style={styles.detailText}>
          Ranking: #{mockData.ranking} out of all candidates
        </Text>
        <Text style={styles.explanationText}>
          This exceptional ranking places the candidate in the top tier of
          applicants. It reflects a strong combination of technical skills,
          project experience, problem-solving abilities, and a well-prepared
          application. This candidate has a high probability of success in FAANG
          interviews and would likely be a valuable asset to the company.
        </Text>
      </AccordionCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  card: {
    margin: 8,
    marginTop: 15,
  },
  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default RecruiterAnalysisDashboard;