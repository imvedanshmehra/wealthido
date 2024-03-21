import { useContext, useState } from "react";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { SceneMap, TabView } from "react-native-tab-view";
import All from "./All";
import { Transaction } from "../enums";
import MainHeaderView from "../MainHeaderView";
import WealthidoFonts from "../Helpers/WealthidoFonts";

/**
 * Renders a tab navigation interface using the TabView component from the react-native-tab-view library.
 * Includes a custom tab bar component for switching between tabs.
 */
const TabNavigator = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [index, setIndex] = useState(0);

  const routes = [
    { key: "all", title: "All" },
    { key: "deposit", title: "Deposit" },
    { key: "withdraws", title: "Withdraws" },
  ];

  // Generates a scene map for rendering different tab scenes.
  const renderScene = SceneMap({
    all: () => <All status={Transaction.ALL} />, // Always render the 'All' tab
    deposit: () => <All status={Transaction.DEPOSIT} />,
    withdraws: () => <All status={Transaction.WITHDRAW} />,
  });

  // Renders a custom tab bar for a navigation component.
  const renderTabBar = (props: any) => (
    <View style={styles.segmentContainer}>
      {props.navigationState.routes.map((route: any, i: any) => {
        const isActive = i === props.navigationState.index;
        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.segmentButton,
              isActive && styles.activeSegmentButton,
            ]}
            onPress={() => setIndex(i)}
          >
            <Text
              style={[
                styles.segmentButtonText,
                isActive && styles.activeSegmentButtonText,
              ]}
            >
              {route.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    headerContainer: {
      marginTop: ratioHeightBasedOniPhoneX(20),
      flexDirection: "row",
      marginHorizontal: ratioWidthBasedOniPhoneX(11),
      alignItems: "center", // Center the items vertically
    },
    backButtonImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      resizeMode: "contain",
      marginLeft: ratioWidthBasedOniPhoneX(10),
      tintColor: colored.textColor,
    },
    headerTextContainer: {
      flex: 1,
      alignItems: "center", // Center the text horizontally
    },
    headerText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
      color: colored.textColor,
    },
    segmentContainer: {
      backgroundColor: colored.segementBackGround,
      borderRadius: ratioHeightBasedOniPhoneX(22),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
      flexDirection: "row",
    },
    segmentButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flex: 1, // Equal spacing
    },
    activeSegmentButton: {
      marginVertical: ratioWidthBasedOniPhoneX(2),
      backgroundColor: colored.segementActiveColor,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      height: ratioHeightBasedOniPhoneX(36),
      flex: 1,
    },
    segmentButtonText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
      color: colors.tabText,
    },
    activeSegmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(3),
      color: colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    headerTextMain: {
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <MainHeaderView
        title="Transactions"
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <Text style={styles.headerTextMain}>Transactions</Text>
      <View
        style={[styles.container, { marginTop: ratioHeightBasedOniPhoneX(10) }]}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          lazy={true}
          lazyPreloadDistance={0}
        />
      </View>
    </View>
  );
};

export default TabNavigator;
