import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  BackHandler,
  Alert,
  View,
  Linking,
  TouchableOpacity
} from "react-native";
import { DocumentView, Config } from "@pdftron/react-native-pdf";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShortlisted: false,
    };
  }

  onLeadingNavButtonPressed = () => {
    console.log("leading nav button pressed");
    if (Platform.OS === "ios") {
      Alert.alert(
        "App",
        "onLeadingNavButtonPressed",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: true }
      );
    } else {
      BackHandler.exitApp();
    }
  };

  handleShortlist = () => {
    this.setState(prevState => ({
      isShortlisted: !prevState.isShortlisted,
    }));
  };

  handleSendEmail = () => {
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

  render() {
    const path = "https://pdftron.s3.amazonaws.com/downloads/pl/PDFTRON_mobile_about.pdf";
    const { isShortlisted } = this.state;

    return (
      <View style={styles.container}>
        <DocumentView
          style={styles.pdfView}
          topAppNavBarRightBar={[Config.Buttons.searchButton,Config.Buttons.shareButton ]}
          bottomToolbar={[]}
          hideDefaultAnnotationToolbars={[Config.DefaultToolbars.Annotate, Config.DefaultToolbars.Favorite, Config.DefaultToolbars.FillAndSign, Config.DefaultToolbars.Redaction, Config.DefaultToolbars.Measure, Config.DefaultToolbars.PrepareForm,Config.DefaultToolbars.View,Config.DefaultToolbars.Pens,Config.DefaultToolbars.Insert,Config.DefaultToolbars.Draw]}
          document={path}
          showLeadingNavButton={true}
          leadingNavButtonIcon={
            Platform.OS === "ios"
              ? "ic_close_black_24px.png"
              : "ic_arrow_back_white_24dp"
          }
          onLeadingNavButtonPressed={this.onLeadingNavButtonPressed}
        />
        <TouchableOpacity
          style={[styles.iconButton, styles.leftButton]}
          onPress={this.handleSendEmail}
        >
          <Icon name="mail" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, styles.rightButton]}
          onPress={this.handleShortlist}
        >
          <Icon 
            name={isShortlisted ? "favorite" : "favorite-border"} 
            size={24} 
            color={isShortlisted ? "#ff0000" : "#fff"} 
          />
        </TouchableOpacity>

        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  pdfView: {
    flex: 1,
  },
  iconButton: {
    position: 'absolute',
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  leftButton: {
    left: 20,
  },
  rightButton: {
    right: 20,
  },
});