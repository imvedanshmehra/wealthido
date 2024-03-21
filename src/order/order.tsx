import React, { useContext, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  RootTag,
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
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";

const OrderView = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [index, setIndex] = useState(0);
  const navigation: NavigationProp<RootTag> = useNavigation();
  const routes = [
    { key: "ongoing", title: "Ongoing" },
    { key: "upcoming", title: "Completed" },
    { key: "completed", title: "Tranx History" },
  ];

  const renderScene = SceneMap({
    ongoing: () => <OnGoing status={ChitStatus.ONGOING} />, // Always render the 'Ongoing' tab
    upcoming: () => <OnGoing status={ChitStatus.COMPLETED} />,
    completed: () => <OnGoing status={ChitStatus.UPCOMING} />,
  });

  const renderTabBar = (props) => (
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
      tintColor: colored.textColor,
    },
    headerTextContainer: {
      flex: 1,
      alignItems: "center", // Center the text horizontally
    },
    headerText: {
      fontFamily: "Inter-Bold",
      fontSize: ratioHeightBasedOniPhoneX(16),
      color: colored.textColor,
    },
    listContainer: {
      flex: 1,
      backgroundColor: colored.background,
    },
    segmentContainer: {
      backgroundColor: colored.segementBackGround,
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginHorizontal: ratioWidthBasedOniPhoneX(15),
      height: ratioHeightBasedOniPhoneX(44),
      marginTop: ratioHeightBasedOniPhoneX(20),
      justifyContent: "center",
      marginBottom: ratioHeightBasedOniPhoneX(20),
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
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginVertical: ratioHeightBasedOniPhoneX(2),
      marginHorizontal: ratioWidthBasedOniPhoneX(1),
      borderColor: colored.segementActiveColor,
      flex: 1, // Equal spacing
    },
    segmentButtonText: {
      fontFamily: "Inter-Medium",
      fontSize: ratioHeightBasedOniPhoneX(14),
      paddingHorizontal: ratioWidthBasedOniPhoneX(15),
      color: colors.tabText,
    },
    activeSegmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(3),
      color: colored.textColor,
    },
    backImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      tintColor: colored.textColor,
    },
    durationRow: {
      flexDirection: "row",
      marginTop: ratioHeightBasedOniPhoneX(25),
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
      color: colors.black,
      fontSize: ratioHeightBasedOniPhoneX(16),
    },
    backImageView: {
      marginTop: ratioHeightBasedOniPhoneX(20),
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            source={require("../assets/images/left-arrow.png")}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Orders & Transaction</Text>
        </View>
      </View>
      <View style={styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          lazy={true}
          lazyPreloadDistance={0}
        />
      </View>
    </SafeAreaView>
  );
};

export default OrderView;
