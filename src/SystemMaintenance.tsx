import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import colors, { dark, light } from "./colors";
import UnderMaintenanceImage from "./assets/images/underMaintenance.svg";
import { View } from "native-base";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "./Extension/ScreenUtils";
import { Text } from "react-native-paper";
import WealthidoFonts from "./Helpers/WealthidoFonts";
import { ThemeContext } from "./Networking/themeContext";
import RNExitApp from "react-native-exit-app";
import serverCommunication from "./Networking/serverCommunication";
import URLConstants from "./Networking/URLConstants";
import StorageService from "./StorageService";
import BackImage from "./assets/images/back.svg";
import WhiteBackImage from "./assets/images/WhiteBack.svg";
import Loader from "./Loader";
import HTTPStatusCode from "./Networking/HttpStatusCode";
import ShowAlertMessage from "./Popup/showAlertMessage";
import strings from "./Extension/strings";

const SystemMaintenance = () => {
  const navigation: any = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const marginPercentage = 0.17;
  const centerPercentage = 0.7;
  const marginWidth = ratioWidthBasedOniPhoneX(marginPercentage * 100);
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  useEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        getUserInfo();
        // Do Whatever you want to do on back button click
        // Return true to stop default back navigaton
        // Return false to keep default back navigaton
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    mainView: {
      flex: 1,
      backgroundColor: colored.headerColor,
      alignItems: "center",
    },
    underMaintenanceText: {
      marginTop: ratioHeightBasedOniPhoneX(24),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(20)),
      color: colored.textColor,
      textAlign: "center",
    },
    backSoonText: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
      color: colored.textColor,
      textAlign: "center",
    },
    backButton: {
      borderRadius: ratioHeightBasedOniPhoneX(24),
      paddingHorizontal: ratioWidthBasedOniPhoneX(12),
      marginTop: ratioHeightBasedOniPhoneX(24),
      backgroundColor: colors.orange,
      height: ratioHeightBasedOniPhoneX(39),
      justifyContent: "center",
    },
    backText: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(15)),
      color: colors.white,
      textAlign: "center",
    },

    // H4eaderView

    headerContent: {
      height: ratioHeightBasedOniPhoneX(50),
      paddingHorizontal: marginWidth,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    leftContainer: {
      flex: centerPercentage,
    },
    centerContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    rightContainer: {
      flex: centerPercentage,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
    },
    headerTitle: {
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    iconImage: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioHeightBasedOniPhoneX(32),
      borderRadius: ratioHeightBasedOniPhoneX(32),
    },
  });

  const getUserInfo = async () => {
    try {
      setLoading(true);
      await serverCommunication.getApi(
        URLConstants.userInfo,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            if (responseData.status == HTTPStatusCode.ok) {
              navigation.goBack();
            }
            StorageService.setIsLogin(responseData);
          } else {
            showTextPopup("", "System maintaining is Still OnGoing");
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "black" : "white"}
        translucent={false}
      />
      <View
        style={[
          styles.headerContent,
          {
            borderBottomColor: colored.borderBottomColor,
            borderBottomWidth: 1,
          },
        ]}
      >
        <View style={styles.leftContainer}>
          <TouchableOpacity
            onPress={() => {
              getUserInfo();
            }}
          >
            {theme === "dark" ? (
              <WhiteBackImage style={styles.image} />
            ) : (
              <BackImage style={styles.image} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.headerTitle,
              theme === "dark"
                ? { color: colors.white }
                : { color: colored.lightblack },
            ]}
          >
            {"System Maintenance"}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text children={undefined}></Text>
        </View>
      </View>
      <View
        style={[styles.mainView, { marginTop: ratioHeightBasedOniPhoneX(131) }]}
      >
        <UnderMaintenanceImage />

        <Text style={styles.underMaintenanceText}>
          We are Under Maintenance
        </Text>
        <Text style={styles.backSoonText}>Will be back soon!</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            RNExitApp.exitApp();
          }}
        >
          <Text style={styles.backText}>Exit</Text>
        </TouchableOpacity>
      </View>
      <Loader loading={loading} children={undefined} />
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SystemMaintenance;
