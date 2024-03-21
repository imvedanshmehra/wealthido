import React, { useContext, useState } from "react";
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
import Loader from "../Loader";
import URLConstants from "../Networking/URLConstants";
import { TwoFactorSetUpLaterAuthRequestModel } from "./Model/TwoFactorSetUpLaterAuthRequestModel";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { RouteParams, handleResponse } from "./TwoFactorController";
import MainHeaderView from "../MainHeaderView";
import ShowAlertMessage from "../Popup/showAlertMessage";
import TwoFactorImage from "../assets/images/undraw_mobile_encryption.svg";
import HTML from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";

//Renders a screen for setting up or enabling two-factor authentication.
const TwoFactorAuth = () => {
  const route = useRoute();
  const params = route?.params as RouteParams | undefined;
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (
    title: string,
    message: string
  ): Promise<boolean> => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.white,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioWidthBasedOniPhoneX(32),
      marginLeft: ratioWidthBasedOniPhoneX(70),
    },
    logoTitle: {
      marginRight: ratioWidthBasedOniPhoneX(85),
      color: colors.lightblack,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    BigText: {
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
    setupText: {
      color: colors.mainlyBlue,
      marginTop: ratioHeightBasedOniPhoneX(10),
      paddingHorizontal: ratioWidthBasedOniPhoneX(30),
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    buttonContainer: {
      marginTop: "auto",
    },
    cardContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 5,
          shadowColor: colors.black,
        },
      }),
      backgroundColor: colors.white,
      padding: ratioHeightBasedOniPhoneX(16),
      marginTop: ratioHeightBasedOniPhoneX(50),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    noteText: {
      color: colors.red,
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    popupText: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(16)),
      color: colored.textColor,
      textAlign: "center",
      marginBottom: ratioHeightBasedOniPhoneX(20),
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
          elevation: 8,
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
    const phoneNumber = params?.phoneNumber;
    await handleTwoFactorAction(phoneNumber, true, false, true);
  };

  // Handles the action for enabling or setting up two-factor authentication.
  const handleTwoFactorAction = async (
    phoneNumber: number | undefined,
    enable2FA: boolean,
    setUpLater: boolean,
    enableNow: boolean
  ) => {
    const data = new TwoFactorSetUpLaterAuthRequestModel(
      phoneNumber,
      enable2FA,
      setUpLater,
      enableNow
    );
    const url = enableNow ? URLConstants.enable2FA : URLConstants.setUpLater;
    handleResponse(
      url,
      data,
      ["Logins", "SetSecurityPin"],
      setLoading,
      () => setLoading(false),
      navigation,
      showTextPopup,
      params?.password
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"Two Factor Authentication"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={{ paddingHorizontal: ratioWidthBasedOniPhoneX(16) }}>
        <Text style={styles.BigText}>Two Factor Authentication</Text>
        <Text style={styles.descText}>
          2FA has been enabled for the security of your account.
        </Text>
        <View
          style={{
            alignItems: "center",
            marginTop: ratioHeightBasedOniPhoneX(50),
          }}
        >
          <TwoFactorImage />
        </View>
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.noteText}>Note</Text>
        <HTML
          source={{
            html: `<p style='text-align:left; font-size:14px; font-family: "Manrope-SemiBold"; color:#3F3F3F;'>
            Two-factor authentication will be 
            <a style='font-size:14px;  font-weight: 800; font-family: "Manrope-ExtraBold"; color:#16110D;' target="_blank">
              activated by default.
            </a> If you attempt to log in on another device, an 
            <a style='font-size:14px;  font-weight: 800; font-family: "Manrope-ExtraBold"; color:#16110D;' target="_blank">
              OTP will be sent
            </a> to the registered mobile number.
          </p>`,
          }}
          contentWidth={ratioWidthBasedOniPhoneX(375)}
          tagsStyles={{
            a: {
              textDecorationLine: "none",
            },
          }}
          styles={styles.popupText}
        />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={enableNowButtonPress} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <Loader loading={loading} />
      <ShowAlertMessage
        isVisible={popupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

export default TwoFactorAuth;
