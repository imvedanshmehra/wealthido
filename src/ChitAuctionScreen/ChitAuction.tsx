import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import colors, { dark, light } from "../colors";
import { ChitGroupResponseModelDatum } from "../ChitFundScreen/Model/ChitGroupResponseModelDatum";
import {
  calculateAuctionDuration,
  dateFormatTime,
  formatTime,
  getCurrentAddedSecond,
  getCurrentTime,
  subtract,
  subtractNanoseconds,
  timeStringToMilliseconds,
} from "../Utility";
import StorageService from "../StorageService";
import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { Button } from "react-native-paper";
import {
  SocketResponseModel,
  SocketResponseModelDatum,
} from "./Model/SocketResponseModel";
import { ThemeContext } from "../Networking/themeContext";
import Modal from "react-native-modal";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import BottomSheet from "react-native-raw-bottom-sheet";
import ShowAlertMessage from "../Popup/showAlertMessage";
import { AuctionWinnerResponse } from "./Model/AuctionWinnerResponse";
import strings from "../Extension/strings";
import MainHeaderView from "../MainHeaderView";
import PriceImageSource from "../assets/images/chitDetails/solar-tag-price-bold.svg";
import CalendarImageSource from "../assets/images/chitDetails/calendar-all-fill.svg";
import ParticipantsImageSource from "../assets/images/chitDetails/personlines.svg";
import WinningImageSource from "../assets/images/chitDetails/cashstack.svg";
import { SafeAreaView } from "react-native-safe-area-context";

const numberData = [
  { number: "+10" },
  { number: "+20" },
  { number: "+30" },
  { number: "+40" },
  { number: "+50" },
  { number: "+60" },
  { number: "+70" },
  { number: "+80" },
  { number: "+90" },
  { number: "+100" },
];

