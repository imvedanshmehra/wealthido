import React, { useContext } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";
import MainHeaderView from "../MainHeaderView";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import TransactionSuccess from "../assets/images/TransactionSucces.svg";

const OrdersTransaction = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const Data = [
    {
      id: 1,
      amount: "158 OZ",
      digital: "of Digital Gold",
      price: "123",
      card: "using card *****6742",
      date: "08-12-2023",
      successText: "Success",
    },
    {
      id: 2,
      amount: "158 OZ",
      digital: "of Digital Gold",
      price: "123",
      card: "using card *****6742",
      date: "08-12-2023",
      successText: "Success",
    },
    {
      id: 3,
      amount: "158 OZ",
      digital: "of Digital Gold",
      price: "123",
      card: "using card *****6742",
      date: "08-12-2023",
      successText: "Success",

    }
  ];

  const renderItem = (item: any) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.chitContainer}>
          <View style={styles.rowView}>
            <TransactionSuccess />
            <View style={{ marginRight: ratioHeightBasedOniPhoneX(5) }} />
            <View style={styles.column}>
              <Text>
                <Text style={styles.columnText}>${item.amount}</Text>
                <Text style={styles.textGray}>{item.digital}</Text>
              </Text>
              <Text>
                <Text style={styles.columnText}>${item.price}</Text>
                <Text style={styles.textGray}>{item.card}</Text>
              </Text>
            </View>
          </View>
          <View style={styles.columnEnd}>
            <Text style={styles.dateText}>{item.date}</Text>
            <View
              style={[
                styles.successBackground,
                {
                  backgroundColor: colors.greenColor,
                },
              ]}
            >
              <Text style={styles.successText}>{item.successText}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    headerText: {
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    cardContainer: {
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
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(70),
      backgroundColor: colored.cardBackGround,
      borderRadius: ratioHeightBasedOniPhoneX(8),
      marginBottom: ratioHeightBasedOniPhoneX(5),
      marginTop: ratioHeightBasedOniPhoneX(5),
      padding: ratioHeightBasedOniPhoneX(10),
      justifyContent: "center",
    },
    successBackground: {
      borderRadius: ratioHeightBasedOniPhoneX(12),
      paddingHorizontal: ratioWidthBasedOniPhoneX(5),
      height: ratioHeightBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(5),
      justifyContent: "center", // Center vertically
      overflow: "hidden",
    },
    successText: {
      color: colors.white,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      textAlign: "center", // Center horizontally
    },
    rowView: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },

    chitContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    column: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    columnEnd: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
    columnText: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    dateText: {
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    textGray: {
      color: colors.mainlyBlue,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <MainHeaderView
        title={"Orders & Transactions"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <Text style={styles.headerText}>Transactions</Text>
      <View style={{ marginTop: ratioHeightBasedOniPhoneX(5) }} />
      <FlatList
        data={Data}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item: any) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
export default OrdersTransaction;
