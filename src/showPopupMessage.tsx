import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "./Extension/ScreenUtils";
import { ThemeContext } from "./Networking/themeContext";
import { dark, light } from "./colors";

/**
 * Renders a modal alert message with a title, description, and a confirm button.
 * The appearance of the alert message is determined by the current theme set in the `ThemeContext`.
 *
 * @component
 *
 * @example
 * ```tsx
 * <ShowAlertMessage
 *   isVisible={true}
 *   message="Alert"
 *   descriptionMessage="This is an alert message"
 *   onConfirm={() => { console.log("Confirmed"); }}
 * />
 * ```
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isVisible - Determines whether the alert message is visible or not.
 * @param {string} props.message - The title of the alert message.
 * @param {string} props.descriptionMessage - The description text of the alert message.
 * @param {function} props.onConfirm - The callback function to be called when the confirm button is pressed.
 *
 * @returns {JSX.Element} The rendered alert message component.
 */
const ShowPopuptMessage = ({
  isVisible,
  message,
  descriptionMessage,
  onConfirm,
}: {
  isVisible: boolean;
  message: string;
  descriptionMessage: string;
  onConfirm: Function;
}): JSX.Element => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colored.background,
      padding: ratioHeightBasedOniPhoneX(20),
      borderRadius: ratioHeightBasedOniPhoneX(10),
      alignItems: "center",
      borderColor:colored.shadowColor,
      borderWidth:ratioWidthBasedOniPhoneX(1),
    },
    titleText: {
      fontSize: ratioHeightBasedOniPhoneX(18),
      fontFamily: "Inter-Regular",
      textAlign: "center",
      color: colored.textColor,
      marginBottom: ratioHeightBasedOniPhoneX(10),
    },
    descriptionText: {
      fontSize: ratioHeightBasedOniPhoneX(16),
      marginBottom: ratioHeightBasedOniPhoneX(20),
    },
    buttonContainer: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      flexDirection: "row",
      justifyContent: "center",
    },
    button: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(30),
      paddingVertical: ratioWidthBasedOniPhoneX(5),
      borderRadius: ratioHeightBasedOniPhoneX(15),
      marginRight: ratioWidthBasedOniPhoneX(10),
    },
    buttonText: {
      fontSize: ratioHeightBasedOniPhoneX(16),
      color: colored.background,
    },
    confirmButton: {
      backgroundColor: colored.textColor,
    },
  });

  return (
    <Modal isVisible={isVisible} backdropOpacity={theme == "dark" ? 0.1 : 0.5}>
      <View style={styles.container}>
        <Text style={styles.titleText}>{message}</Text>
        {descriptionMessage && (
          <Text style={styles.descriptionText}>{descriptionMessage}</Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={onConfirm}
          >
            <Text style={[styles.buttonText]}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ShowPopuptMessage;
