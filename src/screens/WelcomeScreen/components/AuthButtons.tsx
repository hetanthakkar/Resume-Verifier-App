import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {styles} from '../styles';

export const AuthButtons = ({
  platform,
  onGoogleSignIn,
  onAppleSignIn,
  onEmailSignIn,
}) => (
  <View style={styles.buttonContainer}>
    {platform === 'ios' ? (
      <>
        <TouchableOpacity style={styles.socialButton} onPress={onAppleSignIn}>
          <FontAwesome
            name="apple"
            size={20}
            color="#000"
            style={styles.icon}
          />
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
      </>
    ) : (
      <TouchableOpacity style={styles.socialButton} onPress={onGoogleSignIn}>
        <FontAwesome
          name="google"
          size={20}
          color="#DB4437"
          style={styles.icon}
        />
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity style={styles.socialButton} onPress={onEmailSignIn}>
      <IonIcons name="mail-open" size={20} color="#000" style={styles.icon} />
      <Text style={styles.socialButtonText}>Continue with Work Email</Text>
    </TouchableOpacity>
  </View>
);
