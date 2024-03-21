import React, { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import PDFView from "react-native-view-pdf";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import { dark, light } from "../colors";
import MainHeaderView from "../MainHeaderView";
import Loader from "../Loader";

/**
 * Renders a screen that displays a PDF file in a React Native app.
 *
 * @component
 * @param {string} url - The URL of the PDF file to be displayed.
 * @param {string} title - The title of the PDF file.
 *
 * @returns {JSX.Element} The rendered PDF viewer screen.
 */
const PdfViewerScreen = () => {
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
      <PDFView
        fadeInDuration={400.0}
        style={{
          flex: 1,
          marginTop: ratioHeightBasedOniPhoneX(10),
          backgroundColor: colored.background,
          marginHorizontal: ratioWidthBasedOniPhoneX(20),
        }}
        resource={url}
        resourceType="url"
        onLoad={() => setLoading(false)}
      />
      <Loader loading={loading} />
    </SafeAreaView>
  );
};

export default PdfViewerScreen;
