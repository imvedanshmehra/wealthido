import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import colors, { dark, light } from "../colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../Networking/themeContext";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import MainHeaderView from "../MainHeaderView";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { TextInput } from "react-native-paper";
import GoldSubscrptionImage from "../assets/images/GoldSubscriptionImage.svg";
import validation from "../RegisterScreen/validation";
import {
  formatNumberWithThreeDecimals,
  formatNumberWithTwoDecimals,
  trimAmount,
} from "../Utility";
import {
  BuyGoldSocketResponse,
  BuySpotPriceModel,
} from "../Buy/Model/BuySpotPriceModel";
import { initializeWebSocket } from "../Buy/BuyGoldController";
import strings from "../Extension/strings";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import ShowAlertMessage from "../Popup/showAlertMessage";
import { DashboradResponseModel } from "../Home/Model/HomeResponseModel";
import Loader from "../Loader";

/**
 * Renders a screen for withdrawing money or gold.
 *
 * @returns {JSX.Element} The rendered screen for withdrawing money or gold.
 */
const Withdraw = (): JSX.Element => {
  const navigation: NavigationProp<any> = useNavigation();
  const isFocused = useIsFocused();
  const [isGoldButtonActive, setIsGoldButtonActive] = useState(false);
  const [amountGold, setAmountGold] = useState("");
  const [amountGoldError, setAmountGoldError] = useState("");
  const [gramGold, setGramGold] = useState("");
  const [gramGoldError, setGramGoldError] = useState("");
  const [goldSpotPrice, setGoldSpotPrice] = useState<BuySpotPriceModel | null>(
    null
  );
  const [goldSocketPrice, setGoldSocketPrice] =
    useState<BuyGoldSocketResponse | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [setConnectionStatus] = useState<any>("Connecting...");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [userDashboard, setUserDashboard] = useState<DashboradResponseModel>();
  const [loading, setLoading] = useState(false);

  const handleGoldButtonClick = () => {
    setIsGoldButtonActive(!isGoldButtonActive);
  };

  const { theme } = useContext(ThemeContext);

  const colored = theme === "dark" ? dark : light;

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  useEffect(() => {
    if (isFocused) {
      const BuyGoldSpotPrice = async () => {
        setLoading(true);
        try {
          await serverCommunication.getApi(
            URLConstants.getSpotPrice,
            (statusCode: any, responseData: BuySpotPriceModel, error: any) => {
              if (!error) {
                setGoldSpotPrice(responseData);
              } else {
              }
            }
          );
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };

      const getDashboardData = async () => {
        setLoading(true);
        try {
          await serverCommunication.getApi(
            URLConstants.dashBoard,
            (statusCode: any, responseData: any, error: any) => {
              if (!error) {
                setUserDashboard(responseData);
              } else {
              }
            }
          );
        } catch (error) {}
      };

      BuyGoldSpotPrice();
      getDashboardData();
    }
  }, [isFocused]);

  useEffect(() => {
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

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [setConnectionStatus]);

  const onGoBackBuy = () => {
    setAmountGold("");
    setGramGold("");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    view: {
      marginHorizontal: ratioHeightBasedOniPhoneX(16),
    },
    rowcontainer: {
      flex: 1,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    buyGoldText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    buyGoldTextSub: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },
    TextTitle: {
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(20),
      marginBottom: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    ButtonrowContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: ratioWidthBasedOniPhoneX(8),
      marginBottom: ratioHeightBasedOniPhoneX(15),
    },
    button: {
      backgroundColor: colored.chitDetailContainer,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      paddingHorizontal: ratioWidthBasedOniPhoneX(24),
      height: ratioHeightBasedOniPhoneX(36),
      borderWidth: ratioWidthBasedOniPhoneX(1),
      borderColor: colored.tabBarBorder,
      textAlign: "center",
      justifyContent: "center",
    },
    buttonActive: {
      backgroundColor: colored.goldButton,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      paddingHorizontal: ratioWidthBasedOniPhoneX(24),
      height: ratioHeightBasedOniPhoneX(36),
      borderWidth: ratioWidthBasedOniPhoneX(1),
      borderColor: colored.tabBarBorder,
      textAlign: "center",
      justifyContent: "center",
    },
    buttonText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
      color: colored.textColor,
      textAlign: "center",
    },
    buttonActiveText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
      color: colors.white,
      textAlign: "center",
    },
    Inputrow: {
      marginBottom: ratioHeightBasedOniPhoneX(30),
    },
    labelBold: {
      fontSize: ratioHeightBasedOniPhoneX(12),
      marginBottom: ratioHeightBasedOniPhoneX(8),
      color: colored.lightblack,
      fontFamily: "Inter-SemiBold",
      flexDirection: "row",
    },
    input: {
      backgroundColor: colored.headerColor,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      marginTop: ratioHeightBasedOniPhoneX(10),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    ButtonNextRow: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 8,
          shadowColor: colors.black,
        },
      }),
      backgroundColor: colored.cardBackGround,
      marginTop: "auto",
      height: ratioHeightBasedOniPhoneX(62),
      marginHorizontal: ratioHeightBasedOniPhoneX(-20),
      alignItems: "center",
      justifyContent: "center",
    },
    nextbutton: {
      backgroundColor: colors.goldButton,
      borderRadius: ratioHeightBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(40),
      alignItems: "center",
      justifyContent: "center",
      width: ratioWidthBasedOniPhoneX(335),
    },
    NextbuttonText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
      color: colors.white,
      textAlign: "center",
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    errorText: {
      color: "red",
      textAlign: "left",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    placeholdertext: {
      color: colored.lightblack,
    },
    amountText: {
      color: colored.textColor,
      textAlign: "center",
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(24)),
    },
    balanceText: {
      color: colors.mainlyBlue,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    thirdHeader: {
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginTop: ratioHeightBasedOniPhoneX(5),
    },
    FooterTextsubs: {
      color: colors.tabText,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
  });

  // Renders a UI component for the withdrawal screen.
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <Loader loading={loading}>
        <MainHeaderView
          title="Withdraw"
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
        <View style={styles.rowcontainer}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: ratioHeightBasedOniPhoneX(10),
            }}
          >
            <GoldSubscrptionImage />
            <Text style={styles.buyGoldText}>Withdraw</Text>
            <Text style={styles.buyGoldTextSub}>
              {`Digital Gold Balance - ${
                userDashboard?.data?.digitalGold?.holding == 0
                  ? 0
                  : userDashboard?.data?.digitalGold?.holding?.toFixed(2)
              }`}
            </Text>
          </View>
          <Text style={styles.TextTitle}>Choose type</Text>
          <View style={styles.ButtonrowContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                // Use conditional styling based on isGoldButtonActive state
                isGoldButtonActive ? styles.buttonActive : null,
              ]}
              onPress={handleGoldButtonClick}
            >
              <Text
                style={[
                  styles.buttonText,
                  isGoldButtonActive ? styles.buttonActiveText : null,
                ]}
              >
                By Cash
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                // Use conditional styling based on isGoldButtonActive state
                isGoldButtonActive ? null : styles.buttonActive,
              ]}
              onPress={handleGoldButtonClick}
            >
              <Text
                style={[
                  styles.buttonText,
                  isGoldButtonActive ? null : styles.buttonActiveText,
                ]}
              >
                By Gold
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: ratioHeightBasedOniPhoneX(15),
            }}
          >
            <Text style={styles.amountText}>
              {"$"}
              {goldSocketPrice?.goldBid}
              /Oz
            </Text>
            <Text style={styles.balanceText}>Current gold seling price</Text>
            <Text style={styles.balanceText}>(inclusive of all taxes)</Text>
          </View>
          <TextInput
            label="Enter Amount ($)"
            mode="outlined"
            value={amountGold}
            onChangeText={(text) => {
              const goldAsk = goldSocketPrice?.goldBid;
              if (/^\d*\.?\d*$/.test(text)) {
                setAmountGold(text);
              }

              setAmountGoldError(validation.validateAmount(text));
              if (Number(text) >= 5) {
                const convertValue = parseInt(text, 10) / goldAsk;
                setGramGold(
                  formatNumberWithThreeDecimals(convertValue).toString()
                );
                setGramGoldError("");
                if (Number.isNaN(convertValue)) {
                  setGramGold("");
                }
              }
            }}
            underlineColor={colored.textColor}
            keyboardType="number-pad"
            activeUnderlineColor={amountGoldError ? "red" : colors.black}
            style={styles.input}
            textColor={colored.textColor}
            selectionColor={colored.textColor}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colors.orange}
            returnKeyType={"done"}
          />
          {amountGoldError ? (
            <Text style={styles.errorText}>{amountGoldError}</Text>
          ) : null}

          <TextInput
            label="Enter Gold (Oz)"
            mode="outlined"
            value={gramGold}
            onChangeText={(text) => {
              const goldAsk = goldSocketPrice?.goldBid;
              if (/^\d*\.?\d*$/.test(text)) {
                setGramGold(text);
              }
              setGramGoldError(validation.validateAmountGold(text));
              //BuyGoldSpotPrice();
              const convertValue = Number(text) * goldAsk;
              setAmountGold(
                formatNumberWithTwoDecimals(convertValue).toString()
              );
              setAmountGoldError("");
              if (Number.isNaN(convertValue)) {
                setAmountGold("");
              }
              if (text == "") {
                setAmountGold("");
              }
            }}
            underlineColor={colored.textColor}
            keyboardType="number-pad"
            activeUnderlineColor={gramGoldError ? "red" : colors.black}
            style={styles.input}
            textColor={colored.textColor}
            selectionColor={colored.textColor}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colors.orange}
            returnKeyType={"done"}
          />
          {gramGoldError ? (
            <Text style={styles.errorText}>{gramGoldError}</Text>
          ) : null}
          <View style={styles.thirdHeader}>
            <Text style={styles.FooterTextsubs}>
              The amount of gold will vary depending on the convenience fee
              associated with the card details provided.
            </Text>
          </View>
        </View>
        <View style={styles.ButtonNextRow}>
          <TouchableOpacity
            style={styles.nextbutton}
            onPress={() => {
              const amountError = validation.validateAmount(amountGold);
              const goldError = validation.validateAmountGold(gramGold);
              if (
                amountGold != "" &&
                gramGold != "" &&
                amountGoldError == "" &&
                gramGoldError == ""
              ) {
                navigation.navigate("GoldPaymentMethodScreen", {
                  type: "Bank",
                  amount: trimAmount(amountGold), //amount
                  startDate: goldSocketPrice?.goldBid, // price
                  planType: "Digital Gold",
                  subscriptionID: trimAmount(gramGold), // Qty
                  subscriptedDataID: undefined,
                  subscriPtionKey: undefined,
                  onGoBack: onGoBackBuy,
                });
              } else {
                setAmountGoldError(amountError);
                setGramGoldError(goldError);
              }
            }}
          >
            <Text style={styles.NextbuttonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </Loader>

      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => {
          setPopupVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default Withdraw;
