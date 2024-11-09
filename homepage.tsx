import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';

const JobCard = ({ jobId, postedDate, imageSource }) => (
  <View style={styles.jobCard}>
    <Image source={{uri:'https://www.digitaltrends.com/wp-content/uploads/2022/10/MacOS-Finder-View-Go-To-Copy-Path.jpg?fit=640%2C427&p=1'}} style={styles.jobImage} />
    <Text style={styles.jobId}>Job ID: {jobId}</Text>
    <Text style={styles.postedDate}>Posted on {postedDate}</Text>
  </View>
);

const FileUploadModal = ({ visible, onClose, onUpload }) => {
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [jobs, setJobs] = useState([
    { id: '1', title: 'Software Engineer' },
    { id: '2', title: 'Product Manager' },
    { id: '3', title: 'UX Designer' },
  ]);

  const handleFilePick = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf],
      });
      setSelectedFiles(results);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled file picker');
      } else {
        console.error(err);
      }
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0 && selectedJob) {
      onUpload(selectedFiles, selectedJob);
      setSelectedFiles([]);
      setSelectedJob('');
    } else {
      alert('Please select files and a job before uploading.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Upload Resumes</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
            <Text style={styles.uploadButtonText}>Select PDF Files</Text>
          </TouchableOpacity>
          {selectedFiles.length > 0 && (
            <Text style={styles.selectedFilesText}>{selectedFiles.length} file(s) selected</Text>
          )}
          <Text style={styles.jobSelectionLabel}>Select a job:</Text>
          <TextInput
            style={styles.jobSearchInput}
            placeholder="Search jobs..."
            value={selectedJob}
            onChangeText={setSelectedJob}
          />
          <FlatList
            data={jobs.filter(job => job.title.toLowerCase().includes(selectedJob.toLowerCase()))}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.jobItem}
                onPress={() => setSelectedJob(item.title)}
              >
                <Text>{item.title}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const RecruitmentApp = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [jobPostings, setJobPostings] = useState([
    { id: '12345', date: '2023-10-01' },
    { id: '67890', date: '2023-09-25' },
  ]);

  const handleUpload = (files, job) => {
    console.log(`Uploading ${files.length} files for job: ${job}`);
    // Implement the upload logic here
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recruitment App</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="cloud-upload-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.jobPostingsHeader}>
        <Text style={styles.jobPostingsTitle}>Job Postings</Text>
        <TouchableOpacity>
          <Text style={styles.createJobButton}>Create Job &gt;</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={jobPostings}
        renderItem={({ item }) => (
          <JobCard jobId={item.id} postedDate={item.date}  />
        )}
        keyExtractor={item => item.id}
      />
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="briefcase" size={24} color="#007AFF" />
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="people-outline" size={24} color="gray" />
          <Text style={styles.tabLabel}>Candidates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="settings-outline" size={24} color="gray" />
          <Text style={styles.tabLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
      <FileUploadModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onUpload={handleUpload}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      jobPostingsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
      },
      jobPostingsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      createJobButton: {
        color: '#007AFF',
        fontSize: 16,
      },
      jobCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 16,
        overflow: 'hidden',
      },
      jobImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
      },
      jobId: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 12,
      },
      postedDate: {
        fontSize: 14,
        color: 'gray',
        paddingHorizontal: 12,
        paddingBottom: 12,
      },
      tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: 'white',
      },
      tabItem: {
        alignItems: 'center',
        paddingVertical: 8,
      },
      tabLabel: {
        fontSize: 12,
        marginTop: 4,
        color: 'gray',
      },
      activeTabLabel: {
        color: '#007AFF',
      },
  // ... (previous styles remain unchanged)
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  jobSelectionLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  jobSearchInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  jobItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
  selectedFilesText: {
    marginBottom: 10,
    fontStyle: 'italic',
  },
});

export default RecruitmentApp;