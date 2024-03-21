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
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import { ThemeContext } from "../Networking/themeContext";
import ShowAlertMessage from "../Popup/showAlertMessage";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Defines the TypeScript type `RouteParams`.
 *
 * @typedef {Object} RouteParams
 * @property {string} [pin] - An optional property representing a pin of type string.
 */
export type RouteParams = {
  pin?: string;
};

/**
 * Functional component that renders a screen for confirming a PIN number.
 * Allows the user to enter a PIN number and verify it by re-entering the same PIN number.
 * If the entered PIN number matches the original PIN number, an API call is made to change the PIN number.
 * Includes a visual representation of the entered PIN number using dots.
 *
 * Example Usage:
 * <ConfirmPinScreen />
 *
 * Inputs:
 * - enteredConfirmPin: A state variable that stores the entered PIN number.
 * - navigation: A hook from the `react-navigation` library used for navigating between screens.
 * - loading: A state variable that indicates whether a loading spinner should be displayed.
 * - route: A hook from the `react-navigation` library used for accessing the route parameters.
 * - params: The route parameters passed to the screen.
 *
 * Flow:
 * 1. The user can enter a PIN number by pressing the digits on the pin pad.
 * 2. The entered PIN number is stored in the `enteredConfirmPin` state variable.
 * 3. If the user presses the "C" button, the `handlePinSubmit` function is called to submit the PIN number for verification.
 * 4. If the user presses the "X" button, the `handleClearPin` function is called to remove the last digit from the entered PIN number.
 * 5. If the entered PIN number matches the original PIN number and has a length of 6, an API call is made to change the PIN number.
 * 6. If the API call is successful, a success message is displayed and the user is navigated back to the previous screen.
 * 7. If the API call fails, an error message is displayed.
 * 8. If the entered PIN number does not match the original PIN number, an error message is displayed and the entered PIN number is cleared.
 *
 * Outputs:
 * - The rendered screen with a title, subtitle, pin display, pin pad, loading spinner, and toast message.
 */
const ConfirmPinScreen = () => {
  const [enteredConfirmPin, setEnteredConfirmPin] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const params = route?.params as RouteParams | undefined;
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  let pinCount = params?.pin?.length as number;

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const handlePinDigitPress = (digit: any) => {
    if (enteredConfirmPin.length < pinCount) {
      setEnteredConfirmPin(enteredConfirmPin + digit);
    }
  };

  const handleClearPin = () => {
    if (enteredConfirmPin.length > 0) {
      const newEnteredPin = enteredConfirmPin.slice(0, -1); // Remove the last character
      setEnteredConfirmPin(newEnteredPin);
    }
  };

  const clearPin = () => {
    if (enteredConfirmPin.length == pinCount) {
      const resetPin = enteredConfirmPin.slice(0, -6);
      setEnteredConfirmPin(resetPin);
    }
  };

  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const handlePinSubmit = async () => {
    const data = {
      newPinNumber: params?.pin,
      confirmPinNumber: enteredConfirmPin,
    };
    if (
      enteredConfirmPin.length === pinCount &&
      enteredConfirmPin === params?.pin
    ) {
      try {
        await serverCommunication.patchApi(
          URLConstants.changePinNumber,
          data,

          (statusCode: number, responseData: any, error: any) => {
            if (statusCode === HTTPStatusCode.ok) {
              showTextPopup(strings.success, responseData.message);
              setTimeout(() => {
                navigation.goBack();
                navigation.goBack();
              }, 1000);
            } else {
              showTextPopup(strings.error, responseData.message);
            }
          }
        );
      } catch (error) {
        showTextPopup(strings.error, strings.defaultError);
      }
    } else {
      showTextPopup(strings.error, "Pin does not match");
      clearPin();
    }
  };

  const renderPinDot = (index: any) => (
    <View
      key={index}
      style={[
        styles.pinDot,
        {
          backgroundColor:
            enteredConfirmPin.length > index
              ? colors.lightGreen
              : "transparent",
        },
      ]}
    />
  );

  const renderPinDigit = (item: any, index: any) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.pinDigit,
        index % 3 === 1 ? { marginHorizontal: 48 } : { marginHorizontal: 0 },
      ]}
      onPress={() => {
        if (item === "C") {
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    title: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    subtitle: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      color: colors.lightText,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    pinContainer: {
      flex: 1,
      paddingHorizontal: ratioWidthBasedOniPhoneX(12),
      marginTop: ratioHeightBasedOniPhoneX(40),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    pinDisplay: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    pinDot: {
      width: ratioHeightBasedOniPhoneX(30),
      height: ratioHeightBasedOniPhoneX(30),
      borderRadius: ratioHeightBasedOniPhoneX(15),
      borderWidth: ratioWidthBasedOniPhoneX(1),
      borderColor: colors.lightGreen,
    },
    pinPad: {
      borderTopWidth: theme == "dark" ? ratioHeightBasedOniPhoneX(1) : 0,
      borderTopColor: theme == "dark" ? colored.shadowColor : "transparent",
      marginTop: ratioHeightBasedOniPhoneX(
        Platform.OS == "android" ? 132 : 279
      ),
      backgroundColor: colored.headerColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(35),
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      color: colors.black,
      paddingBottom: ratioHeightBasedOniPhoneX(24),
    },
    pinDigit: {
      width: ratioHeightBasedOniPhoneX(69),
      height: ratioHeightBasedOniPhoneX(70),
      borderRadius: ratioHeightBasedOniPhoneX(35),
      marginBottom: ratioHeightBasedOniPhoneX(16),
      color: colored.textColor,
      justifyContent: "center",
      alignItems: "center",
    },
    pinDigitText: {
      borderColor: colors.lightblack,
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(30)),
    },
    clearImage: {
      width: ratioHeightBasedOniPhoneX(70),
      height: ratioHeightBasedOniPhoneX(70),
      borderRadius: ratioHeightBasedOniPhoneX(35),
      color: colored.textColor,
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 0.2, height: 0.2 },
      direction: "inherit",
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    androidShadow: {
      shadowColor: "black",
      elevation: 20,
    },
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"Security Pin"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <Text style={styles.title}>Confirm Pin</Text>
      <Text style={styles.subtitle}>Re-enter your security pin</Text>
      <View style={styles.pinContainer}>
        <View style={[styles.pinDisplay, { gap: pinCount == 4 ? 44 : 24 }]}>
          {Array(pinCount)
            .fill(null)
            .map((_, index) => renderPinDot(index))}
        </View>
      </View>

      <View
        style={[
          styles.pinPad,
          Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
        ]}
      >
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

export default ConfirmPinScreen;
