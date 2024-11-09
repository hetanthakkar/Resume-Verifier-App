import React, { useState, useContext, useCallback } from "react";
import {
  Platform,
  StyleSheet,
  BackHandler,
  View,
  Linking,
} from "react-native";
import { DocumentView, Config } from "@pdftron/react-native-pdf";
import { NavigationContext } from '@react-navigation/native';
import { RouteNameContext } from "../../App";

const App = () => {
  const { setCurrentRouteName } = React.useContext(RouteNameContext);

  const navigation = useContext(NavigationContext);
  const [isShortlisted, setIsShortlisted] = useState(false);
  
  const onLeadingNavButtonPressed = useCallback(() => {
    setCurrentRouteName('other');

    console.log("leading nav button pressed");
    navigation.goBack();
  }, [navigation]);

  const handleShortlist = () => {
    setIsShortlisted(prevState => !prevState);
  };

  const handleSendEmail = () => {
    const recipient = 'candidate@example.com';
    const subject = 'Shortlisted for Software Engineer Position';
    const body = `Dear Candidate,

We are pleased to inform you that you have been shortlisted for the position of Software Engineer at our company. Your qualifications and experience have impressed our hiring team, and we would like to invite you for an interview.

Please let us know your availability for the next week, and we will schedule the interview accordingly.

Best regards,
Recruiting Team`;
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoUrl);
  };

  const path = "http://hetanthakkar.github.io/portfolio/cv.pdf";

  return (
    <View style={styles.container}>
      <DocumentView
        style={styles.pdfView}
        topAppNavBarRightBar={[Config.Buttons.searchButton, Config.Buttons.shareButton]}
        bottomToolbar={[]}
        hideDefaultAnnotationToolbars={[Config.DefaultToolbars.Annotate, Config.DefaultToolbars.Favorite, Config.DefaultToolbars.FillAndSign, Config.DefaultToolbars.Redaction, Config.DefaultToolbars.Measure, Config.DefaultToolbars.PrepareForm, Config.DefaultToolbars.View, Config.DefaultToolbars.Pens, Config.DefaultToolbars.Insert, Config.DefaultToolbars.Draw]}
        document={path}
        showLeadingNavButton={true}
        leadingNavButtonIcon={
          Platform.OS === "ios"
            ? "ic_close_black_24px.png"
            : "ic_arrow_back_white_24dp"
        }
        onLeadingNavButtonPressed={onLeadingNavButtonPressed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  pdfView: {
    flex: 1,
  },
});

export default App;
