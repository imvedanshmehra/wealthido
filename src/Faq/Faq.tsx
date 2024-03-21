import React, { useContext, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import colors, { dark, light } from "../colors";
import { FaqStatus } from "../enums";
import { ThemeContext } from "../Networking/themeContext";
import ChitFundFaq from "./chitfundfaq";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";


const Faq: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [index, setIndex] = useState(0);

  const routes = [
    { key: "chitfund", title: "Digital Chits" },
    { key: "digitalgold", title: "Digital Gold" },
    { key: "fundgurus", title: "Fund Gurus" },
  ];
  const renderScene = SceneMap({
    chitfund: () => <ChitFundFaq status={FaqStatus.ChitFund} />, // Always render the 'Ongoing' tab
    digitalgold: () => <ChitFundFaq status={FaqStatus.DigitalGold} />,
    fundgurus: () => <ChitFundFaq status={FaqStatus.FundGurus} />,
  });

  const renderTabBar = (props: any) => (
    <View style={styles.segmentContainer}>
      {props.navigationState.routes.map((route: any, i: number) => {
        const isActive = i === props.navigationState.index;
        return (
          <TouchableOpacity
            key={route.key}
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
      backgroundColor: colored.white,
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
      marginHorizontal: ratioWidthBasedOniPhoneX(15),
    },
    headerTextContainer: {
      flex: 1,
      alignItems: "center", // Center the text horizontally
    },
    headerText: {
      color: colored.textColor,
      marginRight: ratioWidthBasedOniPhoneX(35),
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
    },

    segmentContainer: {
      backgroundColor: colored.segementBackGround,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      marginHorizontal: ratioWidthBasedOniPhoneX(15),
      height: ratioHeightBasedOniPhoneX(44),
      marginTop: ratioHeightBasedOniPhoneX(10),
      justifyContent: "center",
      marginBottom: ratioHeightBasedOniPhoneX(15),
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
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(13)),
    },
    activeSegmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(3),
      color: colored.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(13)),
    },
  });

  return (
    <View style={styles.container}>
      <MainHeaderView
        title="Faq"
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        lazy={true}
        lazyPreloadDistance={0}
      />
    </View>
  );
};
export default Faq;


