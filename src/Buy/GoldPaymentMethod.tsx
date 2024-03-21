import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../Networking/themeContext";
import React, { useContext, useEffect, useState } from "react";
import colors, { dark, light } from "../colors";
import { SafeAreaView } from "react-native-safe-area-context";
import MainHeaderView from "../MainHeaderView";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import BankImage from "../assets/images/mdi_bank.svg";
import BankUnVerifyImage from "../assets/images/cancleIcon.svg";
import GoldImage from "../assets/images/DigitalGold.svg";
import CardImage from "../assets/images/card_Gold.svg";
import InfoIcon from "../assets/images/fluent_info-12-filled.svg";
import BankVerifyImage from "../assets/images/greenCheckImage.svg";
import AddItemComponent from "../Wallet/AddItemComponent";
import {
  getCardAndBank,
  getWalletRewardBalance,
} from "../Payment/TotalPayableController";
import { CardListData } from "../Addbank&CardDetails/Model/CardListData";
import { RewardAndWalletBalanceModel } from "../ChitDetails/Model/RewardWalletBalanceAuthModel";
import { BankListData } from "../Addbank&CardDetails/Model/BankListData";
import UnSelected from "../assets/images/Radio_ButtonGoldOut.svg";
import Selected from "../assets/images/Radio_ButtonGoldIn.svg";
import UnSelectedDark from "../assets/images/radio-dark-unselected.svg";
import SelectedDark from "../assets/images/radio-dark-selected.svg";
import ShowAlertMessage from "../Popup/showAlertMessage";
import strings from "../Extension/strings";
import WalletBalanceImage from "../assets/images/WalletGold.svg";
import Loader from "../Loader";
import { DateFormatType, DobDate } from "../Extension/DateFormatType";
import {
  editSubscriptionPlan,
  userSubscriptionCreate,
} from "../SubscriptionPlanDetail/SubscriptionController";
import { SubscriptionCreateAuthRequestModel } from "../SubscriptionPlanDetail/Model.tsx/SubscriptionCreateAuthRequestModel";
import {
  GoldPaymentIntentAuthRequest,
  GoldWithdrawAuthRequest,
} from "../ChitDetails/Model/PaymentIntentAuthRequestModel";
import {
  buyDigitalGold,
  initializeWebSocket,
  withdrawGold,
} from "./BuyGoldController";
import { BuyGoldSocketResponse } from "./Model/BuySpotPriceModel";

