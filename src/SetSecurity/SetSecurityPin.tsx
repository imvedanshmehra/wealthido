import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import colors, { dark, light } from "../colors";
import { ThemeContext } from "../Networking/themeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import SecurityImage from "../assets/images/SecurityImage.svg";
import { SafeAreaView } from "react-native-safe-area-context";

export type RouteParams = {
  phoneNumber?: number;
  password?: string;
};

const SetSecurityPin = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const navigation: any = useNavigation();
  const route = useRoute();
  const params = route?.params as RouteParams | undefined;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.white,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioWidthBasedOniPhoneX(32),
      marginLeft: ratioWidthBasedOniPhoneX(70),
    },
    logoTitle: {
      marginRight: ratioWidthBasedOniPhoneX(85),
      color: colored.lightblack,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    SecurityText: {
      color: colors.veryDarkGrayishYellow,
      marginTop: ratioHeightBasedOniPhoneX(25),
      textAlign: "left",
      textTransform: "capitalize",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(24)),
    },
    descText: {
      marginTop: ratioHeightBasedOniPhoneX(8),
      color: colored.dimGray,
      textAlign: "left",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    mainImage: {
      height: ratioHeightBasedOniPhoneX(86),
      width: ratioWidthBasedOniPhoneX(86),
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(166),
      justifyContent: "center",
    },
    setupText: {
      color: colors.mainlyBlue,
      marginTop: ratioHeightBasedOniPhoneX(20),
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    bottomContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 5,
          shadowColor: colors.black,
        },
      }),
      marginTop: "auto",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.white,
      height: ratioHeightBasedOniPhoneX(62),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    button: {
      height: ratioHeightBasedOniPhoneX(42),
      backgroundColor: colored.lightGreen,
      justifyContent: "center",
      alignSelf: "center",
      width: "100%",
      borderRadius: ratioHeightBasedOniPhoneX(24),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
  });

  const enableNowButtonPress = async () => {
    navigation.navigate("SecurityPinScreen", {
      phoneNumber: params?.phoneNumber,
      tag: "2",
      password: params?.password,
    });
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"Set Security PIN"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={{ marginHorizontal: ratioWidthBasedOniPhoneX(20) }}>
        <Text style={styles.SecurityText}>Set Security PIN</Text>
        <Text style={styles.descText}>
          Add security PIN to secure your wallet fund
        </Text>

        <View
          style={{
            marginTop: ratioHeightBasedOniPhoneX(98),
            alignItems: "center",
          }}
        >
          <SecurityImage />
          <Text style={styles.setupText}>
            Set a unique PIN to safeguard your wallet funds, enhancing security
            and preventing unauthorized access.
          </Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={enableNowButtonPress} style={styles.button}>
          <Text style={styles.buttonText}>Enable now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SetSecurityPin;
