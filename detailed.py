import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Card } from 'react-native-paper';
import { ProgressBar } from 'react-native-paper';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  education: {
    cgpa: 3.8,
  },
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
    <Card style={styles.card}>
      <Card.Title
        title="Candidate Ranking"
        right={() => (
          <InfoButton
            onPress={() =>
              showInfo(
                'This shows how the candidate ranks compared to others applying for the same job at FAANG companies.'
              )
            }
          />
        )}
      />
      <Card.Content>
        <Text style={styles.rankingText}>
          #{mockData.ranking} out of all candidates
        </Text>
      </Card.Content>
    </Card>

    <Card style={styles.card}>
      <Card.Title
        title="Overall Score"
        right={() => (
          <InfoButton
            onPress={() =>
              showInfo(
                'Overall score based on various factors important for FAANG companies.'
              )
            }
          />
        )}
      />
      <Card.Content>
        <ProgressBar progress={mockData.overallScore / 100} color="#6200ee" />
        <Text style={styles.scoreText}>{mockData.overallScore}%</Text>
      </Card.Content>
    </Card>

    <View style={styles.row}>
      <Card style={styles.halfCard}>
        <Card.Title
          title="ATS Match"
          titleStyle={styles.smallTitle}
          right={() => (
            <InfoButton
              onPress={() =>
                showInfo(
                  "How well the candidate's resume matches Applicant Tracking System criteria."
                )
              }
            />
          )}
        />
        <Card.Content>
          <Text style={styles.scoreText}>{mockData.atsMatch.score}%</Text>
        </Card.Content>
      </Card>
    </View>
    <Card style={styles.card}>
      <Card.Title
        title="Technical Skills"
        right={() => (
          <InfoButton
            onPress={() =>
              showInfo(
                'Proficiency in various programming languages relevant to FAANG companies.'
              )
            }
          />
        )}
      />
      <Card.Content>
        {languageData.map((language, index) => (
          <View key={index} style={styles.languageRow}>
            <Text style={styles.languageName}>{language.name}</Text>
            <View style={styles.progressContainer}>
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
          </View>
        ))}
      </Card.Content>
    </Card>

    <View style={styles.row}>
      <Card style={styles.halfCard}>
        <Card.Title
          title="Years of Experience"
          titleStyle={styles.smallTitle}
          right={() => (
            <InfoButton
              onPress={() =>
                showInfo('Total years of relevant professional experience.')
              }
            />
          )}
        />
        <Card.Content>
          <Text style={styles.scoreText}>
            {mockData.yearsOfExperience} years
          </Text>
        </Card.Content>
      </Card>
      <Card style={styles.halfCard}>
        <Card.Title
          title="GPA"
          titleStyle={styles.smallTitle}
          right={() => (
            <InfoButton
              onPress={() =>
                showInfo(
                  "Grade Point Average from the candidate's highest degree."
                )
              }
            />
          )}
        />
        <Card.Content>
          <Text style={styles.scoreText}>{mockData.gpa}</Text>
        </Card.Content>
      </Card>
    </View>

    <View style={styles.row}>
      <Card style={styles.halfCard}>
        <Card.Title
          title="Project Quality"
          titleStyle={styles.smallTitle}
          right={() => (
            <InfoButton
              onPress={() =>
                showInfo(
                  'Quality of projects based on complexity, innovation, and impact.'
                )
              }
            />
          )}
        />
        <Card.Content>
          <Text style={styles.scoreText}>{mockData.projectQuality}/10</Text>
        </Card.Content>
      </Card>
      <Card style={styles.halfCard}>
        <Card.Title
          title="GitHub Quality"
          titleStyle={styles.smallTitle}
          right={() => (
            <InfoButton
              onPress={() =>
                showInfo(
                  'Overall GitHub profile quality based on repositories, commits, and engagement.'
                )
              }
            />
          )}
        />
        <Card.Content>
          <Text style={styles.scoreText}>{mockData.githubQuality.score}</Text>
        </Card.Content>
      </Card>
    </View>

    <View style={styles.row}>
      <Card style={styles.halfCard}>
        <Card.Title
          title="LinkedIn Match"
          titleStyle={styles.smallTitle}
          right={() => (
            <InfoButton
              onPress={() =>
                showInfo(
                  "How well the candidate's LinkedIn profile matches FAANG job requirements."
                )
              }
            />
          )}
        />
        <Card.Content>
          <Text style={styles.scoreText}>
            {(
              (mockData.linkedinMatching.projects +
                mockData.linkedinMatching.experience) /
              2
            ).toFixed(1)}
            /10
          </Text>
        </Card.Content>
      </Card>
      <Card style={styles.halfCard}>
        <Card.Title
          title="Codeforces"
          titleStyle={styles.smallTitle}
          right={() => (
            <InfoButton
              onPress={() =>
                showInfo('Codeforces rating indicating problem-solving skills.')
              }
            />
          )}
        />
        <Card.Content>
          <Text style={styles.scoreText}>{mockData.codeforcesRating}</Text>
        </Card.Content>
      </Card>
    </View>
  </ScrollView>
);

