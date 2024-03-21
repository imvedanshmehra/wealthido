import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { Divider } from "react-native-paper";
import ShowAlertMessage from "../../Popup/showAlertMessage";
import { ThemeContext } from "../../Networking/themeContext";
import colors, { dark, light } from "../../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../../Extension/ScreenUtils";
import WealthidoFonts from "../../Helpers/WealthidoFonts";
import Loader from "../../Loader";
import URLConstants from "../../Networking/URLConstants";
import serverCommunication from "../../Networking/serverCommunication";
import { TicketResponseModel } from "./Model/TicketResponseModel";
import HTTPStatusCode from "../../Networking/HttpStatusCode";
import { TicketResponseDataList } from "./Model/TicketResponseData";
import NoData from "../../NoData";
import strings from "../../Extension/strings";

const Opened: React.FC<{ status: string }> = ({ status }) => {
  const navigation: NavigationProp<any> = useNavigation();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [response, setTicketResponse] = useState<TicketResponseModel | null>(
    null
  );
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
      getTicketList();
    }
  }, [isFocused]);

  const getTicketList = async () => {
    setLoading(true);
    try {
      await serverCommunication.getApi(
        `${URLConstants.getTicket}${status}`,
        (statusCode: any, responseData: TicketResponseModel, error: any) => {
          if (statusCode === HTTPStatusCode.ok) {
            setTicketResponse(responseData);
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

  const renderItem = (
    item: TicketResponseDataList,
    index: number
  ): React.JSX.Element => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("TicketReplayScreen", {
              id: item.id,
              ticketId: item.ticketId,
              status: item.status,
              title: item.title ? item.title : "",
              category: item.category ? item.category : "",
            });
          }}
          activeOpacity={1}
        >
          <View
            style={[
              styles.card,
              Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
            ]}
          >
            <View style={styles.justifyCard}>
              <View style={styles.cardInner}>
                <Text style={styles.subTitle}>{item.ticketId}</Text>
                <Text
                  style={[
                    styles.inProgress,
                    { backgroundColor: colors.greenColor },
                  ]}
                >
                  {item.status}
                </Text>
              </View>

              <View
                style={[
                  styles.cardInner,
                  { marginTop: ratioHeightBasedOniPhoneX(10) },
                ]}
              >
                <Text style={styles.subTitleEnd}>{item.title} </Text>
                <Text
                  style={[
                    styles.inProgress,
                    { backgroundColor: colors.lightGreen, width: "30%" },
                  ]}
                >
                  {item.category}
                </Text>
              </View>
              <Divider
                style={{ marginVertical: ratioHeightBasedOniPhoneX(10) }}
              />
              <Text style={styles.descriptionText} numberOfLines={5}>
                {item.messageList[0].description}{" "}
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate("TicketReplayScreen", {
                    id: item.id,
                    ticketId: item.ticketId,
                    status: item.status,
                    title: item.title ? item.title : "",
                    category: item.category ? item.category : "",
                  });
                }}
              >
                <Text style={styles.buttonText}>View Detail</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    listBg: {
      backgroundColor: colored.headerColor,
      flex: 1,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(64),
      width: ratioWidthBasedOniPhoneX(64),
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    card: {
      flex: 1,
      backgroundColor: colored.cardBackGround,
      padding: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(335),
      height: "auto",
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      borderRadius: ratioHeightBasedOniPhoneX(15),
      marginTop: ratioHeightBasedOniPhoneX(15),
    },
    justifyCard: {
      flex: 1,
      flexDirection: "column",
    },
    cardInner: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
    cardImage: {
      marginRight: ratioWidthBasedOniPhoneX(10),
    },
    subTitle: {
      color: colored.textColor,
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    subTitleEnd: {
      width: "70%",
      color: colored.black,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    inProgress: {
      paddingVertical: ratioHeightBasedOniPhoneX(6),
      paddingHorizontal: ratioWidthBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(15),
      overflow: "hidden",
      alignItems: "center",
      textAlign: "center",
      color: colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    descriptionText: {
      color: colored.lightText,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    button: {
      borderColor: colors.orange,
      borderWidth: ratioHeightBasedOniPhoneX(1),
      height: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginTop: ratioHeightBasedOniPhoneX(16),
      padding: ratioHeightBasedOniPhoneX(1),
    },
    buttonText: {
      color: colors.orange,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    errorText: {
      color: colors.error,
      marginLeft: ratioWidthBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
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
      elevation: 4,
    },

    bottomContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      width: "auto",
      height: ratioHeightBasedOniPhoneX(80),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      backgroundColor: colored.darkheaderColor,
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 8,
          shadowColor: colors.black,
        },
      }),
    },
    raiseTicketButton: {
      marginVertical: ratioHeightBasedOniPhoneX(16),
      backgroundColor: colors.orange,
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      height: ratioHeightBasedOniPhoneX(40),
    },
  });

  const renderBottomContainer = () => {
    return (
      <View style={[styles.bottomContainer]}>
        <TouchableOpacity
          style={styles.raiseTicketButton}
          onPress={() =>
            navigation.navigate("TicketRaiseScreen", {
              id: undefined,
              title: "Raise Ticket",
            })
          }
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>
            Raise Ticket
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.listBg}>
      {response?.data?.list?.length == 0 ? (
        <NoData />
      ) : (
        <FlatList
          data={response?.data?.list}
          renderItem={({ item, index }) => renderItem(item, index)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: ratioHeightBasedOniPhoneX(10),
          }}
          keyExtractor={(item: any) => item.id}
        ></FlatList>
      )}

      {status == "Opened" && renderBottomContainer()}
      <Loader loading={loading} />
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </View>
  );
};

export default Opened;
