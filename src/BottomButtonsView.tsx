import React, { useContext } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "./Extension/ScreenUtils";
import colors, { dark, light } from "./colors";
import WealthidoFonts from "./Helpers/WealthidoFonts";
import { ThemeContext } from "./Networking/themeContext";

interface BottomButtonsProps {
  firstText: string;
  secondText: string;
  onPressSuccess: () => void;
  onPressBack: () => void;
}
export const BottomButtonsView: React.FC<BottomButtonsProps> = ({
  firstText,
  secondText,
  onPressSuccess,
  onPressBack,
}) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const styles = StyleSheet.create({
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
      marginTop: "auto",
      flexDirection: "row",
      gap: ratioHeightBasedOniPhoneX(9),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      backgroundColor: colored.darkheaderColor,
      alignItems: "center",
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(62),
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    button: {
      backgroundColor: colors.lightGreen,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      marginVertical: ratioHeightBasedOniPhoneX(16),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
  });

  return (
    <View style={styles.bottomContainer}>
      <TouchableOpacity
        onPress={onPressBack}
        style={[
          styles.button,
          {
            backgroundColor:
              theme === "light" ? colors.buttonGray : colored.cancelButtonBg,
          },
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            { color: theme === "light" ? colors.lightblack : colors.white },
          ]}
        >
          {firstText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressSuccess} style={styles.button}>
        <Text style={styles.buttonText}>{secondText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomButtonsView;
