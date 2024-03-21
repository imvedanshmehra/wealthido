import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import colors, { dark, light } from "../colors";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import strings from "../Extension/strings";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import { ThemeContext } from "../Networking/themeContext";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import ShowAlertMessage from "../Popup/showAlertMessage";
import { addBankAccount } from "./Controller/AddCard&AddBankController";
import { AddBankAuthRequestModel } from "./Model/AddBankAuthRequestModel";
import Loader from "../Loader";
import { SafeAreaView } from "react-native-safe-area-context";

const AddBank = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankErrorCode, setBankErrorCode] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountError, setAccountError] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };
  const validateName = (text: string) => {
    setName(text);
    if (!text) {
      setNameError(strings.nameRequired);
    } else {
      setNameError("");
    }
  };

  const validateBankCode = (text: string) => {
    setBankCode(text);
    if (!text) {
      setBankErrorCode("Bank code is required");
    } else {
      setBankErrorCode("");
    }
  };

  const validateAccountNo = (text: string) => {
    setAccountNo(text);
    if (!text) {
      setAccountError("Account no is required");
    } else {
      setAccountError("");
    }
  };

  const createSetupLater = async (
    paymentMethodType: string
  ): Promise<string> => {
    try {
      return new Promise((resolve, reject) => {
        serverCommunication.postApi(
          `${URLConstants.createSetupIntent}${paymentMethodType}`,
          null,
          (statusCode: number, responseData: any, error: any) => {
            if (!error) {
              resolve(responseData.data.setUpIntentId);
            } else {
              reject(error.message);
            }
          }
        );
      });
    } catch (error) {
      return showTextPopup("", "An error occurred while resending OTP.");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    errorText: {
      color: "red",
      textAlign: "left",
      fontSize: ratioHeightBasedOniPhoneX(12),
      fontFamily: "Inter-Medium",
      paddingBottom: ratioHeightBasedOniPhoneX(4),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colors.black,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    labels: {
      color: colors.mainlyBlue,
      marginTop: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },

    textInput: {
      height: ratioHeightBasedOniPhoneX(40),
      textAlign: "left",
      backgroundColor: "transparent",
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginBottom: ratioHeightBasedOniPhoneX(10),
      color: colors.black,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    button: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    buttonText: {
      color: colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
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
      flexDirection: "row",
      alignItems: "center",
      gap: ratioHeightBasedOniPhoneX(9),
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(62),
      justifyContent: "center",
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    accountVerificationText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
      color: colors.black,
    },
    startVerifyText: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(18)),
      textAlign: "justify",
      color: colors.lightblack,
    },
    buttonContainerBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: ratioHeightBasedOniPhoneX(35),
      marginBottom: ratioHeightBasedOniPhoneX(10),
    },
    cancelbutton: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(50),
      backgroundColor: colored.buttonGray,
      width: "auto",
      flex: 0.37,
      marginRight: ratioWidthBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    cancelText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    confirmbutton: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(50),
      backgroundColor: colors.orange,
      width: "auto",
      flex: 0.6,
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    depositText: {
      color: colors.white,
      textAlign: "center",
      padding: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    input: {
      height: ratioHeightBasedOniPhoneX(48),
      textAlign: "left",
      backgroundColor: colored.background,
      color: colored.textColor,
      paddingHorizontal: ratioHeightBasedOniPhoneX(2),
      marginBottom: ratioHeightBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(14),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(13)),
    },

    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    popupContainer: {
      backgroundColor: colored.headerColor,
      padding: ratioHeightBasedOniPhoneX(20),
      borderRadius: ratioHeightBasedOniPhoneX(10),
      justifyContent: "center",
      alignItems: "center",
      width: "80%",
      borderColor: colored.shadowColor,
      borderWidth: ratioWidthBasedOniPhoneX(0.8),
    },
    popupText: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(16)),
      color: colored.textColor,
      textAlign: "center",
      marginBottom: ratioHeightBasedOniPhoneX(20),
    },
    closeButton: {
      flex: 1,
      backgroundColor: colors.orange,
      marginTop: ratioHeightBasedOniPhoneX(30),
      padding: ratioHeightBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(40),
      alignItems: "center",
    },
    closeButtonText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
      color: colors.white,
    },
  });

  const handleConfirmManualBankAccountParamsPress = async () => {
    setLoading(true);
    const clientSecret = await createSetupLater("bank");
    const data = new AddBankAuthRequestModel(
      name,
      accountNo,
      bankCode,
      clientSecret
    );
    addBankAccount(
      data,
      (response) => {
        showTextPopup(strings.success, response.message);
      },
      (error) => {
        showTextPopup(strings.error, error.message);
      },
      (loading) => {
        setLoading(loading);
      },
      () => setLoading(false)
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"Add Bank"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: ratioWidthBasedOniPhoneX(20) }}>
          <View style={{ marginTop: ratioHeightBasedOniPhoneX(10) }}>
            <TextInput
              mode="outlined"
              selectionColor={colors.black}
              activeUnderlineColor={colors.black}
              underlineColor={colors.dimGray}
              style={styles.input}
              cursorColor={theme === "light" ? colors.black : colors.white}
              label={"Name"}
              value={name}
              outlineColor={colors.inactivegrey}
              outlineStyle={styles.outlineStyle}
              activeOutlineColor={colors.orange}
              textColor={theme === "light" ? colors.black : colors.white}
              onChangeText={validateName}
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
          </View>

          <TextInput
            mode="outlined"
            selectionColor={colors.black}
            activeUnderlineColor={colors.black}
            underlineColor={colors.dimGray}
            style={styles.input}
            label="Routing Number"
            cursorColor={theme === "light" ? colors.black : colors.white}
            value={bankCode}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colors.orange}
            textColor={theme === "light" ? colors.black : colors.white}
            onChangeText={validateBankCode}
          />
          {bankErrorCode ? (
            <Text style={styles.errorText}>{bankErrorCode}</Text>
          ) : null}

          <TextInput
            mode="outlined"
            selectionColor={colors.black}
            activeUnderlineColor={colors.black}
            underlineColor={colors.dimGray}
            style={styles.input}
            cursorColor={theme === "light" ? colors.black : colors.white}
            value={accountNo}
            label={strings.accountNumber}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colors.orange}
            textColor={theme === "light" ? colors.black : colors.white}
            onChangeText={validateAccountNo}
          />
          {accountError ? (
            <Text style={styles.errorText}>{accountError}</Text>
          ) : null}
          <Text style={styles.labels}>{strings.makeSureBankName}</Text>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  theme === "light"
                    ? colors.buttonGray
                    : colored.cancelButtonBg,
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: theme === "light" ? colors.lightblack : colors.white,
                },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.orange }]}
            onPress={() => {
              if (
                name != "" &&
                bankCode != "" &&
                accountNo != "" &&
                nameError == "" &&
                bankErrorCode == "" &&
                accountError == ""
              ) {
                handleConfirmManualBankAccountParamsPress();
              } else {
                validateName(name);
                validateBankCode(bankCode);
                validateAccountNo(accountNo);
              }
            }}
          >
            <Text style={styles.buttonText}>Add Bank</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ShowAlertMessage
        isVisible={popupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => {
          if (popupMessage == "New bank added successfully") {
            navigation.goBack();
          } else {
            setPopupVisible(false);
          }
        }}
      />
      <Loader loading={loading} />
    </SafeAreaView>
  );
};

export default AddBank;
