import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { useNavigation, useRoute } from "@react-navigation/native";
import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import Loader from "../Loader";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import {
  SetSecurityAuthRequestModel,
  SetWithdrawAuthRequestModel,
} from "./Model/SetSecurityAuthRequestModel";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import { ThemeContext } from "../Networking/themeContext";
import ShowAlertMessage from "../Popup/showAlertMessage";
import StorageService from "../StorageService";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";

export type RouteParams = {
  phoneNumber?: number;
  amount?: number;
  tag?: string;
  password?: string;
};

/**
 * Renders a screen for entering a security PIN.
 * Handles PIN digit presses, PIN clearing, and PIN submission.
 * Communicates with a server to set the security PIN and perform a withdrawal.
 * Uses various styles and images to create a visually appealing UI.
 */
const SecurityPinScreen = () => {
  const [enteredPin, setEnteredPin] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const params = route?.params as RouteParams | undefined;
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [pinCount, setPinCount] = useState(6);

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const handlePinDigitPress = (digit: any) => {
    if (enteredPin.length < pinCount) {
      setEnteredPin(enteredPin + digit);
    }
  };

  const handleClearPin = () => {
    if (enteredPin.length > 0) {
      const newEnteredPin = enteredPin.slice(0, -1); // Remove the last character
      setEnteredPin(newEnteredPin);
    }
  };

  const handlePinSubmit = () => {
    if (enteredPin.length === pinCount) {
      const phoneNumber = params?.phoneNumber;
      const SetSecurityRequest = new SetSecurityAuthRequestModel(
        phoneNumber,
        enteredPin,
        pinCount,
        params?.password
      );
      setSecurityPinPassword(SetSecurityRequest);
    } else {
      showTextPopup(strings.error, "Invalid PIN");
    }
  };

  const setSecurityPinPassword = async (data: SetSecurityAuthRequestModel) => {
    setLoading(true);
    try {
      await serverCommunication.patchApi(
        URLConstants.setPinPassword,
        data,
        (statusCode: number, responseData: LoginResponseModel, error: any) => {
          if (!error) {
            if (responseData.status == HTTPStatusCode.ok) {
              StorageService.setIsLogin(responseData);
              if (
                responseData.data?.isVerified == true &&
                responseData.data.enablePinLock == true
              ) {
                navigation.reset({
                  index: 1,
                  routes: [
                    { name: "Logins" },
                    { name: "BiometricSetupScreen" },
                  ],
                });
              }
            } else {
              showTextPopup(responseData?.message ?? "");
            }
          } else {
            showTextPopup(responseData?.message ?? "");
          }
        }
      );
    } catch (error) {
      console.error("Error object:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (enteredPin.length === 6) {
      const amount = params?.amount as unknown as number;
      const withdrawvalue = new SetWithdrawAuthRequestModel(enteredPin, amount);
      setLoading(true);
      try {
        await serverCommunication.postApi(
          URLConstants.withdrawWalletAmount,
          withdrawvalue,
          (statusCode: number, responseData: any, error: any) => {
            if (responseData.status == HTTPStatusCode.ok) {
              setTimeout(() => {
                navigation.goBack();
                navigation.goBack();
              }, 1000);
            } else {
              showTextPopup(strings.error, responseData?.message ?? "");
            }
          }
        );
      } catch (error) {
        showTextPopup(strings.error, strings.defaultError);
      } finally {
        setLoading(false);
      }
    } else {
      showTextPopup(strings.error, "Invalid PIN");
    }
  };

  const renderPinDot = (index: any) => (
    <View
      key={index}
      style={[
        styles.pinDot,
        {
          backgroundColor:
            enteredPin.length > index ? colors.lightGreen : "transparent",
        },
      ]}
    />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioHeightBasedOniPhoneX(32),
      borderRadius: ratioHeightBasedOniPhoneX(32),
    },
    title: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(24)),
    },
    subtitle: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(5),
      color: colors.lightText,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    pinContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    pinDisplay: {
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(40),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    pinDot: {
      width: ratioHeightBasedOniPhoneX(30),
      height: ratioHeightBasedOniPhoneX(30),
      borderRadius: ratioHeightBasedOniPhoneX(15),
      borderWidth: ratioWidthBasedOniPhoneX(1),
      borderColor: colors.lightGreen,
    },
    pinPad: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        android: {
          elevation: 13,
          shadowColor: colors.black,
        },
      }),
      marginTop: ratioHeightBasedOniPhoneX(108),
      backgroundColor: colored.headerColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(35),
      flexDirection: "row",
      flex: 1,
      flexWrap: "wrap",
      justifyContent: "center",
      alignContent: "flex-end",
      color: colors.black,
    },
    pinDigit: {
      marginTop: ratioHeightBasedOniPhoneX(5),
      width: ratioHeightBasedOniPhoneX(69),
      height: ratioHeightBasedOniPhoneX(70),
      borderRadius: ratioHeightBasedOniPhoneX(35),
      marginBottom: ratioHeightBasedOniPhoneX(8),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "light" ? colors.white : "#272B30",
    },
    pinDigitText: {
      borderColor: colors.lightblack,
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(30)),
    },
    DigitPinText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    clearImage: {
      width: ratioHeightBasedOniPhoneX(70),
      height: ratioHeightBasedOniPhoneX(70),
      borderRadius: ratioHeightBasedOniPhoneX(35),
      color: colored.textColor,
    },
  });

  const renderPinDigit = (item: any, index: any) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.pinDigit,
        index % 3 === 1
          ? { marginHorizontal: ratioWidthBasedOniPhoneX(48) }
          : { marginHorizontal: ratioWidthBasedOniPhoneX(0) },
      ]}
      onPress={() => {
        if (item === "C" && params?.tag == "1") {
          handleWithdraw();
        } else if (item === "C" && params?.tag == "2") {
          handlePinSubmit();
        } else if (item === "X") {
          handleClearPin();
        } else {
          handlePinDigitPress(String(item));
        }
      }}
    >
      {item === "C" ? (
        <Image
          source={require("../assets/images/numberpad.png")}
          style={styles.clearImage}
        />
      ) : item === "X" ? (
        <Image
          source={require("../assets/images/numberPadCloseIcon.png")}
          style={styles.clearImage}
        />
      ) : (
        <Text style={styles.pinDigitText}>{item}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"Enter Security PIN"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />

      <Text style={styles.title}>Enter Security PIN</Text>
      <Text style={styles.subtitle}>
        {params?.tag == "1"
          ? "Enter your security PIN to withdraw"
          : "Add security PIN to secure your wallet fund"}
      </Text>

      <View style={styles.pinContainer}>
        <View style={[styles.pinDisplay, { gap: pinCount == 4 ? 44 : 24 }]}>
          {Array(pinCount)
            .fill(null)
            .map((_, index) => renderPinDot(index))}
        </View>
      </View>

      <TouchableOpacity
        style={{
          marginTop: ratioHeightBasedOniPhoneX(60),
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
        onPress={() => {
          setPinCount(pinCount == 6 ? 4 : 6);
          setEnteredPin("");
        }}
      >
        <Text>
          <Text style={[styles.DigitPinText, { color: colors.lightblack }]}>
            Use {""}
          </Text>
          <Text style={[styles.DigitPinText, { color: colors.orange }]}>
            {pinCount == 6 ? "4 Digit Pin" : "6 Digit Pin"}
          </Text>
        </Text>
      </TouchableOpacity>
      <View style={styles.pinPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "X", 0, "C"].map((item, index) =>
          renderPinDigit(item, index)
        )}
      </View>
      <Loader loading={loading} children={undefined} />
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SecurityPinScreen;
