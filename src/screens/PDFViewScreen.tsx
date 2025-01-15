import React, {useState, useContext, useCallback} from 'react';
import {Platform, StyleSheet, View, TouchableOpacity} from 'react-native';
import {DocumentView, Config} from '@pdftron/react-native-pdf';
import {NavigationContext} from '@react-navigation/native';
import {RouteNameContext} from '../../App';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = 'http://localhost:8000/api';

const PdfViewScreen = ({route}) => {
  const {setCurrentRouteName} = React.useContext(RouteNameContext);
  const navigation = useContext(NavigationContext);
  const {uri, jobId, resumeId} = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const onLeadingNavButtonPressed = useCallback(() => {
    setCurrentRouteName('other');
    navigation.goBack();
  }, [navigation]);

  const handleFavoritePress = useCallback(async () => {
    try {
      // console.log(route.params);
      const token = await AsyncStorage.getItem('accessToken');
      const user = await AsyncStorage.getItem('userData');
      console.log('user', user);
      // await fetch(`${API_BASE_URL}/recent-analyses/`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      console.log(
        `${API_BASE_URL}/jobs/${route.params.job.id}/shortlist/${route.params.resume_id}/`,
      );
      const response = await fetch(
        `${API_BASE_URL}/jobs/${route.params.job.id}/shortlist/${route.params.resume_id}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('response', response);
      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  }, [jobId, resumeId, isFavorite]);

  return (
    <View style={styles.container}>
      <DocumentView
        style={styles.pdfView}
        topAppNavBarRightBar={[
          Config.Buttons.searchButton,
          Config.Buttons.shareButton,
        ]}
        annotationToolbars={[]}
        bottomToolbar={[]}
        hideDefaultAnnotationToolbars={[
          // Config.DefaultToolbars.Annotate,
          Config.DefaultToolbars.Favorite,
          Config.DefaultToolbars.FillAndSign,
          Config.DefaultToolbars.Redaction,
          Config.DefaultToolbars.Measure,
          Config.DefaultToolbars.PrepareForm,
          Config.DefaultToolbars.View,
          Config.DefaultToolbars.Pens,
          Config.DefaultToolbars.Insert,
          Config.DefaultToolbars.Draw,
        ]}
        document={Platform.OS === 'ios' ? uri.replace('file://', '') : uri}
        showLeadingNavButton={true}
        leadingNavButtonIcon={
          Platform.OS === 'ios'
            ? 'ic_close_black_24px.png'
            : 'ic_arrow_back_white_24dp'
        }
        onLeadingNavButtonPressed={onLeadingNavButtonPressed}
      />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}>
        <Icon
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={24}
          color="#007AFF"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  pdfView: {
    flex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 10 : 20,
    right: 10,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
});

export default PdfViewScreen;