export type RouteParams = {
  type?: any;
  amount?: any;
  startDate?: any | undefined;
  planType?: any;
  subscriptionID?: any;
  subscriptedDataID?: any;
  subscriPtionKey: any;
  onGoBack: any;
};
const GoldPaymentMethod = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const params = route?.params as RouteParams | undefined;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [showCardAll, setShowCardAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bankResponse, setBankResponse] = useState<BankListData[] | null>(null);
  const [cardResponse, setCardResponse] = useState<CardListData[] | null>(null);
  const [walletRewardBalance, setWalletRewardBalance] =
    useState<RewardAndWalletBalanceModel | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [showBankAll, setShowBankAll] = useState(false);
  const [customDate, setCustomDate] = useState<String | null | undefined>(null);
  const [goldSocketPrice, setGoldSocketPrice] =
    useState<BuyGoldSocketResponse | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<any>("Connecting...");

  const [dataSet, setDataSet] = useState([
    {
      id: 2,
      balanceText: "Wallet Balance",
      availableBalance: 20,
      imageUrl: <WalletBalanceImage />,
      selected: false,
    },
  ]);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      Promise.all([
        getCardAndBank(
          (response) => {
            setBankResponse(response);
          },
          (response) => {
            setCardResponse(response);
          }
        ),
        getWalletRewardBalance(
          (response) => {
            setWalletRewardBalance(response);
          },
          (message) => {
            showTextPopup(strings.error, message ?? "");
          }
        ),
      ]).finally(() => {
        setLoading(false);
      });
      if (params?.startDate !== null && params?.startDate !== undefined) {
        setCustomDate(
          DobDate(
            params?.startDate.toString(),
            DateFormatType.birthDateFormatThree
          )
        );
      }
    }
    return () => {
      setPaymentMethodId(null);
    };
  }, [isFocused]);

  useEffect(() => {
    if (params?.subscriPtionKey == undefined) {
      initializeWebSocket(
        (response) => {
          setGoldSocketPrice(response);
        },
        (onError) => {
          showTextPopup(strings.success, onError.message);
        },
        (webSocket) => {
          setSocket(webSocket);
        },
        (status) => {
          setConnectionStatus(status);
        }
      );
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connectionStatus]);

  const showTextPopup = async (
    title: string,
    message: string,
    navigate?: boolean
  ) => {
    setIsPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const handleItemSelection = async (id: number) => {
    const updatedDataSet = dataSet.map((item) => ({
      ...item,
      selected: item.id === id ? !item.selected : item.selected,
    }));
    setDataSet(updatedDataSet);
  };

  const selectedWalletBalance = dataSet.find(
    (item) => item.balanceText === "Wallet Balance" && item.selected
  );

  const validateErrorBalance = (num: number) => {
    if (num == 0) {
      showTextPopup(strings.error, "Insufficient Wallet balance");
    }
  };

  const renderListItem = (item: any, index: any) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (walletRewardBalance?.data?.walletBalance != 0) {
          setSelectedId(null);
          setPaymentMethodId(null);
          handleItemSelection(item.id);
        } else {
          validateErrorBalance(index);
        }
      }}
    >
      <View
        key={item.text}
        style={[
          styles.rowContainer,
          {
            marginHorizontal: ratioHeightBasedOniPhoneX(20),
            backgroundColor: colored.cardBackGround,
            marginTop: ratioHeightBasedOniPhoneX(16),
            borderRadius: ratioHeightBasedOniPhoneX(12),
            padding: ratioHeightBasedOniPhoneX(16),
          },
          Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {item.imageUrl}
          <View
            style={{
              marginLeft:
                index === 1
                  ? ratioWidthBasedOniPhoneX(8)
                  : ratioWidthBasedOniPhoneX(11),
            }}
          >
            <Text style={styles.balanceText}>{item.balanceText}</Text>
            <Text style={styles.availableBalanceText}>
              Available Balance : ${" "}
              {item.balanceText == "Wallet Balance"
                ? walletRewardBalance?.data?.walletBalance
                : walletRewardBalance?.data?.rewardBalance}
            </Text>
          </View>
        </View>
        {theme === "light" ? (
          item.selected ? (
            <Selected />
          ) : (
            <UnSelected />
          )
        ) : item.selected ? (
          <SelectedDark />
        ) : (
          <UnSelectedDark />
        )}
      </View>
    </TouchableOpacity>
  );

  const bankRenderItem = (item: BankListData) => {
    const handlePress = (id: string) => {
      setSelectedId(id === selectedId ? null : id);
    };
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          item.status && handlePress(item?.id ?? "");
          setPaymentMethodId(item?.id ?? "");
        }}
      >
        <View
          style={[
            styles.rowContainer,
            {
              backgroundColor: colored.cardBackGround,
              marginHorizontal: ratioHeightBasedOniPhoneX(20),
              marginTop: ratioHeightBasedOniPhoneX(16),
              margin: ratioHeightBasedOniPhoneX(4),
              borderRadius: ratioHeightBasedOniPhoneX(12),
              padding: ratioHeightBasedOniPhoneX(16),
            },
            Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <BankImage />
            <View
              style={{
                marginLeft: ratioWidthBasedOniPhoneX(8),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.balanceText]}>{item.bank_name}</Text>

                <View style={{ marginLeft: ratioWidthBasedOniPhoneX(11) }}>
                  {item.status ? <BankVerifyImage /> : <BankUnVerifyImage />}
                </View>

                {!item.status && (
                  <View style={styles.verificationPendingView}>
                    <Text style={styles.verificationPendingText}>Pending</Text>
                  </View>
                )}
              </View>
              <Text style={styles.availableBalanceText}>
                ************{item.account_number}
              </Text>
            </View>
          </View>
          {item.status &&
            (item.id === selectedId ? <Selected /> : <UnSelected />)}
        </View>
      </TouchableOpacity>
    );
  };

  const renderAllBanks = () => {
    return (
      <FlatList
        data={bankResponse}
        renderItem={({ item }) => bankRenderItem(item)}
        keyExtractor={(item: any) => item.id}
      />
    );
  };

  const renderLimitedBanks = () => {
    return (
      <FlatList
        data={bankResponse?.slice(0, 2)} // Render only the first two items if showAll is false
        renderItem={({ item }) => bankRenderItem(item)}
        keyExtractor={(item: any) => item.id}
      />
    );
  };

  const renderAllCards = () => {
    return (
      <FlatList
        data={cardResponse}
        renderItem={({ item }) => CardRenderItem(item)}
        keyExtractor={(item: any) => item.id}
      />
    );
  };

  const renderLimitedCards = () => {
    return (
      <FlatList
        data={cardResponse?.slice(0, 2)} // Render only the first two items if showAll is false
        renderItem={({ item }) => CardRenderItem(item)}
        keyExtractor={(item: any) => item.id}
      />
    );
  };

  const CardRenderItem = (item: CardListData) => {
    const handlePress = (id: string) => {
      const updatedDataSet = dataSet.map((item) => ({
        ...item,
        selected: false,
      }));
      setDataSet(updatedDataSet);
      setSelectedId(id === selectedId ? null : id);
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          handlePress(item?.id ?? "");
          setPaymentMethodId(item?.id ?? "");
        }}
      >
        <View
          style={[
            styles.rowContainer,
            {
              backgroundColor: colored.cardBackGround,
              marginHorizontal: ratioHeightBasedOniPhoneX(20),
              marginTop: ratioHeightBasedOniPhoneX(16),
              margin: ratioHeightBasedOniPhoneX(4),
              borderRadius: ratioHeightBasedOniPhoneX(12),
              padding: ratioHeightBasedOniPhoneX(16),
            },
            Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CardImage />
            <View
              style={{
                marginLeft: ratioWidthBasedOniPhoneX(8),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.balanceText]}>{item.card_brand}</Text>
              </View>
              <Text style={styles.availableBalanceText}>
                ************{item.card_number}
              </Text>
            </View>
          </View>
          {theme === "light" ? (
            item.id === selectedId ? (
              <Selected />
            ) : (
              <UnSelected />
            )
          ) : item.id === selectedId ? (
            <SelectedDark />
          ) : (
            <UnSelectedDark />
          )}
          {/* {item.id === selectedId ? <Selected /> : <UnSelected />} */}
        </View>
      </TouchableOpacity>
    );
  };

  function formatDate(inputDateStr: any) {
    const inputDate = new Date(inputDateStr);
    const year = inputDate.getUTCFullYear();
    const month = inputDate.getUTCMonth() + 1;
    const day = inputDate.getUTCDate();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}T10:11:00Z`;
    return formattedDate;
  }

  const EditSubscriptionPlan = () => {
    const startDate = formatDate(params?.startDate);
    const data = new SubscriptionCreateAuthRequestModel(
      params?.amount,
      params?.subscriptionID,
      dataSet[0].selected ? "WALLET" : selectedId !== null ? "CARD" : "",
      startDate,
      paymentMethodId
    );

    if (paymentMethodId != null || dataSet[0].selected != false) {
      editSubscriptionPlan(
        data,
        params?.subscriptedDataID,
        (response) => {
          showTextPopup(strings.success, response.message);
        },
        (responseError) => {
          showTextPopup(strings.error, responseError.message);
        },
        (error) => {
          showTextPopup(strings.error, error.message);
        },
        (loading) => {
          setLoading(loading);
        },
        () => setLoading(false)
      );
    } else {
      showTextPopup(strings.error, "Please Select Payment Type");
    }
  };

  const createSubscription = () => {
    const startDate = formatDate(params?.startDate);
    const data = new SubscriptionCreateAuthRequestModel(
      params?.amount,
      params?.subscriptionID,
      dataSet[0].selected == true ? "WALLET" : selectedId != null ? "CARD" : "",
      startDate,
      paymentMethodId
    );

    if (paymentMethodId != null || dataSet[0].selected != false) {
      userSubscriptionCreate(
        data,
        (response) => {
          showTextPopup(strings.success, response.message);
        },
        (responseError) => {
          showTextPopup(strings.error, responseError.message);
        },
        (error) => {
          showTextPopup(strings.error, error.message);
        },
        (loading) => {
          setLoading(loading);
        },
        () => setLoading(false)
      );
    } else {
      showTextPopup(strings.error, "Please Select Payment Type");
    }
  };

  const buyGold = () => {
    const price =
      goldSocketPrice != undefined
        ? goldSocketPrice?.goldAsk
        : params?.startDate;
    const GoldPaymentIntentAuth = new GoldPaymentIntentAuthRequest(
      Number(params?.amount),
      Number(price),
      Number(params?.subscriptionID),
      dataSet[0].selected ?? false,
      paymentMethodId
    );

    if (paymentMethodId != null || dataSet[0].selected != false) {
      buyDigitalGold(
        GoldPaymentIntentAuth,
        (response) => {
          showTextPopup(strings.success, response.message);
        },
        (responseError) => {
          showTextPopup(strings.error, responseError.message);
        },
        (error) => {
          showTextPopup(strings.error, error.message);
        },
        (loading) => {
          setLoading(loading);
        },
        () => setLoading(false)
      );
    } else {
      showTextPopup(strings.error, "Please Select Payment Type");
    }
  };

  const GoldWithdraw = () => {
    const price =
      goldSocketPrice != undefined
        ? goldSocketPrice?.goldBid
        : params?.startDate;
    const GoldPaymentIntentAuth = new GoldWithdrawAuthRequest(
      Number(params?.amount),
      Number(price),
      Number(params?.subscriptionID),
      paymentMethodId
    );

    if (paymentMethodId != null) {
      withdrawGold(
        GoldPaymentIntentAuth,
        (response) => {
          showTextPopup(strings.success, response.message);
        },
        (responseError) => {
          showTextPopup(strings.error, responseError.message);
        },
        (error) => {
          showTextPopup(strings.error, error.message);
        },
        (loading) => {
          setLoading(loading);
        },
        () => setLoading(false)
      );
    } else {
      showTextPopup(strings.error, "Please Select Payment Type");
    }
  };

  const handlePayment = () => {
    if (
      params?.type == "Card" &&
      params?.subscriPtionKey == "Plan" &&
      params?.subscriptedDataID == undefined
    ) {
      createSubscription();
    } else if (
      params?.type == "Card" &&
      params?.subscriPtionKey == "Plan" &&
      params?.subscriptedDataID != undefined
    ) {
      EditSubscriptionPlan();
    } else if (
      params?.type == "Card" &&
      params?.subscriptedDataID == undefined
    ) {
      buyGold();
    } else if (params?.type == "Bank") {
      GoldWithdraw();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    mainText: {
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    boxContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0.2, height: 0.2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          shadowColor: colors.black,
          elevation: 5,
        },
      }),
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      height: ratioHeightBasedOniPhoneX(78),
      marginTop: ratioHeightBasedOniPhoneX(10),
      padding: ratioHeightBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    DigitalText: {
      color: theme === "light" ? colors.black : colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    qtyText: {
      color: colors.mainlyBlue,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    onczeText: {
      color: theme === "light" ? colors.black : colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    column: {
      flexDirection: "column",
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    totalPayableText: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    balanceText: {
      color: theme === "light" ? colors.black : colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    availableBalanceText: {
      color: theme === "light" ? colored.chitDetailTextColor : "#808185",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    addBank: {
      color: colors.borderYellow,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    viewAllText: {
      color: colors.borderYellow,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
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
    totalAmountTitle: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    rewardBalanceTitle: {
      color: colored.chitDetailTextColor,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    convenient: {
      color: colored.chitDetailTextColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    noteContainer: {
      justifyContent: "flex-start",
      marginBottom: ratioHeightBasedOniPhoneX(2),
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    convientView: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: ratioHeightBasedOniPhoneX(24),
    },
    rowView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
          elevation: 8,
          shadowColor: colors.black,
        },
      }),
      marginTop: "auto",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(62),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
    },
    button: {
      backgroundColor: colored.lightGreen,
      height: ratioHeightBasedOniPhoneX(40),
      width: "100%",
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    verificationPendingView: {
      marginTop: ratioHeightBasedOniPhoneX(4),
      backgroundColor: colors.lightBeige,
      borderRadius: ratioHeightBasedOniPhoneX(15),
      marginLeft: ratioWidthBasedOniPhoneX(75),
      width: ratioWidthBasedOniPhoneX(62),
      height: ratioHeightBasedOniPhoneX(22),
      justifyContent: "center",
    },
    verificationPendingText: {
      color: colors.goldenrod,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    rowViewBox: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <Loader loading={loading}>
        <StatusBar
          barStyle={theme === "dark" ? "light-content" : "dark-content"}
        />
        <MainHeaderView
          title={"Payment Method"}
          showImage={false}
          closeApp={false}
          bottomBorderLine={false}
          whiteTextColor={false}
          callback={() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.close();
              console.log("websocket Close");
            }
          }}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: ratioWidthBasedOniPhoneX(20) }}>
            <View style={styles.boxContainer}>
              <View style={styles.row}>
                <View style={styles.rowViewBox}>
                  <GoldImage />
                  <View
                    style={{ marginRight: ratioHeightBasedOniPhoneX(10) }}
                  />
                  <View style={[styles.column, { justifyContent: "center" }]}>
                    <Text style={styles.DigitalText}>
                      {params?.type == "Card" &&
                      params?.subscriPtionKey == "Plan"
                        ? params?.planType
                        : params?.type == "Card" &&
                          params?.subscriptedDataID == undefined
                        ? "Digital Gold"
                        : "Digital Gold"}
                    </Text>
                    <Text style={styles.qtyText}>
                      {params?.type == "Card" &&
                      params?.subscriPtionKey == "Plan"
                        ? "Date"
                        : params?.type == "Card" &&
                          params?.subscriptedDataID == undefined
                        ? "Qty"
                        : "Qty"}
                    </Text>
                    <Text style={styles.onczeText}>
                      {params?.type == "Card" &&
                      params?.subscriPtionKey == "Plan"
                        ? customDate
                        : params?.type == "Card" &&
                          params?.subscriptedDataID == undefined
                        ? goldSocketPrice != undefined
                          ? params?.type == "Bank"
                            ? goldSocketPrice?.goldBid + "Oz"
                            : goldSocketPrice?.goldAsk + "Oz"
                          : params?.startDate + "Oz"
                        : goldSocketPrice != undefined
                        ? params?.type == "Bank"
                          ? goldSocketPrice?.goldBid + "Oz"
                          : goldSocketPrice?.goldAsk + "Oz"
                        : params?.startDate + "Oz"}
                    </Text>
                  </View>
                </View>
                <View style={[styles.column, { justifyContent: "flex-end" }]}>
                  <Text style={styles.qtyText}>Amount</Text>
                  <Text style={styles.onczeText}>$ {params?.amount}</Text>
                </View>
              </View>
            </View>
          </View>
          {params?.type == "Bank" ? (
            <View>
              <View
                style={[
                  styles.rowContainer,
                  {
                    marginTop: ratioHeightBasedOniPhoneX(25),
                    marginHorizontal: ratioHeightBasedOniPhoneX(20),
                  },
                ]}
              >
                <View style={styles.rowContainer}>
                  <Text style={styles.totalPayableText}>
                    {bankResponse?.length === 0 ? "Payment Method" : "Bank"}
                  </Text>
                  <TouchableOpacity>
                    {bankResponse?.length != 0 && (
                      <InfoIcon
                        style={{
                          marginLeft: ratioWidthBasedOniPhoneX(2),
                          marginTop: ratioWidthBasedOniPhoneX(2),
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                {bankResponse?.length != 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("AddBank");
                    }}
                  >
                    <Text style={styles.addBank}>+Add Bank</Text>
                  </TouchableOpacity>
                )}
              </View>
              {bankResponse?.length === 0 && (
                <AddItemComponent
                  IconComponent={BankImage}
                  text="Add Bank"
                  action={() => navigation.navigate("AddBank")}
                  colorBackground={colors.borderYellow}
                />
              )}
              {showBankAll ? renderAllBanks() : renderLimitedBanks()}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: ratioHeightBasedOniPhoneX(15),
                }}
              >
                {bankResponse && bankResponse.length > 2 && (
                  <TouchableOpacity
                    onPress={() => setShowBankAll(!showBankAll)}
                  >
                    <Text style={styles.viewAllText}>
                      {showBankAll ? "View Less" : "View All"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View>
              <View
                style={[
                  styles.rowContainer,
                  {
                    marginTop: ratioHeightBasedOniPhoneX(15),
                    marginHorizontal: ratioHeightBasedOniPhoneX(20),
                  },
                ]}
              >
                {
                  <View style={styles.rowContainer}>
                    <Text style={styles.totalPayableText}>Card</Text>
                    <TouchableOpacity>
                      <InfoIcon
                        style={{
                          marginLeft: ratioWidthBasedOniPhoneX(2),
                          marginTop: ratioWidthBasedOniPhoneX(2),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                }

                {
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("AddCardScreen");
                    }}
                  >
                    <Text style={styles.addBank}>+Add Card</Text>
                  </TouchableOpacity>
                }
              </View>
              {cardResponse?.length === 0 && (
                <AddItemComponent
                  IconComponent={CardImage}
                  text="Add Card"
                  action={() => navigation.navigate("AddCardScreen")}
                  colorBackground={colors.borderYellow}
                />
              )}
              {showCardAll ? renderAllCards() : renderLimitedCards()}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: ratioHeightBasedOniPhoneX(15),
                }}
              >
                {cardResponse && cardResponse.length > 2 && (
                  <TouchableOpacity
                    onPress={() => setShowCardAll(!showCardAll)}
                  >
                    <Text
                      style={[
                        styles.viewAllText,
                        { marginBottom: ratioHeightBasedOniPhoneX(40) },
                      ]}
                    >
                      {showCardAll ? "View Less" : "View All"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={[
                  [
                    styles.rowContainer,
                    {
                      marginHorizontal: ratioHeightBasedOniPhoneX(20),
                    },
                  ],
                ]}
              >
                <Text style={styles.totalPayableText}>Redeemable</Text>
              </View>
              {dataSet.map((item, index) => renderListItem(item, index))}
              <View>
                <View
                  style={[
                    styles.rowContainer,
                    {
                      marginVertical: ratioHeightBasedOniPhoneX(15),
                      marginHorizontal: ratioHeightBasedOniPhoneX(20),
                    },
                  ]}
                >
                  <Text style={styles.totalAmountTitle}>Total Amount</Text>
                  <Text style={styles.totalPayableText}>
                    $ {params?.amount}
                  </Text>
                </View>
                {selectedWalletBalance && (
                  <View
                    style={[
                      styles.rowContainer,
                      {
                        marginBottom: ratioHeightBasedOniPhoneX(15),
                        marginHorizontal: ratioHeightBasedOniPhoneX(20),
                      },
                    ]}
                  >
                    <Text style={styles.rewardBalanceTitle}>
                      Wallet Balance
                    </Text>
                    <Text style={styles.rewardBalanceTitle}>
                      ${walletRewardBalance?.data?.walletBalance}
                    </Text>
                  </View>
                )}
                <View
                  style={{ marginHorizontal: ratioHeightBasedOniPhoneX(20) }}
                >
                  <Text style={styles.noteContainer}>
                    {selectedId != null
                      ? "Note"
                      : selectedWalletBalance
                      ? "Note"
                      : ""}
                  </Text>
                  <View style={styles.convientView}>
                    {selectedId != null ? (
                      <Text style={styles.convenient}>
                        A convenience fee of ${params?.amount} will be charged
                        for the chosen payment method. The amount, excluding the
                        fee, will be utilized for buying gold.
                      </Text>
                    ) : selectedWalletBalance ? (
                      <Text style={styles.convenient}>
                        The selected payment method will not be charged any
                        convenience fee.
                      </Text>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.rowView}>
            <TouchableOpacity
              onPress={handlePayment}
              style={[styles.button, { backgroundColor: colors.borderYellow }]}
            >
              <Text style={[styles.buttonText]}>
                {params?.type == "Bank" ? "Withdraw" : "Proceed To Pay"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ShowAlertMessage
          isVisible={isPopupVisible}
          title={popupTitle}
          message={popupMessage}
          onClose={() => {
            if (popupMessage == "Plan created successfully") {
              setIsPopupVisible(false);
              navigation.goBack();
              navigation.goBack();
            } else if (
              popupMessage == "Subscription plan updated successfully"
            ) {
              setIsPopupVisible(false);
              navigation.goBack();
              navigation.goBack();
            } else if (
              popupMessage == "Digital gold buy successfully" ||
              popupMessage == "DG gold buy successfully"
            ) {
              setIsPopupVisible(false);
              navigation.goBack();
              navigation.goBack();
              if (typeof params?.onGoBack === "function") {
                params?.onGoBack();
              }
            } else if (
              popupMessage == "Gold withdrawal request placed successfully"
            ) {
              setIsPopupVisible(false);
              navigation.goBack();
              if (typeof params?.onGoBack === "function") {
                params?.onGoBack();
              }
            } else {
              setIsPopupVisible(false);
            }
          }}
        />
      </Loader>
    </SafeAreaView>
  );
};
export default GoldPaymentMethod;
