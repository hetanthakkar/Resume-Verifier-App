import React from 'react';
import {View, TouchableOpacity, Text, ViewStyle, TextStyle, FlexAlignType} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';

const styles = {
  buttonContainer: {
    justifyContent: 'center' as ViewStyle['justifyContent'],
    alignItems: 'center' as FlexAlignType,
    paddingVertical: 20,
  },
  socialButton: {
    flexDirection: 'row' as ViewStyle['flexDirection'],
    alignItems: 'center' as FlexAlignType,
    justifyContent: 'center' as ViewStyle['justifyContent'],
    width: '80%',
    padding: 15,
    marginBottom: 15,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 15,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
};

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