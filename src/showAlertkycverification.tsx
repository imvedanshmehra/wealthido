import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "./Extension/ScreenUtils";
import { ThemeContext } from "./Networking/themeContext";
import { dark, light } from "./colors";
import AddBankImage from "./assets/images/add-bank.svg";

// Renders a modal alert with a title, description, and confirm button.
//  The appearance of the alert is determined by the current theme set in the `ThemeContext`.
const ShowAlertkycMessage = ({
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
      color: colored.dimGray,
      //   marginBottom: ratioHeightBasedOniPhoneX(20),
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
    image: {
      height: ratioHeightBasedOniPhoneX(35),
      width: ratioWidthBasedOniPhoneX(35),
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    column: {
      flexDirection: "column",
      justifyContent: "flex-start",
    },
  });

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <View style={styles.container}>
        <Text style={styles.titleText}>{message}</Text>

        <View style={styles.column}>
          <View style={styles.row}>
            <Image
              source={require("./assets/images/wallet.png")}
              style={styles.image}
            />
            <Text style={styles.descriptionText}>KYC Verification</Text>
          </View>

          <View style={styles.row}>
            <AddBankImage style={styles.image} />
            <Text style={styles.descriptionText}>Add Card & Bank Details</Text>
          </View>
        </View>
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

export default ShowAlertkycMessage;
