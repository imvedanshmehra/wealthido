import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import colors from "../colors";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { useNavigation } from "@react-navigation/native";
import { ForgotAuthRequestModel } from "../VerficationCodeScreen/Modal/VerificationAuthRequestModel";
import HttpStatusCode from "../Networking/HttpStatusCode";
import ServerController from "../Networking/ServerController";
import { ForgotPassword } from "./Model/ForgetPassordResponseModel";
import Loader from "../Loader";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import { countryCode } from "../enums";
import ShowAlertMessage from "../Popup/showAlertMessage";

const ForgotScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    // Apply the US phone number format
    if (cleaned.length > 6) {
      const formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(
        3,
        6
      )}-${cleaned.slice(6, 21)}`;
      setPhoneNumber(formatted);
    } else if (cleaned.length > 3) {
      const formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}`;
      setPhoneNumber(formatted);
    } else {
      setPhoneNumber(cleaned);
    }
    if (!text) {
      setPhoneNumberError(strings.mobileRequired);
    } else if (text.length != 14) {
      setPhoneNumberError("Enter a Valid Mobile Number");
    } else {
      setPhoneNumberError("");
    }
  };

  const handleLogin = async () => {
    if (phoneNumber && phoneNumberError === "") {
      const cleaned = phoneNumber.replace(/\D/g, "");
      const otpVerify = new ForgotAuthRequestModel(countryCode.Code + cleaned);
      setLoading(true);
      const onSuccess = async (response: ForgotPassword) => {
        setLoading(false);
        if (response.status === HttpStatusCode.ok) {
          navigation.navigate("VerificationCodeScreen", {
            phoneNumber: countryCode.Code + cleaned,
            blockTime: response.data?.blockTime,
            tag: 1,
            statusCode: response.status,
            second: response.data?.second,
          });
          setLoading(false);
        }
        if (response?.data == null) {
          showTextPopup(strings.error, response?.message);
        }
      };

      const onError = (error: any) => {
        setLoading(false);
        showTextPopup(strings.error, error.message);
      };

      ServerController.ForgotPassword(otpVerify, onSuccess, onError);
    } else {
      formatPhoneNumber(phoneNumber);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"Forgot Password"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={styles.subContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Please enter your Mobile Number</Text>
        <TextInput
          label="Mobile Number"
          mode="outlined"
          activeUnderlineColor={phoneNumberError != "" ? "red" : colors.black}
          underlineColor={colors.dimGray}
          style={styles.input}
          keyboardType="number-pad"
          returnKeyType={"done"}
          value={phoneNumber}
          maxLength={14}
          onChangeText={formatPhoneNumber}
          cursorColor={colors.orange}
          selectionColor={colors.orange}
          outlineColor={colors.inactivegrey}
          outlineStyle={styles.outlineStyle}
          activeOutlineColor={colors.orange}
        />
        {phoneNumberError ? (
          <Text style={styles.errorText}>{phoneNumberError}</Text>
        ) : null}

        <Loader loading={loading} />
        <ShowAlertMessage
          isVisible={popupVisible}
          title={popupTitle}
          message={popupMessage}
          onClose={() => setPopupVisible(false)}
        />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  subContainer: {
    paddingHorizontal: ratioHeightBasedOniPhoneX(20),
  },
  title: {
    marginTop: ratioHeightBasedOniPhoneX(10),
    color: colors.veryDarkGrayishYellow,
    ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
  },
  subtitle: {
    marginTop: ratioHeightBasedOniPhoneX(8),
    color: colors.lightText,
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: ratioHeightBasedOniPhoneX(48),
  },
  image: {
    height: ratioHeightBasedOniPhoneX(20),
    width: ratioWidthBasedOniPhoneX(20),
  },
  fundImage: {
    height: ratioHeightBasedOniPhoneX(55),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: ratioHeightBasedOniPhoneX(50),
    marginTop: ratioHeightBasedOniPhoneX(30),
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: ratioHeightBasedOniPhoneX(14),
    height: ratioHeightBasedOniPhoneX(40),
    paddingHorizontal: ratioWidthBasedOniPhoneX(2),
    marginTop: ratioHeightBasedOniPhoneX(40),
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
  },
  outlineStyle: {
    borderWidth: ratioWidthBasedOniPhoneX(0.5),
    color: colors.black,
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
  },
  errorText: {
    marginTop: ratioHeightBasedOniPhoneX(5),
    color: "red",
    textAlign: "left",
    fontSize: ratioHeightBasedOniPhoneX(12),
    fontFamily: "Inter-Medium",
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
    backgroundColor: colors.white,
    paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    height: ratioHeightBasedOniPhoneX(62),
  },
  button: {
    marginVertical: ratioHeightBasedOniPhoneX(16),
    backgroundColor: colors.lightGreen,
    height: ratioHeightBasedOniPhoneX(40),
    justifyContent: "center",
    borderRadius: ratioHeightBasedOniPhoneX(24),
  },
  buttonText: {
    color: colors.white,
    textAlign: "center",
    ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
  },
});

export default ForgotScreen;
