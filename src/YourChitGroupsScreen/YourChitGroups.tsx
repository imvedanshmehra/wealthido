import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TabView, SceneMap } from "react-native-tab-view";
import YourChitGroupOnGoing from "./YourChitGroupOnGoing";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ChitStatus, filterChitsByStatus } from "../enums";
import { ThemeContext } from "../Networking/themeContext";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";

// Renders a screen with two tabs: "Ongoing" and "Upcoming" to display chit groups based on their status.
const YourChitGroups = () => {
  const route = useRoute();
  const userJoinedData = route.params?.userJoinedData;
  const [index, setIndex] = useState(0);
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const [routes] = useState([
    { key: "ongoing", title: "Ongoing" },
    { key: "upcoming", title: "Upcoming" }, // Change the key to 'upcoming'
  ]);

  // Renders a TabView component with two scenes: "ongoing" and "upcoming".
  // Each scene renders a YourChitGroupOnGoing component with filtered chit data based on the status of the chits.
  const renderScene = SceneMap({
    ongoing: () => (
      <YourChitGroupOnGoing
        userJoinedDatas={filterChitsByStatus(
          userJoinedData.list,
          ChitStatus.ONGOING
        )}
      />
    ),
    upcoming: () => (
      <YourChitGroupOnGoing
        userJoinedDatas={filterChitsByStatus(
          userJoinedData.list,
          ChitStatus.UPCOMING
        )}
      />
    ),
  });

  // Renders a custom tab bar component for the TabView component.
  const renderTabBar = (props: {
    navigationState: { routes: any[]; index: any };
  }) => (
    <View style={styles.segmentContainer}>
      {props.navigationState.routes.map((route, i) => {
        const isActive = i === props.navigationState.index;
        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.segmentButton,
              isActive && styles.activeSegmentButton,
            ]}
            onPress={() => setIndex(i)}
            activeOpacity={1}
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

  // Defines the styles for a component called `YourChitGroups`.
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    view: {
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
    },
    headerContainer: {
      marginTop: ratioHeightBasedOniPhoneX(20),
      flexDirection: "row",
      alignItems: "center",
    },
    backButtonImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      resizeMode: "contain",
      tintColor: colored.textColor,
    },
    headerTextContainer: {
      flex: 1,
      alignItems: "center",
    },
    headerText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    segmentContainer: {
      backgroundColor: colored.segementBackGround,
      borderRadius: ratioHeightBasedOniPhoneX(30),
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
      backgroundColor: colored.segementActiveColor,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      height: ratioHeightBasedOniPhoneX(36),
      marginVertical: ratioHeightBasedOniPhoneX(2),
      marginHorizontal: ratioWidthBasedOniPhoneX(2),
      marginBottom: ratioHeightBasedOniPhoneX(1),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      flex: 1, // Equal spacing
    },
    segmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      color: colors.tabText,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    activeSegmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(3),
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
  });

  // Renders a screen layout with a header and a TabView component.
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <MainHeaderView
        title="Your Digital Chits"
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
        />
      </View>
    </SafeAreaView>
  );
};

export default YourChitGroups;
