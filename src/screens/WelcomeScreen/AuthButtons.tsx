import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },
  icon: {
    marginRight: 8,
  },
});

export const AuthButtons = ({
  onGoogleSignIn,
  onEmailSignIn,
}) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.socialButton} onPress={onGoogleSignIn}>
      <FontAwesome
        name="google"
        size={20}
        color="#DB4437"
        style={styles.icon}
      />
      <Text style={styles.socialButtonText}>Continue with Google</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.socialButton} onPress={onEmailSignIn}>
      <IonIcons name="mail-open" size={20} color="#000" style={styles.icon} />
      <Text style={styles.socialButtonText}>Continue with Work Email</Text>
    </TouchableOpacity>
  </View>
); 