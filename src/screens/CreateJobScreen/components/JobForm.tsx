import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from '../styles';
export const JobForm = ({
  job,
  isEditing,
  mode,
  onFieldUpdate,
  onToggleEdit,
}) => {
  const renderField = (
    label,
    value,
    field,
    readonly = false,
    multiline = false,
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {Array.isArray(value) ? (
        <ArrayField
          value={value}
          field={field}
          label={label}
          readonly={readonly}
          onUpdate={onFieldUpdate}
        />
      ) : (
        <TextInput
          style={[
            styles.input,
            multiline && styles.textArea,
            readonly && styles.readonlyInput,
          ]}
          value={value}
          onChangeText={newValue => onFieldUpdate(field, newValue)}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          editable={!readonly}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </View>
  );

  return (
    <>
      <View style={styles.editHeader}>
        <View style={styles.headerContainer}>
          <Text style={styles.editHeaderText}>
            {isEditing ? 'Edit Job Details' : 'Job Details'}
          </Text>
          {mode === 'view' && (
            <TouchableOpacity
              style={styles.editButtonContainer}
              onPress={onToggleEdit}>
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {renderField('Title', job.title, 'title', !isEditing)}
      {renderField('Company', job.company_name, 'company_name', !isEditing)}
      {renderField('Location', job.location, 'location', !isEditing)}
      {renderField(
        'Required Skills',
        job.required_skills,
        'required_skills',
        !isEditing,
      )}
      {renderField(
        'Preferred Skills',
        job.preferred_skills,
        'preferred_skills',
        !isEditing,
      )}
      {renderField(
        'Required Experience',
        job.years_of_experience,
        'required_experience',
        !isEditing,
      )}
      {renderField('Education', job.education, 'education', !isEditing)}
      {renderField(
        'Employment Type',
        job.employment_type,
        'employment_type',
        !isEditing,
      )}
      {renderField(
        'Job Description',
        job.description,
        'description',
        !isEditing,
        true,
      )}
    </>
  );
};
