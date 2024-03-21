import { View } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import colors from "./colors";
import { Text } from "react-native-paper";
import { ratioHeightBasedOniPhoneX } from "./Extension/ScreenUtils";
import WealthidoFonts from "./Helpers/WealthidoFonts";

const SplashImage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.wealthidoText}>Wealthido</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.orange,
  },
  wealthidoText: {
    color: colors.white,
    textAlign: "center",
    ...WealthidoFonts.georgiaBold(ratioHeightBasedOniPhoneX(72)),
  },
});

export default SplashImage;
