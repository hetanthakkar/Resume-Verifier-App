import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
const JobCard = ({job, gradientColors, onPress}) => {
  // Get initials for avatar
  const getInitials = name => {
    const parts = name.split(' ');
    // Handle "Anonymous User X" format
    if (parts.length >= 3 && parts[0] === 'Anonymous' && parts[1] === 'User') {
      return parts[2];
    }
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={styles.card}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        {/* Top Section */}
        <View style={styles.topSection}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(job.title)}</Text>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.name}>{job.title}</Text>
            {job.age && <Text style={styles.age}>Age Range: {job.age}</Text>}
            <View style={styles.matchContainer}>
              <Ionicons name="heart" size={16} color="white" />
              <Text style={styles.matchText}>{job.similarity}% Match</Text>
            </View>
          </View>
        </View>

        {/* Challenge Section */}
        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Shared Challenge:</Text>
          <Text style={styles.challengeText} numberOfLines={3}>
            "{job.company_name}"
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.lastActive}>{job.lastActive}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    width: 350,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 0,
  },
  topSection: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  age: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 4,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  matchText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  challengeSection: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 16,
    paddingTop: 12,
  },
  challengeLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  challengeText: {
    color: 'white',
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  lastActive: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
});

export default JobCard;
