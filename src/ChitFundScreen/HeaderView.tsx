import React, { useContext } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";
import { useNavigation } from "@react-navigation/native";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import HeaderTransaction from "../assets/images/Header_Transaction.svg";
import UserIcon from "../assets/images/homeImage/UserIcon.svg";

const HeaderView = ({ title, onPress }) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    headerContent: {
      backgroundColor: colored.darkheaderColor,
      height: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? 78 : 53),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      paddingTop: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? 36 : 0),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      ...Platform.select({
        ios: {
          shadowColor: theme !== "dark" ? colors.silverGrayColor : undefined,
          shadowOffset: { width: 0, height: 3.7 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          elevation: theme !== "dark" ? 8 : undefined,
          shadowColor: theme !== "dark" ? colors.black : undefined,
        },
      }),
    },
    image: {
      height: ratioHeightBasedOniPhoneX(36),
      width: ratioHeightBasedOniPhoneX(36),
      backgroundColor: theme !== "dark" ? "#FFF3E6" : "#41464C",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ratioHeightBasedOniPhoneX(36),
    },
    headerTitle: {
      color: colors.orange,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(18)),
    },
    headerTextContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    backButtonImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      alignItems: "stretch",
      tintColor: colored.textColor,
    },
    buttonContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(30),
      borderRadius: ratioHeightBasedOniPhoneX(37),
      minWidth: ratioWidthBasedOniPhoneX(80),
      paddingHorizontal: ratioWidthBasedOniPhoneX(10),
    },
    buttonTextConfirm: {
      color: colors.white,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },

    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
    },
    androidShadow: {
      shadowColor: colors.black,
      elevation: 1,
    },
  });

  return (
    <View style={{ backgroundColor: colored.headerColor }}>
      <View style={styles.headerContent}>
        <View style={[title == "More" && { flex: 1 }]}>
          {title == "More" ? null : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EditProfile");
              }}
            >
              <View style={styles.image}>
                <UserIcon />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.headerTitle, title == "More" && { flex: 1 }]}>
          {title}
        </Text>
        {title == "More" ? null : (
          <TouchableOpacity onPress={onPress}>
            <HeaderTransaction />
          </TouchableOpacity>
        )}
        {title == "More" && (
          <View style={{ flex: 1 }}>
            <Text></Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default HeaderView;