// React functional component representing the ChitAuction.
const ChitAuction: React.FC = ({ route }: any) => {
  interface auctionDetailsParam {
    data: ChitGroupResponseModelDatum;
    userId: number;
    back: any;
  }

  const { data, userId, back } = route.params as auctionDetailsParam | any;
  const [response, setResponse] = useState<LoginResponseModel | any>(null);
  const [socketData, setSocketResponse] = useState<SocketResponseModel | any>(
    null
  );
  const [actionWinner, setActionWinnerResponse] = useState<
    AuctionWinnerResponse | any
  >(null);
  const [participantCounts, setparticipantCounts] = useState<number | any>(1);
  const navigation = useNavigation();
  const [duration, setDuration] = useState(5);
  const isFocused = useIsFocused();
  const [count, setCount] = useState(0);
  const [defaultCount, setDefaultCount] = useState(0);
  const [timerData, settimerData] = useState(1);
  const [visible, setVisible] = React.useState(false);
  const flatListRef = useRef<FlatList | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [seconds, setseconds] = useState(0);
  const filteredData = numberData.filter(
    (numberData) => numberData.number == "+10"
  );
  const defaultSelectedItem = filteredData[0];
  const [selectedItem, setSelectedItem] = useState(defaultSelectedItem);
  const [setConnectionStatus] = useState<any>("Connecting...");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  useEffect(() => {
    const fetchAndProcessTimer = async (): Promise<void> => {
      try {
        const timerString = await StorageService.getThirtySecond();
        if (timerString) {
          const updatedTimersArray = timerString.filter(
            (timer: { actionId: any; userId: any }) =>
              timer.userId === response?.data?.id &&
              timer.actionId === data.auctionId
          );

          if (updatedTimersArray) {
            const timerMilliseconds = timeStringToMilliseconds(
              updatedTimersArray[0].time
            );
            const currentTimeMilliseconds = timeStringToMilliseconds(
              getCurrentTime()
            );
            const currentSeconds =
              (timerMilliseconds - currentTimeMilliseconds) / 1000;
            setseconds(currentSeconds);

            if (currentSeconds <= 0) {
              var removeData = timerString.filter(
                (item: { userId: number; actionId: number }) =>
                  item.userId === response?.data?.id &&
                  item.actionId === data.actionId
              );

              const updatedTimerString = timerString.filter(
                (item: { userId: any; actionId: any }) =>
                  !removeData.some(
                    (removeItem: { userId: any; actionId: any }) =>
                      removeItem.userId === item.userId &&
                      removeItem.actionId === item.actionId
                  )
              );

              // Set the updated array in storage
              await StorageService.setThirtySecond(updatedTimerString);
            } else {
              // Timer is still active, update seconds state
              setseconds(currentSeconds);
            }
          } else {
            setseconds(0);
          }
        } else {
          setseconds(0);
        }
      } catch (error) {}
    };

    const calculateAndSetDuration = () => {
      fetchAndProcessTimer();
      const calculatedDuration = calculateAuctionDuration(
        data.time,
        subtractNanoseconds(data.auctionduration),
        onAuctionEnd
      );
      setDuration(calculatedDuration);
      if (calculatedDuration > 0) {
        const timer = setTimeout(() => {
          setDuration((prevDuration) => Math.max(0, prevDuration - 1));
        }, 1000);

        return () => {
          clearTimeout(timer);
        };
      }
    };

    calculateAndSetDuration();
  }, [duration, data, seconds]);

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const initializeWebSocket = () => {
    let action = data.auctionId;
    const webSocketURL =
      "wss://finance-java.blockchainfirm.io/auction-websocket?auctionId=" +
      action +
      "&userId=" +
      userId;

    const newSocket: any = new WebSocket(webSocketURL);
    setSocket(newSocket);

    newSocket.onopen = () => {
      setConnectionStatus("Connected");
    };

    newSocket.onmessage = (event: any) => {
      const { data } = event;
      if (data === null) {
        return; // Ignore null data
      }
      try {
        const newData = JSON.parse(data);
        if (newData.participantCounts !== undefined) {
          setparticipantCounts(newData.participantCounts);
        }
        if (newData.hasOwnProperty("bidAmount") && newData.bidAmount !== null) {
          appendData(newData);
          scrollToBottom();
          setCount(newData.bidAmount);
          setDefaultCount(newData.bidAmount);
        }

        if (newData.message !== undefined) {
          showTextPopup(strings.error, newData.message ?? "");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    newSocket.onerror = (error: any) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("Reconnecting...");
    };

    newSocket.onclose = (event: any) => {
      console.log("WebSocket closed:", event.code, event.reason);
      setConnectionStatus("Reconnecting...");
    };
  };

  useEffect(() => {
    initializeWebSocket();
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [userId, data, setConnectionStatus]);

  const auctionWinner = async () => {
    try {
      await serverCommunication.getApi(
        `${URLConstants.auctionWinner}${data.auctionId}`,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            setActionWinnerResponse(responseData);
            setVisible(true);
          }
        }
      );
    } catch (error) {}
  };

  // Toggles the visibility of a modal in the ChitAuction component.
  const toggleModal = () => {
    bottomSheetRef.current?.open();
  };

  // Handles the click event on an item in the list.
  const handleItemClick = (item: any) => {
    bottomSheetRef.current?.close();
    setSelectedItem(item);
  };

  // Retrieves login response data from the storage and sets it in the component's state.
  const fetchData = async () => {
    try {
      const loginResponseData = await StorageService.getIsLogin();
      if (loginResponseData !== null) {
        setResponse(loginResponseData);
      }
    } catch (error) {
      console.error("Error fetching login response data:", error);
    }
  };

  const appendData = (newData: SocketResponseModelDatum) => {
    setSocketResponse((prevData: any) => ({
      ...prevData,
      data: [...(prevData?.data || []), newData],
    }));
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const onContentSizeChange = () => {
    scrollToBottom();
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
      setCount(data.auctionMinBid);
      getBidDetails();
    }
  }, [isFocused]);

  // Sends a WebSocket message with the auction ID, user ID, and bid amount to the server.
  const sendMessage = (
    auctionId: string,
    userId: number,
    bidAmount: number
  ) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        auctionId: auctionId,
        userId: userId,
        bidAmount: bidAmount,
      });
      (socket as WebSocket).send(message);
    }
  };

  const getBidDetails = async () => {
    try {
      await serverCommunication.getApi(
        `${URLConstants.getBidDetails}${data.auctionId}`,
        async (
          statusCode: any,
          responseData: SocketResponseModel | any,
          error: any
        ) => {
          if (!error) {
            const bidData = await StorageService.getIsbidAmount();
            if (bidData) {
              setCount(
                responseData.data?.length == 0
                  ? data.auctionMinBid
                  : responseData.data[responseData.data?.length - 1]?.bidAmount
              );
              await StorageService.setIsbidAmount(false);
            }

            setSocketResponse(responseData);
            setDefaultCount(
              responseData.data?.length == 0
                ? data.auctionMinBid
                : responseData.data[responseData.data?.length - 1]?.bidAmount
            );
            setCount(
              responseData.data?.length == 0
                ? data.auctionMinBid
                : responseData.data[responseData.data?.length - 1]?.bidAmount
            );
          } else {
          }
        }
      );
    } catch (error) {}
  };

  const handleIncrement = () => {
    // Get the maximum bid limit, default to 30 if not provided
    const maxLimit = data.bidMax ?? 10;

    // Parse the amount string to an integer, default to 30 if it's not a valid number
    const amount = selectedItem.number.substring(1);
    const incrementAmount = parseInt(amount, 10) || 10;

    // Calculate the new count
    const newCount = count + incrementAmount;

    if (maxLimit < newCount) {
      setCount(maxLimit);
    } else if (maxLimit == newCount || maxLimit == count) {
      showTextPopup(strings.error, "Maximum Bid Amount is Reached");
    } else {
      if (newCount <= maxLimit) {
        bottomSheetRef.current?.close();
        // If the new count is within the maximum limit, update the count
        setCount(newCount);
      } else {
        // If the new count exceeds the maximum limit, show an error message
        showTextPopup(strings.error, "Maximum Bid Amount is Reached");
      }
    }
  };

  // Handles the decrement of the count based on the selected item's number.
  const handleDecrement = () => {
    const amount = selectedItem.number.substring(1);
    const decrementtAmount = parseInt(amount, 10) || 10;
    bottomSheetRef.current?.close();
    setCount((count) => Math.max(count - decrementtAmount, defaultCount));
  };

  // Checks if the socket data is empty and the timer seconds is zero.
  const onAuctionEnd = async (timerSeconds: any) => {
    settimerData(0);
    if (socketData?.data?.length == 0 && timerSeconds == 0) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      navigation.goBack();
    } else {
      auctionWinner();
    }
  };

  const renderBidItem = (chitData: SocketResponseModelDatum, index: number) => {
    const isJohnDoe = chitData.userId === response?.data?.id;
    const color = isJohnDoe ? colors.lightGreen : "transparent";
    const isLastItem = index === socketData.data.length - 1;

    return (
      <View style={styles.sampleView}>
        {!isJohnDoe && (
          <View
            style={[
              styles.card,
              isLastItem && { marginBottom: ratioHeightBasedOniPhoneX(7) },
              Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
            ]}
          >
            <View style={styles.cardBackgroundView}>
              {colors.white !== "transparent" && (
                <>
                  <Text
                    style={[
                      styles.nameText,
                      {
                        color:
                          color === "#38958E"
                            ? colors.white
                            : colors.mainlyBlue,
                      },
                    ]}
                  >
                    Participant {chitData.userId}
                  </Text>
                  <View style={styles.dateContainer}>
                    <Text
                      style={[
                        styles.bidText,
                        {
                          color:
                            color === "#38958E"
                              ? colors.white
                              : colored.textColor,
                        },
                      ]}
                    >
                      ${chitData.bidAmount}
                    </Text>
                    <Text
                      style={[
                        styles.timestampText,
                        {
                          color:
                            color === "#38958E"
                              ? colors.white
                              : colors.mainlyBlue,
                        },
                      ]}
                    >
                      {dateFormatTime(chitData.time)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        )}
        <View
          style={[
            styles.card,
            {
              marginLeft: isJohnDoe ? ratioWidthBasedOniPhoneX(180) : 0,
              backgroundColor: isJohnDoe ? colors.lightGreen : "transparent",
            },
          ]}
        >
          <View style={styles.cardBackgroundView}>
            {color !== "transparent" && (
              <>
                <Text
                  style={[
                    styles.nameText,
                    {
                      color: color === "#38958E" ? colors.white : colors.white,
                      opacity: 0.75,
                    },
                  ]}
                >
                  Participant {chitData.userId}
                </Text>
                <View style={styles.dateContainer}>
                  <Text
                    style={[
                      styles.bidText,
                      {
                        color:
                          color === "#38958E" ? colors.white : colors.white,
                      },
                    ]}
                  >
                    ${chitData.bidAmount}
                  </Text>
                  <Text
                    style={[
                      styles.timestampText,
                      {
                        color:
                          color === "#38958E" ? colors.white : colors.white,
                        opacity: 0.75,
                      },
                    ]}
                  >
                    {dateFormatTime(chitData.time)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderBottomContainer = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.bottomContainer}>
          <View style={styles.bidBackGroundView}>
            <View style={styles.circleContainer}>
              <TouchableOpacity onPress={handleDecrement} style={styles.circle}>
                <Text style={styles.buttonText}>{"-"}</Text>
              </TouchableOpacity>
              <Text style={styles.countText}>${count}</Text>
              <TouchableOpacity onPress={handleIncrement} style={styles.circle}>
                <Text style={styles.buttonText}>{"+"}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={toggleModal} style={styles.countView}>
              <Text style={[styles.viewText, { color: colored.manatee }]}>
                {selectedItem.number}
              </Text>
              <Image
                source={require("../assets/images/caretdown.png")}
                style={[styles.buttonImage, { marginLeft: 0 }]}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleBid}
            style={[
              styles.viewButton,
              {
                backgroundColor:
                  (seconds ?? 0) > 0 ? "#FF891C" : colors.lightGreen,
              },
            ]}
          >
            {(seconds ?? 0) > 0 ? (
              <Image
                source={require("../assets/images/clock.png")}
                style={styles.buttonImage}
              />
            ) : null}
            <Text style={styles.viewText}>
              {(seconds ?? 0) > 0 ? formatTime(seconds) : "Bid now"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };

  const handleBid = async (): Promise<void> => {
    if (seconds === undefined || seconds < 0 || seconds === 0) {
      if (socketData && socketData.data && socketData.data.length != null) {
        const lastBidAmount =
          socketData.data[socketData.data.length - 1]?.bidAmount;

        // Check if the bid amount already exists in storage

        if (lastBidAmount !== count) {
          const userId = response?.data?.id; // Replace getUserId with the actual function to get the user ID
          const time = getCurrentAddedSecond(30);
          const actionId = data.auctionId;
          const bidInfo = { userId, time, actionId };
          const existingData = await StorageService.getThirtySecond();
          const filteredData = existingData
            ? existingData.filter(
                (data: { userId: any; auctionId: any }) =>
                  data.userId !== bidInfo.userId ||
                  data.auctionId !== bidInfo.actionId
              )
            : [];

          const newData = [...filteredData, bidInfo];
          await StorageService.setThirtySecond(newData);
          sendMessage(actionId, response?.data?.id, count);
        } else if (
          socketData.data[socketData.data.length - 1]?.bidAmount === count
        ) {
          sendMessage(data.auctionId, response?.data?.id, count);
        }
      }
    }
  };

  const renderChitDetails = (
    chitTitle: string,
    chitSubTitle: number,
    chitImageSource: React.ReactNode,
    durationTitle: string,
    durationSubTitle: number,
    durationImageSource: React.ReactNode
  ) => (
    <View
      style={{ flex: 2, flexDirection: "row", justifyContent: "space-between" }}
    >
      <View style={styles.backGroundView}>
        <View style={styles.imageView}>{chitImageSource}</View>
        <View style={styles.columnView}>
          <Text style={styles.chitValue}>{chitTitle}</Text>
          <Text style={styles.amount}>
            {chitTitle == "No.of Participants"
              ? `${chitSubTitle}`
              : `$${chitSubTitle}`}
          </Text>
        </View>
      </View>
      <View style={styles.backGroundView}>
        <View style={styles.imageView}>{durationImageSource}</View>
        <View style={styles.columnView}>
          <Text style={styles.chitValue}>{durationTitle}</Text>
          <Text style={styles.amount}>
            {durationTitle === "Duration"
              ? `${durationSubTitle} Months`
              : `$${durationSubTitle}`}
          </Text>
        </View>
      </View>
    </View>
  );

  const winningAmount = subtract(
    data?.chitValue,
    socketData?.data?.[socketData.data?.length - 1]?.bidAmount ||
      data.auctionMinBid
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    backgroundContainer: {
      height: ratioHeightBasedOniPhoneX(144),
      paddingTop: Platform.OS === "android" ? 0 : ratioHeightBasedOniPhoneX(20),
      alignItems: "center",
    },
    image: {
      marginTop: ratioHeightBasedOniPhoneX(24),
      width: ratioWidthBasedOniPhoneX(36),
      height: ratioHeightBasedOniPhoneX(36),
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    chitFund: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
      textAlign: "center",
      color: colors.white,
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    eligible: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(12)),
      textAlign: "center",
      color: colors.white,
      marginTop: ratioHeightBasedOniPhoneX(5),
    },
    columnView: {
      flexDirection: "column",
      paddingVertical: ratioHeightBasedOniPhoneX(3),
      paddingLeft: ratioWidthBasedOniPhoneX(8),
    },
    backGroundView: {
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      flex: 1,
    },
    backGroundContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      flex: 1,
    },
    imageView: {
      marginTop: ratioHeightBasedOniPhoneX(5),
      width: ratioWidthBasedOniPhoneX(30),
      height: ratioHeightBasedOniPhoneX(30),
      borderRadius: ratioHeightBasedOniPhoneX(5),
      backgroundColor: colors.apricot,
      justifyContent: "center",
      alignItems: "center",
    },
    tagImage: {
      width: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(20),
      alignItems: "stretch",
    },
    chitValue: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      color: colors.lightblack,
    },
    amount: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
      color: colors.lightblack,
    },
    actionView: {
      width: "100%",
      height: ratioHeightBasedOniPhoneX(24),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.red,
    },
    auctionDate: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
      color: colors.white,
    },
    date: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
      color: colors.white,
    },
    card: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 8,
          shadowColor: colors.black,
        },
      }),
      height: ratioHeightBasedOniPhoneX(72),
      width: ratioWidthBasedOniPhoneX(158),
      backgroundColor: colored.chitDetailContainer,
      borderRadius: ratioHeightBasedOniPhoneX(8),
      marginHorizontal: ratioWidthBasedOniPhoneX(10),
    },
    cardBackgroundView: {
      padding: ratioHeightBasedOniPhoneX(17),
    },

    sampleView: {
      marginTop: ratioHeightBasedOniPhoneX(25),
      flexDirection: "row",
    },
    backButton: {
      position: "absolute",
      top: ratioHeightBasedOniPhoneX(68),
      left: ratioWidthBasedOniPhoneX(20),
      zIndex: 1,
    },

    bidcontainer: {
      flex: 1,
      padding: ratioHeightBasedOniPhoneX(16),
      backgroundColor: colored.headerColor,
      width: "100%",
    },
    listContainer: {
      paddingBottom: ratioHeightBasedOniPhoneX(16),
    },
    bidItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: ratioHeightBasedOniPhoneX(12),
      marginVertical: ratioHeightBasedOniPhoneX(4),
      backgroundColor: "#fff",
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    bidText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    nameText: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      textAlign: "left",
    },
    dateContainer: {
      flexDirection: "row",
      marginTop: ratioHeightBasedOniPhoneX(3),
      justifyContent: "space-between",
    },
    timestampText: {
      paddingTop: ratioHeightBasedOniPhoneX(5),
      fontSize: ratioHeightBasedOniPhoneX(12),
      color: "#777",
    },
    circleContainer: {
      height: ratioHeightBasedOniPhoneX(48),
      borderRadius: ratioHeightBasedOniPhoneX(24),
      width: ratioWidthBasedOniPhoneX(234),
      borderColor: colored.shadowColor,
      flexDirection: "row",
      borderWidth: ratioWidthBasedOniPhoneX(1),
      backgroundColor: colored.cardBackGround,
      justifyContent: "space-between",
      alignItems: "center",
    },
    countText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(18)),
      color: colored.textColor,
    },
    buttonContainer: {
      flexDirection: "row",
      paddingRight: ratioWidthBasedOniPhoneX(1),
      paddingVertical: 0,
      alignItems: "center",
    },
    circle: {
      height: ratioHeightBasedOniPhoneX(48),
      width: ratioHeightBasedOniPhoneX(48),
      borderRadius: ratioHeightBasedOniPhoneX(48),
      backgroundColor: colored.cardBackGround,
      borderColor: colors.orange,
      borderWidth: ratioWidthBasedOniPhoneX(2),
      justifyContent: "center",
      alignItems: "center",
      resizeMode: "contain",
    },
    buttonText: {
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(17)),
      color: colors.lightGreen,
    },
    bottomContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 8,
          shadowColor: colors.black,
        },
      }),
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: colored.headerColor,
      width: ratioWidthBasedOniPhoneX(378),
      height: ratioHeightBasedOniPhoneX(145),
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
    },
    bidBackGroundView: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: ratioHeightBasedOniPhoneX(28),
      height: ratioHeightBasedOniPhoneX(48),
    },
    viewButton: {
      height: ratioHeightBasedOniPhoneX(40),
      marginTop: ratioHeightBasedOniPhoneX(15),
      marginBottom: "auto",
      flexDirection: "row",
      backgroundColor: colors.lightGreen,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      alignItems: "center",
      justifyContent: "center",
    },
    countView: {
      height: ratioHeightBasedOniPhoneX(48),
      width: ratioWidthBasedOniPhoneX(87),
      paddingLeft: ratioWidthBasedOniPhoneX(19),
      alignContent: "center",
      backgroundColor: colored.chitActionView,
      borderRadius: ratioHeightBasedOniPhoneX(37),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    viewText: {
      color: colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    buttonImage: {
      width: ratioWidthBasedOniPhoneX(20), // Adjust the image width as needed
      height: ratioHeightBasedOniPhoneX(20), // Adjust the image height as needed
      marginRight: ratioWidthBasedOniPhoneX(8), // Adjust the spacing between the image and text
    },

    alertBg: {
      height: ratioHeightBasedOniPhoneX(185),
      width: ratioWidthBasedOniPhoneX(300),
      borderRadius: ratioHeightBasedOniPhoneX(20),
      backgroundColor: colors.white,
      justifyContent: "flex-start",
      marginHorizontal: ratioWidthBasedOniPhoneX(40),
      alignItems: "flex-start",
      padding: ratioHeightBasedOniPhoneX(20),
    },
    winnerText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
      color: colors.lightblack,
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    descText: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      color: colors.tabText,
      lineHeight: ratioHeightBasedOniPhoneX(20),
    },
    descTextBlack: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      color: colors.lightblack,
    },
    buttonAlert: {
      backgroundColor: colors.lightGreen,
      borderRadius: ratioHeightBasedOniPhoneX(20),
      width: "100%",
      marginTop: ratioHeightBasedOniPhoneX(20),
      color: colors.lightblack,
    },
    buttonAlertLabel: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
      color: colors.white,
    },
    alertImage: {
      height: ratioHeightBasedOniPhoneX(80),
      width: ratioWidthBasedOniPhoneX(80),
      marginTop: ratioHeightBasedOniPhoneX(-70),
      marginLeft: ratioWidthBasedOniPhoneX(-15),
    },
    input: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
      width: ratioHeightBasedOniPhoneX(30),
      height: ratioHeightBasedOniPhoneX(30),
      borderRadius: 30,
      textAlign: "center",
      paddingHorizontal: ratioWidthBasedOniPhoneX(6),
      backgroundColor: colors.white,
    },
    bottomContent: {
      backgroundColor: colored.background,
      borderRadius: ratioHeightBasedOniPhoneX(10),
      padding: ratioHeightBasedOniPhoneX(16),
    },
    item: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      width: ratioWidthBasedOniPhoneX(75),
      height: ratioHeightBasedOniPhoneX(61),
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      borderRightWidth: 0,
      borderColor: colored.chitActionViewBorderColor,
    },
    selectedItem: {
      borderRightColor: colored.chitActionViewBorderColor,
      borderLeftColor: colored.chitActionViewBorderColor,
      borderTopColor: colored.chitActionViewBorderColor,
      borderBottomWidth: ratioWidthBasedOniPhoneX(1.5),
      borderColor: colored.textColor,
    },
    itemText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
      color: colored.textColor,
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 0.2, height: 0.2 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    androidShadow: {
      elevation: 4,
      color: colors.black,
    },
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={colors.orange}
        translucent={false}
      />
      <MainHeaderView
        title={data?.chitGroupName}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
        callback={() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
          }
        }}
      />
      <View style={styles.backgroundContainer}>
        {renderChitDetails(
          "Chit Value",
          data?.chitValue,
          <PriceImageSource style={styles.tagImage} />,
          "Duration",
          data?.chitduration,
          <CalendarImageSource style={styles.tagImage} />
        )}
        {renderChitDetails(
          "No.of Participants",
          participantCounts,
          <ParticipantsImageSource style={styles.tagImage} />,
          "Winning Amount",
          winningAmount,
          <WinningImageSource style={styles.tagImage} />
        )}
      </View>
      {timerData === 0 ? null : (
        <View style={styles.actionView}>
          <Text style={styles.auctionDate}>Auction ends on </Text>
          <Text style={styles.date}>
            {formatTime(
              calculateAuctionDuration(
                data?.time,
                subtractNanoseconds(data?.auctionduration)
              )
            )}
          </Text>
        </View>
      )}
      <View style={styles.bidcontainer}>
        <FlatList
          ref={(ref) => (flatListRef.current = ref)}
          numColumns={1}
          style={{ backgroundColor: colored.headerColor }}
          showsVerticalScrollIndicator={false}
          data={socketData?.data || []}
          renderItem={({ item, index }) => renderBidItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          onContentSizeChange={onContentSizeChange}
        />
      </View>
      {socketData?.data &&
      socketData.data.length > 0 &&
      socketData.data[0].participantStatus === false
        ? null
        : renderBottomContainer()}

      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />

      <Modal
        isVisible={visible}
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          marginHorizontal: ratioWidthBasedOniPhoneX(20),
        }}
      >
        <View style={styles.alertBg}>
          <View>
            <Image
              source={require("../assets/images/alert.png")}
              style={styles.alertImage}
            />
          </View>
          <Text style={styles.winnerText}>
            {actionWinner?.data?.winnerText}
          </Text>
          <Text>
            <Text style={styles.descText}>
              {actionWinner?.data?.winnerDesc}
            </Text>
            <Text style={styles.descTextBlack}>
              {" "}
              {actionWinner?.data?.bidAmount}{" "}
            </Text>
            <Text style={styles.descText}>
              {" "}
              {actionWinner?.data?.priceText}{" "}
            </Text>
            <Text style={styles.descTextBlack}>
              {" "}
              {actionWinner?.data?.priceAmount}{" "}
            </Text>
          </Text>
          <Button
            style={styles.buttonAlert}
            labelStyle={styles.buttonAlertLabel}
            onPress={() => {
              if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
              }
              if (back == 0) {
                navigation.goBack();
                navigation.goBack();
              }
              navigation.goBack();
              navigation.goBack();
            }}
          >
            Okay
          </Button>
        </View>
      </Modal>

      <BottomSheet
        ref={bottomSheetRef}
        height={ratioHeightBasedOniPhoneX(290)} // Set the height
        closeOnDragDown
        dragFromTopOnly
        customStyles={{
          draggableIcon: { backgroundColor: "transparent" },
          container: {
            borderTopColor: theme == "dark" ? "#222528" : colors.white,
            borderWidth: 1,
            backgroundColor: colored.background,
            borderRadius: ratioHeightBasedOniPhoneX(10),
            paddingHorizontal: ratioHeightBasedOniPhoneX(16),
          },
        }}
      >
        <View style={styles.bidBackGroundView}>
          <View style={styles.circleContainer}>
            <TouchableOpacity onPress={handleDecrement} style={styles.circle}>
              <Text style={styles.buttonText}>{"-"}</Text>
            </TouchableOpacity>
            <Text style={styles.countText}>${count}</Text>
            <TouchableOpacity onPress={handleIncrement} style={styles.circle}>
              <Text style={styles.buttonText}>{"+"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.countView}>
            <Text style={[styles.viewText, { color: colored.manatee }]}>
              {selectedItem.number}
            </Text>
            <Image
              source={require("../assets/images/caretdown.png")}
              style={[styles.buttonImage, { marginLeft: 0 }]}
            />
          </View>
        </View>
        <FlatList
          data={numberData}
          numColumns={5}
          scrollEnabled={false}
          style={{
            marginTop: ratioHeightBasedOniPhoneX(24),
          }}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => handleItemClick(item)}>
              <View
                style={[
                  styles.item,
                  selectedItem === item && styles.selectedItem,
                  item.number == "+50" || item.number == "+100"
                    ? { borderRightWidth: ratioWidthBasedOniPhoneX(0.5) }
                    : { borderRightWidth: 0 },
                ]}
              >
                <Text
                  style={[
                    styles.itemText,
                    selectedItem === item && { color: colored.textColor },
                  ]}
                >
                  {item.number}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      </BottomSheet>
    </SafeAreaView>
  );
};

export default ChitAuction;
