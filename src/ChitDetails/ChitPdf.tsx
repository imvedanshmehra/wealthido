import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  Platform,
  StyleSheet,
} from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";

interface ChitPdfProps {
  description: string;
  onPress: () => void;
}

const ChitPdf: React.FC<ChitPdfProps> = ({ description, onPress }) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const styles = StyleSheet.create({
    card: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0.3, height: 0.3 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
        },
        android: {
          elevation: 13,
          shadowColor: colors.black,
        },
      }),
      width: ratioWidthBasedOniPhoneX(160),
      backgroundColor: colored.chitDetailContainer,
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    cardBackgroundView: {
      paddingVertical: ratioHeightBasedOniPhoneX(15),
      paddingHorizontal: ratioWidthBasedOniPhoneX(15),
    },
    subscription: {
      color:
        theme === "light" ? colored.chitDetailTextColor : colors.lightGreyColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    pdfView: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioWidthBasedOniPhoneX(48),
      borderRadius: ratioHeightBasedOniPhoneX(31),
      backgroundColor: colors.lightGreen,
      alignItems: "center",
      justifyContent: "center",
    },
    PdfText: {
      textAlign: "center",
      color: colors.white,
      paddingVertical: ratioHeightBasedOniPhoneX(1),
    },
    descriptionContainer: {
      marginTop: ratioHeightBasedOniPhoneX(5),
    },
  });

  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={colored.cardBackGround}
      style={styles.card}
    >
      <View style={styles.cardBackgroundView}>
        <View style={styles.pdfView}>
          <Text style={styles.PdfText}>PDF</Text>
        </View>
        <Text style={[styles.subscription, styles.descriptionContainer]}>
          {description}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default ChitPdf;
