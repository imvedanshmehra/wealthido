import { useNavigation, useRoute } from "@react-navigation/native";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { ratioHeightBasedOniPhoneX } from "../Extension/ScreenUtils";

const BuyGoldSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { qty } = route.params as { qty: any };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.borderYellow,
      justifyContent: "center",
      alignItems: "center",
    },
    BackGroundImage: {
      height: ratioHeightBasedOniPhoneX(287),
      width: ratioHeightBasedOniPhoneX(287),
      alignItems: "center",
      justifyContent: "center",
    },
    Image: {
      height: ratioHeightBasedOniPhoneX(64),
      width: ratioHeightBasedOniPhoneX(64),
    },
    gramText: {
      color: colors.black,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(24)),
    },
    text: {
      color: colors.black,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
      marginTop: ratioHeightBasedOniPhoneX(4),
    },
    Button: {
      backgroundColor: colors.black,
      borderRadius: ratioHeightBasedOniPhoneX(37),
      height: ratioHeightBasedOniPhoneX(48),
      paddingHorizontal: ratioHeightBasedOniPhoneX(63),
      justifyContent: "center",
      position: "relative",
      marginTop: "auto",
      marginBottom: ratioHeightBasedOniPhoneX(52),
    },
    buttonText: {
      color: colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
  });
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ImageBackground
          source={require("../assets/images/succesBg.png")}
          resizeMode="cover"
          style={styles.BackGroundImage}
        >
          <Image
            source={require("../assets/images/patch_check_fill.png")}
            resizeMode="contain"
            style={styles.Image}
          ></Image>
          <Text style={styles.gramText}>{qty + "g"}</Text>
          <Text style={styles.text}>Purchased Successfully!</Text>
        </ImageBackground>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
          navigation.goBack();
        }}
        style={styles.Button}
      >
        <Text style={styles.buttonText}>Okay</Text>
      </TouchableOpacity>
    </View>
  );
};
export default BuyGoldSuccess;
