import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import colors, { dark, light } from "./colors";
import { Text } from "react-native-paper";
import NoDataImageDark from "./assets/images/NoDataDarkTheme.svg";
import NoDataImage from "./assets/images/NoData.svg";
import { ThemeContext } from "./Networking/themeContext";
import WealthidoFonts from "./Helpers/WealthidoFonts";
import { ratioHeightBasedOniPhoneX } from "./Extension/ScreenUtils";

// Renders a component to display "No Data" message.
const NoData = ({ marginTop }: { marginTop?: number }) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
      marginTop: ratioHeightBasedOniPhoneX(marginTop ? marginTop : 195),
      alignItems: "center",
    },
    Textview: {
      marginTop: ratioHeightBasedOniPhoneX(8),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(22)),
      color: "#686868",
      textAlign: "center",
    },
  });
  return (
    <View style={styles.container}>
      {theme === "dark" ? <NoDataImageDark /> : <NoDataImage />}
      <Text style={styles.Textview}>No Data</Text>
    </View>
  );
};

export default NoData;
