import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Divider, ProgressBar } from "react-native-paper";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ChitGroupResponseModelDatum } from "../ChitFundScreen/Model/ChitGroupResponseModelDatum";
import {
  ProgressDaysDifference,
  calculateDaysDifference,
  calculateProgressRatio,
  formatDate,
} from "../Utility";
import { ChitStatus } from "../enums";
import { ThemeContext } from "../Networking/themeContext";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import ChitFundImage from "../assets/images/chitDetails_large.svg";
import DollorSymbol from "../assets/images/svg/ant-design_dollar-circle-filled.svg";
import AuctionSymbol from "../assets/images/svg/ri_auction-fill.svg";
import NoData from "../NoData";

// Renders a list of chit groups based on the provided data.

const YourChitGroupOnGoing = ({ userJoinedDatas }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  /**
   * Navigates to the "chitDetails" screen with the provided tag and data.
   *
   * @param {any} tag - The tag parameter is used to identify the selected item.
   * @param {ChitGroupResponseModelDatum} data - The data parameter is an object of type `ChitGroupResponseModelDatum` that contains information about the selected item.
   * @returns {void}
   */
  const didselectItem = (
    tag: any,
    data: ChitGroupResponseModelDatum,
    back: any
  ) => {
    navigation.navigate("chitDetails", { tag, data, back });
  };

  // Defines a StyleSheet object with various styles for a component in a React Native application.
  const styles = StyleSheet.create({
    listBg: {
      backgroundColor: colored.headerColor,
      flex: 1,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(64),
      width: ratioWidthBasedOniPhoneX(64),
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    card: {
      flex: 1,
      backgroundColor: colored.cardBackGround,
      padding: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(335),
      height: ratioHeightBasedOniPhoneX(159),
      borderRadius: ratioHeightBasedOniPhoneX(5),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: ratioHeightBasedOniPhoneX(10),
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
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
      elevation: 4,
    },
    justifyCard: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: ratioHeightBasedOniPhoneX(20),
    },
    cardInner: {
      flex: 1,
      flexDirection: "row",
    },
    cardImage: {
      marginRight: ratioWidthBasedOniPhoneX(10),
    },
    subTitle: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    subTitleEnd: {
      color: colored.lightText,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    subTitleEndYour: {
      color: colored.lightText,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    progressText: {
      color: colored.chitsubColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(8)),
    },
    progress: {
      marginTop: ratioHeightBasedOniPhoneX(40),
      width: "100%",
      marginBottom: ratioHeightBasedOniPhoneX(0),
    },
    cardFooter: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: ratioHeightBasedOniPhoneX(15),
    },
    subTitleEndCard: {
      color: colored.lightText,
      marginRight: ratioWidthBasedOniPhoneX(5),
      marginLeft: ratioWidthBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    subTitleEndblack: {
      color: colored.lightblack,
      marginRight: ratioWidthBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    payText: {
      fontFamily: "Inter-Medium",
      color: colors.lightGreen,
      fontSize: ratioHeightBasedOniPhoneX(14),
    },
    subTitleEndGray: {
      color: colors.grayColor,
      marginRight: ratioWidthBasedOniPhoneX(5),
      marginLeft: ratioWidthBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    lastItemPadding: {
      marginBottom: ratioHeightBasedOniPhoneX(20),
    },
    subTitleValue: {
      color: colored.lightblack,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
  });

  // Renders a card view with information about a chit group.
  const renderFirstTypeItem = (
    data: ChitGroupResponseModelDatum,
    index: number
  ) => {
    const isLastItem = index === userJoinedDatas.length - 1;
    const fromDate = new Date(data?.from ?? "");
    const daysDifference = calculateDaysDifference(fromDate, data.chitduration);
    const progressRatio = calculateProgressRatio(
      ProgressDaysDifference(fromDate),
      data.chitduration
    );
    const formattedDate = formatDate(data.auctionDate);
    const st = data.chitStatus;
    return (
      <TouchableOpacity
        onPress={() => {
          data.chitStatus == ChitStatus.ONGOING
            ? data.auctionStatus == ChitStatus.ONGOING
              ? didselectItem("2", data, 0)
              : didselectItem("1", data, undefined)
            : didselectItem("1", data, undefined);
        }}
        activeOpacity={1}
      >
        <View
          style={[
            styles.card,
            isLastItem && styles.lastItemPadding,
            Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
            index == 0 && { marginTop: ratioHeightBasedOniPhoneX(15) },
          ]}
        >
          <View style={styles.justifyCard}>
            <View style={styles.cardInner}>
              <View style={styles.cardImage}>
                <ChitFundImage />
              </View>
              <View>
                <Text style={styles.subTitle}>{data.chitGroupName}</Text>
                <Text style={styles.subTitleEnd}>{data.chitGroupId} </Text>
                <Text style={styles.subTitleEndYour}>
                  Value :
                  <Text
                    style={styles.subTitleValue}
                  >{`$${data.chitValue}`}</Text>
                </Text>
              </View>
            </View>
            <View></View>
            <View>
              <AnimatedCircularProgress
                size={36}
                width={ratioWidthBasedOniPhoneX(4)}
                fill={ProgressDaysDifference(fromDate) / data.chitduration}
                tintColor="#FF8001"
                backgroundColor={theme === "dark" ? "#808185" : "#FFDBB5"}
              >
                {(fill) => (
                  <Text style={styles.progressText}>{daysDifference}</Text>
                )}
              </AnimatedCircularProgress>
            </View>
          </View>
          <View style={styles.progress}>
            <ProgressBar
              progress={progressRatio}
              color={colors.lightGreen}
              style={{
                backgroundColor: colored.progressColor,
                height: ratioHeightBasedOniPhoneX(4),
                borderRadius: ratioHeightBasedOniPhoneX(15),
              }}
            />
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.cardInner}>
              <View style={{ marginTop: ratioHeightBasedOniPhoneX(-1) }}>
                <DollorSymbol />
              </View>
              <View>
                <Text style={styles.subTitleEndCard}>Due:</Text>
              </View>
              <View>
                <Text style={styles.subTitleEndblack}>
                  ${data.contribution}
                </Text>
              </View>

              {formattedDate !== "Invalid Date" ? (
                <View style={{ flexDirection: "row" }}>
                  <AuctionSymbol />
                  <Text style={styles.subTitleEndGray}>{formattedDate}</Text>
                  <Text style={styles.subTitleEndblack}>{"(" + st + ")"}</Text>
                </View>
              ) : null}
            </View>
            <View>{/* <Text style={styles.payText}>{'Pay >'}</Text> */}</View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Renders a view that displays a list of chit groups based on the provided data.
  return (
    <View style={styles.listBg}>
      {userJoinedDatas && userJoinedDatas.length > 0 ? (
        <FlatList
          data={userJoinedDatas}
          renderItem={({ item, index }) => renderFirstTypeItem(item, index)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <NoData marginTop={160} />
      )}
    </View>
  );
};

export default YourChitGroupOnGoing;
