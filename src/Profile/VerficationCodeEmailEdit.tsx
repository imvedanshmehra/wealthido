import React, { useContext, useEffect, useState } from "react";
import {
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import URLConstants from "../Networking/URLConstants";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import {
  add30Seconds,
  calculateAuctionDuration,
  extractTimeFromTimestamp,
  formatTime,
  formatUSCountryCode,
} from "../Utility";
import Loader from "../Loader";
import validation from "../RegisterScreen/validation";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { VerificationResponseModel } from "../VerficationCodeScreen/Modal/verificationResponseModel";
import LogoutPopupMessage from "../LogoutPopupMessage";
import ShowPopuptMessage from "../showPopupMessage";
import ShowAlertMessage from "../Popup/showAlertMessage";
import MainHeaderView from "../MainHeaderView";
import {
  resendNewMobileNo,
  verificationEmailOrPhone,
} from "./VerificationController";
import { ThemeContext } from "../Networking/themeContext";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";

const CELL_COUNT = 6;
export type RouteParams = {
  email?: string;
  newEmail?: string;
  isEmailVerified?: boolean;
  blockTime?: Date;
  phoneNumber?: string;
  tag?: number;
  second?: number;
};

const VerificationCodeEmailEdit = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const params = route?.params as RouteParams | undefined;
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [otpVerification, setOTPVerification] = useState("");
  const [response, setResendOtp] = useState<VerificationResponseModel>({});
  const [loading, setLoading] = useState(false);
  const [OTPVerificationError, setOTPVerificationError] = useState("");
  const [isAlertVisibleEdit, setIsAlertVisibleEdit] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const targetTime = params?.blockTime;
  const [currentDate, setCurrentDate] = useState(targetTime);
  const ref = useBlurOnFulfill({
    value: otpVerification,
    cellCount: CELL_COUNT,
  });
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpVerification,
    setValue: setOTPVerification,
  });
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const isDisabled = seconds !== 0;

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  useEffect(() => {
    const onBackPress = () => true;
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    const extractedTime = extractTimeFromTimestamp(
      add30Seconds(currentDate ?? "", params?.second)
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
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [seconds, currentDate, params?.second]);

  const resendCodeHandePress = async () => {
    const resendOtpModel = { phoneNo: params?.phoneNumber };
    const url =
      params?.tag === 1
        ? URLConstants.resendNewMobileNo
        : URLConstants.resendOtp;
    await resendNewMobileNo(
      resendOtpModel,
      url,
      (response) => {
        const blockTime = response?.data?.block_regenerate_time;
        if (blockTime && !isNaN(Date.parse(blockTime))) {
          setCurrentDate(new Date(blockTime));
        } else {
          console.error("Invalid blockTime value:", blockTime);
        }
        setResendOtp(response);
        showTextPopup(strings.success, response.message);
      },
      (message) => {
        showTextPopup(strings.error, message);
      },
      (Visible) => {
        setIsAlertVisible(Visible);
      }
    );
  };

  const handlevalidate = () => {
    const otpVerifyError = validation.handleOTPVerification(otpVerification);
    setOTPVerificationError(otpVerifyError);
    if (
      otpVerification !== "" &&
      OTPVerificationError === "" &&
      otpVerification.length == 6
    ) {
      setIsAlertVisibleEdit(true);
    }
  };

  const handleConfirmbuttonPress = async () => {
    setIsAlertVisibleEdit(false);

    const data: { otp: string; phoneNo?: string; email?: string } = {
      otp: otpVerification,
    };

    let url;
    if (params?.tag === 1) {
      data.phoneNo = params?.phoneNumber;
      url = URLConstants.editPhoneNoVerify;
    } else {
      data.email = params?.newEmail;
      url = URLConstants.editEmail;
    }
    await verificationEmailOrPhone(
      url,
      data,
      (message: string) => {
        setTimeout(() => {
          showTextPopup(strings.error, message);
        }, 400);
      },
      (loading: any) => {
        setLoading(loading);
      }
    );
  };

  const handleOkButtonPress = async () => {
    setIsAlertVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Logins" }],
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? colored.white : colored.FilterBg,
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
      color: theme === "light" ? colors.black : colors.white,
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
      marginTop: "auto",
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    androidShadow: {
      elevation: 8,
      shadowColor: colors.black,
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

    contentContainer: {
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      flex: 1,
      backgroundColor: theme === "light" ? colors.white : colored.FilterBg,
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    descriptionContainer: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      alignItems: "center",
    },
    descriptionTextContainer: {
      flexDirection: "column",
    },
    descriptionMainTitle: {
      color: theme === "light" ? colors.veryDarkGrayishYellow : colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    descriptionMainSubTitle: {
      marginTop: ratioHeightBasedOniPhoneX(5),
      color: colors.dimGray,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    descriptionEmail: {
      color: theme === "light" ? colors.veryDarkGrayishYellow : colors.white,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(15)),
    },
    descriptionTitle: {
      color: colors.veryDarkGray,
      textAlign: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    descriptionSubTitle: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      color: colors.veryDarkGray,
      textAlign: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    resendButtonText2: {
      marginLeft: ratioWidthBasedOniPhoneX(5),
      color: colors.orange,
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
    },
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"OTP Verification"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />

      <View style={styles.contentContainer}>
        <View style={styles.descriptionTextContainer}>
          <Text style={styles.descriptionMainTitle}>Enter OTP</Text>
          <Text>
            <Text style={styles.descriptionMainSubTitle}>
              We have sent a code to {""}
            </Text>
            <Text style={styles.descriptionEmail}>
              {params?.email
                ? params?.email
                : formatUSCountryCode(params?.phoneNumber ?? "")}
            </Text>
          </Text>
        </View>

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
        {OTPVerificationError ? (
          <Text style={styles.errorText}>{OTPVerificationError}</Text>
        ) : null}

        <Text
          style={[
            styles.secondText,
            { marginTop: ratioHeightBasedOniPhoneX(25) },
          ]}
        >
          {seconds > 0 ? ` ${formatTime(seconds)} Sec` : "0:00 Sec"}
        </Text>

        <View
          style={[
            styles.resendCodeContainer,
            { marginTop: ratioHeightBasedOniPhoneX(50) },
          ]}
        >
          <Text style={styles.resendText}>Didn't you receive the OTP?</Text>
          <TouchableOpacity
            disabled={seconds > 0 ? isDisabled : false}
            onPress={resendCodeHandePress}
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
      <View
        style={[
          styles.bottomContainer,
          Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                theme === "dark"
                  ? colored.lightGreen
                  : otpVerification.length > 5
                  ? colors.lightGreen
                  : colors.lightGraySilver,
            },
          ]}
          onPress={handlevalidate}
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
      <ShowPopuptMessage
        isVisible={isAlertVisible}
        message={
          response.message ??
          "Your account has been blocked, Please try again after 24 hours"
        }
        onConfirm={handleOkButtonPress}
        descriptionMessage={undefined}
      />
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => {
          if (
            popupMessage ===
            "Your Email has been updated successfully, please login again to continue"
          ) {
            setPopupVisible(false);
            handleOkButtonPress();
          } else {
            setPopupVisible(false);
          }
        }}
      />
      <LogoutPopupMessage
        isVisible={isAlertVisibleEdit}
        message={
          params?.tag == 1
            ? "Are you sure you want to update your Mobile number?"
            : "Are you sure you want to update your Email Id"
        }
        onClose={() => {
          setIsAlertVisibleEdit(false);
        }}
        onConfirm={handleConfirmbuttonPress}
        tag={1}
      />
    </SafeAreaView>
  );
};

export default VerificationCodeEmailEdit;
