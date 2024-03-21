import { FlatList, Image, Platform, StyleSheet, Text } from "react-native";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";
import { View } from "native-base";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import React, { useContext, useState } from "react";
import { FaqStatus } from "../enums";

interface ChitFundFaqProps {
  status: FaqStatus;
}

const ChitFundFaq: React.FC<ChitFundFaqProps> = ({ status }) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const [data, setData] = useState([
    {
      id: "1",
      title: "What are the advantages of participating in a digital chits?",
      amount:
        "There are 4 main advantages of investing in digital chits: \n  1.fund is the only financial instrument that allows customers to save and borrow from their own funds. \n  2.digital chits are one of the oldest forms of investments used by households to grow their money. Today, with FDs and RDs offering low interest rates of 5-6%, digital chits have become a much more attractive investment that offer more returns, and more value for money. \n 1.fund is the only financial instrument that allows customers to save and borrow from their own funds. \n  2.digital chits are one of the oldest forms of investments used by households to grow their money. Today, with FDs and RDs offering low interest rates of 5-6%, digital chits have become a much more attractive investment that offer more returns, and more value for money.",
      selected: false,
    },
    {
      id: "2",
      title: "What are the advantages of participating in a digital chits?",
      amount:
        "There are 4 main advantages of investing in digital chits: \n  1.fund is the only financial instrument that allows customers to save and borrow from their own funds. \n  2.digital chits are one of the oldest forms of investments used by households to grow their money. Today, with FDs and RDs offering low interest rates of 5-6%, digital chits have become a much more attractive investment that offer more returns, and more value for money.",
      selected: false,
    },

    {
      id: "3",
      title: "What are the advantages of participating in a digital chits?",
      amount:
        "There are 4 main advantages of investing in digital chits: \n  1.fund is the only financial instrument that allows customers to save and borrow from their own funds. \n  2.digital chits are one of the oldest forms of investments used by households to grow their money. Today, with FDs and RDs offering low interest rates of 5-6%, digital chits have become a much more attractive investment that offer more returns, and more value for money. \n 1.fund is the only financial instrument that allows customers to save and borrow from their own funds. \n  2.digital chits are one of the oldest forms of investments used by households to grow their money. Today, with FDs and RDs offering low interest rates of 5-6%, digital chits have become a much more attractive investment that offer more returns, and more value for money \n  money. Today, with FDs and RDs offering low interest rates of 5-6%, digital chits have become a much more attractive investment that offer more returns, and more value for money  money. Today, with FDs and RDs offering low interest rates of 5-6%, digital chits have become a much more attractive investment that offer more returns, and more value for money.",
      selected: false,
    },
  ]);

  const handleItemSelection = (id: string) => {
    const updatedDataSet = data.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          selected: !item.selected,
        };
      } else {
        return {
          ...item,
          selected: item.selected,
        };
      }
    });
    setData(updatedDataSet);
  };

  const renderItem = (Data: any, index: number) => {
    return (
      <View
        style={{ marginBottom: index != 2 ? ratioHeightBasedOniPhoneX(8) : 0 }}
      >
        <TouchableOpacity
          onPress={() => {
            handleItemSelection(Data.id);
          }}
        >
          <View style={styles.row}>
            <Text style={styles.headerText}>{Data.title}</Text>
            <Image
              source={
                Data.selected
                  ? require("../assets/images/up_arrow.png")
                  : require("../assets/images/down_arrow.png")
              }
              style={styles.downArrow}
            />
          </View>
        </TouchableOpacity>
        {Data.selected ? (
          <Text style={styles.subText}>{Data.amount}</Text>
        ) : null}
        {index !== 2 && (
          <View style={styles.divider}>
            <Divider />
          </View>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.background,
    },
    subcontainer: {
      marginTop: ratioHeightBasedOniPhoneX(1),
      marginHorizontal: ratioWidthBasedOniPhoneX(15),
      height: "auto",
      backgroundColor: colored.headerColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(24),
      paddingVertical: ratioHeightBasedOniPhoneX(24),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      marginBottom: ratioHeightBasedOniPhoneX(17),
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    headerText: {
      color: colored.textColor,
      width: ratioWidthBasedOniPhoneX(237),
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    downArrow: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(3),
      tintColor: colored.textColor,
    },
    subText: {
      marginTop: ratioHeightBasedOniPhoneX(8),
      color: colors.mainlyBlue,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },
    divider: {
      position: "relative",
      marginTop: ratioHeightBasedOniPhoneX(15),
      color: colors.lineColor,
      height: ratioHeightBasedOniPhoneX(2),
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 1 },
      direction: "inherit",
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    androidShadow: {
      shadowColor: "black",
      elevation: 1,
    },
    containeriosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 2 },
      direction: "inherit",
      shadowOpacity: 0.23,
      shadowRadius: 3,
    },
    containeandroidShadow: {
      shadowColor: colors.black,
      elevation: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.subcontainer,
          Platform.OS == "ios"
            ? styles.containeriosShadow
            : styles.containeandroidShadow,
        ]}
      >
        <FlatList
          data={data}
          renderItem={({ item, index }) => renderItem(item, index)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        ></FlatList>
      </View>
    </View>
  );
};
export default ChitFundFaq;
