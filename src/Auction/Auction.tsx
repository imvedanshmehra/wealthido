import React, { useContext, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ChitStatus } from "../enums";
import { ThemeContext } from "../Networking/themeContext";
import OnGoing from "./OngoingScreen";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";

const Auction = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [index, setIndex] = useState(0);

  const routes = [
    { key: "ongoing", title: "Ongoing" },
    { key: "upcoming", title: "Upcoming" },
    { key: "completed", title: "Completed" },
  ];

  /**
   * Generates a scene map for rendering different tab scenes.
   *
   * @param {Object} scenes - An object that maps scene keys to functions that return JSX elements.
   * @returns {Object} A scene map with the specified scenes.
   */
  const renderScene = SceneMap({
    ongoing: () => <OnGoing status={ChitStatus.ONGOING} />, // Always render the 'Ongoing' tab
    upcoming: () => <OnGoing status={ChitStatus.UPCOMING} />,
    completed: () => <OnGoing status={ChitStatus.COMPLETED} />,
  });

  /**
   * Renders a custom tab bar for a navigation component.
   *
   * @param {object} props - The component's props.
   * @param {object} props.navigationState - The state of the navigation component.
   * @param {Array} props.navigationState.routes - An array of route objects.
   * @param {number} props.navigationState.index - The currently active route index.
   *
   * @returns {React.JSX.Element} A custom tab bar component.
   */
  const renderTabBar = (props: any): React.JSX.Element => (
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

    segmentContainer: {
      backgroundColor: colored.segementBackGround,
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      borderRadius: ratioHeightBasedOniPhoneX(30),
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
      justifyContent: "center",
      marginHorizontal: ratioWidthBasedOniPhoneX(2),
      marginVertical: ratioHeightBasedOniPhoneX(2),
      backgroundColor: colored.segementActiveColor,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      height: ratioHeightBasedOniPhoneX(36),
      flex: 1, // Equal spacing/ Equal spacing
    },
    segmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      color: colors.tabText,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(13)),
    },
    activeSegmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(3),
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <MainHeaderView
        title="Auction"
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      ></MainHeaderView>
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

export default Auction;
