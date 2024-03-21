import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import colors, { dark, light } from "../colors";
import { ThemeContext } from "../Networking/themeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import Loader from "../Loader";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import ShowAlertMessage from "../Popup/showAlertMessage";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import validation from "../RegisterScreen/validation";
import {
  add30Seconds,
  calculateAuctionDuration,
  extractTimeFromTimestamp,
  formatTime,
} from "../Utility";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import { GenerateOtpModel } from "./Model/GenerateOtpModel";
import HttpStatusCode from "../Networking/HttpStatusCode";
import { VerificationAuthRequestModel } from "../VerficationCodeScreen/Modal/VerificationAuthRequestModel";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";

const CELL_COUNT = 6;

export type VerificationParams = {
  second?: number;
  blockRegenerateTime?: Date;
  phoneNo?: string;
};

const OtpVerification = () => {
  const route = useRoute();
  const params = route?.params as VerificationParams | undefined;
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [otpVerification, setOTPVerification] = useState("");
  const [otpVerificationError, setOTPVerificationError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const targetTime = params?.blockRegenerateTime;
  const [currentDate, setCurrentDate] = useState(targetTime);

  const ref = useBlurOnFulfill({
    value: otpVerification,
    cellCount: CELL_COUNT,
  });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpVerification,
    setValue: setOTPVerification,
  });

  useEffect(() => {
    const extractedTime = extractTimeFromTimestamp(
      `${add30Seconds(currentDate, params?.second)}`
    );
    setSeconds(
      calculateAuctionDuration(extractedTime, 0, (seconds) => {
        setSeconds(seconds);
      })
    );
    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds((prevDuration) => Math.max(0, prevDuration - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds, currentDate]);

  const showTextPopup = async (title: string, message: string) => {
    setIsPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const resendOtp = async () => {
    try {
      await serverCommunication.getApi(
        URLConstants.regenerateOTP,
        async (statusCode: any, responseData: GenerateOtpModel, error: any) => {
          if (responseData.status == HttpStatusCode.ok) {
            setCurrentDate(responseData.data?.block_regenerate_time);
            showTextPopup(strings.success, responseData.message ?? "");
          } else if (responseData.status == HttpStatusCode.unauthorized) {
            showTextPopup(strings.error, responseData.message ?? "");
          } else {
            showTextPopup(strings.error, error.message);
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    }
  };

  const otpVerify = async (data: VerificationAuthRequestModel) => {
    setLoading(true);
    try {
      await serverCommunication.postApi(
        URLConstants.phoneNoVerify,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (responseData.status == HttpStatusCode.ok) {
            navigation.navigate("PasswordChangedScreen");
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? colored.white : colored.FilterBg,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioWidthBasedOniPhoneX(32),
      marginLeft: ratioWidthBasedOniPhoneX(70),
    },
    logoTitle: {
      marginRight: ratioWidthBasedOniPhoneX(85),
      color: colors.lightblack,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    descText: {
      color: colored.dimGray,
      textAlign: "left",
      marginTop: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    BigText: {
      color: theme === "light" ? colors.veryDarkGrayishYellow : colors.white,
      marginTop: ratioHeightBasedOniPhoneX(10),
      textAlign: "left",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    subText: {
      color: colors.dimGray,
      marginTop: ratioHeightBasedOniPhoneX(10),
      textAlign: "left",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    otpContainer: {
      marginTop: ratioHeightBasedOniPhoneX(46),
      flexDirection: "row",
      gap: 6,
      justifyContent: "space-between",
    },
    otpInput: {
      width: ratioWidthBasedOniPhoneX(42),
      borderWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.lightGray,
      borderRadius: ratioHeightBasedOniPhoneX(5),
      fontSize: ratioHeightBasedOniPhoneX(18),
      color: theme === "light" ? colors.black : colors.white,
      textAlign: "center",
      padding: ratioHeightBasedOniPhoneX(10),
      height: ratioHeightBasedOniPhoneX(42),
    },
    errorText: {
      color: colors.mainlyRED,
      textAlign: "left",
      marginTop: ratioHeightBasedOniPhoneX(3),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    focusCell: {
      borderColor: colors.lightGreen,
      color: colors.lightGreen,
    },
    resendCodeContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(27),
      marginLeft: ratioHeightBasedOniPhoneX(20),
      paddingBottom: ratioHeightBasedOniPhoneX(20),
    },
    resendText: {
      color: colors.veryDarkGray,
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
    },
    resendButtonText: {
      marginLeft: ratioWidthBasedOniPhoneX(5),
      color: colors.orange,
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
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
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.cardBackGround,
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(62),
    },
    button: {
      backgroundColor: colored.lightGreen,
      height: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      padding: ratioHeightBasedOniPhoneX(1),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 0.2, height: 0.2 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    androidShadow: {
      elevation: 8,
      shadowColor: colors.black,
    },
  });

  const verifyNowButtonPress = async () => {
    const otpVerificationError =
      validation.handleOTPVerification(otpVerification);
    setOTPVerificationError(otpVerificationError);
    if (otpVerificationError === "") {
      const phoneNumber = params?.phoneNo as unknown as string;
      const otpVerifyRequest = new VerificationAuthRequestModel(
        phoneNumber,
        otpVerification
      );
      await otpVerify(otpVerifyRequest);
    }
  };

  const isDisabled = seconds !== 0;
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"OTP Verification"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={{ paddingHorizontal: ratioWidthBasedOniPhoneX(20) }}>
        <Text style={styles.BigText}>Enter OTP </Text>
        <Text style={{ marginTop: ratioHeightBasedOniPhoneX(10) }}>
          <Text style={styles.descText}>We have sent a code to</Text>{" "}
          <Text
            style={{ color: theme === "light" ? colors.black : colors.white }}
          >
            {params?.phoneNo}
          </Text>
        </Text>

        <View style={{ justifyContent: "space-around" }}>
          <CodeField
            ref={ref}
            {...props}
            value={otpVerification}
            onChangeText={(text) => {
              setOTPVerification(text);
              setOTPVerificationError(validation.handleOTPVerification(text));
            }}
            cellCount={CELL_COUNT}
            rootStyle={styles.otpContainer}
            keyboardType="number-pad"
            returnKeyType={"done"}
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.otpInput, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          {otpVerificationError ? (
            <Text style={styles.errorText}>{otpVerificationError}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.resendCodeContainer}>
        <Text style={styles.resendButtonText}>
          {seconds > 0 ? ` ${formatTime(seconds)} Sec` : "0:00 Sec"}
        </Text>
      </View>
      <View
        style={[
          styles.resendCodeContainer,
          { marginTop: ratioHeightBasedOniPhoneX(16) },
        ]}
      >
        <Text style={styles.resendText}>Didn't you receive the OTP?</Text>
        <TouchableOpacity
          disabled={seconds > 0 ? isDisabled : false}
          onPress={resendOtp}
          activeOpacity={0.5}
        >
          <Text
            style={[
              styles.resendButtonText,
              {
                color:
                  seconds > 0
                    ? isDisabled
                      ? colors.lightGray
                      : colors.orange
                    : colors.orange,
              },
            ]}
          >
            Resend OTP
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                theme === "dark"
                  ? colors.lightGreen
                  : otpVerification.length > 5
                  ? colors.lightGreen
                  : colors.lightGraySilver,
            },
          ]}
          onPress={verifyNowButtonPress}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  theme === "dark"
                    ? colors.white
                    : otpVerification.length > 5
                    ? colors.white
                    : colors.DarkGray,
              },
            ]}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      <Loader loading={loading} />
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setIsPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

export default OtpVerification;
