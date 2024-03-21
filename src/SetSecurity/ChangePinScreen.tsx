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
import { useNavigation } from "@react-navigation/native";
import Loader from "../Loader";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import { ThemeContext } from "../Networking/themeContext";
import ShowAlertMessage from "../Popup/showAlertMessage";
import strings from "../Extension/strings";

/**
 * React component that allows the user to enter a new security PIN.
 * It displays a screen with a title, subtitle, and a pin pad for entering the PIN.
 * The entered PIN is stored in the component's state and is used to navigate to another screen if the PIN is valid.
 */
const ChangePinScreen = () => {
  const [enteredPin, setEnteredPin] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [pinCount, setPinCount] = useState(6);

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
      navigation.navigate("ConfirmPinScreen", { pin: enteredPin });
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
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    pinDisplay: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(40),
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
        Platform.OS == "android" ? 132 : 122
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
      height: ratioHeightBasedOniPhoneX(69),
      borderRadius: ratioHeightBasedOniPhoneX(35),
      marginBottom: ratioHeightBasedOniPhoneX(16),
      justifyContent: "center",
      color: colored.textColor,
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
    DigitPinText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
  });

  return (
    <View style={styles.container}>
      <MainHeaderView
        title={"Security Pin"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <Text style={styles.title}>Enter New Pin</Text>
      <Text style={styles.subtitle}>Enter your new security pin</Text>

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
    </View>
  );
};

export default ChangePinScreen;
