import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import colors, { dark, light } from "./colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "./Extension/ScreenUtils";
import { ThemeContext } from "./Networking/themeContext";
import WealthidoFonts from "./Helpers/WealthidoFonts";

/**
 * Renders a modal popup with a message and two buttons for confirming or canceling an action.
 *
 * @component
 *
 * @param {boolean} isVisible - Determines whether the popup is visible or not.
 * @param {string} message - The message to be displayed in the popup.
 * @param {function} onClose - Callback function to be executed when the cancel button is clicked.
 * @param {function} onConfirm - Callback function to be executed when the confirm button is clicked.
 *
 * @returns {JSX.Element} The rendered modal popup.
 */
const LogoutPopupMessage = ({
  isVisible,
  message,
  onClose,
  onConfirm,
  tag,
}) => {
  const [confirmClicked, setConfirmClicked] = useState(false);
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const handleConfirmClick = () => {
    if (tag == 2) {
      if (!confirmClicked) {
        setConfirmClicked(true);
        onConfirm(); // Disable the button after the first click
        // Call the onConfirm function
      }
    } else {
      onConfirm();
    }
  };

  /**
   * Creates a StyleSheet object with various styles for a logout popup message component.
   *
   * @returns {Object} The StyleSheet object with the defined styles.
   */
  const styles = StyleSheet.create({
    container: {
      backgroundColor:
        theme === "light" ? colored.background : colored.darkheaderColor,
      height: "auto",
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
      borderRadius: ratioHeightBasedOniPhoneX(16),
    },
    titleText: {
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(14)),
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(15),
      textAlign: "center",
      paddingHorizontal: ratioHeightBasedOniPhoneX(15),
      marginBottom: ratioHeightBasedOniPhoneX(20),
    },
    descriptionText: {
      marginTop: ratioHeightBasedOniPhoneX(5),
      fontSize: ratioHeightBasedOniPhoneX(14),
      fontFamily: "Inter-Regular",
      color: colors.mainlyBlue,
      textAlign: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor:
        theme === "light" ? colors.white : colored.darkheaderColor,
      height: ratioHeightBasedOniPhoneX(60),
      borderBottomRightRadius: ratioWidthBasedOniPhoneX(16),
      borderBottomLeftRadius: ratioWidthBasedOniPhoneX(16),
      paddingHorizontal: ratioHeightBasedOniPhoneX(20),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      width: ratioWidthBasedOniPhoneX(127),
      borderRadius: ratioHeightBasedOniPhoneX(27),
    },
    buttonText: {
      color: colored.black,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    ImageStyle: {
      height: ratioHeightBasedOniPhoneX(74),
      width: ratioWidthBasedOniPhoneX(301),
    },
    androidShadow: {
      elevation: 6,
      shadowColor: colors.black,
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 1 },
      direction: "inherit",
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
  });

  return (
    <Modal isVisible={isVisible} backdropOpacity={theme == "dark" ? 0.5 : 0.5}>
      <View style={styles.container}>
        <Image
          source={require("./assets/images/AlertBgOrange.png")}
          style={styles.ImageStyle}
        />
        <Text style={styles.titleText}>{message}</Text>
        <View
          style={[
            styles.buttonContainer,
            Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  theme === "light"
                    ? colored.buttonGray
                    : colored.cancelButtonBg,
              },
            ]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.orange }]}
            onPress={handleConfirmClick}
          >
            <Text style={[styles.buttonText, { color: colors.white }]}>
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutPopupMessage;
