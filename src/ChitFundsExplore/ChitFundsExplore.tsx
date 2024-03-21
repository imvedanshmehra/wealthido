import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ColorValue,
} from "react-native";
import { List, Divider } from "react-native-paper";
import colors, { dark, light } from "../colors";
import Pointer from "../assets/images/Pointer.svg";
import PointerBlack from "../assets/images/PointerBlack.svg";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";

interface ChitFundsExploreProps {
  onPress?: (value: boolean) => void;
  backOnPress?: () => void;
  buttonBackGroundColor: ColorValue;
  HeaderImage: any;
  title: string;
  theme: string;
  description: string;
}

const items: { title: string; description: string; size: number }[] = [
  {
    title: "A savings and borrowing model",
    description:
      "Digital Chits facilitate both saving and borrowing within a trusted community.",
    size: -10,
  },
  {
    title: "A savings and borrowing model",
    description:
      "Digital Chits facilitate both saving and borrowing within a trusted community.",
    size: -10,
  },
  {
    title: "A savings and borrowing model",
    description:
      "Digital Chits facilitate both saving and borrowing within a trusted community.",
    size: 20,
  },
];

const ChitFundsExplore: React.FC<ChitFundsExploreProps> = ({
  onPress,
  buttonBackGroundColor,
  HeaderImage,
  title,
  theme,
  description,
}) => {
  const colored = theme === "dark" ? dark : light;
  const startInvestButtonPress = () => {
    if (onPress) {
      onPress(true);
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    headerImageContainer: {
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
    },
    headerImage: {
      height: ratioHeightBasedOniPhoneX(260),
      width: ratioWidthBasedOniPhoneX(343),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    divider: {
      backgroundColor: colors.mainlyBlue,
      marginTop: ratioHeightBasedOniPhoneX(15),
      borderBottomWidth: 0.3,
    },
    chitFundsText: {
      marginTop: ratioHeightBasedOniPhoneX(15),
      color: colored.approxNightRider,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(24)),
    },
    subheader: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      color: colors.veryDarkGrayishYellow,
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
    },
    pointContainer: {
      backgroundColor: colored.headerColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    description: {
      color: colors.lightgrey,
      marginTop: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
    },
    listIcon: {
      marginTop: ratioHeightBasedOniPhoneX(-30),
    },
    listItem: {
      marginVertical: ratioHeightBasedOniPhoneX(-5),
    },

    bottomContainer: {
      marginTop: "auto",
      backgroundColor: colored.headerColor,
      height: ratioHeightBasedOniPhoneX(62),
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },

    button: {
      alignItems: "center",
      width: "100%",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      borderRadius: ratioHeightBasedOniPhoneX(37),
      backgroundColor: buttonBackGroundColor,
      marginBottom: ratioHeightBasedOniPhoneX(6),
    },
    buttonText: {
      fontFamily: "Inter-Medium",
      fontSize: ratioHeightBasedOniPhoneX(16),
      color: colors.white,
    },
    title: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
      color: colors.darkgrey,
    },
  });

  const ListItem = ({ title, description, index, size }) => {
    if (!title || !description) {
      // Handle the case where title or description is undefined
      return null; // or any fallback UI
    }

    return (
      <List.Item
        title={title}
        description={description}
        left={() => (
          <List.Icon
            icon={theme === "dark" ? PointerBlack : Pointer}
            style={styles.listIcon}
          />
        )}
        descriptionStyle={[
          styles.description,
          { fontSize: ratioHeightBasedOniPhoneX(12) },
        ]}
        titleStyle={[styles.title, { marginTop: ratioHeightBasedOniPhoneX(5) }]}
        style={[
          styles.listItem,
          { marginBottom: ratioHeightBasedOniPhoneX(size) },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MainHeaderView
        title={""}
        showImage={false}
        closeApp={false}
        bottomBorderLine={true}
        whiteTextColor={false}
      />

      <ScrollView
        style={styles.pointContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerImageContainer}>
          <HeaderImage style={styles.headerImage} />
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.chitFundsText}>{title}</Text>
        <Text style={styles.subheader}>{description}</Text>
        {items.map((item, index) => (
          <ListItem
            key={index}
            title={item.title}
            description={item.description}
            index={index}
            size={item.size}
          />
        ))}
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={startInvestButtonPress}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Start Invest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChitFundsExplore;
