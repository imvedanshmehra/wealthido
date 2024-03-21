import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Platform, AppState, View } from "react-native";
import Home from "./Home/Home";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "./Extension/ScreenUtils";
import colors, { dark, light } from "./colors";
import { ThemeContext } from "./Networking/themeContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChitFund from "./ChitFundScreen/ChitFund";
import GoldInvestment from "./GoldInvestment/GoldInvestment";
import more from "./More/more";
import house from "./assets/images/TabBarImage/house.svg";
import houseFill from "./assets/images/TabBarImage/house-fill.svg";
import server from "./assets/images/TabBarImage/server.svg";
import serverFill from "./assets/images/TabBarImage/server-fill.svg";
import goldInvest from "./assets/images/TabBarImage/goldInvest.svg";
import goldInvestFill from "./assets/images/TabBarImage/goldInvest-fill.svg";
import moreIcon from "./assets/images/TabBarImage/more.svg";
import moreIconFill from "./assets/images/TabBarImage/more-fill.svg";
import { useNavigation } from "@react-navigation/native";
import StorageService from "./StorageService";
import TokenManager from "./TokenManager";
import WealthidoFonts from "./Helpers/WealthidoFonts";

const MainTabs = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [token, setToken] = useState("");
  const [appState, setAppState] = useState(AppState.currentState);
  const [enableFinger, setenableFingerOrFaceLock] = useState();
  const navigation = useNavigation();

  const tabScreens = [
    {
      name: "HomeScreen",
      component: Home,
      label: "Home",
      iconDefault: house,
      iconFocused: houseFill,
    },
    {
      name: "ChitFundScreen",
      component: ChitFund,
      label: "Digital Chits",
      iconDefault: server,
      iconFocused: serverFill,
    },
    {
      name: "GoldInvestmentScreen",
      component: GoldInvestment,
      label: "Gold Invest",
      iconDefault: goldInvest,
      iconFocused: goldInvestFill,
    },
    {
      name: "More",
      component: more,
      label: "More",
      iconDefault: moreIcon,
      iconFocused: moreIconFill,
    },
  ];

  useEffect(() => {
    const getLoginResponse = async () => {
      const storedToken = TokenManager.getToken();
      const enableFingerOrFaceLock =
        await StorageService.getIsEnableFingerOrFaceLock();
      setenableFingerOrFaceLock(enableFingerOrFaceLock);
      setToken(storedToken);
    };

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "inactive") {
        navigation.navigate("SplashImageScreen");
      }
      if (nextAppState === "active" && Platform.OS == "ios") {
        navigation.goBack();
      }
      const isTransitioningToActive =
        appState === "background" &&
        nextAppState === "active" &&
        enableFinger === true &&
        token;
      if (isTransitioningToActive) {
        navigation.navigate("BioMetryScreens");
      }
      setAppState(nextAppState);
    };

    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    getLoginResponse();
    return () => {
      appStateListener.remove();
    };
  }, [appState, enableFinger]);

  const Tab = createBottomTabNavigator();
  return (
    <View style={[{ flex: 1, backgroundColor: colored.white, height: 90 }]}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: tabScreens.find((tab) => tab.name === route.name)?.label,
          tabBarIcon: ({ focused, color, size }) => {
            const Icon = focused
              ? tabScreens.find((tab) => tab.name === route.name)?.iconFocused
              : tabScreens.find((tab) => tab.name === route.name)?.iconDefault;
            return (
              <Icon
                style={{
                  width: size,
                  height: size,
                  resizeMode: "contain",
                }}
              />
            );
          },
          tabBarStyle: [
            {
              paddingTop: ratioHeightBasedOniPhoneX(10),
              paddingBottom:
                Platform.OS == "ios"
                  ? ratioHeightBasedOniPhoneX(40)
                  : ratioHeightBasedOniPhoneX(10),
              height: ratioHeightBasedOniPhoneX(
                Platform.OS == "android" ? 62 : 96
              ),

              borderTopColor:
                theme !== "dark" ? colored.shadowcolor : "#222528",
              backgroundColor: colored.darkheaderColor,
              borderTopWidth: ratioWidthBasedOniPhoneX(1),
            },
            Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
          ],
          tabBarLabelStyle: {
            marginTop: ratioHeightBasedOniPhoneX(2),
            ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
          },
          tabBarActiveTintColor:
            tabScreens.find((tab) => tab.name === route.name)?.label ==
            "Gold Invest"
              ? colors.borderYellow
              : colors.orange,
        })}
      >
        {tabScreens.map((tab, index) => (
          <Tab.Screen
            key={index}
            name={tab.name}
            component={tab.component}
            options={{ headerShown: false }}
            initialParams={{ tag: "2" }}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  ios: {
    shadowColor: colors.veryDarkShade,
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
  },
  android: {
    elevation: 5,
  },
});

export default MainTabs;
