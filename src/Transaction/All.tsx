import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import { Divider } from "react-native-paper";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import React, { useContext, useEffect, useState } from "react";
import colors, { dark, light } from "../colors";
import { ThemeContext } from "../Networking/themeContext";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import {
  TransactionHistoryResponse,
  TransactionHistoryResponseDatum,
} from "./Model/TransactionHistoryModelResponse";
import { useIsFocused } from "@react-navigation/native";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { DateFormatType, toDate } from "../Extension/DateFormatType";
import Loader from "../Loader";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import ShowAlertMessage from "../Popup/showAlertMessage";
import NoData from "../NoData";
import strings from "../Extension/strings";
import TransactionSuccess from "../assets/images/TransactionSucces.svg";

/**
 * Renders a list of transaction history based on the provided status.
 * Fetches transaction data from a server and displays it in a FlatList component.
 * Handles loading state and displays a loader while fetching data.
 *
 * @param {string} status - The status of the transactions to fetch.
 * @returns {ReactElement} - The rendered transaction history list.
 */
const All: React.FC<{ status: string }> = ({ status }) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [loading, setLoading] = useState(false);
  const [TransactionHistory, setTransactionHistoryList] =
    useState<TransactionHistoryResponse | null>(null);
  const isFocused = useIsFocused();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  useEffect(() => {
    if (isFocused) {
      getTransactionList();
    }
  }, [isFocused]);

  const getTransactionList = async () => {
    setLoading(true);
    const data = {
      type: status,
    };

    try {
      await serverCommunication.postApi(
        URLConstants.getTransactionHistory,
        data,
        (
          statusCode: number,
          responseData: TransactionHistoryResponse,
          error: any
        ) => {
          if (!error) {
            if (statusCode == HTTPStatusCode.ok) {
              setTransactionHistoryList(responseData);
            }
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    } finally {
      setLoading(false);
    }
  };

  // Renders an item in a transaction history list.
  const renderItem = (item: TransactionHistoryResponseDatum) => (
    <TouchableOpacity onPress={() => {}}>
      <View style={styles.cardContainer}>
        <View style={styles.chitContainer}>
          <View style={styles.rowView}>
            <TransactionSuccess />
            <View style={{ marginRight: ratioWidthBasedOniPhoneX(5) }} />
            <View style={styles.column}>
              <Text style={styles.columnText}>
                $ {item?.amount}{" "}
                {item?.paymentStatus
                  ? item?.paymentStatus.charAt(0).toUpperCase() +
                    item?.paymentStatus.slice(1).toLowerCase()
                  : ""}
              </Text>
              <Text style={styles.textGray}>{item?.chitName} </Text>
            </View>
          </View>
          <View style={styles.columnEnd}>
            <Text style={[styles.textGray, { color: colored.black }]}>
              {toDate(
                item?.createdAt?.toString(),
                DateFormatType.birthDateFormatTwo
              ).toLocaleString()}
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
              <Text style={styles.successText}>
                {item?.status
                  ? item.status.charAt(0).toUpperCase() +
                    item.status.slice(1).toLowerCase()
                  : ""}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Creates a StyleSheet object with various styles for a React Native component.
  const styles = StyleSheet.create({
    listBg: {
      backgroundColor: colored.headerColor,
      flex: 1,
    },
    cardContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        android: {
          elevation: 3,
          shadowColor: colors.black,
        },
      }),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(70),
      backgroundColor: colored.cardBackGround,
      borderRadius: ratioHeightBasedOniPhoneX(8),
      marginBottom: ratioHeightBasedOniPhoneX(5),
      marginTop: ratioHeightBasedOniPhoneX(5),
      padding: ratioHeightBasedOniPhoneX(10),
      justifyContent: "center",
      borderWidth: theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#4C4C55",
    },
    successBackground: {
      borderRadius: ratioHeightBasedOniPhoneX(12),
      paddingHorizontal: ratioWidthBasedOniPhoneX(5),
      height: ratioHeightBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(3),
      justifyContent: "center", // Center vertically
      overflow: "hidden",
    },
    successText: {
      color: colors.white,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      textAlign: "center", // Center horizontally
    },
    rowView: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },

    chitContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    column: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    columnEnd: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
    columnText: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
      color: colored.black,
      lineHeight: ratioHeightBasedOniPhoneX(20),
      fontWeight: "600",
    },

    image: {
      height: ratioHeightBasedOniPhoneX(35),
      width: ratioHeightBasedOniPhoneX(35),
    },
    textGray: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
      color: colors.mainlyBlue,
      fontWeight: "500",
    },
  });

  return (
    <View style={styles.listBg}>
      {TransactionHistory?.data?.length !== 0 ? (
        <>
          <View style={{ marginTop: ratioHeightBasedOniPhoneX(10) }} />
          <FlatList
            data={TransactionHistory?.data}
            renderItem={({ item }) => renderItem(item)}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item: any) => item.id}
          ></FlatList>
        </>
      ) : (
        <NoData marginTop={140} />
      )}
      <Loader loading={loading} children={undefined} />
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </View>
  );
};

export default All;
