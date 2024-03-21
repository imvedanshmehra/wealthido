import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  RootTag,
  FlatList,
  Platform,
} from "react-native";
import colors, { dark, light } from "../colors";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { ThemeContext } from "../Networking/themeContext";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import { GoldTransactionHistory, List } from "./Modal/GoldTransactionHistory";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import ShowAlertMessage from "../Popup/showAlertMessage";
import { dateformate } from "../Utility";
import Loader from "../Loader";
import NoData from "../NoData";
import strings from "../Extension/strings";

const OnGoing: React.FC<{ status: string }> = ({ status }) => {
  const navigation: NavigationProp<RootTag> = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const isFocused = useIsFocused();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [goldHistory, setGoldTransactionHistory] =
    useState<GoldTransactionHistory | null>(null);
  const [loading, setLoading] = useState(false);

  const onView = () => {
    navigation.navigate("orderDetails");
  };

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  useEffect(() => {
    if (isFocused) {
      getTransactionHistory();
    }
  }, [isFocused]);

  const getTransactionHistory = async () => {
    try {
      setLoading(true);
      await serverCommunication.getApi(
        URLConstants.getDigitalGoldTransaction,
        (statusCode: any, responseData: any, error: any) => {
          if (statusCode === HTTPStatusCode.ok) {
            setGoldTransactionHistory(responseData);
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

  const renderItem = (Data: List) => {
    return (
      <View style={styles.rowContainerTranx}>
        <Text style={styles.subTitleTrans}>
          {dateformate(Data?.created_at)}
        </Text>
        <Text style={styles.subTitleTransBuy}>{Data?.type}</Text>
        <Text style={styles.subTitleTrans}>{Data?.amount}</Text>
        <Text style={styles.subTitleTrans}>{Data?.quantity}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    ListContainer: {
      backgroundColor: colored.headerColor,
      flex: 1,
    },
    cardContainer: {
      backgroundColor: colored.cardBackGround,
      marginVertical: ratioHeightBasedOniPhoneX(16),
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
      padding: ratioHeightBasedOniPhoneX(24),
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    completedCard: {
      backgroundColor: colors.white,
      marginVertical: ratioHeightBasedOniPhoneX(16),
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
      padding: ratioHeightBasedOniPhoneX(24),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      height: "auto",
    },
    rightimage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
    },
    GoldView: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    image: {
      height: ratioHeightBasedOniPhoneX(47),
      width: ratioHeightBasedOniPhoneX(47),
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rowContainerTranx: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: ratioWidthBasedOniPhoneX(5),
    },
    subTitle: {
      color: colored.black,
      fontSize: ratioHeightBasedOniPhoneX(16),
      fontFamily: "Inter-Bold",
    },
    subTitleTrans: {
      color: colored.black,
      fontSize: ratioHeightBasedOniPhoneX(12),
      fontFamily: "Inter-Medium",
      padding: ratioHeightBasedOniPhoneX(10),
      width: ratioWidthBasedOniPhoneX(99),
      textAlign: "center",
    },
    subTitleTransBuy: {
      color: colored.lightGreen,
      fontSize: ratioHeightBasedOniPhoneX(12),
      fontFamily: "Inter-Medium",
      padding: ratioHeightBasedOniPhoneX(10),
      width: ratioWidthBasedOniPhoneX(99),
      textAlign: "center",
    },
    columnContainer: {
      flexDirection: "column",
      flex: 1,
      marginLeft: ratioWidthBasedOniPhoneX(8),
    },
    subTitleEnd: {
      fontFamily: "Inter-Medium",
      color: colored.lightText,
      fontSize: ratioHeightBasedOniPhoneX(14),
    },
    subTitleEndTranx: {
      fontFamily: "Inter-Medium",
      color: colored.lightText,
      fontSize: ratioHeightBasedOniPhoneX(12),
      padding: ratioHeightBasedOniPhoneX(5),
      textAlign: "center",
      width: ratioWidthBasedOniPhoneX(99),
    },
    orderTrackingImage: {
      marginTop: ratioHeightBasedOniPhoneX(8),
      height: ratioHeightBasedOniPhoneX(32),
      justifyContent: "center",
      width: "100%",
    },
    bottomRowContainer: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
    },
    cubeImagebackGroundContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(8),
    },
    cubeImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioHeightBasedOniPhoneX(20),
    },
    statusText: {
      fontFamily: "Inter-Medium",
      marginLeft: ratioWidthBasedOniPhoneX(4),
      color: colored.lightText,
      fontSize: ratioHeightBasedOniPhoneX(12),
    },
    subTitleViewblack: {
      fontFamily: "Inter-Medium",
      color: colored.lightblack,
      fontSize: ratioHeightBasedOniPhoneX(14),
    },

    column: {
      flexDirection: "column",
    },

    container: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(0),
      backgroundColor: colors.listBgColor,
      textAlign: "center",
      flex: 1,
    },
    tableRow: {
      textAlign: "center",
      padding: 5,
      fontFamily: "Inter-Medium",
      color: colored.lightblack,
      fontSize: ratioHeightBasedOniPhoneX(12),
      flex: 1,
      justifyContent: "space-evenly",
    },
    tableHeader: {
      textAlign: "center",
      padding: 10,
      fontFamily: "Inter-Medium",
      color: colored.lightText,
      fontSize: ratioHeightBasedOniPhoneX(12),
    },
    buy: {
      color: colors.lightGreen,
    },
    sell: {
      color: colors.lightPink,
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 1 },
      direction: "inherit",
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    androidShadow: {
      shadowColor: colors.black,
      shadowOpacity: 0.1,
      elevation: 4,
    },
  });

  return (
    <>
      {status == "ONGOING" && (
        <View style={styles.ListContainer}>
          <View
            style={[
              styles.cardContainer,
              Platform.OS == "android"
                ? styles.androidShadow
                : styles.iosShadow,
            ]}
          >
            <View style={styles.column}>
              <View style={styles.GoldView}>
                <Image
                  source={require("../assets/images/goldorder.png")}
                  style={styles.image}
                />
                <View style={styles.columnContainer}>
                  <View style={styles.rowContainer}>
                    <Text style={styles.subTitle}>2g of Gold</Text>
                    <TouchableOpacity onPress={onView}>
                      <Image
                        source={require("../assets/images/arrow_left.png")}
                        style={styles.rightimage}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.subTitleEnd}>GOLD031 </Text>
                  <Text style={styles.subTitleEnd}>Ordered: 20th Jul 2023</Text>
                </View>
              </View>
              <Image
                source={require("../assets/images/orderTrackingImage.png")}
                style={styles.orderTrackingImage}
              />

              <View style={styles.cubeImagebackGroundContainer}>
                <Image
                  source={require("../assets/images/transit.png")}
                  style={styles.cubeImage}
                />
                <View style={styles.bottomRowContainer}>
                  <Text>
                    <Text style={styles.statusText}> status:</Text>
                    <Text style={[styles.statusText, { color: colored.black }]}>
                      {" "}
                      In-Transist
                    </Text>
                  </Text>
                  <Text onPress={onView} style={styles.subTitleViewblack}>
                    view &gt;
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {status === "COMPLETED" && (
        <View style={styles.ListContainer}>
          <View
            style={[
              styles.cardContainer,
              Platform.OS == "android"
                ? styles.androidShadow
                : styles.iosShadow,
            ]}
          >
            <View style={styles.column}>
              <View style={styles.GoldView}>
                <Image
                  source={require("../assets/images/goldorder.png")}
                  style={styles.image}
                />
                <View style={styles.columnContainer}>
                  <View style={styles.rowContainer}>
                    <Text style={styles.subTitle}>2g of Gold</Text>
                    <TouchableOpacity onPress={() => {}}>
                      <Image
                        source={require("../assets/images/arrow_left.png")}
                        style={styles.rightimage}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.subTitleEnd}>GOLD031</Text>
                  <Text style={styles.subTitleEnd}>Ordered: 20th Jul 2023</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {status == "UPCOMING" && (
        <View style={styles.ListContainer}>
          <View style={{ marginTop: ratioHeightBasedOniPhoneX(10) }}></View>
          <View style={styles.rowContainerTranx}>
            <Text style={styles.subTitleEndTranx}>Date</Text>
            <Text style={styles.subTitleEndTranx}>Type</Text>
            <Text style={styles.subTitleEndTranx}>Amount</Text>
            <Text style={styles.subTitleEndTranx}>Gold</Text>
          </View>
          {goldHistory?.data?.list?.length == 0 ? (
            <NoData />
          ) : (
            <FlatList
              data={goldHistory?.data?.list}
              renderItem={({ item }) => renderItem(item)}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item: any) => item.id}
            ></FlatList>
          )}

          <ShowAlertMessage
            isVisible={isPopupVisible}
            title={popupTitle}
            message={popupMessage}
            onClose={() => setPopupVisible(false)}
          />
          <Loader loading={loading} />
        </View>
      )}
    </>
  );
};

export default OnGoing;
