import { View } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import colors, { dark, light } from "../colors";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { ThemeContext } from "../Networking/themeContext";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { TextInput } from "react-native-paper";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { WalletBalanceModelResponse } from "../Wallet/WalletBalanceModel";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { SafeAreaView } from "react-native-safe-area-context";
import MainHeaderView from "../MainHeaderView";
import ShowAlertMessage from "../Popup/showAlertMessage";
import strings from "../Extension/strings";

/**
 * React component that allows users to withdraw funds from their wallet.
 * Displays the current wallet balance, allows the user to enter the withdrawal amount,
 * and performs validation on the amount entered. If the amount is valid, it navigates
 * to the security pin screen for further processing.
 */
const WithdrawWallet = () => {
  const [walletResoponse, setWalletResponse] =
    useState<WalletBalanceModelResponse | null>(null);
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [Amount, setAmount] = useState("");
  const [AmountError, setAmountError] = useState("");
  const isFocused = useIsFocused();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isFocus, setFocus] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    headerBg: {
      backgroundColor: colors.blackChitColor,
      height: ratioHeightBasedOniPhoneX(68),
    },
    backImageContainer: {
      borderRadius: ratioHeightBasedOniPhoneX(15),
      marginTop: ratioHeightBasedOniPhoneX(40),
      height: ratioHeightBasedOniPhoneX(120),
      width: "auto",
      overflow: "hidden",
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
    },
    divider: {
      backgroundColor: colors.shadowcolor,
      height: ratioHeightBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(14),
    },
    row: {
      marginTop:
        Platform.OS === "android"
          ? ratioHeightBasedOniPhoneX(25)
          : ratioHeightBasedOniPhoneX(58),
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
    },

    amountText: {
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(60),
      textAlign: "center",
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(24)),
    },
    balanceText: {
      color: colors.mainlyBlue,
      textAlign: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    input: {
      backgroundColor: colored.headerColor,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(32),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colors.black,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    error: {
      color: colors.red,
      textAlign: "left",
      fontFamily: "Inter-Medium",
      fontSize: ratioHeightBasedOniPhoneX(12),
      paddingTop: ratioHeightBasedOniPhoneX(3),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    buttonContainer: {
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
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(62),
      marginTop: "auto",
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      alignItems: "center",
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      borderTopColor: theme === "dark" ? colored.shadowColor : "transparent",
      borderTopWidth: theme === "dark" ? ratioHeightBasedOniPhoneX(1) : 0,
    },
    button: {
      backgroundColor: colors.orange,
      height: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
      width: "100%",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      padding: ratioHeightBasedOniPhoneX(1), // Add padding
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
      elevation: 10,
    },
  });

  // Determines if the component is currently focused or not.
  useEffect(() => {
    if (isFocused) {
      getWalletBalance();
    }
  }, [isFocused]);

  // Validates the amount entered by the user for withdrawing funds from their wallet.
  const validationAmount = (text: string) => {
    const digitRegex = /^[0-9.]*$/;
    if (digitRegex.test(text)) {
      setAmount(text);
    }

    const balance = walletResoponse?.data?.walletBalance ?? "";
    if (text === "") {
      setAmountError("Amount is required");
    } else if (text.trim().length !== text.length) {
      setAmountError("Enter Amount without whitespaces");
    } else if (text == "0") {
      setAmountError("Enter amount greater than zero");
    } else if (text > balance) {
      setAmountError("Insufficient Funds");
    } else {
      setAmountError("");
    }
  };

  /**
   * Retrieves the wallet balance by making an API call.
   * If the API call is successful, updates the wallet balance state variable.
   * If there is an error, displays a toast message with the error message.
   *
   * @returns {Promise<void>} - A promise that resolves with no value.
   */
  const getWalletBalance = async () => {
    try {
      await serverCommunication.getApi(
        URLConstants.walletBalance,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            if (statusCode === HTTPStatusCode.ok) {
              setWalletResponse(responseData);
            }
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    }
  };

  const handleWithDraw = () => {
    if (AmountError === "" && Amount !== "") {
      navigation.navigate("SecurityPinScreen", {
        amount: parseInt(Amount, 10),
        tag: "1",
      });
    } else {
      validationAmount(Amount);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "black" : "white"}
        translucent={false}
      />
      <View style={{ flex: 1, backgroundColor: colored.headerColor }}>
        <MainHeaderView
          title="Withdraw"
          showImage={false}
          closeApp={false}
          bottomBorderLine={false}
          whiteTextColor={false}
        />
        <Text style={styles.amountText}>
          ${" "}
          {walletResoponse?.data?.walletBalance
            ? walletResoponse?.data?.walletBalance.toFixed(2)
            : "0"}
        </Text>
        <Text style={styles.balanceText}>Total Balance</Text>
        <TextInput
          label="Amount"
          mode="outlined"
          value={Amount}
          onChangeText={validationAmount}
          underlineColor={colored.textColor}
          keyboardType="number-pad"
          returnKeyType={"done"}
          textColor={colored.textColor}
          activeUnderlineColor={AmountError ? "red" : colored.textColor}
          style={[
            styles.input,
            {
              marginTop: ratioHeightBasedOniPhoneX(40),
              marginHorizontal: ratioWidthBasedOniPhoneX(20),
            },
          ]}
          selectionColor={colored.textColor}
          outlineColor={colors.inactivegrey}
          outlineStyle={styles.outlineStyle}
          activeOutlineColor={colors.orange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        {AmountError ? <Text style={styles.error}>{AmountError}</Text> : null}
        <View style={[styles.buttonContainer]}>
          <TouchableOpacity style={styles.button} onPress={handleWithDraw}>
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

export default WithdrawWallet;
