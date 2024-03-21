import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { ThemeContext } from "../Networking/themeContext";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import Loader from "../Loader";
import MainHeaderView from "../MainHeaderView";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import { BankListData } from "../Addbank&CardDetails/Model/BankListData";
import ShowAlertMessage from "../Popup/showAlertMessage";
import { RewardAndWalletBalanceModel } from "../ChitDetails/Model/RewardWalletBalanceAuthModel";
import { FeeChargeResponseModel } from "../Buy/Model/FeeChargeResponseModel";
import RewardBalanceImage from "../assets/images/reward_Balance.svg";
import WalletBalanceImage from "../assets/images/wallet_Balance.svg";
import BankImage from "../assets/images/BankImage.svg";
import BankVerifyImage from "../assets/images/greenCheckImage.svg";
import BankUnVerifyImage from "../assets/images/cancleIcon.svg";
import { PaymentAuthRequestModel } from "../ChitDetails/Model/PaymentAuthRequestModel";
import HttpStatusCode from "../Networking/HttpStatusCode";
import {
  getCardAndBank,
  getWalletRewardBalance,
} from "./TotalPayableController";
import { paymentTypes } from "../enums";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";
import Radio from "../assets/images/radioButton.svg";
import UnRadio from "../assets/images/UnRadio.svg";

