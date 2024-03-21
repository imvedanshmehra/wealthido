import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ResendAuthRequestModel } from "./Modal/ResendAuthRequestModel";
import URLConstants from "../Networking/URLConstants";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { VerificationAuthRequestModel } from "./Modal/VerificationAuthRequestModel";
import {
  add30Seconds,
  calculateAuctionDuration,
  extractTimeFromTimestamp,
  formatTime,
  formatUSCountryCode,
} from "../Utility";
import serverCommunication from "../Networking/serverCommunication";
import Loader from "../Loader";
import { SignupResponseModel } from "../RegisterScreen/Modal/SignupResponseModel";
import validation from "../RegisterScreen/validation";
import HttpStatusCode from "../Networking/HttpStatusCode";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import ShowAlertMessage from "../Popup/showAlertMessage";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";

const CELL_COUNT = 6;
export type RouteParams = {
  statusCode?: number;
  blockTime?: Date;
  phoneNumber?: string;
  tag?: number;
  second?: number;
  password?: string;
};

const VerificationCode = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route?.params as RouteParams | undefined;
  const [otpVerification, setOTPVerification] = useState("");
  const [loading, setLoading] = useState(false);
  const [OTPVerificationError, setOTPVerificationError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const targetTime = params?.blockTime;
  const [currentDate, setCurrentDate] = useState(targetTime);
  const ref = useBlurOnFulfill({
    value: otpVerification,
    cellCount: CELL_COUNT,
  });
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

  useEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const resendOtp = async () => {
    const phoneNumber = params?.phoneNumber as unknown as string;
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

  const handleLogin = async () => {
    const otpVerificationError =
      validation.handleOTPVerification(otpVerification);
    setOTPVerificationError(otpVerificationError);
    if (otpVerificationError === "") {
      const phoneNumber = params?.phoneNumber as unknown as string;
      const otpVerifyRequest = new VerificationAuthRequestModel(
        phoneNumber,
        otpVerification
      );
      await otpVerify(otpVerifyRequest);
    }
  };

  const otpVerify = async (data: VerificationAuthRequestModel) => {
    setLoading(true);
    try {
      await serverCommunication.postApi(
        URLConstants.otpVerify,
        data,
        (statusCode: number, responseData: SignupResponseModel, error: any) => {
          if (
            responseData.status == HttpStatusCode.ok &&
            responseData.data?.isVerified == true
          ) {
            navigation.reset({
              index: 1,
              routes: [
                { name: "Logins" },
                {
                  name: "TwoFactorAuth",
                  params: {
                    phoneNumber: responseData.data.phoneNo,
                    password: params?.password,
                  },
                },
              ],
            });
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

  const resetOtpVerify = async (data: VerificationAuthRequestModel) => {
    setLoading(true);
    try {
      await serverCommunication.postApi(
        URLConstants.resetOtpVerify,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (responseData.status == HttpStatusCode.ok) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "PasswordUpdate",
                  params: { phoneNumber: params?.phoneNumber },
                },
              ],
            });
          } else {
            showTextPopup(strings.error, responseData.message ?? "");
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    } finally {
      setLoading(false);
    }
  };

  const onPress = async () => {
    if (params?.tag === 1) {
      const phoneNumber = params?.phoneNumber as unknown as string;
      const otpVerifyRequest = new VerificationAuthRequestModel(
        phoneNumber,
        otpVerification
      );
      await resetOtpVerify(otpVerifyRequest);
    } else {
      handleLogin();
    }
  };

  const resendCodeHandePress = async () => {
    await resendOtp();
  };

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
        <Text style={styles.OTPVerificationText}>OTP Verification</Text>
        <Text style={styles.VerifyMobileNumberText}>
          Verify your mobile number by entering the valid OTP.
        </Text>

        <Text style={{ marginTop: ratioHeightBasedOniPhoneX(50) }}>
          <Text style={[styles.descriptionTitle]}>
            {" "}
            Enter OTP sent to {"  "}
          </Text>
          <Text style={[styles.descriptionSubTitle]}>
            {formatUSCountryCode(params?.phoneNumber as string)}
          </Text>
        </Text>

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
          onPress={onPress}
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
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    marginTop: ratioHeightBasedOniPhoneX(25),
    flex: 1,
    backgroundColor: colors.white,
  },
  descriptionContainer: {
    marginTop: ratioHeightBasedOniPhoneX(10),
    alignItems: "center",
  },
  OTPVerificationText: {
    color: colors.veryDarkGrayishYellow,
    ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(24)),
  },
  VerifyMobileNumberText: {
    marginTop: ratioHeightBasedOniPhoneX(10),
    color: colors.grayColor,
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
  },
  descriptionTitle: {
    color: colors.veryDarkGray,
    textAlign: "left",
    ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
  },
  descriptionSubTitle: {
    color: colors.black,
    textAlign: "center",
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
  },
  otpContainer: {
    marginTop: ratioHeightBasedOniPhoneX(40),
    flexDirection: "row",
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
  resendText: {
    color: colors.veryDarkGray,
    ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
  },
  secondText: {
    color: colors.lightGreen,
    marginLeft: ratioWidthBasedOniPhoneX(5),
    fontFamily: "Segoe-UI",
    fontSize: ratioHeightBasedOniPhoneX(14),
  },
  resendCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: ratioHeightBasedOniPhoneX(27),
    paddingBottom: ratioHeightBasedOniPhoneX(20),
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    height: ratioHeightBasedOniPhoneX(62),
    paddingHorizontal: ratioWidthBasedOniPhoneX(20),
  },
  button: {
    height: ratioHeightBasedOniPhoneX(42),
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    borderRadius: ratioHeightBasedOniPhoneX(24),
  },
  buttonText: {
    color: colors.white,
    textAlign: "center",
    ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
  },
});

export default VerificationCode;
