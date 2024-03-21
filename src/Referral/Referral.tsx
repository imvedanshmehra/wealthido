import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ImageBackground,
  StatusBar,
} from "react-native";
import colors, { dark, light } from "../colors";
import { useIsFocused } from "@react-navigation/native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import { SceneMap, TabView } from "react-native-tab-view";
import { Referral } from "../enums";
import ContactScreen from "./contacts";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import Loader from "../Loader";
import { ReferralResponseModel } from "./Model/ReferralResponseModel";

const ReferralScreen = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = React.useState(0);
  const isFocused = useIsFocused();
  const [referralData, setReferralDetails] =
    useState<ReferralResponseModel | null>(null);
  const routes = [
    { key: "code", title: "Code" },
    { key: "contacts", title: "Contacts" },
  ];

  const getReferral = async () => {
    setLoading(true);
    try {
      await serverCommunication.postApi(
        URLConstants.getReferral,
        null,
        (
          statusCode: number,
          responseData: ReferralResponseModel,
          error: any
        ) => {
          if (responseData.status == HTTPStatusCode.ok) {
            setReferralDetails(responseData);
          }
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getReferral();
    }
  }, [isFocused]);

  // Generates a scene map for rendering different tab scenes.
  const renderScene = SceneMap({
    code: () => (
      <ContactScreen
        status={Referral.Code}
        selectedIndex={index}
        setIndex={setIndex}
        referralData={referralData}
      />
    ), // Always render the 'Ongoing' tab
    contacts: () => (
      <ContactScreen
        status={Referral.Contacts}
        selectedIndex={index}
        setIndex={setIndex}
        referralData={referralData}
      />
    ),
  });

  useEffect(() => {
    if (isFocused) {
      setIndex(0);
    }
  }, [isFocused]);

  // Renders a custom tab bar for a navigation component.
  const renderTabBar = (props: {
    navigationState: { routes: any[]; index: any };
  }): React.JSX.Element => (
    <View style={styles.rowcontainer}>
      {props.navigationState.routes.map((route, i) => {
        const isActive = i === props.navigationState.index;
        return (
          <TouchableOpacity
            key={i}
            style={[styles.button, isActive && styles.buttonActive]}
            onPress={() => setIndex(i)}
          >
            <Text
              style={[styles.buttonText, isActive && styles.buttonActiveText]}
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
      backgroundColor: colored.background,
    },
    header: {
      backgroundColor: colored.headerColor,
      height: "auto",
    },
    headerContainer: {
      marginTop:
        Platform.OS == "android"
          ? ratioHeightBasedOniPhoneX(20)
          : ratioHeightBasedOniPhoneX(69),
      flexDirection: "row",
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
      alignItems: "center",
    },
    backButtonImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      resizeMode: "contain",
      tintColor: colored.white,
    },
    headerData: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: ratioHeightBasedOniPhoneX(10),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      width: "auto",
      height: ratioHeightBasedOniPhoneX(72),
      overflow: "hidden",
      gap: ratioWidthBasedOniPhoneX(10),
    },
    headerDataView: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center",
      padding: ratioHeightBasedOniPhoneX(15),
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      overflow: "hidden",
    },
    headerDataTextCompleted: {
      color: "#343434",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    headerDataTextReferralReward: {
      color: theme === "light" ? "#343434" : colors.lightGreyColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    headerDataValueCompleted: {
      color: theme === "light" ? colored.textColor : colors.darkgrey,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    headerDataValueReferralReward: {
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    rowcontainer: {
      marginHorizontal: ratioWidthBasedOniPhoneX(18),
      marginTop: ratioHeightBasedOniPhoneX(20),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colored.segementBackGround,
      height: ratioHeightBasedOniPhoneX(40),
      borderRadius: ratioHeightBasedOniPhoneX(30),
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flex: 1, // Equal spacing
    },

    buttonActive: {
      backgroundColor: colored.segementActiveColor,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      height: ratioHeightBasedOniPhoneX(36),
      borderWidth: ratioWidthBasedOniPhoneX(1.5),
      borderColor: theme === "light" ? "#E6E6E6" : "transparent",
      flex: 1, // Equal spacing/ Equal spacing
    },
    // Equal spacing
    buttonText: {
      color: colored.chitDetailTextColor,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    buttonActiveText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "black" : "white"}
        translucent={false}
      />
      <Loader loading={loading}>
        <View style={styles.header}>
          <MainHeaderView
            title="Referral"
            showImage={false}
            closeApp={false}
            bottomBorderLine={false}
            whiteTextColor={false}
          />

          <View style={styles.headerData}>
            <ImageBackground
              style={styles.headerDataView}
              source={require("../assets/images/primary-referral.png")}
            >
              <Text style={styles.headerDataTextCompleted}>Completed</Text>
              <Text style={styles.headerDataValueCompleted}>
                {referralData?.data?.referral?.completed ?? 0}
              </Text>
            </ImageBackground>
            <ImageBackground
              style={styles.headerDataView}
              source={
                theme === "light"
                  ? require("../assets/images/wallet_bg_referal.png")
                  : require("../assets/images/referral-reward-dark.png")
              }
            >
              <Text style={styles.headerDataTextReferralReward}>
                Referral Reward
              </Text>
              <Text style={styles.headerDataValueReferralReward}>
                {referralData?.data?.referral?.rewardAmount ?? 0}
              </Text>
            </ImageBackground>
          </View>
        </View>
        <View
          style={{
            backgroundColor: colored.background,
            flex: 1,
          }}
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
      </Loader>
    </View>
  );
};

export default ReferralScreen;
