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
import HttpStatusCode from "../Networking/HttpStatusCode";
import { ResendAuthRequestModel } from "../VerficationCodeScreen/Modal/ResendAuthRequestModel";
import { TwoFactorAuthRequestModel } from "./Model/TwoFactorAuthRequestModel";
import StorageService from "../StorageService";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";

const CELL_COUNT = 6;
export type VerificationParams = {
  second?: number;
  blockRegenerateTime?: Date;
  phoneNo?: string;
  password?: string;
  fcmToken?: string;
  deviceId?: string;
};

const TwoFactorVerification = () => {
  const route = useRoute();
  const params = route?.params as VerificationParams | undefined;
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [otpVerification, setOTPVerification] = useState("");
  const [oldOTPVerificationError, setOldOTPVerificationError] = useState("");
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
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const resendOtp = async () => {
    const phoneNumber = params?.phoneNo as unknown as string;
    const resendOtpModel = new ResendAuthRequestModel(phoneNumber);
    try {
      await serverCommunication.postApi(
        URLConstants.resendOtp,
        resendOtpModel,
        async (statusCode: number, responseData: any, error: any) => {
          if (!error) {
            setCurrentDate(responseData.data.blockTime);
            showTextPopup(strings.success, responseData.message);
          } else {
            if (responseData.statusCode == HttpStatusCode.unauthorized) {
              showTextPopup(strings.error, responseData.message);
              return;
            }
            showTextPopup(strings.error, error.message);
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    }
  };

  const navigateToSetSecurityPin = (phoneNumber: any, password: string) => {
    navigation.navigate("SetSecurityPin", { phoneNumber, password });
  };

  const navigateToBiometricSetup = () => {
    navigation.navigate("BiometricSetupScreen");
  };

  const navigateToMainTab = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTab" }],
    });
  };

  const TwoFactorOtpVerify = async (data: TwoFactorAuthRequestModel) => {
    setLoading(true);
    try {
      await serverCommunication.postApi(
        URLConstants.TwoFactorOtpVerify,
        data,
        (statusCode: number, responseData: any, error: any) => {
          StorageService.setIsLogin(responseData);
          if (responseData.status == HttpStatusCode.ok) {
            if (responseData?.data?.enablePinLock === false) {
              navigateToSetSecurityPin(
                params?.phoneNo,
                params?.password as string
              );
            } else if (
              responseData?.data?.setUpLaterFingerOrFaceLock === false &&
              responseData?.data?.enableFingerOrFaceLock === false
            ) {
              navigateToBiometricSetup();
            } else {
              navigateToMainTab();
            }
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
      backgroundColor: colored.white,
    },
    BigText: {
      color: colors.veryDarkGrayishYellow,
      marginTop: ratioHeightBasedOniPhoneX(24),
      textAlign: "left",
      textTransform: "capitalize",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(26)),
    },
    descText: {
      color: colored.dimGray,
      textAlign: "left",
      marginTop: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    phoneNoText: {
      color: colored.lightblack,
      textAlign: "left",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    otpContainer: {
      marginTop: ratioHeightBasedOniPhoneX(50),
      flexDirection: "row",
      gap: 6,
      justifyContent: "space-between",
    },
    otpInput: {
      width: ratioWidthBasedOniPhoneX(45),
      height: ratioHeightBasedOniPhoneX(45),
      borderWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.lightGray,
      borderRadius: ratioHeightBasedOniPhoneX(5),
      fontSize: ratioHeightBasedOniPhoneX(18),
      color: colors.black,
      textAlign: "center",
      padding: ratioHeightBasedOniPhoneX(8),
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
    secondText: {
      marginTop: ratioHeightBasedOniPhoneX(25),
      color: colors.lightGreen,
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
    },
    resendCodeContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(50),
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
      backgroundColor: colored.headerColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(62),
    },
    button: {
      marginVertical: ratioHeightBasedOniPhoneX(16),
      backgroundColor: colored.lightGreen,
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

  const verifyNowButtonPress = async () => {
    const otpVerificationError =
      validation.handleOTPVerification(otpVerification);
    setOldOTPVerificationError(otpVerificationError);
    if (otpVerificationError === "") {
      const phoneNumber = params?.phoneNo as unknown as string;

      const otpVerifyRequest = new TwoFactorAuthRequestModel(
        otpVerification,
        phoneNumber,
        params?.password as string,
        params?.fcmToken as string,
        params?.deviceId as string
      );
      await TwoFactorOtpVerify(otpVerifyRequest);
    }
  };

  const isDisabled = seconds !== 0;
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"Two Factor Authentication"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />

      <View style={{ paddingHorizontal: ratioWidthBasedOniPhoneX(20) }}>
        <Text style={styles.BigText}>Enter OTP</Text>
        <Text>
          <Text style={styles.descText}>We have sent a code to</Text>{" "}
          <Text style={styles.phoneNoText}>{params?.phoneNo}</Text>
        </Text>

        <View style={{ justifyContent: "space-around" }}>
          <CodeField
            ref={ref}
            {...props}
            value={otpVerification}
            onChangeText={(text) => {
              setOTPVerification(text);
              setOldOTPVerificationError(
                validation.handleOTPVerification(text)
              );
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
          {oldOTPVerificationError ? (
            <Text style={styles.errorText}>{oldOTPVerificationError}</Text>
          ) : null}
        </View>

        <Text style={styles.secondText}>
          {seconds > 0 ? ` ${formatTime(seconds)} Sec` : "0:00 Sec"}
        </Text>

        <View style={[styles.resendCodeContainer]}>
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
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                otpVerification.length > 5
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
                  otpVerification.length > 5 ? colors.white : colors.DarkGray,
              },
            ]}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      <Loader loading={loading} />
      <ShowAlertMessage
        isVisible={popupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

export default TwoFactorVerification;
