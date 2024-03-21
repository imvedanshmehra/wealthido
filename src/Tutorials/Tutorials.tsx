import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import { TutorialStatus } from "../enums";
import VideoTutorial from "./Videotutorial";
import { SceneMap, TabView } from "react-native-tab-view";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";

/**
 * Renders a screen with two tabs: "Video" and "Blog".
 *
 * @returns {ReactElement} The rendered screen with two tabs.
 */
const Tutorials = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [index, setIndex] = useState(0);

  /**
   * Defines an array of routes with their corresponding titles.
   */
  const routes = [
    { key: "video", title: "Video" },
    { key: "blog", title: "Blogs" },
  ];

  const renderScene = SceneMap({
    video: () => <VideoTutorial status={TutorialStatus.Video} />, // Always render the 'Ongoing' tab
    blog: () => <VideoTutorial status={TutorialStatus.Blogs} />,
  });

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
      marginVertical: ratioHeightBasedOniPhoneX(2),
      marginHorizontal: ratioWidthBasedOniPhoneX(1),
      borderColor: colored.segementActiveColor,
      flex: 1, // Equal spacing
    },
    segmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      color: colors.tabText,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    activeSegmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(3),
      color: colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
  });

  return (
    <View style={styles.container}>
      <MainHeaderView
        title="Tutorial"
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={[styles.container, {marginTop:ratioHeightBasedOniPhoneX(10)}]}>
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

export default Tutorials;