export type RouteParams = {
  amount?: any;
  data?: any;
  type?: any;
};
const TotalPayable = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const navigation = useNavigation();
  const route = useRoute();
  const params = route?.params as RouteParams | undefined;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [bankResponse, setBankDetails] = useState<BankListData[] | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [navigat, setNavigation] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [walletRewardBalance, setWalletRewardBalance] =
    useState<RewardAndWalletBalanceModel | null>(null);
  const [feeCharagePrice, setFeeCharagePrice] =
    useState<FeeChargeResponseModel | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [dataSet, setDataSet] = useState([
    {
      id: 1,
      balanceText: "Reward Balance",
      availableBalance: 19,
      imageUrl: <RewardBalanceImage />,
      selected: false,
    },
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
        getCardAndBank((response) => {
          setBankDetails(response);
        }),
        getWalletRewardBalance(
          (response) => {
            setWalletRewardBalance(response);
          },
          (message) => {
            showTextPopup(strings.error, message ?? "");
          }
        ),
        feeCalculation(),
      ]).finally(() => {
        setLoading(false);
      });
    }
    return () => {
      setPaymentMethodId(null);
    };
  }, [isFocused]);

  const handleItemSelection = async (id: number) => {
    const updatedDataSet = dataSet.map((item) => ({
      ...item,
      selected: item.id === id ? !item.selected : item.selected,
    }));
    setDataSet(updatedDataSet);
  };

  const selectedRewardBalance = dataSet.find(
    (item) => item.balanceText === "Reward Balance" && item.selected
  );

  const selectedWalletBalance = dataSet.find(
    (item) => item.balanceText === "Wallet Balance" && item.selected
  );

  const validateErrorBalance = (num: number) => {
    if (num == 1) {
      showTextPopup(strings.error, "Insufficient Wallet balance");
    }
  };

  const validateRewardErrorBalance = (num: number) => {
    if (num == 0) {
      showTextPopup(strings.error, "Insufficient Reward balance");
    }
  };

  const showTextPopup = async (
    title: string,
    message: string,
    navigate?: boolean
  ) => {
    setPopupVisible(true);
    setNavigation(navigate ?? false);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const feeCalculation = async () => {
    const data = {
      amount:
        selectedWalletBalance != undefined || selectedRewardBalance != undefined
          ? calculateTotalAmount(
              selectedRewardBalance ?? 0,
              selectedWalletBalance ?? 0,
              params?.amount
            )
          : params?.amount,
      paymentMethod: "BANK_PAYMENT",
    };
    try {
      await serverCommunication.postApi(
        URLConstants.serviceFeeChargecalculation,
        data,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            setFeeCharagePrice(responseData);
          } else {
          }
        }
      );
    } catch (error) {}
  };

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

                <View
                  style={{ paddingHorizontal: ratioWidthBasedOniPhoneX(7) }}
                >
                  {item.status == true ? (
                    <BankVerifyImage />
                  ) : (
                    <BankUnVerifyImage />
                  )}
                </View>

                {item.status == false && (
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
          {item.status && (item.id === selectedId ? <Radio /> : <UnRadio />)}
        </View>
      </TouchableOpacity>
    );
  };

  function calculateTotalAmount(
    selectedRewardBalance: any,
    selectedWalletBalance: any,
    amount: any
  ) {
    if (selectedRewardBalance || selectedWalletBalance) {
      const subtractionAmount =
        ((selectedRewardBalance && walletRewardBalance?.data?.rewardBalance) ||
          0) +
        ((selectedWalletBalance && walletRewardBalance?.data?.walletBalance) ||
          0);

      return (totalAmount = amount - subtractionAmount);
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    bankText: {
      marginTop: ratioHeightBasedOniPhoneX(24),
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    viewAllText: {
      color: colors.orange,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    selectedCardContainer: {
      height: "auto",
      backgroundColor: colored.cardBackGround,
      padding: ratioHeightBasedOniPhoneX(16),
      marginHorizontal: ratioWidthBasedOniPhoneX(4),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      marginTop: ratioHeightBasedOniPhoneX(16),
      marginBottom: ratioHeightBasedOniPhoneX(8),
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    defaultView: {
      marginTop: ratioHeightBasedOniPhoneX(4),
      backgroundColor: colors.lightBlue,
      borderRadius: ratioHeightBasedOniPhoneX(15),
      width: ratioWidthBasedOniPhoneX(58),
      height: ratioHeightBasedOniPhoneX(22),
      justifyContent: "center",
    },
    defaultText: {
      color: colors.royalBlue,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    verificationPendingView: {
      marginTop: ratioHeightBasedOniPhoneX(4),
      backgroundColor: colors.lightBeige,
      borderRadius: ratioHeightBasedOniPhoneX(15),
      marginLeft: ratioWidthBasedOniPhoneX(46),
      width: ratioWidthBasedOniPhoneX(62),
      height: ratioHeightBasedOniPhoneX(22),
      justifyContent: "center",
    },
    verificationPendingText: {
      color: colors.goldenrod,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    column: {
      flexDirection: "column",
      justifyContent: "flex-start",
      flex: 2,
      marginLeft: ratioWidthBasedOniPhoneX(16),
    },
    BankText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    columnView: {
      flexDirection: "column",
      justifyContent: "flex-start",
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
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
    },
    button: {
      marginVertical: ratioHeightBasedOniPhoneX(16),
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
    cardiosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 1 },
      direction: "inherit",
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    cardandroidShadow: {
      shadowColor: colors.black,
      elevation: 3,
    },
    circleButtonImage: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioHeightBasedOniPhoneX(24),
      borderRadius: ratioHeightBasedOniPhoneX(12),
    },
    BankNameText: {
      color: colors.mainlyBlue,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    BankCardText: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    orangeShadow: {
      shadowColor: colors.orange,
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 20,
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
    addBank: {
      color: colors.orange,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    closeButtonImage: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioHeightBasedOniPhoneX(24),
    },
    closeButton: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioHeightBasedOniPhoneX(24),
      tintColor: colored.textColor,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioHeightBasedOniPhoneX(32),
    },
    balanceText: {
      color: colored.romanSilver,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    availableBalanceText: {
      color: colored.chitDetailTextColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    totalAmountTitle: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    error: {
      color: colors.red,
      textAlign: "left",
      fontFamily: "Inter-Medium",
      fontSize: ratioHeightBasedOniPhoneX(12),
      paddingTop: ratioHeightBasedOniPhoneX(3),
    },
    rewardBalanceTitle: {
      color: colored.chitDetailTextColor,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    convenient: {
      color: colored.chitDetailTextColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    noteContainer: {
      justifyContent: "flex-start",
      marginBottom: ratioHeightBasedOniPhoneX(8),
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    convientView: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: ratioHeightBasedOniPhoneX(24),
    },
  });

  const renderListItem = (item: any, index: any) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (
          walletRewardBalance?.data?.walletBalance != 0 ||
          walletRewardBalance?.data?.rewardBalance != 0
        ) {
          handleItemSelection(item.id);
        } else {
          validateErrorBalance(index);
          validateRewardErrorBalance(index);
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
            <Text style={[styles.balanceText]}>{item.balanceText}</Text>
            <Text style={styles.availableBalanceText}>
              Available Balance : ${" "}
              {item.balanceText == "Wallet Balance"
                ? walletRewardBalance?.data?.walletBalance
                : walletRewardBalance?.data?.rewardBalance}
            </Text>
          </View>
        </View>
        {item.selected ? <Radio /> : <UnRadio />}
      </View>
    </TouchableOpacity>
  );

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

  const joinGroup = async (url: string, data: PaymentAuthRequestModel) => {
    setLoading(true);
    try {
      await serverCommunication.postApi(
        url,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (responseData.status == HttpStatusCode.ok) {
            showTextPopup(strings.success, responseData?.message ?? "", true);
          } else {
            showTextPopup(strings.error, responseData?.message ?? "", false);
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
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <Loader loading={loading}>
        <MainHeaderView
          title={"Total Payable"}
          showImage={false}
          closeApp={false}
          bottomBorderLine={false}
          whiteTextColor={false}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.rowContainer,
              {
                marginTop: ratioHeightBasedOniPhoneX(10),
                marginHorizontal: ratioHeightBasedOniPhoneX(20),
              },
            ]}
          >
            <Text style={styles.totalPayableText}>Bank</Text>
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
          {bankResponse?.length == 0 && (
            <View
              style={[
                styles.rowContainer,
                {
                  backgroundColor: colored.cardBackGround,
                  marginTop: ratioHeightBasedOniPhoneX(15),
                  borderRadius: ratioHeightBasedOniPhoneX(8),
                  marginHorizontal: ratioWidthBasedOniPhoneX(20),
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
                    <Text
                      style={[
                        styles.balanceText,
                        { paddingHorizontal: ratioWidthBasedOniPhoneX(4) },
                      ]}
                    >
                      Add Bank
                    </Text>
                  </View>
                  <Text style={styles.availableBalanceText}>
                    Added bank will be verified.
                  </Text>
                </View>
              </View>

              <View
                style={{
                  paddingVertical: ratioHeightBasedOniPhoneX(5),
                  paddingHorizontal: ratioWidthBasedOniPhoneX(15),
                  backgroundColor: colors.orange,
                  borderRadius: ratioHeightBasedOniPhoneX(28),
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("AddBank");
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
                    }}
                  >
                    Add Bank
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {showAll ? renderAllBanks() : renderLimitedBanks()}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: ratioHeightBasedOniPhoneX(15),
            }}
          >
            {bankResponse && bankResponse.length > 2 && (
              <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                <Text style={styles.viewAllText}>
                  {showAll ? "View Less" : "View All"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={[
              [
                styles.rowContainer,
                {
                  marginTop: ratioHeightBasedOniPhoneX(15),
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
                  marginVertical: ratioHeightBasedOniPhoneX(20),
                  marginHorizontal: ratioHeightBasedOniPhoneX(20),
                },
              ]}
            >
              <Text style={styles.totalAmountTitle}>Total Amount</Text>
              <Text style={styles.totalPayableText}>
                ${" "}
                {params?.data.afterChitStart
                  ? params.data.payAmount
                  : params?.amount}
              </Text>
            </View>
            {selectedRewardBalance && (
              <View
                style={[
                  styles.rowContainer,
                  {
                    marginTop: ratioHeightBasedOniPhoneX(16),
                    marginBottom:
                      selectedWalletBalance == undefined
                        ? ratioHeightBasedOniPhoneX(16)
                        : 0,
                    marginHorizontal: ratioHeightBasedOniPhoneX(20),
                  },
                ]}
              >
                <Text style={styles.rewardBalanceTitle}>Reward Balance</Text>
                <Text style={styles.rewardBalanceTitle}>
                  $ {walletRewardBalance?.data?.rewardBalance}
                </Text>
              </View>
            )}
            {selectedWalletBalance && (
              <View
                style={[
                  styles.rowContainer,
                  {
                    marginTop: ratioHeightBasedOniPhoneX(8),
                    marginBottom: ratioHeightBasedOniPhoneX(24),
                    marginHorizontal: ratioHeightBasedOniPhoneX(20),
                  },
                ]}
              >
                <Text style={styles.rewardBalanceTitle}>Wallet Balance</Text>
                <Text style={styles.rewardBalanceTitle}>
                  ${walletRewardBalance?.data?.walletBalance}
                </Text>
              </View>
            )}
            <View style={{ marginHorizontal: ratioHeightBasedOniPhoneX(20) }}>
              <Text style={styles.noteContainer}>Note</Text>
              <View style={styles.convientView}>
                <Text style={styles.convenient}>convenient fee</Text>
                <Text style={styles.rewardBalanceTitle}>
                  $ {feeCharagePrice?.data?.fee}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.rowView}>
            <TouchableOpacity
              onPress={() => {
                if (params?.type == paymentTypes.dueAmount) {
                  const PaymentAuthRequest = new PaymentAuthRequestModel(
                    params?.data.id,
                    dataSet[1].selected ?? false,
                    dataSet[0].selected ?? false,
                    paymentMethodId ?? "",
                    params.data.contributionAmount,
                    params.data.contributionId
                  );
                  joinGroup(URLConstants.latePayment, PaymentAuthRequest);
                } else if (params?.data.afterChitStart) {
                  const PaymentAuthRequest = new PaymentAuthRequestModel(
                    params?.data.id,
                    dataSet[1].selected ?? false,
                    dataSet[0].selected ?? false,
                    paymentMethodId ?? "",
                    params.data.payAmount
                  );
                  joinGroup(URLConstants.joinStartedChit, PaymentAuthRequest);
                } else {
                  const PaymentAuthRequest = new PaymentAuthRequestModel(
                    params?.data.id,
                    dataSet[1].selected ?? false,
                    dataSet[0].selected ?? false,
                    paymentMethodId ?? ""
                  );
                  joinGroup(URLConstants.joinGroup, PaymentAuthRequest);
                }
              }}
              style={[styles.button, { backgroundColor: colors.orange }]}
            >
              <Text style={[styles.buttonText]}>
                {params?.data.afterChitStart ? "Pay Now" : "Join Now"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ShowAlertMessage
          isVisible={isPopupVisible}
          title={popupTitle}
          message={popupMessage}
          onClose={() => {
            if (navigat) {
              setPopupVisible(false);
              navigation.goBack();
              navigation.goBack();
            } else {
              setPopupVisible(false);
            }
          }}
        />
      </Loader>
    </SafeAreaView>
  );
};

export default TotalPayable;
