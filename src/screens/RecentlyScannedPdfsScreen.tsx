import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteNameContext} from '../../App';
import {chatAPI} from '../services/api';

interface User {
  username: string;
  problem?: {
    description: string;
  };
}

interface Chat {
  id: number;
  other_user: User;
  last_message: string;
  created_at: string;
  unread_count: number;
}

interface RouteNameContextType {
  currentRouteName: string;
  setCurrentRouteName: (name: string) => void;
}

const API_BASE_URL = 'http://localhost:8000/api';

const PreviousChatsScreen = ({navigation, route}) => {
  const {setCurrentRouteName} = React.useContext(RouteNameContext) as RouteNameContextType;
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const gradientColors = [
    ['#FF6B6B', '#FF8E8E'],
    ['#4ECDC4', '#45B7A8'],
    ['#45AAF2', '#2D98DA'],
    ['#FF9FF3', '#F368E0'],
  ];

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChats();
      setChats(response);
    } catch (error) {
      console.error('Error fetching chats:', error);
      if (error.response?.status === 401) {
        // Handle unauthorized error
        Alert.alert(
          'Session Expired',
          'Please log in again to continue.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to load chats. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (chat) => {
    setCurrentRouteName('InnerHome');
    navigation.navigate('ChatScreen', {
      chatId: chat.id,
      userName: chat.other_user.username,
      challenge: chat.other_user.problem?.description || 'No description available',
    });
  };

  // Generate initials from name
  const getInitials = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    } else {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
  };

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    // Search in username
    if (chat.other_user.username?.toLowerCase().includes(query)) return true;

    // Search in last message
    if (chat.last_message?.toLowerCase().includes(query)) return true;

    return false;
  });

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleItemPress(item)}>
      <LinearGradient
        colors={gradientColors[index % gradientColors.length]}
        style={styles.gradientContainer}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {getInitials(item.other_user.username)}
          </Text>
        </View>
        <View style={styles.chatInfo}>
          <Text style={styles.userName}>{item.other_user.username}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.last_message}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        {item.unread_count > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread_count}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Previous Conversations</Text>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name, topic or message..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? 'No matches found' : 'No conversations yet'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 24,
  },
  chatItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lastMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
});

export default PreviousChatsScreen;
