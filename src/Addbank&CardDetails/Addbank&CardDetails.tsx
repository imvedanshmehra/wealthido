import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import colors, { dark, light } from "../colors";
import { useNavigation } from "@react-navigation/native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import MainHeaderView from "../MainHeaderView";
import { ThemeContext } from "../Networking/themeContext";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import AddCardImage from "../assets/images/AddCard.svg";
import AddBankImage from "../assets/images/AddBank.svg";

const AddbankCardDetails = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    settingContainer: {
      marginTop: ratioHeightBasedOniPhoneX(25),
      backgroundColor: colored.headerColor,
      width: "100%",
      alignItems: "center",
    },
    card: {
      backgroundColor: colored.headerColor,
      padding: ratioHeightBasedOniPhoneX(16),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      borderRadius: ratioHeightBasedOniPhoneX(5),
      marginBottom: ratioHeightBasedOniPhoneX(16),
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    circularImageContainer: {
      alignContent: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(36),
      width: ratioWidthBasedOniPhoneX(36),
    },
    circularImage: {
      flex: 1,
      width: undefined,
      height: undefined,
    },
    textContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginLeft: ratioWidthBasedOniPhoneX(16),
    },
    titleText: {
      color: colors.black,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    descriptionText: {
      width: ratioWidthBasedOniPhoneX(170),
      color: colors.mainlyBlue,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    arrowRight: {
      marginLeft: ratioWidthBasedOniPhoneX(60),
      width: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(20),
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 1 },
      direction: "inherit",
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    androidShadow: {
      shadowColor: "black",
      elevation: 4,
    },
  });

  const Row = ({ Icon, text, description, onPress }) => {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
        ]}
        onPress={onPress}
        activeOpacity={1}
      >
        <View style={styles.circularImageContainer}>{Icon}</View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{text}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        <Image
          source={require("../assets/images/right-arrow.png")}
          style={styles.arrowRight}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MainHeaderView
        title={"Add Bank & Card Details"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={styles.settingContainer}>
        <Row
          Icon={<AddBankImage />}
          text="Add Bank"
          description="Choose Bank or Enter IFSC Details"
          onPress={() => navigation.navigate("AddBank")}
        />
        <Row
          Icon={<AddCardImage />}
          text="Add Card"
          description="Add card for Auto-withdrawal"
          onPress={() => navigation.navigate("AddCardScreen")}
        />
      </View>
    </View>
  );
};

export default AddbankCardDetails;
