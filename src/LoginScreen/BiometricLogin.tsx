import React, { useEffect, useState } from "react";
import {
  AppState,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import MainHeaderView from "../MainHeaderView";
import colors from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import FingerprintScannerImage from "../assets/images/FingerprintImage.svg";
import FaceIDImage from "../assets/images/FaceIDScannerImage.svg";
import validation from "../RegisterScreen/validation";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import strings from "../Extension/strings";
import RightArrowimage from "../assets/arrow_right.svg";
import ReactNativeBiometrics from "react-native-biometrics";
import FingerprintScanner from "react-native-fingerprint-scanner";
import StorageService from "../StorageService";
import { LoginResponseModel } from "./Modal/LoginResponseModel";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { BiometricLoginAuthRequestModel } from "./Modal/BiometricLoginAuthRequestModel";
import ShowAlertMessage from "../Popup/showAlertMessage";
import Loader from "../Loader";
import ChangePasswordAlertView from "../Popup/ChangePasswordAlertView";

const BiometricLogin = () => {
  const navigation: any = useNavigation();
  const [appState, setAppState] = useState(AppState.currentState);
  const [deviceId, setDeviceId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>("");
  const [available, setAvailable] = useState<boolean | null>(false);
  const isFocused = useIsFocused();
  const [response, setResponse] = useState<LoginResponseModel | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [faceIdAttempts, setFaceIdAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [changePopupVisible, setChangePopupVisible] = useState(false);
  const [changePopupMessage, setChangePopupMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) {
        try {
          const rnBiometrics = new ReactNativeBiometrics();
          const { available, biometryType } =
            await rnBiometrics.isSensorAvailable();
          const deviceId = await StorageService.getIsDeviceId();
          setBiometryType(biometryType ?? "");
          setAvailable(available);
          setDeviceId(deviceId);
          const LoginResponseData = await StorageService.getIsLogin();
          if (LoginResponseData !== null) {
            setResponse(LoginResponseData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "inactive") {
        navigation.navigate("SplashImageScreen");
      }
      if (nextAppState === "active" && Platform.OS == "ios") {
        navigation.goBack();
      }
      setAppState(nextAppState);
    };
    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      appStateListener.remove();
    };
  }, [isFocused, biometryType, appState, available, deviceId]);

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const showChangeTextPopup = async (message: string) => {
    setChangePopupVisible(true);
    return setChangePopupMessage(message);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const navigateToSignUp = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Logins" }],
    });
  };

  const platform = () => {
    return Platform.OS === "ios"
      ? getMessage()
      : "Scan your Biometrics on the device scanner to continue";
  };

  const getMessage = () => {
    return biometryType === "FaceID"
      ? "Scan your Face on the device to continue"
      : "Scan your Fingerprint on the device scanner to continue";
  };

  const handleButtonClick = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const isBiometricsAvailable = available === true;
    const isFaceOrFingerLockEnabled =
      response?.data?.enableFingerOrFaceLock === true;
    const shouldAuthenticateWithBiometrics =
      isBiometricsAvailable && isFaceOrFingerLockEnabled;
    if (shouldAuthenticateWithBiometrics) {
      if (faceIdAttempts < 3) {
        try {
          FingerprintScanner.authenticate({
            description: platform(),
          })
            .then(async (value) => {
              const userName = response?.data?.username;
              const prodKey = "4ede231e9a600b0179064a6e67fc3ebe";
              const payload = userName + prodKey;
              const { signature, success } = await rnBiometrics.createSignature(
                {
                  promptMessage: "Confirmation",
                  payload,
                }
              );
              if (success) {
                biometricLogin(
                  response?.data?.id ?? 0,
                  userName ?? "",
                  signature ?? "",
                  deviceId ?? ""
                );
              }
            })
            .catch((error) => {
              setFaceIdAttempts(faceIdAttempts + 1);
            })
            .finally(() => {
              FingerprintScanner.release();
            });
        } catch (error) {}
      } else {
        showTextPopup(
          strings.error,
          "Sorry, we cannot recognise your fingerprint / face ID. Log in using your password"
        );
      }
    } else {
      showTextPopup(strings.error, strings.FaceIDErrorText);
    }
  };

  const biometricLogin = async (
    userId: number,
    userName: string,
    signature: string,
    deviceId: string
  ) => {
    setLoading(true);
    const data = new BiometricLoginAuthRequestModel(
      userId,
      userName,
      signature,
      deviceId
    );
    try {
      await serverCommunication.postApi(
        URLConstants.biometricLogin,
        data,
        async (
          statusCode: number,
          responseData: LoginResponseModel,
          error: any
        ) => {
          handleBioMetricLoginResponse(responseData);
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    } finally {
      setLoading(false);
    }
  };

  const handleBioMetricLoginResponse = (responseData: any) => {
    if (responseData.status === HTTPStatusCode.ok) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTab" }],
      });
    } else if (
      responseData.message ===
      "Your account has been locked due to 3 failed attempts. It will be unlocked after 15 min"
    ) {
      const changeTextPopupMessage = `
            <p style='text-align:center; font-size:16px; font-family: "Manrope-Regular"'>
              You have tried more than 03 times. Your account is blocked for
              <a style="color:#ff6200;" target="_blank">15 minutes.</a>
            </p>
          `;
      showChangeTextPopup(changeTextPopupMessage);
    } else if (
      responseData.message ===
      "Your account has been locked. Please click here to reset your password"
    ) {
      const changeTextPopupMessage = `
          <p style='text-align:center; font-size:16px; font-family: "Manrope-Regular"'>
            Your account has been locked. Please click
            <a href="ForgetScreen" style="color:#ff6200;" target="_blank">here</a>
            to reset your password.
          </p>
        `;
      showChangeTextPopup(changeTextPopupMessage);
    } else {
      showTextPopup(strings.error, responseData.message ?? "");
    }
  };

  const loginButton = async () => {
    if (password != "") {
      setLoading(true);
      const data = {
        userId: response?.data?.id ?? 0,
        password: password,
        deviceId: deviceId,
      };
      try {
        await serverCommunication.postApi(
          URLConstants.passwordLogin,
          data,
          async (
            statusCode: number,
            responseData: LoginResponseModel,
            error: any
          ) => {
            handleBioMetricLoginResponse(responseData);
          }
        );
      } catch (error) {
        showTextPopup(strings.error, strings.defaultError);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={colors.white}
        translucent={false}
      />
      <MainHeaderView
        title={"Sign In"}
        showImage={false}
        closeApp={true}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Wealthido</Text>
        <Text style={styles.welcomeText}>
          Welcome {response?.data?.username},
        </Text>
        <Text style={styles.fingerprintText}>
          Tap to Login with Fingerprint
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.fingerprintScannerImage}
          onPress={handleButtonClick}
        >
          {biometryType == "FaceID" ? (
            <FaceIDImage />
          ) : (
            <FingerprintScannerImage />
          )}
        </TouchableOpacity>
        <Text style={styles.passwordInsteadText}>
          or Enter your password instead
        </Text>
        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError(validation.validatePassword(text));
          }}
          textColor={colors.black}
          underlineColor={colors.black}
          secureTextEntry={!passwordVisible}
          right={
            <TextInput.Icon
              color={colors.tabText}
              size={20}
              icon={passwordVisible ? "eye" : "eye-off"}
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}
            />
          }
          selectionColor={colors.orange}
          cursorColor={colors.orange}
          activeUnderlineColor={passwordError ? "red" : colors.black}
          style={styles.input}
          outlineColor={colors.inactivegrey}
          outlineStyle={styles.outlineStyle}
          activeOutlineColor={colors.lightGreen}
        />
        {passwordError ? (
          <Text style={styles.error}>{passwordError}</Text>
        ) : null}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate("ForgetScreen");
            setPassword("");
          }}
        >
          <Text style={styles.forgotPassword}>Forgot Password ?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={loginButton}>
          <RightArrowimage />
        </TouchableOpacity>
        <View style={styles.followUsSection}>
          <Text style={styles.lineContainer}>-------------------------</Text>
          <Text style={styles.followUsOnText}>Follow us on </Text>
          <Text style={styles.lineContainer}>-------------------------</Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.imageBackGroundView}
            onPress={() => Linking.openURL("https://www.instagram.com/")}
          >
            <Image
              source={require("../assets/images/instagram.png")}
              style={styles.iconImage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imageBackGroundView}
            onPress={() => Linking.openURL("https://www.linkedin.com/")}
          >
            <Image
              source={require("../assets/images/linkedin.png")}
              style={styles.iconImage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imageBackGroundView}
            onPress={() => Linking.openURL("https://www.twitter.com/")}
          >
            <Image
              source={require("../assets/images/twitter.png")}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.signupContainer}>
          <Text style={styles.haveAccount}>Login with another account?</Text>
          <TouchableOpacity onPress={navigateToSignUp}>
            <Text style={styles.signupText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <ShowAlertMessage
          isVisible={popupVisible}
          title={popupTitle}
          message={popupMessage}
          onClose={() => {
            if (
              popupMessage ===
              "Your account has been registered with a new device. Please log in again and proceed to register the new device for access."
            ) {
              setPopupVisible(false);
              navigation.reset({
                index: 0,
                routes: [{ name: "Logins" }],
              });
            } else {
              setPopupVisible(false);
            }
          }}
        />
        <ChangePasswordAlertView
          secondButtonText={"Okay!"}
          firstButtonHide={true}
          isVisible={changePopupVisible}
          message={changePopupMessage}
          onClose={() => setChangePopupVisible(false)}
          onOpen={() => {
            setChangePopupVisible(false);
          }}
          onLinkPress={true}
        />
        <Loader loading={loading} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerText: {
    marginTop: ratioHeightBasedOniPhoneX(10),
    textAlign: "center",
    alignItems: "center",
    color: colors.orange,
    ...WealthidoFonts.georgiaBold(ratioHeightBasedOniPhoneX(48)),
  },
  welcomeText: {
    color: colors.black,
    marginHorizontal: ratioHeightBasedOniPhoneX(20),
    textAlign: "center",
    ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(20)),
  },
  fingerprintText: {
    marginTop: ratioHeightBasedOniPhoneX(8),
    color: colors.mainlyBlue,
    textAlign: "center",
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
  },
  fingerprintScannerImage: {
    marginTop: ratioHeightBasedOniPhoneX(15),
    alignItems: "center",
  },
  passwordInsteadText: {
    marginTop: ratioHeightBasedOniPhoneX(25),
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    color: colors.mainlyBlue,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: ratioHeightBasedOniPhoneX(14),
    height: ratioHeightBasedOniPhoneX(40),
    paddingHorizontal: ratioWidthBasedOniPhoneX(2),
    marginHorizontal: ratioWidthBasedOniPhoneX(20),
    marginTop: ratioHeightBasedOniPhoneX(15),
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
  },
  outlineStyle: {
    borderWidth: ratioWidthBasedOniPhoneX(0.5),
    color: colors.black,
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
  },
  eyeIcon: {
    paddingTop: ratioHeightBasedOniPhoneX(8),
  },
  error: {
    textAlign: "left",
    paddingTop: ratioHeightBasedOniPhoneX(3),
    marginHorizontal: ratioWidthBasedOniPhoneX(20),
    color: colors.mainlyRED,
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
  },
  forgotPassword: {
    marginTop: ratioHeightBasedOniPhoneX(8),
    marginHorizontal: ratioWidthBasedOniPhoneX(20),
    color: colors.orange,
    ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    alignItems: "flex-end",
    textAlign: "right",
  },
  button: {
    marginHorizontal: ratioWidthBasedOniPhoneX(20),
    backgroundColor: colors.orange,
    height: ratioHeightBasedOniPhoneX(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: ratioHeightBasedOniPhoneX(24),
    marginTop: ratioHeightBasedOniPhoneX(16),
    padding: ratioHeightBasedOniPhoneX(1),
  },
  followUsSection: {
    marginTop: ratioHeightBasedOniPhoneX(20),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: ratioWidthBasedOniPhoneX(20),
  },
  lineContainer: {
    color: colors.lightcolorgrey,
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
  },
  followUsOnText: {
    color: colors.lightGreyColor,
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: ratioWidthBasedOniPhoneX(75),
    marginTop: ratioHeightBasedOniPhoneX(17),
  },
  imageBackGroundView: {
    height: ratioHeightBasedOniPhoneX(44),
    width: ratioHeightBasedOniPhoneX(44),
    borderRadius: ratioHeightBasedOniPhoneX(22),
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    height: ratioHeightBasedOniPhoneX(40),
    width: ratioHeightBasedOniPhoneX(40),
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: ratioHeightBasedOniPhoneX(26),
    marginBottom: ratioHeightBasedOniPhoneX(16),
    alignItems: "center",
    justifyContent: "center",
  },
  haveAccount: {
    textAlign: "center",
    color: colors.mainlyBlue,
    ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
  },
  signupText: {
    color: colors.orange,
    padding: ratioHeightBasedOniPhoneX(5),
    ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
  },
});

export default BiometricLogin;
