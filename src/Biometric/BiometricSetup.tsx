import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import colors, { dark, light } from "../colors";
import { ThemeContext } from "../Networking/themeContext";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import { BiometricAuthRequestModel } from "./Model/BiometricAuthRequestModel";
import { handleResponse } from "./BiometricController";
import { useNavigation } from "@react-navigation/native";
import Loader from "../Loader";
import ShowAlertMessage from "../Popup/showAlertMessage";
import FingerprintScanner from "react-native-fingerprint-scanner";
import ReactNativeBiometrics from "react-native-biometrics";
import UnlockImage from "../assets/images/UnlockImage.svg";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";

//Renders a screen for setting up or enabling two-factor authentication.
const BiometricSetup = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [biometryType, setBiometryType] = useState<string | null>(null);
  const rnBiometrics = new ReactNativeBiometrics();

  const showTextPopup = async (title: string, message: string) => {
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
    BigText: {
      color: colors.veryDarkGrayishYellow,
      marginTop: ratioHeightBasedOniPhoneX(25),
      textAlign: "left",
      textTransform: "capitalize",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(24)),
    },
    descText: {
      color: colored.dimGray,
      textAlign: "left",
      marginTop: ratioHeightBasedOniPhoneX(6),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    mainImage: {
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(99),
      justifyContent: "center",
    },
    setupText: {
      color: colors.mainlyBlue,
      marginTop: ratioHeightBasedOniPhoneX(10),
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
          elevation: 8,
          shadowColor: colors.black,
        },
      }),
      flexDirection: "row",
      gap: ratioHeightBasedOniPhoneX(8),
      height: ratioHeightBasedOniPhoneX(62),
      marginTop: "auto",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.white,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    button: {
      height: ratioHeightBasedOniPhoneX(40),
      backgroundColor: colored.lightGreen,
      justifyContent: "center",
      alignSelf: "center",
      width: "50%",
      borderRadius: ratioHeightBasedOniPhoneX(24),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
  });

  const platform = () => {
    return Platform.OS === "ios"
      ? getMessage()
      : "Scan your Biometrics on the device scanner to continue";
  };

  const getMessage = () => {
    return biometryType === "Face ID"
      ? "Scan your Face on the device to continue"
      : "Scan your Fingerprint on the device scanner to continue";
  };

  const checkSensorAvailability = async () => {
    try {
      const type = await FingerprintScanner.isSensorAvailable();
      setBiometryType(type);
      showAuthenticationDialog();
    } catch (error) {}
  };

  const showAuthenticationDialog = async () => {
    FingerprintScanner.authenticate({
      description: platform(),
    })
      .then(async (value) => {
        const { publicKey } = await rnBiometrics.createKeys();

        const data = new BiometricAuthRequestModel(true, false, publicKey);
        handleResponse(
          data,
          setLoading,
          () => setLoading(false),
          navigation,
          showTextPopup,
          "MainTab"
        );
      })
      .catch((error) => {
        console.log("Fail");
      })
      .finally(() => {
        FingerprintScanner.release();
      });
  };

  const setUpLaterButtonPress = async () => {
    const data = new BiometricAuthRequestModel(false, true);
    handleResponse(
      data,
      setLoading,
      () => setLoading(false),
      navigation,
      showTextPopup,
      "MainTab"
    );
  };

  const enableNowButtonPress = async () => {
    const { available } = await rnBiometrics.isSensorAvailable();
    if (available) {
      checkSensorAvailability();
    } else {
      showTextPopup(strings.error, strings.FaceIDErrorText);
    }
  };

  const renderTwoFactorButtons = (
    enableNowButtonPress: () => void,
    setUpLaterButtonPress: () => void
  ) => {
    return (
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={setUpLaterButtonPress}
          style={[
            styles.button,
            {
              backgroundColor: colored.buttonGray,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colored.lightblack }]}>
            Skip
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={enableNowButtonPress} style={styles.button}>
          <Text style={styles.buttonText}>Enable Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "black" : "white"}
        translucent={false}
      />
      <MainHeaderView
        title={"Biometric Setup"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={{ paddingHorizontal: ratioWidthBasedOniPhoneX(20) }}>
        <Text style={styles.BigText}>Biometric Setup</Text>
        <Text style={styles.descText}>
          Add fingerprint or face unlock to access your account easily
        </Text>
        <View style={{ alignItems: "center" }}>
          <UnlockImage style={styles.mainImage} />
          <Text style={styles.setupText}>
            Prepare to set up Face ID/Touch ID unlock, ensuring that there are
            no obstructions blocking the sensor or face.
          </Text>
        </View>
      </View>

      {renderTwoFactorButtons(enableNowButtonPress, setUpLaterButtonPress)}

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

export default BiometricSetup;
