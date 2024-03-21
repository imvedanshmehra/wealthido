import React, { useContext, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { ThemeContext } from "../../Networking/themeContext";
import WealthidoFonts from "../../Helpers/WealthidoFonts";
import MainHeaderView from "../../MainHeaderView";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../../Extension/ScreenUtils";
import colors, { dark, light } from "../../colors";
import Opened from "./Opened";

const Ticket = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [index, setIndex] = useState(0);

  const routes = [
    { key: "Opened", title: "Opened" },
    { key: "completed", title: "Completed" },
  ];

  const renderScene = SceneMap({
    Opened: () => <Opened status={"Opened"} />, // Always render the 'Ongoing' tab
    completed: () => <Opened status={"Completed"} />,
  });

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
      borderRadius: ratioHeightBasedOniPhoneX(30),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(44),
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
      height: ratioHeightBasedOniPhoneX(42),
      marginTop: ratioHeightBasedOniPhoneX(1),
      marginBottom: ratioHeightBasedOniPhoneX(1),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      borderWidth:
        theme === "light"
          ? ratioWidthBasedOniPhoneX(1.5)
          : ratioWidthBasedOniPhoneX(0),
      borderColor: "#E6E6E6",
      flex: 1, // Equal spacing
    },
    segmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      color: colors.tabText,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    activeSegmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
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
        title="Ticket"
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

export default Ticket;
