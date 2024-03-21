import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import colors, { dark, light } from "../colors";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import serverCommunication from "../Networking/serverCommunication";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { useStripe } from "@stripe/stripe-react-native";
import URLConstants from "../Networking/URLConstants";
import { GoldPaymentIntentAuthRequest } from "./Model/PaymentIntentAuthRequestModel";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { RewardAndWalletBalanceModel } from "./Model/RewardWalletBalanceAuthModel";
import { ThemeContext } from "../Networking/themeContext";
import { FeeChargeResponseModel } from "../Buy/Model/FeeChargeResponseModel";
import Decimal from "decimal.js";
import { formatNumberWithTwoDecimals } from "../Utility";
import BottomSheet from "react-native-raw-bottom-sheet";

const BottomSheetContent = ({
  onClose,
  amount,
  data,
  tag,
  price,
  qty,
  bottomSheetRef,
  setLoading,
  setLoadingFalse,
  setAmountRetrunNull,
  popupmessage,
}: {
  onClose: () => void;
  amount: any;
  data: any;
  tag: any;
  price: any;
  qty: any;
  bottomSheetRef: any;
  setLoading: (loading: boolean) => void;
  setLoadingFalse: () => void;
  popupmessage: (text: string) => void;
  setAmountRetrunNull: (AmountRetrunNull: boolean) => void;
}): JSX.Element => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [type, setType] = useState(4);
  const [amountFee, setAmountFee] = useState<string>("");
  const [walletRewardBalance, setWalletRewardBalance] =
    useState<RewardAndWalletBalanceModel | null>(null);
  const [feeCharagePrice, setFeeCharagePrice] =
    useState<FeeChargeResponseModel | null>(null);
  const { theme } = useContext(ThemeContext);
  const [chooseTypeError, setChooseTypeError] = useState("");
  const [Errorbalance, setErrorbalance] = useState("");
  const [RewardErrorbalance, setRewardErrorbalance] = useState("");
  const colored = theme === "dark" ? dark : light;
  let WalletFee: any;
  let totalAmount: any;

  const [dataSet, setDataSet] = useState([
    {
      id: 1,
      balanceText: "Reward Balance",
      availableBalance: 19,
      imageUrl: require("../assets/images/giftImage.png"),
      selected: false,
    },
    {
      id: 2,
      balanceText: "Wallet Balance",
      availableBalance: 20,
      imageUrl: require("../assets/images/giftImage.png"),
      selected: false,
    },
  ]);

  let paymentId: any;

  const handleItemSelection = (id: number) => {
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

  const validateChooseType = (num: number) => {
    if (num == 4 && type == 4) {
      setChooseTypeError("Please select choose type");
    } else {
      setChooseTypeError("");
    }
  };

  const validateErrorBalance = (num: number) => {
    if (num == 1) {
      setErrorbalance("Insufficient Wallet balance");
    } else {
      setErrorbalance("");
    }
  };

  const validateRewardErrorBalance = (num: number) => {
    if (num == 0) {
      setRewardErrorbalance("Insufficient Reward balance");
    } else {
      setRewardErrorbalance("");
    }
  };

  let typevalue =
    (selectedWalletBalance &&
      (walletRewardBalance?.data?.walletBalance ?? 0) > amount) ||
    (selectedRewardBalance &&
      (walletRewardBalance?.data?.rewardBalance ?? 0) > amount)
      ? 4
      : type;

  const addBankDetails = async (amount: number) => {
    return new Promise(async (resolve, reject) => {
      const PaymentIntentAuthRequest = new PaymentIntentAuthRequestModel(
        Number(amount),
        "usd",
        data.id,
        dataSet[1].selected ?? false,
        dataSet[1].selected == true
          ? walletRewardBalance?.data?.walletBalance ?? 0
          : 0,
        dataSet[0].selected ?? false,
        dataSet[0].selected == true
          ? walletRewardBalance?.data?.rewardBalance ?? 0
          : 0,
        typevalue == 0 ? "CARD_PAYMENT" : typevalue == 1 ? "BANK_PAYMENT" : ""
      );
      bottomSheetRef.current?.close();
      try {
        setLoading(true);
        await serverCommunication.postApi(
          URLConstants.createPaymentIntent,
          PaymentIntentAuthRequest,
          async (statusCode: number, responseData: any, error: any) => {
            if (!error) {
              if (responseData.status == HTTPStatusCode.ok) {
                if (responseData.data !== null) {
                  paymentId = responseData?.data?.paymentId;
                  await initPaymentSheet({
                    paymentIntentClientSecret:
                      responseData?.data?.client_Secret,
                    customerId: responseData?.data?.customer,
                    returnURL: "FinanceApp://stripe-redirect",
                    customerEphemeralKeySecret:
                      responseData?.data?.ephemeralKey,
                    customFlow: false,
                    merchantDisplayName: "FinanceApp",
                    allowsDelayedPaymentMethods: true,
                    testEnv: true,
                    merchantCountryCode: "US",
                  });
                }
              }
              resolve(responseData);
            }
          }
        );
      } catch (error) {
        reject(console.log("==================================>", error));
      } finally {
        setLoadingFalse();
      }
    });
  };

  const DGGoldBuy = async (amount: number) => {
    return new Promise(async (resolve, reject) => {
      const GoldPaymentIntentAuth = new GoldPaymentIntentAuthRequest(
        Number(amount),
        Number(price),
        Number(qty),
        dataSet[1].selected ?? false,
        dataSet[1].selected == true
          ? walletRewardBalance?.data?.walletBalance ?? 0
          : 0,
        dataSet[0].selected ?? false,
        dataSet[0].selected == true
          ? walletRewardBalance?.data?.rewardBalance ?? 0
          : 0,
        typevalue == 0 ? "CARD_PAYMENT" : typevalue == 1 ? "BANK_PAYMENT" : ""
      );
      bottomSheetRef.current?.close();
      try {
        setLoading(true);
        setAmountRetrunNull(true);
        await serverCommunication.postApi(
          URLConstants.executeTradeDGGold,
          GoldPaymentIntentAuth,
          async (statusCode: number, responseData: any, error: any) => {
            if (!error) {
              if (responseData.status == HTTPStatusCode.ok) {
                if (responseData.data !== null) {
                  paymentId = responseData?.data?.paymentId;
                  await initPaymentSheet({
                    paymentIntentClientSecret:
                      responseData?.data?.client_Secret,
                    customerId: responseData?.data?.customer,
                    returnURL: "FinanceApp://stripe-redirect",
                    customerEphemeralKeySecret:
                      responseData?.data?.ephemeralKey,
                    customFlow: false,
                    merchantDisplayName: "FinanceApp",
                    allowsDelayedPaymentMethods: true,
                    testEnv: true,
                    merchantCountryCode: "US",
                  });
                }
              }
              resolve(responseData);
            } else {
            }
          }
        );
      } catch (error) {
        reject(console.log("==================================>", error));
      } finally {
        setLoadingFalse();
      }
    });
  };

  useEffect(() => {
    if (isFocused) {
      getWalletRewardBalance();
    }
  }, [isFocused]);

  const getWalletRewardBalance = async () => {
    try {
      await serverCommunication.getApi(
        URLConstants.getRewardAndWallet,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            if (statusCode === HTTPStatusCode.ok) {
              setWalletRewardBalance(responseData);
            }
          } else {
            popupmessage(responseData?.message ?? "");
          }
        }
      );
    } catch (error) {}
  };

  const getChitJoinedStatus = async () => {
    setLoading(true);
    try {
      await serverCommunication.getApi(
        URLConstants.getChitJoinedStatus + data.id,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            const capitalizedPaymentStatus =
              responseData.data.paymentStatus.charAt(0).toUpperCase() +
              responseData.data.paymentStatus.slice(1).toLowerCase();
            const message = `Your payment has been processed ${capitalizedPaymentStatus}.`;
            Alert.alert(`Payment ${capitalizedPaymentStatus}`, message, [
              {
                text: "OK",
                onPress: () => {
                  setLoading(true);
                  navigation.goBack();
                },
              },
            ]);
          } else {
          }
        }
      );
    } catch (error) {
    } finally {
      setLoadingFalse();
    }
  };

  const feeCalculation = async () => {
    setLoading(true);
    const data = {
      amount:
        selectedWalletBalance || selectedRewardBalance ? totalAmount : amount,
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
    } catch (error) {
    } finally {
      setLoadingFalse();
    }
  };

  const handlePayment = async () => {
    try {
      const { error } = await presentPaymentSheet();
      if (error) {
        // Payment failed
        Alert.alert("Payment Error", error.message, [
          {
            text: "OK",
            onPress: () => {
              cancelPayment();
            },
          },
        ]);
      } else if (tag == undefined) {
        await getChitJoinedStatus();
      } else if (tag == 2 && !error) {
        Alert.alert("", "Payment Successfully", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("BuyGoldSuccess", { qty: qty });
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error object:", error);
    }
  };

  const cancelPayment = async () => {
    try {
      await serverCommunication.getApi(
        `${URLConstants.cancelPayment}${paymentId}`,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
          } else {
            popupmessage(responseData?.message ?? "");
          }
        }
      );
    } catch (error) {}
  };

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
            backgroundColor: colored.cardBackGround,
            marginTop:
              index === 1
                ? ratioHeightBasedOniPhoneX(16)
                : ratioHeightBasedOniPhoneX(40),
            borderRadius: ratioHeightBasedOniPhoneX(12),
            padding: ratioHeightBasedOniPhoneX(16),
          },
          Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
        ]}
      >
        <View style={{ flexDirection: "row" }}>
          <Image source={item.imageUrl} style={[styles.closeButtonImage]} />
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
              Available Balance: $
              {item.balanceText == "Wallet Balance"
                ? walletRewardBalance?.data?.walletBalance?.toFixed(2)
                : walletRewardBalance?.data?.rewardBalance?.toFixed(2)}
            </Text>
          </View>
        </View>
        {item.selected ? (
          <Image
            source={require("../assets/images/selectedCircleImage.png")}
            style={styles.circleButtonImage}
          />
        ) : (
          <Image
            source={require("../assets/images/unSelectedCircleImage.png")}
            style={styles.circleButtonImage}
          />
        )}
      </View>
      {index == 1 && Errorbalance ? (
        <Text style={styles.error}>{Errorbalance}</Text>
      ) : null}
      {index == 0 && RewardErrorbalance ? (
        <Text style={styles.error}>{RewardErrorbalance}</Text>
      ) : null}
    </TouchableOpacity>
  );

  const handlePaymentWithClose = async (amount: number) => {
    const response =
      tag !== undefined
        ? await DGGoldBuy(amount)
        : await addBankDetails(amount);
    if (response?.data !== null) {
      handlePayment();
    } else if (response?.status === 200 && response?.data === null) {
      popupmessage(response?.message ?? "");
    } else if (response?.data === null) {
      popupmessage(response?.message ?? "");
    } else {
      if (response?.status === HTTPStatusCode.badRequest) {
        Alert.alert("", response.message, [
          {
            text: "OK",
            onPress: () => {
              cancelPayment();
            },
          },
        ]);
      } else if (tag === undefined) {
        getChitJoinedStatus();
      }
    }
  };

  useEffect(() => {
    if (amount && feeCharagePrice?.data?.fee) {
      const num1 = new Decimal(amount);
      const num2 = new Decimal(feeCharagePrice?.data?.fee);
      const result = num1.plus(num2).toFixed(2);
      setAmountFee(result);
    }
    type == 0 || type == 1 ? feeCalculation() : null;
  }, [type, amount, feeCharagePrice?.data?.fee]);

  const handleTypeChange = (newType: number) => {
    setType(newType);
    validateChooseType(newType);
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

      totalAmount = amount - subtractionAmount;
      if (amount && feeCharagePrice?.data?.fee && totalAmount) {
        const num1 = new Decimal(totalAmount);
        const num2 = new Decimal(feeCharagePrice?.data?.fee);
        WalletFee = num1.plus(num2).toFixed(2);
      }
      return type == 0 || type == 1
        ? WalletFee ?? 0
        : formatNumberWithTwoDecimals(totalAmount);
    } else {
      return type == 0 || type == 1 ? amountFee : amount;
    }
  }

  const styles = StyleSheet.create({
    bottomContent: {
      backgroundColor: colored.FilterBg,
      height: "auto",
      borderRadius: ratioHeightBasedOniPhoneX(10),
      padding: ratioHeightBasedOniPhoneX(16),
      borderTopColor: colored.shadowcolor,
      borderTopWidth: ratioWidthBasedOniPhoneX(1),
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    totalPayableText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
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
    circleButtonImage: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioHeightBasedOniPhoneX(24),
      borderRadius: ratioHeightBasedOniPhoneX(12),
    },
    totalAmountView: {
      marginTop: ratioHeightBasedOniPhoneX(24),
      height: "auto",
      borderBottomWidth: ratioHeightBasedOniPhoneX(1),
      borderTopWidth: ratioHeightBasedOniPhoneX(1),
      borderColor: colored.shadowcolor,
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
      color: colored.romanSilver,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    convenient: {
      color: colors.dimGray,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    button: {
      backgroundColor: colors.orange,
      height: ratioHeightBasedOniPhoneX(48),
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginTop: ratioHeightBasedOniPhoneX(24),
      padding: ratioHeightBasedOniPhoneX(1),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
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
    choosetypeText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(16),
    },
    typeRow: {
      flexDirection: "row",
      marginTop: ratioHeightBasedOniPhoneX(16),
      gap: ratioWidthBasedOniPhoneX(10),
    },
    typeContainerOrange: {
      borderRadius: ratioHeightBasedOniPhoneX(30),
      paddingHorizontal: ratioWidthBasedOniPhoneX(24),
      height: ratioHeightBasedOniPhoneX(36),
      backgroundColor: colors.green,
      justifyContent: "center",
      alignItems: "center",
    },
    typeContainer: {
      borderRadius: ratioHeightBasedOniPhoneX(30),
      backgroundColor: colored.segementActiveColor,
      borderColor: theme == "light" ? colored.shadowColor : "transparent",
      borderWidth: theme == "light" ? ratioWidthBasedOniPhoneX(1) : 0,
      paddingHorizontal: ratioWidthBasedOniPhoneX(24),
      height: ratioHeightBasedOniPhoneX(36),
      justifyContent: "center",
      alignItems: "center",
    },
    textViewGreen: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    textView: {
      color: colored.textColor,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      closeOnDragDown
      dragFromTopOnly
      onClose={() => {
        setType(4);
        setChooseTypeError("");
        setErrorbalance("");
        setRewardErrorbalance("");
        setDataSet((prevData) => {
          const newData = [...prevData]; // Create a copy of the array
          newData[0].selected = false;
          newData[1].selected = false;
          return newData; // Set the state with the new array
        });
      }}
      customStyles={{
        draggableIcon: { backgroundColor: "transparent" },
        container: {
          backgroundColor: colored.FilterBg,
          height: "auto",
          borderRadius: ratioHeightBasedOniPhoneX(10),
          padding: ratioHeightBasedOniPhoneX(16),
          borderTopColor: colored.shadowcolor,
          borderTopWidth: ratioWidthBasedOniPhoneX(1),
        },
      }}
    >
      <View style={styles.rowContainer}>
        <Text style={styles.totalPayableText}>Total Payable</Text>
        <TouchableOpacity
          onPress={() => {
            bottomSheetRef.current?.close();
          }}
        >
          <Image
            source={require("../assets/images/Close.png")}
            style={styles.closeButton}
          />
        </TouchableOpacity>
      </View>
      {dataSet.map((item, index) => renderListItem(item, index))}
      {(!selectedWalletBalance ||
        (walletRewardBalance?.data?.walletBalance ?? 0) <= amount) &&
        (!selectedRewardBalance ||
          (walletRewardBalance?.data?.rewardBalance ?? 0) <= amount) && (
          <View>
            <Text style={styles.choosetypeText}>Choose Type</Text>
            <View style={styles.typeRow}>
              {[0, 1].map((typeValue) => (
                <TouchableOpacity
                  key={typeValue}
                  style={
                    type === typeValue
                      ? styles.typeContainerOrange
                      : styles.typeContainer
                  }
                  onPress={() => handleTypeChange(typeValue)}
                >
                  <Text
                    style={
                      type === typeValue
                        ? styles.textViewGreen
                        : styles.textView
                    }
                  >
                    {typeValue === 0 ? "Card" : "ACH"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {chooseTypeError ? (
              <Text style={styles.error}>{chooseTypeError}</Text>
            ) : null}
          </View>
        )}
      <View style={styles.totalAmountView}>
        <View
          style={[
            styles.rowContainer,
            { marginVertical: ratioHeightBasedOniPhoneX(24) },
          ]}
        >
          <Text style={styles.totalAmountTitle}>Total Amount</Text>
          <Text style={styles.totalPayableText}>${amount}</Text>
        </View>
        {selectedRewardBalance && (
          <View
            style={[
              styles.rowContainer,
              {
                marginTop: ratioHeightBasedOniPhoneX(24),
                marginBottom:
                  selectedWalletBalance == undefined
                    ? ratioHeightBasedOniPhoneX(24)
                    : 0,
              },
            ]}
          >
            <Text style={styles.rewardBalanceTitle}>Reward Balance</Text>
            <Text style={styles.rewardBalanceTitle}>
              ${walletRewardBalance?.data?.rewardBalance?.toFixed(2)}
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
              },
            ]}
          >
            <Text style={styles.rewardBalanceTitle}>Wallet Balance</Text>
            <Text style={styles.rewardBalanceTitle}>
              ${walletRewardBalance?.data?.walletBalance?.toFixed(2)}
            </Text>
          </View>
        )}
        {typevalue == 0 || typevalue == 1 ? (
          <View>
            <Text style={styles.noteContainer}>Note</Text>
            <View style={styles.convientView}>
              <Text style={styles.convenient}>convenient fee</Text>
              <Text style={styles.rewardBalanceTitle}>
                $ {feeCharagePrice?.data?.fee}
              </Text>
            </View>
          </View>
        ) : (
          <Text></Text>
        )}
      </View>
      <TouchableOpacity
        onPress={async () => {
          if (typevalue == 0 || typevalue == 1) {
            handlePaymentWithClose(
              calculateTotalAmount(
                selectedRewardBalance ?? 0,
                selectedWalletBalance ?? 0,
                amount
              )
            );
          } else if (
            (selectedWalletBalance &&
              (walletRewardBalance?.data?.walletBalance ?? 0) > amount) ||
            (selectedRewardBalance &&
              (walletRewardBalance?.data?.rewardBalance ?? 0) > amount)
          ) {
            onClose();
            tag !== undefined
              ? handlePaymentWithClose(amount)
              : handlePaymentWithClose(0);
          } else {
            validateChooseType(4);
          }
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {" "}
          {(selectedWalletBalance &&
            (walletRewardBalance?.data?.walletBalance ?? 0) > amount) ||
          (selectedRewardBalance &&
            (walletRewardBalance?.data?.rewardBalance ?? 0) > amount)
            ? "Pay $" + amount
            : "Pay $ " +
              Math.max(
                amount > (walletRewardBalance?.data?.walletBalance ?? 0) ||
                  amount > (walletRewardBalance?.data?.rewardBalance ?? 0)
                  ? calculateTotalAmount(
                      selectedRewardBalance ?? 0,
                      selectedWalletBalance ?? 0,
                      amount
                    )
                  : amount,
                0
              )}
        </Text>
      </TouchableOpacity>
    </BottomSheet>
  );
};

export default BottomSheetContent;
