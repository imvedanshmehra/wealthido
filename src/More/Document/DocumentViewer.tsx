import React, { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../../Extension/ScreenUtils";
import { ThemeContext } from "../../Networking/themeContext";
import { dark, light } from "../../colors";
import { WebView } from "react-native-webview";
import MainHeaderView from "../../MainHeaderView";
import { useRoute } from "@react-navigation/native";
import Loader from "../../Loader";

/**
 * Renders a screen that displays a PDF file in a React Native app.
 *
 * @component
 * @param {string} url - The URL of the PDF file to be displayed.
 * @param {string} title - The title of the PDF file.
 *
 * @returns {JSX.Element} The rendered PDF viewer screen.
 */
const DocumentViewerScreen = () => {
  const route = useRoute();
  const { url, title } = route.params as { url: any; title: string };
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [loading, setLoading] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.background,
    },
    headerContainer: {
      marginTop: ratioHeightBasedOniPhoneX(20),
      flexDirection: "row",
      marginHorizontal: ratioWidthBasedOniPhoneX(11),
      alignItems: "center", // Center the items vertically
    },
    backButtonImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      resizeMode: "contain",
      tintColor: colored.textColor,
    },
    headerTextContainer: {
      flex: 1,
      alignItems: "center", // Center the text horizontally
    },
    headerText: {
      fontFamily: "Inter-Bold",
      fontSize: ratioHeightBasedOniPhoneX(16),
      color: colored.textColor,
    },
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={title}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <WebView
        source={{
          uri: `https://docs.google.com/gview?embedded=true&url=${url}`,
        }}
        style={{
          flex: 1,
          backgroundColor: colored.headerColor,
          marginTop: ratioHeightBasedOniPhoneX(20),
          marginHorizontal: ratioWidthBasedOniPhoneX(16),
        }}
        onLoad={() => setLoading(false)}
        onLoadEnd={() => setLoading(false)}
      />
      <Loader loading={loading} />
    </SafeAreaView>
  );
};

export default DocumentViewerScreen;
