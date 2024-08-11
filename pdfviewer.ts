import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  BackHandler,
  Alert,
} from "react-native";

import { DocumentView ,Config} from "@pdftron/react-native-pdf";

type Props = {};
export default class App extends Component<Props> {

  

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

  render() {

    const path =
      "https://pdftron.s3.amazonaws.com/downloads/pl/PDFTRON_mobile_about.pdf";

    return (
      <DocumentView
        hideDefaultAnnotationToolbars={[Config.DefaultToolbars.Annotate,Config.DefaultToolbars.Favorite,Config.DefaultToolbars.FillAndSign,Config.DefaultToolbars.Redaction,Config.DefaultToolbars.Measure,Config.DefaultToolbars.PrepareForm]}
        document={path}
        showLeadingNavButton={true}
        leadingNavButtonIcon={
          Platform.OS === "ios"
            ? "ic_close_black_24px.png"
            : "ic_arrow_back_white_24dp"
        }
        onLeadingNavButtonPressed={this.onLeadingNavButtonPressed}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});