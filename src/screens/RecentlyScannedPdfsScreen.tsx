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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteNameContext} from '../../App';
import {previousChats} from '../static_data/data';

const API_BASE_URL = 'http://localhost:8000/api';

const PreviousChatsScreen = ({navigation, route}) => {
  const {setCurrentRouteName} = React.useContext(RouteNameContext);
  const [chats, setChats] = useState([]);
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
      // In a real app, we would fetch chats from an API
      // For now, we'll use our static data
      setChats(previousChats);
      
      // Simulate API loading
      setTimeout(() => {
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  const handleItemPress = (chat) => {
    // Navigate to the chat screen
    setCurrentRouteName('InnerHome');
    navigation.navigate('ChatScreen', {
      chatId: chat.id,
      userName: chat.userName,
      challenge: chat.challenge,
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

  // Function to highlight matching text
  const HighlightText = ({ text, searchTerm, style }) => {
    if (!searchTerm.trim()) {
      return <Text style={style}>{text}</Text>;
    }
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <Text style={style}>
        {parts.map((part, i) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? 
            <Text key={i} style={[style, styles.highlightedText]}>{part}</Text> : 
            part
        )}
      </Text>
    );
  };

  // Chat item component
  const ChatItem = ({item, index}) => {
    const date = new Date(item.timestamp);
    const formattedDate = date.toLocaleDateString();
    const initials = getInitials(item.userName);
    const query = searchQuery.trim();
    
    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
        style={styles.itemContainer}>
        <LinearGradient
          colors={gradientColors[index % gradientColors.length]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.item}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.textContainer}>
            <HighlightText 
              text={item.userName}
              searchTerm={query}
              style={styles.name}
            />
            <HighlightText 
              text={item.lastMessage}
              searchTerm={query}
              style={[styles.jobTitle, { numberOfLines: 1, ellipsizeMode: 'tail' }]}
            />
            <View style={styles.topicContainer}>
              <Text style={styles.topicLabel}>Topic: </Text>
              <HighlightText 
                text={item.challenge}
                searchTerm={query}
                style={styles.challenge}
              />
            </View>
          </View>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
          <Feather name="chevron-right" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    // Search in user name
    if (chat.userName?.toLowerCase().includes(query)) return true;
    
    // Search in challenge/topic
    if (chat.challenge?.toLowerCase().includes(query)) return true;
    
    // Search in last message
    if (chat.lastMessage?.toLowerCase().includes(query)) return true;
    
    return false;
  });
  
  const renderItem = ({item, index}) => {
    return (
      <ChatItem item={item} index={index} />
    );
  };

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
  itemContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
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
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  jobTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  topicLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
  challenge: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
  highlightedText: {
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
    fontWeight: 'bold',
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
