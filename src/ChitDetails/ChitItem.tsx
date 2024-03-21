import React, { useContext } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";

interface ChitItemProps {
  title: string;
  description: any;
  month: string;
}

const ChitItem: React.FC<ChitItemProps> = ({ title, description, month }) => {
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
    subscriptionAmount: {
      color: theme === "light" ? colored.chitDetailLightText : colors.white,
      textAlign: "left",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    descriptionContainer: {
      marginTop: ratioHeightBasedOniPhoneX(5),
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardBackgroundView}>
        <Text style={styles.subscription}>{title}</Text>
        <Text style={[styles.descriptionContainer]}>
          <Text style={styles.subscriptionAmount}>{description}</Text>
          <Text style={styles.subscription}>{month}</Text>
        </Text>
      </View>
    </View>
  );
};

export default ChitItem;
