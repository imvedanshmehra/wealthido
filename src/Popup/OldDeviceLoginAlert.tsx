import React, { useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { ThemeContext } from "../Networking/themeContext";

interface OldDeviceLoginAlert {
  isVisible: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const OldDeviceLoginAlert: React.FC<OldDeviceLoginAlert> = ({
  isVisible,
  message,
  onConfirm,
  onClose,
}) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    androidShadow: {
      elevation: 2,
    },
    popupContainer: {
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      borderRadius: ratioHeightBasedOniPhoneX(16),
      justifyContent: "center",
      alignItems: "center",
      width: "80%",
      paddingBottom: ratioHeightBasedOniPhoneX(20),
    },
    popupText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(15),
      paddingHorizontal: ratioWidthBasedOniPhoneX(10),
      textAlign: "center",
      marginBottom: ratioHeightBasedOniPhoneX(20),
    },
    buttonConainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: ratioHeightBasedOniPhoneX(10),
      paddingTop: theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(10),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
    },
    closeButton: {
      backgroundColor:
        theme === "light" ? colors.buttonGray : colored.cancelButtonBg,
      height: ratioHeightBasedOniPhoneX(40),
      borderRadius: ratioHeightBasedOniPhoneX(28),
      alignItems: "center",
      flex: 0.5,
      justifyContent: "center",
    },
    closeButtonText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
      color: theme === "light" ? colors.black : colors.white,
      textAlign: "center",
    },
    confirmButton: {
      backgroundColor: colors.orange,
      height: ratioHeightBasedOniPhoneX(40),
      borderRadius: ratioHeightBasedOniPhoneX(28),
      alignItems: "center",
      flex: 0.5,
      justifyContent: "center",
    },
    confirmButtonText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
      color: colors.white,
      textAlign: "center",
    },
    ImageStyle: {
      height: ratioHeightBasedOniPhoneX(74),
      width: "100%",
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalContainer,
          Platform.OS === "ios" ? null : styles.androidShadow,
        ]}
      >
        <View
          style={[
            styles.popupContainer,
            Platform.OS === "ios" ? null : styles.androidShadow,
          ]}
        >
          <Image
            source={require("../assets/images/AlertBgOrange.png")}
            style={styles.ImageStyle}
          />
          <Text style={styles.popupText}>{message}</Text>
          <View style={styles.buttonConainer}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>No</Text>
            </TouchableOpacity>
            <View style={{ marginLeft: ratioWidthBasedOniPhoneX(16) }}></View>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OldDeviceLoginAlert;
