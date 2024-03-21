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
import strings from "../Extension/strings";

interface ShowAlertMessageProps {
  isVisible: boolean;
  title: string;
  message: string;
  isRegularAlert?: boolean;
  onClose: () => void;
}

const ShowAlertMessageProps: React.FC<ShowAlertMessageProps> = ({
  isVisible,
  title,
  isRegularAlert = false,
  message,
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
    ImageStyle: {
      height: ratioHeightBasedOniPhoneX(74),
      borderTopLeftRadius: ratioHeightBasedOniPhoneX(16),
      borderTopRightRadius: ratioHeightBasedOniPhoneX(16),
      width: "100%",
    },
    popupContainer: {
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      borderRadius: ratioHeightBasedOniPhoneX(16),
      justifyContent: "center",
      alignItems: "center",
      width: "80%",
    },
    titleText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
      color: theme === "light" ? colors.black : colors.white,
      marginTop: ratioHeightBasedOniPhoneX(15),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      textAlign: "center",
    },
    popupText: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
      color: theme === "light" ? colors.lightblack : colors.lightGreyColor,
      marginTop: ratioHeightBasedOniPhoneX(5),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      textAlign: "center",
      marginBottom: ratioHeightBasedOniPhoneX(20),
    },
    closeButton: {
      backgroundColor:
        theme === "light" ? colors.buttonGray : colored.cancelButtonBg,
      padding: ratioHeightBasedOniPhoneX(10),
      width: ratioWidthBasedOniPhoneX(180),
      borderRadius: ratioHeightBasedOniPhoneX(27),
      alignItems: "center",
    },
    closeButtonText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
      color: theme === "light" ? colors.black : colors.white,
    },
    bottomContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 4,
        },
      }),
      justifyContent: "center",
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      borderBottomLeftRadius: ratioHeightBasedOniPhoneX(16),
      borderBottomRightRadius: ratioHeightBasedOniPhoneX(16),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      paddingHorizontal: ratioWidthBasedOniPhoneX(60),
      height: ratioHeightBasedOniPhoneX(60),
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
            source={
              isRegularAlert
                ? require("../assets/images/AlertBgOrange.png")
                : title == strings.error
                ? require("../assets/images/AlertBgError.png")
                : require("../assets/images/AlertBgSuccess.png")
            }
            style={styles.ImageStyle}
          />
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.popupText}>{message}</Text>
          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ShowAlertMessageProps;
