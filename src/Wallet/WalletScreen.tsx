import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";
import {
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { SceneMap, TabView } from "react-native-tab-view";
import { Transaction } from "../enums";
import WalletAll from "./walletAll";
import BottomSheet from "react-native-raw-bottom-sheet";
import { TextInput } from "react-native-paper";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { WalletBalanceModelResponse } from "./WalletBalanceModel";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import ShowAlertMessage from "../Popup/showAlertMessage";
import WalletImage from "../assets/images/homeImage/walletImage.svg";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";

const WalletScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [index, setIndex] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [Amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [walletResponse, setWalletResponse] =
    useState<WalletBalanceModelResponse | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  // Represents an array of routes for a tab view component.
  const routes = [
    { key: "all", title: "All" },
    { key: "deposit", title: "Deposit" },
    { key: "withdraws", title: "Withdraws" },
  ];

  // Returns a SceneMap object that defines the scenes for a TabView component.
  const renderScene = SceneMap({
    all: () => <WalletAll status={Transaction.ALL} />,
    deposit: () => <WalletAll status={Transaction.DEPOSIT} />,
    withdraws: () => <WalletAll status={Transaction.WITHDRAW} />,
  });

  useEffect(() => {
    if (isFocused) {
      getWalletBalance();
    }
  }, [isFocused]);

  const validateAmounts = (text: string) => {
    const amountNumber = parseInt(text, 10);

    setAmount(text);
    if (text === "") {
      setAmountError("Amount is required");
    } else if (text.trim().length !== text.length) {
      setAmountError("Enter Amount without whitespaces");
    } else if (!isNaN(amountNumber) && amountNumber == 0) {
      setAmountError("Please Enter Amount greater than equal to  1");
    } else if (!isNaN(amountNumber) && amountNumber > 100000) {
      setAmountError("Please Enter Amount less than 100000");
    } else {
      setAmountError("");
    }
  };

  const renderTabBar = (props) => (
    <View style={styles.segmentContainer}>
      {props.navigationState.routes.map((route, i) => {
        const isActive = i === props.navigationState.index;
        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.segmentButton,
              isActive && styles.activeSegmentButton,
            ]}
            onPress={() => setIndex(i)}
          >
            <Text
              style={[
                styles.segmentButtonText,
                isActive && styles.activeSegmentButtonText,
              ]}
            >
              {route.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const handlePaymentWithClose = async () => {
    if (Amount !== "" && amountError === "") {
      bottomSheetRef.current?.close();
      navigation.navigate("PaymentMethodScreen", { amount: Amount });
    } else {
      validateAmounts(Amount);
    }
  };

  // Retrieves the wallet balance by making an API call.
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? colored.white : colored.FilterBg,
    },
    backImageContainer: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      height: ratioHeightBasedOniPhoneX(165),
      paddingTop: ratioHeightBasedOniPhoneX(10),
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },

    transactionText: {
      color: colored.textColor,
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    walletText: {
      marginTop: ratioHeightBasedOniPhoneX(6),
      color: colors.black,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(32)),
    },
    totalBalanceText: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      color: colors.darkgrey,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    DigitalWalletText: {
      color: colors.lightblack,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    segmentContainer: {
      backgroundColor: colored.segementBackGround,
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(36),
      marginTop: ratioHeightBasedOniPhoneX(10),
      justifyContent: "center",
      marginBottom: ratioHeightBasedOniPhoneX(20),
      flexDirection: "row",
    },
    segmentButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    activeSegmentButton: {
      backgroundColor: colored.segementActiveColor,
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginVertical: ratioHeightBasedOniPhoneX(2),
      marginHorizontal: ratioWidthBasedOniPhoneX(1),
      borderColor: colored.background,
      flex: 1,
    },
    segmentButtonText: {
      color: colors.tabText,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    activeSegmentButtonText: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      color: colored.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    depositbutton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.orange,
      borderRadius: ratioHeightBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(40),
      marginLeft: ratioHeightBasedOniPhoneX(9),
      flex: 1,
    },
    depositText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    amountPrefix: {
      marginTop: 12,
    },
    bottomContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
        },
        android: {
          elevation: 8,
          shadowColor: colors.black,
        },
      }),
      marginTop: "auto",
      flexDirection: "row",
      gap: ratioHeightBasedOniPhoneX(9),
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
    },
    button: {
      backgroundColor: colored.lightGreen,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      marginVertical: ratioHeightBasedOniPhoneX(12),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },

    //bottomsheet
    headerBottomTitle: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    input: {
      backgroundColor: colored.cardBackGround,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      marginTop: ratioHeightBasedOniPhoneX(15),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    error: {
      color: colors.red,
      textAlign: "left",
      fontFamily: "Inter-Medium",
      fontSize: ratioHeightBasedOniPhoneX(12),
      paddingTop: ratioHeightBasedOniPhoneX(3),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    closeImage: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioWidthBasedOniPhoneX(24),
      tintColor: colored.dimGray,
    },
    buttonContainerBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: ratioHeightBasedOniPhoneX(15),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(96),
    },
    confirmbutton: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      backgroundColor: colors.orange,
      width: "auto",
      flex: 1,
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    cancelbutton: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      backgroundColor:
        theme === "light" ? colored.buttonGray : colored.cancelButtonBg,
      width: "auto",
      flex: 1,
      marginRight: ratioWidthBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    cancelText: {
      color: colored.textColor,
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
      elevation: 8,
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
      backgroundColor: colored.white,
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
    subText: {
      color: colors.dimGray,
      marginTop: ratioHeightBasedOniPhoneX(5),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? colored.darkheaderColor : "white"}
        translucent={false}
      />
      <MainHeaderView
        title="Wallet"
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />

      <ImageBackground
        source={
          theme === "light"
            ? require("../assets/images/Wallet_background.png")
            : require("../assets/images/wallet-dark-bg.png")
        }
        style={styles.backImageContainer}
        borderRadius={10}
      >
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            paddingVertical: ratioHeightBasedOniPhoneX(
              Platform.OS == "ios" ? ratioHeightBasedOniPhoneX(15) : 0
            ),
            paddingTop: ratioHeightBasedOniPhoneX(
              Platform.OS == "android" ? 15 : 10
            ),
          }}
        >
          <Text style={styles.DigitalWalletText}>Wealthido Digital Wallet</Text>
          <WalletImage />
        </View>

        <Text style={styles.walletText}>
          ${" "}
          {walletResponse?.data?.walletBalance
            ? walletResponse?.data?.walletBalance.toFixed(2)
            : "0"}
        </Text>
        <Text style={styles.totalBalanceText}>Total Balance</Text>
      </ImageBackground>

      <Text style={styles.transactionText}>Transactions</Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        lazy={true}
        lazyPreloadDistance={0}
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("WithdrawWallet");
          }}
          style={[
            styles.button,
            {
              backgroundColor:
                theme === "light" ? colored.buttonGray : colored.cancelButtonBg,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colored.lightblack }]}>
            Withdraw
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            bottomSheetRef.current?.open();
            setAmount("");
            setAmountError("");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Deposit</Text>
        </TouchableOpacity>
      </View>

      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />

      <BottomSheet
        ref={bottomSheetRef}
        closeOnDragDown
        dragFromTopOnly
        customStyles={{
          draggableIcon: { backgroundColor: "transparent" },
          container: {
            backgroundColor: colored.cardBackGround,
            height: "auto",
          },
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: ratioHeightBasedOniPhoneX(-10),
              marginHorizontal: ratioWidthBasedOniPhoneX(20),
            }}
          >
            <Text style={styles.headerBottomTitle}>Deposit</Text>
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.close();
              }}
            >
              <Image
                source={require("../assets/images/Close.png")}
                style={styles.closeImage}
              ></Image>
            </TouchableOpacity>
          </View>
          <Text style={styles.subText}>
            Enter the amount you want to deposit.
          </Text>
          <TextInput
            label="Amount"
            mode="outlined"
            value={Amount}
            left={<TextInput.Affix text="$" textStyle={styles.amountPrefix} />}
            onChangeText={validateAmounts}
            activeUnderlineColor={amountError ? "red" : colors.black}
            underlineColor={colors.black}
            keyboardType="number-pad"
            style={[
              styles.input,
              {
                marginHorizontal: ratioWidthBasedOniPhoneX(20),
              },
            ]}
            cursorColor={"#FF8001"}
            selectionColor={"#FF8001"}
            textColor={colored.textColor}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colors.orange}
          />
          {amountError ? (
            <Text
              style={[
                styles.error,
                { marginHorizontal: ratioWidthBasedOniPhoneX(20) },
              ]}
            >
              {amountError}
            </Text>
          ) : null}
          <View
            style={{
              borderTopWidth:
                theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
              borderColor: "#222528",
              marginTop: ratioHeightBasedOniPhoneX(15),
            }}
          >
            <View style={styles.buttonContainerBottom}>
              <TouchableOpacity
                style={styles.cancelbutton}
                onPress={() => {
                  bottomSheetRef.current?.close();
                  setAmount("");
                  setAmountError("");
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmbutton}
                onPress={handlePaymentWithClose}
              >
                <Text style={styles.depositText}>Deposit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default WalletScreen;
