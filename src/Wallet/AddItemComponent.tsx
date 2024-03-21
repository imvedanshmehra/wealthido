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
} from "../Extension/ScreenUtils";
import React, { useContext } from "react";
import colors, { dark, light } from "../colors";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { ThemeContext } from "../Networking/themeContext";

interface AddItemComponentProps {
  IconComponent: React.ComponentType<any>;
  text: string;
  action: () => void;
  colorBackground: string
}

const AddItemComponent: React.FC<AddItemComponentProps> = ({
  IconComponent,
  text,
  action,
  colorBackground,
}) => {
  const newText = text.replace("Add ", "");
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const styles = StyleSheet.create({
    rowContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 0 },
          direction: "inherit",
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          shadowColor: colors.black,
          elevation: 4,
        },
      }),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colored.cardBackGround,
      marginTop: ratioHeightBasedOniPhoneX(15),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      padding: ratioHeightBasedOniPhoneX(16),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      borderWidth: ratioHeightBasedOniPhoneX(1),
      borderColor: colors.lightGreen,
    },
    balanceText: {
      color: colored.romanSilver,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    availableBalanceText: {
      color: colored.chitDetailTextColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
  });

  return (
    <View style={styles.rowContainer}>
      <View style={{ flexDirection: "row" }}>
        <IconComponent />
        <View
          style={{
            marginLeft: ratioWidthBasedOniPhoneX(8),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.balanceText,
              ]}
            >
              {text}
            </Text>
          </View>
          <Text style={styles.availableBalanceText}>
            {`Added ${newText.toLowerCase()} will be verified.`}
          </Text>
        </View>
      </View>

      <View
        style={{
          paddingVertical: ratioHeightBasedOniPhoneX(5),
          paddingHorizontal: ratioWidthBasedOniPhoneX(15),
          backgroundColor: colorBackground,
          borderRadius: ratioHeightBasedOniPhoneX(28),
        }}
      >
        <TouchableOpacity onPress={action}>
          <Text
            style={{
              color: colors.white,
              ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
            }}
          >
            {text}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddItemComponent;
