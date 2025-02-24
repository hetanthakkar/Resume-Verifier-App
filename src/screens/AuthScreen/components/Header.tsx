import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import styles from '../styles';
import GradientText from '../../gradienttext';

export const Header = ({navigation}) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}>
      <IonIcons name="chevron-back" size={24} color="#000" />
    </TouchableOpacity>
    <View style={styles.titleContainer}>
      <GradientText text={'Welcome to Skill Verify'} fontSize={24} />
    </View>
  </View>
);
