import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import {
  NotificationModelDatum,
  NotificationModelResponse,
} from "./NotificationModel/NotificationModelResponse";
import { formatDate, formatUtcTimeTo12Hour } from "../Utility";
import { ThemeContext } from "../Networking/themeContext";
import LogoutPopupMessage from "../LogoutPopupMessage";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import Loader from "../Loader";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import ShowAlertMessage from "../Popup/showAlertMessage";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import MainHeaderView from "../MainHeaderView";
import NoData from "../NoData";
import strings from "../Extension/strings";

const Notification = () => {
  const [getNotificationData, setNotificationData] =
    useState<NotificationModelResponse>();
  const isFocused = useIsFocused();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [dataReceived, setDataReceived] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      getNotification();
    }
  }, [isFocused]);

  const getNotification = async () => {
    setDataReceived(false);
    try {
      await serverCommunication.getApi(
        URLConstants.getNotification,
        (statusCode: any, responseData: any, error: any) => {
          setDataReceived(true);
          if (!error) {
            setNotificationData(responseData);
          } else {
          }
        }
      );
    } catch (error) {
      setDataReceived(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async () => {
    setLoading(true);
    try {
      await serverCommunication.deleteApi(
        URLConstants.deleteNotification,
        (statusCode: any, responseData: any, error: any) => {
          hideAlert();
          if (responseData.status == HTTPStatusCode.ok) {
            getNotification();
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        }
      );
    } catch (error) {}
  };

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const showAlert = () => {
    setIsAlertVisible(true);
  };

  const hideAlert = () => {
    setIsAlertVisible(false);
  };

  const onClearAll = () => {
    showAlert();
  };

  const getNotificationListItem = (data: NotificationModelDatum) => {
    return (
      <View style={styles.containerChit}>
        <View style={styles.row}>
          <Image
            source={
              theme === "light"
                ? require("../assets/images/notifications.png")
                : require("../assets/images/notifications-dark.png")
            }
            style={styles.image}
          />
          <View style={styles.column}>
            <Text style={styles.columnText}>{data.title}</Text>
            <Text
              style={[
                styles.textGrayMain,
                { paddingVertical: ratioHeightBasedOniPhoneX(8) },
              ]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {data.description}
            </Text>
            <Text style={styles.textGray}>
              {formatUtcTimeTo12Hour(data.createdAt)}
              {", "}
              {formatDate(data.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    containerChit: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0.3, height: 0.3 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
        },
        android: {
          elevation: 13,
          shadowColor: colors.black,
        },
      }),
      backgroundColor: colored.cardBackGround,
      flexDirection: "row",
      justifyContent: "space-between",
      padding: ratioWidthBasedOniPhoneX(16),
      alignItems: "center",
      borderRadius: ratioHeightBasedOniPhoneX(10),
      marginTop: ratioHeightBasedOniPhoneX(10),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    container: {
      flex: 1,
      backgroundColor: colored.white,
    },
    row: {
      flexDirection: "row",
      gap: ratioWidthBasedOniPhoneX(10),
    },
    column: {
      flexDirection: "column",
      alignItems: "flex-start",
      flex: 1,
    },
    listBg: {
      backgroundColor: colored.headerColor,
      flex: 1,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(36),
      width: ratioWidthBasedOniPhoneX(36),
      resizeMode: "contain",
    },
    textGrayMain: {
      color: theme === "light" ? colors.lightblack : "#C1C3CB",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    textGray: {
      color: colors.mainlyBlue,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    columnText: {
      color: colored.textColor,
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    NoData: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(320),
    },
    noDataText: {
      color: colors.dimGray,
      marginTop: ratioHeightBasedOniPhoneX(35),
      marginLeft: ratioHeightBasedOniPhoneX(-10),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(22)),
    },
    // header bar

    headerContent: {
      height: ratioHeightBasedOniPhoneX(50),
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomColor: "#ECECEC",
      borderBottomWidth: 1,
    },
    leftContainer: {
      flex: 1,
    },
    centerContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      flex: getNotificationData?.data.length == 0 ? 1 : 3,
    },
    rightContainer: {
      flex: 1,
    },
    imageBack: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
    },
    headerTitle: {
      textAlign: "center",
      color: colored.lightblack,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    investBtn: {
      backgroundColor: colors.lightGreen,
      padding: ratioHeightBasedOniPhoneX(5),
      borderRadius: ratioHeightBasedOniPhoneX(15),
      color: colors.white,
      paddingHorizontal: ratioHeightBasedOniPhoneX(10),
      textAlign: "center",
      overflow: "hidden",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 0.2, height: 0.2 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    androidShadow: {
      elevation: 4,
      shadowColor: colors.black,
    },
    bottomContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 4,
        },
      }),
      marginTop: "auto",
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(62),
      justifyContent: "center",
      alignItems: "center",
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
    },
    button: {
      backgroundColor:
        theme === "light" ? colors.buttonColor : colored.cancelButtonBg,
      height: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
      width: "100%",
      borderRadius: ratioHeightBasedOniPhoneX(24),
    },
    buttonText: {
      color: theme === "light" ? colors.black : colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <View style={styles.listBg}>
        <MainHeaderView
          title={"Notifications"}
          showImage={false}
          closeApp={false}
          bottomBorderLine={false}
          whiteTextColor={false}
        />

        {getNotificationData?.data &&
        getNotificationData?.data.length > 0 &&
        !loading ? (
          <FlatList
            data={getNotificationData?.data}
            renderItem={({ item }) => getNotificationListItem(item)}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item: any) => item.id}
            style={{ marginTop: ratioHeightBasedOniPhoneX(3) }}
            contentContainerStyle={{
              paddingBottom: ratioHeightBasedOniPhoneX(20),
            }}
          />
        ) : dataReceived ? (
          <View style={styles.NoData}>
            <NoData />
            <Text style={styles.noDataText}>No Data</Text>
          </View>
        ) : null}
      </View>
      {getNotificationData?.data.length != 0 ? (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={onClearAll}>
            <Text style={styles.buttonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <LogoutPopupMessage
        isVisible={isAlertVisible}
        message="Are you sure want to Delete Notifications?"
        onClose={hideAlert}
        onConfirm={deleteNotification}
        tag={2}
      />
      <Loader loading={loading} />
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Notification;
