import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import {
  ratioWidthBasedOniPhoneX,
  ratioHeightBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import colors, { dark, light } from "../colors";
import { ThemeContext } from "../Networking/themeContext";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import {
  WalletHistoryModelResponse,
  WalletHistoryModelResponseDatum,
} from "./WalletHistoryModelResponse";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import Loader from "../Loader";
import { useIsFocused } from "@react-navigation/native";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { DateFormatType, toDate } from "../Extension/DateFormatType";
import ShowAlertMessage from "../Popup/showAlertMessage";
import strings from "../Extension/strings";
import NoData from "../NoData";

const WalletAll: React.FC<{ status: string }> = ({ status }) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [loading, setLoading] = useState(false);
  const [historyResoponse, setHistoryResponseList] =
    useState<WalletHistoryModelResponse | null>(null);
  const isFocused = useIsFocused();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  useEffect(() => {
    if (isFocused) {
      getUserWalletList(false);
    }
  }, [isFocused]);

  const handleRefresh = () => {
    setRefreshing(true);
    getUserWalletList(true);
  };

  const getUserWalletList = async (refreshing: boolean) => {
    if (refreshing == false) {
      setLoading(true);
    }
    const data = {
      type: status,
    };

    try {
      await serverCommunication.postApi(
        URLConstants.getWalletTransactionHistory,
        data,
        (
          statusCode: number,
          responseData: WalletHistoryModelResponse,
          error: any
        ) => {
          if (!error) {
            if (responseData.status == HTTPStatusCode.ok) {
              setHistoryResponseList(responseData);
              setRefreshing(false);
            }
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        }
      );
    } catch (error) {
      console.error("Error object:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = (item: WalletHistoryModelResponseDatum) => (
    <View style={styles.carContainer}>
      <View style={styles.rowView}>
        <Image
          source={
            theme === "dark"
              ? require("../assets/images/transaction-gray.png")
              : require("../assets/images/transaction.png")
          }
          style={styles.image}
        />

        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.columnText}>
              ${item.totalAmount.toFixed(2)} {item.paymentStatus}{" "}
            </Text>
            <View>
              <Text style={styles.dateText}>
                {toDate(
                  item?.createdAt?.toString(),
                  DateFormatType.birthDateFormatTwo
                ).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.textGray}>
              {item.status == "SUCCESS"
                ? "completed successfully"
                : item.status == "PENDING"
                ? "Pending Transaction"
                : "Cancelled Tranasaction"}{" "}
            </Text>
            <View
              style={[
                styles.successBackground,
                {
                  backgroundColor:
                    item.status == "PENDING"
                      ? colors.orange
                      : item.status == "SUCCESS"
                      ? colors.greenColor
                      : colors.red,
                },
              ]}
            >
              <Text style={styles.successText}>{item.status}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    divider: {
      position: "relative",
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      color: colored.walletUnderLine,
    },

    listBg: {
      backgroundColor: colored.headerColor,
      flex: 1,
    },
    successBackground: {
      borderRadius: ratioHeightBasedOniPhoneX(12),
      paddingHorizontal: ratioWidthBasedOniPhoneX(5),
      height: ratioHeightBasedOniPhoneX(22),
      justifyContent: "center", // Center vertically
      overflow: "hidden",
    },
    successText: {
      color: colors.white,
      fontFamily: "Inter-Bold",
      fontSize: ratioHeightBasedOniPhoneX(10),
      textAlign: "center", // Center horizontally
    },
    rowView: {
      flexDirection: "row",
      gap: ratioWidthBasedOniPhoneX(5),
      flex: 1,
      justifyContent: "flex-start",
    },
    row: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
    },

    chitContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: ratioWidthBasedOniPhoneX(16),
      marginHorizontal: ratioWidthBasedOniPhoneX(15),
      paddingVertical: ratioHeightBasedOniPhoneX(10),
    },

    column: {
      flexDirection: "column",
      alignItems: "flex-start",
      flex: 1,
    },
    columnText: {
      width: ratioWidthBasedOniPhoneX(205),
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    dateText: {
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    image: {
      height: ratioHeightBasedOniPhoneX(35),
      width: ratioHeightBasedOniPhoneX(35),
      resizeMode: "contain",
    },
    textGray: {
      width: ratioWidthBasedOniPhoneX(205),
      color: colors.mainlyBlue,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    carContainer: {
      borderBottomColor: theme === "light" ? "#EEEEEE" : "#4C4C55",
      borderBottomWidth: 1,
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      height: "auto",
      backgroundColor:
        theme === "light" ? colored.cardBackGround : "transparent",
      borderRadius: ratioHeightBasedOniPhoneX(8),
      marginBottom: ratioHeightBasedOniPhoneX(5),
      marginTop: ratioHeightBasedOniPhoneX(5),
      paddingHorizontal: ratioWidthBasedOniPhoneX(10),
      paddingVertical: ratioHeightBasedOniPhoneX(15),
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.listBg}>
      {historyResoponse?.data && historyResoponse?.data?.length === 0 ? (
        <View style={{ marginTop: ratioHeightBasedOniPhoneX(-140), flex: 1 }}>
          <NoData />
        </View>
      ) : (
        <FlatList
          data={historyResoponse?.data}
          renderItem={({ item }) => renderItem(item)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#4285f4"]}
            />
          }
        ></FlatList>
      )}
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
      <Loader loading={loading} children={undefined} />
    </View>
  );
};

export default WalletAll;
