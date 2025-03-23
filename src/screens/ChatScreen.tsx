import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteNameContext } from '../../App';

// Mock data for chat messages
const MOCK_MESSAGES = [
  {
    id: 1,
    text: "Hi there! How are you feeling today?",
    sender: "other",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 2,
    text: "I've been struggling with my anxiety again. Work has been really stressful lately.",
    sender: "me",
    timestamp: new Date(Date.now() - 3600000 * 23).toISOString()
  },
  {
    id: 3,
    text: "I'm sorry to hear that. Have you been practicing the breathing techniques we discussed?",
    sender: "other",
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString()
  },
  {
    id: 4,
    text: "Yes, they do help sometimes. But I feel overwhelmed as soon as I get back to work.",
    sender: "me",
    timestamp: new Date(Date.now() - 3600000 * 21).toISOString()
  },
  {
    id: 5,
    text: "That's understandable. Would it help to talk about what specifically at work is causing the most stress?",
    sender: "other",
    timestamp: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 6,
    text: "It's mostly the deadlines and my fear of not meeting expectations. I worry that I'm not good enough.",
    sender: "me",
    timestamp: new Date(Date.now() - 3600000 * 19).toISOString()
  },
  {
    id: 7,
    text: "That's a common feeling. Remember that you're doing your best, and that's what matters. Have you considered talking to your manager about your workload?",
    sender: "other",
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
  }
];

const ChatScreen = ({ route, navigation }) => {
  const { userName, challenge, chatId } = route.params || {
    userName: "Anonymous Friend",
    challenge: "Anxiety",
    chatId: 1
  };
  
  const { setCurrentRouteName } = React.useContext(RouteNameContext);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const flatListRef = useRef(null);
  
  // Generate initials from name
  const getInitials = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    } else {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: userName,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity 
            style={{ marginRight: 16 }}
            onPress={toggleSearch}>
            <Ionicons name={isSearching ? "close-outline" : "search-outline"} size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ marginRight: 16 }}
            onPress={() => alert('Chat info')}>
            <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, userName, isSearching]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  // Reset the route name when navigating back from the chat screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Reset the route name to show the bottom tabs again
      setCurrentRouteName('');
    });
    
    return unsubscribe;
  }, [navigation, setCurrentRouteName]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    const newMessage = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'me',
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    const results = messages.filter(
      message => message.text.toLowerCase().includes(normalizedQuery)
    );
    
    setSearchResults(results);
    
    // Scroll to first result if available
    if (results.length > 0 && flatListRef.current) {
      const index = messages.findIndex(msg => msg.id === results[0].id);
      if (index !== -1) {
        setTimeout(() => {
          flatListRef.current.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }, 100);
      }
    }
  };
  
  // Toggle search mode
  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender === 'me';
    const isHighlighted = searchQuery.trim() !== '' && 
      searchResults.some(result => result.id === item.id);
    
    // Function to highlight search term in text
    const highlightText = (text, query) => {
      if (!query.trim()) return <Text style={styles.messageText}>{text}</Text>;
      
      const parts = text.split(new RegExp(`(${query})`, 'gi'));
      return (
        <Text style={styles.messageText}>
          {parts.map((part, i) => 
            part.toLowerCase() === query.toLowerCase() ? 
              <Text key={i} style={styles.highlightedText}>{part}</Text> : 
              part
          )}
        </Text>
      );
    };
    
    return (
      <View style={[
        styles.messageContainer, 
        isMe ? styles.myMessageContainer : styles.otherMessageContainer,
        isHighlighted && styles.highlightedMessage
      ]}>
        {!isMe && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </View>
        )}
        <View style={[
          styles.bubble, 
          isMe ? styles.myBubble : styles.otherBubble,
          isHighlighted && styles.highlightedBubble
        ]}>
          {searchQuery.trim() !== '' ? 
            highlightText(item.text, searchQuery) : 
            <Text style={styles.messageText}>{item.text}</Text>
          }
          <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidContainer}
        keyboardVerticalOffset={90}>
        <View style={styles.chatInfoBanner}>
          <Text style={styles.chatInfoText}>Topic: {challenge}</Text>
        </View>
        
        {isSearching && (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search in conversation..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
              returnKeyType="search"
            />
            {searchResults.length > 0 && (
              <Text style={styles.searchResultCounter}>
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
              </Text>
            )}
          </View>
        )}
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.messagesContainer}
          onScrollToIndexFailed={info => {
            console.warn('Failed to scroll to index:', info);
            // Fallback scrolling implementation
            setTimeout(() => {
              flatListRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: true
              });
            }, 100);
          }}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}>
            <LinearGradient
              colors={['#007AFF', '#00C6FF']}
              style={styles.sendButtonGradient}>
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  chatInfoBanner: {
    backgroundColor: '#E1F5FE',
    padding: 8,
    alignItems: 'center',
  },
  chatInfoText: {
    fontSize: 14,
    color: '#0277BD',
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    margin: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  searchResultCounter: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
  },
  highlightedMessage: {
    backgroundColor: 'rgba(255, 213, 0, 0.1)',
  },
  highlightedBubble: {
    borderWidth: 2,
    borderColor: 'rgba(255, 213, 0, 0.5)',
  },
  highlightedText: {
    backgroundColor: 'rgba(255, 213, 0, 0.3)',
    fontWeight: 'bold',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 12,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;