const DetailedRoute = () => (
  <ScrollView style={styles.scene}>
    <Card style={styles.card}>
      <Card.Title title="Overall Score Breakdown" />
      <Card.Content>
        <Text style={styles.detailText}>
          Overall Score: {mockData.overallScore}%
        </Text>
        <Text style={styles.explanationText}>
          This score is a weighted average of all factors, with emphasis on
          technical skills, project quality, and GitHub contributions. The
          candidate's score indicates strong potential for FAANG-level
          performance.
        </Text>
      </Card.Content>
    </Card>

    <Card style={styles.card}>
      <Card.Title title="Technical Skills Analysis" />
      <Card.Content>
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
      </Card.Content>
    </Card>

    <Card style={styles.card}>
      <Card.Title title="Experience and Education" />
      <Card.Content>
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
      </Card.Content>
    </Card>

    <Card style={styles.card}>
      <Card.Title title="Project Quality Analysis" />
      <Card.Content>
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
      </Card.Content>
    </Card>

    <Card style={styles.card}>
      <Card.Title title="GitHub Profile Analysis" />
      <Card.Content>
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
      </Card.Content>
    </Card>

    <Card style={styles.card}>
      <Card.Title title="LinkedIn Profile Match" />
      <Card.Content>
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
      </Card.Content>
    </Card>

    <Card style={styles.card}>
      <Card.Title title="Codeforces Rating Analysis" />
      <Card.Content>
        <Text style={styles.detailText}>
          Rating: {mockData.codeforcesRating}
        </Text>
        <Text style={styles.explanationText}>
          A Codeforces rating of {mockData.codeforcesRating} is considered very
          good. This demonstrates strong problem-solving skills and algorithmic
          thinking, which are crucial for passing FAANG technical interviews.
        </Text>
      </Card.Content>
    </Card>

    <Card style={styles.card}>
      <Card.Title title="ATS Match" />
      <Card.Content>
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
      </Card.Content>
    </Card>

    <Card style={styles.card}>
      <Card.Title title="Overall Ranking" />
      <Card.Content>
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
      </Card.Content>
    </Card>
  </ScrollView>
);
const initialLayout = { width: Dimensions.get('window').width };

const RecruiterAnalysisDashboard = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'summary', title: 'Summary' },
    { key: 'detailed', title: 'Detailed' },
  ]);

  const renderScene = SceneMap({
    summary: SummaryRoute,
    detailed: DetailedRoute,
  });

  return (
    <View style={{ flex: 1, marginTop: 50 }}>
     <SummaryRoute/>
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  card: {
    margin: 8,
    marginTop: 15,
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
  smallTitle: {
    fontSize: 14,
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
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
