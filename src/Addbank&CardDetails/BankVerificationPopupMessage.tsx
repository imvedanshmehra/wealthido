import React, { useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import colors, { dark, light } from "../colors";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { ThemeContext } from "../Networking/themeContext";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import VerificationFailedImage from "../assets/images/VerificationFailedIcon.svg";
import VerificationSuccessImage from "../assets/images/VerificationSuccesIcon.svg";

interface ShowAlertMessageProps {
  isVisible: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
}

const BankVerificationPopupmessage: React.FC<ShowAlertMessageProps> = ({
  isVisible,
  title,
  subtitle,
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
      backgroundColor: colored.headerColor,
      paddingHorizontal: ratioHeightBasedOniPhoneX(24),
      paddingBottom: ratioHeightBasedOniPhoneX(24),
      borderRadius: ratioHeightBasedOniPhoneX(10),
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
      borderColor: colored.shadowColor,
      borderWidth: ratioWidthBasedOniPhoneX(0.8),
    },
    verificationText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
      color: colors.lightblack,
    },
    verificationsubtitle: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
      color: colors.mainlyBlue,
    },
    buttonView: {
      marginTop: ratioHeightBasedOniPhoneX(16),
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    closeButton: {
      backgroundColor: colors.buttonGray,
      height: ratioHeightBasedOniPhoneX(48),
      marginTop: ratioHeightBasedOniPhoneX(30),
      width: "100%",
      padding: ratioHeightBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(37),
      alignItems: "center",
    },
    closeButtonText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(18)),
      color: colors.lightblack,
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
          {title == "Verification Failed" ? (
            <VerificationFailedImage
              style={{
                marginTop: -ratioHeightBasedOniPhoneX(30),
                marginLeft: ratioWidthBasedOniPhoneX(-180),
              }}
            />
          ) : (
            <VerificationSuccessImage
              style={{
                marginTop: -ratioHeightBasedOniPhoneX(30),
                marginLeft: ratioWidthBasedOniPhoneX(-180),
              }}
            />
          )}
          <View style={[styles.buttonView]}>
            <Text style={styles.verificationText}>{title}</Text>
            <Text style={styles.verificationsubtitle}>{subtitle}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BankVerificationPopupmessage;
