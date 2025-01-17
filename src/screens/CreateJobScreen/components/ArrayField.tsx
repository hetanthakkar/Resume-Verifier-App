import React from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import styles from '../styles';

export const ArrayField = ({value, field, label, readonly, onUpdate}) => (
  <View style={styles.listContainer}>
    {value.map((item, index) => (
      <View key={index} style={styles.listItemContainer}>
        <TextInput
          style={[styles.listItemInput, readonly && styles.readonlyInput]}
          value={item}
          onChangeText={newValue => onUpdate(field, newValue, index)}
          editable={!readonly}
        />
        {!readonly && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onUpdate(field, null, index, 'remove')}>
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    ))}
    {!readonly && (
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onUpdate(field, '', value.length, 'add')}>
        <Text style={styles.addButtonText}>+ Add {label}</Text>
      </TouchableOpacity>
    )}
  </View>
);
