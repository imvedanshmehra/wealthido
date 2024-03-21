import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Linking,
  StatusBar,
  AppState,
} from "react-native";
import Checkbox from "@react-native-community/checkbox";
import { TextInput } from "react-native-paper";
import colors from "../colors";
import strings from "../Extension/strings";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { LoginResponseModel } from "./Modal/LoginResponseModel";
import { LoginAuthRequestModel } from "./Modal/LoginAuthRequestModel";
import StorageService from "../StorageService";
import Loader from "../Loader";
import validation from "../RegisterScreen/validation";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import ShowAlertMessage from "../Popup/showAlertMessage";
import ChangePasswordAlertView from "../Popup/ChangePasswordAlertView";
import OldDeviceLoginAlert from "../Popup/OldDeviceLoginAlert";

enum PopupTitle {
  Success = "Success",
  Error = "Error",
  Warning = "Warning",
}

const LoginScreen = () => {
  const navigation: any = useNavigation();
  const [appState, setAppState] = useState(AppState.currentState);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pushNotificationToken, setPushNotificationToken] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isFocused = useIsFocused();
  const [isChecked, setIsChecked] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [popupState, setPopupState] = useState({
    visible: false,
    title: "",
    message: "",
  });
  const [changePopupVisible, setChangePopupVisible] = useState(false);
  const [changePopupMessage, setChangePopupMessage] = useState("");
  const [oldDevicePopupVisible, setOldDevicePopupVisible] = useState(false);
  const [oldDevicePopupMessage, setOldDevicePopupMessage] = useState("");

  const showTextPopup = (title: PopupTitle, message: string): void => {
    setPopupState({ visible: true, title, message });
  };

  const showChangeTextPopup = async (message: string) => {
    setChangePopupVisible(true);
    return setChangePopupMessage(message);
  };

  const showOldDeviceTextPopup = async (message: string) => {
    setOldDevicePopupVisible(true);
    return setOldDevicePopupMessage(message);
  };

  const toggleCheckbox = async () => {
    setIsChecked(!isChecked);
  };

  const navigateToSignUp = () => {
    navigation.navigate("SignupScreen");
  };

  const OldDeviceConfirmLogin = async () => {
    setOldDevicePopupVisible(false);
    const tokenValue: any = pushNotificationToken; // Token for push notifications
    const trimmedUserName = userName.trim();
    const trimmedPassword = password.trim();
    const loginAuthRequest = new LoginAuthRequestModel(
      trimmedUserName,
      trimmedPassword,
      tokenValue,
      deviceId
    );
    try {
      setLoading(true);
      await serverCommunication.postApi(
        URLConstants.oldDeviceConfirmLogin,
        loginAuthRequest,
        async (statusCode: number, responseData: any, error: any) => {
          handleLoginResponse(responseData, navigation, password, false);
        }
      );
    } catch (error) {
      console.error("Error object:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (isFocused) {
      const pushNotification = async () => {
        const token = await StorageService.getIsFcmtoken();
        const userName = await StorageService.getEmail();
        const isChecked = await StorageService.getChecked();
        const deviceId = await StorageService.getIsDeviceId();
        setDeviceId(deviceId);
        setUserName(userName);
        setIsChecked(isChecked);
        setPushNotificationToken(token);
      };
      pushNotification();
    }

    return () => {
      setUserName("");
      setPassword("");
      setUserNameError("");
      setPasswordError("");
    };
  }, [isFocused]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
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
  }, [appState]);

  const navigateToTwoFactorAuth = (phoneNumber: any, password: string) => {
    navigation.navigate("TwoFactorAuth", { phoneNumber, password });
  };

  const navigateToTwoFactorAuthVerification = (
    second: any,
    blockRegenerateTime: string,
    phoneNo: any,
    password: any,
    fcmToken: any,
    deviceId: any
  ) => {
    navigation.navigate("TwoFactorVerificationScreen", {
      second,
      blockRegenerateTime,
      phoneNo,
      password,
      fcmToken,
      deviceId,
    });
  };

  const navigateToSetSecurityPin = (phoneNumber: any, password: string) => {
    navigation.navigate("SetSecurityPin", { phoneNumber, password });
  };

  const navigateToBiometricSetup = () => {
    navigation.navigate("BiometricSetupScreen");
  };

  const validateUsername = (text: string) => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    setUserName(text);
    if (!text) {
      setUserNameError("Enter your Email/Mobile No");
    } else if (text.trim().length != text.length) {
      setUserNameError("Enter Email Id/Mobile no without whitespaces");
    } else if (/^\d+$/.test(text) && text.length != 10) {
      setUserNameError("Enter a valid 10-digit phone number");
    } else if (!/^\d+$/.test(text) && !emailRegex.test(text)) {
      setUserNameError("Enter a valid email address");
    } else {
      setUserNameError("");
    }
  };

  const navigateToMainTab = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTab" }],
    });
  };
  const handleLoginResponse = (
    responseData: any,
    navigation: any,
    password: any,
    login: boolean
  ) => {
    if (responseData.status == HTTPStatusCode.ok) {
      const phoneNo = responseData?.data?.phoneNo;

      if (responseData?.data?.isVerified === false) {
        navigation.navigate("VerificationCodeScreen", {
          statusCode: responseData.status,
          blockTime: responseData.data?.blockTime,
          phoneNumber: phoneNo,
          tag: 0,
          second: responseData.data.second,
          password: password,
        });
      } else if (responseData?.data?.enable2FA === false) {
        navigateToTwoFactorAuth(phoneNo, password);
      } else if (
        responseData?.data?.enable2FA &&
        responseData.data.enable2FAPhoneNo &&
        !login
      ) {
        navigateToTwoFactorAuthVerification(
          responseData.data?.second,
          responseData.data?.blockTime,
          phoneNo,
          password,
          pushNotificationToken,
          deviceId
        );
      } else if (responseData?.data?.enablePinLock === false) {
        navigateToSetSecurityPin(phoneNo, password);
      } else if (
        responseData?.data?.setUpLaterFingerOrFaceLock === false &&
        responseData?.data?.enableFingerOrFaceLock === false
      ) {
        navigateToBiometricSetup();
      } else {
        navigateToMainTab();
      }
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
    } else if (responseData.status === HTTPStatusCode.forbidden) {
      showOldDeviceTextPopup(responseData?.message ?? "");
    } else {
      showTextPopup(PopupTitle.Error, responseData.message ?? "");
      StorageService.setEmail("");
      StorageService.setChecked(!isChecked);
    }
  };

  const login = async (data: LoginAuthRequestModel) => {
    setLoading(true);
    try {
      await serverCommunication.postApi(
        URLConstants.login,
        data,
        (statusCode: number, responseData: LoginResponseModel, error: any) => {
          handleLoginResponse(responseData, navigation, password, true);
        }
      );
    } catch (error) {
      showTextPopup(PopupTitle.Error, strings.defaultError);
    } finally {
      setLoading(false);
    }
  };

  const navigationLoginButton = async () => {
    const passwordError = validation.validatePassword(password);
    validateUsername(userName);
    setPasswordError(passwordError);

    if (
      userNameError === "" &&
      passwordError === "" &&
      userName != "" &&
      password != ""
    ) {
      const tokenValue: any = pushNotificationToken;
      const trimmedUserName = userName.trim();
      const trimmedPassword = password.trim();
      const loginAuthRequest = new LoginAuthRequestModel(
        trimmedUserName,
        trimmedPassword,
        tokenValue,
        deviceId
      );

      if (isChecked) {
        await Promise.all([
          StorageService.setEmail(trimmedUserName),
          StorageService.setChecked(isChecked),
        ]);
      } else {
        await Promise.all([
          StorageService.setEmail(""),
          StorageService.setChecked(false),
        ]);
      }
      login(loginAuthRequest);
    }
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
      color: colors.lightGreen,
      ...WealthidoFonts.georgiaBold(ratioHeightBasedOniPhoneX(48)),
    },
    welcomeText: {
      marginTop: ratioHeightBasedOniPhoneX(40),
      color: colors.orange,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    input: {
      backgroundColor: colors.white,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(15),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colors.black,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    error: {
      textAlign: "left",
      paddingTop: ratioHeightBasedOniPhoneX(3),
      color: colors.mainlyRED,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    mainContainer: {
      paddingHorizontal: ratioHeightBasedOniPhoneX(20),
    },
    rememberContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkbox: {
      height: ratioHeightBasedOniPhoneX(15),
      width: ratioWidthBasedOniPhoneX(15),
      borderWidth: ratioWidthBasedOniPhoneX(1),
      borderColor: colors.lightGreyColor,
      marginRight: ratioWidthBasedOniPhoneX(5),
    },
    rememberme: {
      color: colors.lightGreyColor,
      marginLeft:
        Platform.OS == "ios"
          ? ratioWidthBasedOniPhoneX(5)
          : ratioWidthBasedOniPhoneX(15),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    button: {
      backgroundColor: colors.orange,
      height: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginTop: ratioHeightBasedOniPhoneX(50),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    followUsSection: {
      marginTop: ratioHeightBasedOniPhoneX(40),
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
    },
    followUsOnText: {
      color: colors.lightGreyColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    lineContainer: {
      color: colors.lightcolorgrey,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    signupContainer: {
      flexDirection: "row",
      marginTop: ratioHeightBasedOniPhoneX(125),
      marginBottom: ratioHeightBasedOniPhoneX(25),
      alignItems: "center",
      justifyContent: "center",
    },
    forgotPassword: {
      color: colors.orange,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    iconsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: ratioWidthBasedOniPhoneX(75),
      marginTop: ratioHeightBasedOniPhoneX(50),
    },
    imageBackGroundView: {
      height: ratioHeightBasedOniPhoneX(48),
      width: ratioHeightBasedOniPhoneX(48),
      borderRadius: ratioHeightBasedOniPhoneX(22),
      backgroundColor: colors.white,
      justifyContent: "center",
      alignItems: "center",
    },
    iconImage: {
      height: ratioHeightBasedOniPhoneX(40),
      width: ratioHeightBasedOniPhoneX(40),
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
    eyeIcon: {
      paddingTop: ratioHeightBasedOniPhoneX(8),
    },
  });

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}
      >
        <Text style={styles.headerText}>Wealthido</Text>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <TextInput
          label="Email address/Mobile no"
          mode="outlined"
          value={userName}
          onChangeText={validateUsername}
          underlineColor={colors.black}
          keyboardType="email-address"
          activeUnderlineColor={userNameError ? "red" : colors.black}
          style={[styles.input, { marginTop: ratioHeightBasedOniPhoneX(15) }]}
          maxLength={/^\d+$/.test(userName) ? 10 : 500}
          outlineColor={colors.inactivegrey}
          outlineStyle={styles.outlineStyle}
          textColor={colors.black}
          selectionColor={colors.orange}
          cursorColor={colors.orange}
          activeOutlineColor={colors.lightGreen}
        />
        {userNameError ? (
          <Text style={styles.error}>{userNameError}</Text>
        ) : null}
        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError(validation.validatePassword(text));
          }}
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
          textColor={colors.black}
          activeOutlineColor={colors.lightGreen}
        />
        {passwordError ? (
          <Text style={styles.error}>{passwordError}</Text>
        ) : null}

        <View style={styles.rememberContainer}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={isChecked}
              hideBox={true}
              disabled={false}
              style={styles.checkbox}
              tintColors={{ false: colors.lightGreyColor, true: colors.orange }}
              onValueChange={toggleCheckbox}
              onCheckColor={colors.orange}
            />
            <Text style={styles.rememberme} onPress={toggleCheckbox}>
              Remember Me
            </Text>
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                navigation.navigate("ForgetScreen");
                setPassword("");
              }}
            >
              <Text style={styles.forgotPassword}>
                {strings.forgotPassword}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={navigationLoginButton}>
          <Text style={styles.buttonText}>{strings.login}</Text>
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
          <Text style={styles.haveAccount}>{strings.haveAccount}</Text>
          <TouchableOpacity onPress={navigateToSignUp}>
            <Text style={styles.signupText}>{strings.signUp}</Text>
          </TouchableOpacity>
        </View>
        <Loader loading={loading} />
        <ShowAlertMessage
          isVisible={popupState.visible}
          title={popupState.title}
          message={popupState.message}
          onClose={() =>
            setPopupState({ visible: false, title: "", message: "" })
          }
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
          navigate={"ForgetScreen"}
          onLinkPress={true}
        />
        <OldDeviceLoginAlert
          isVisible={oldDevicePopupVisible}
          message={oldDevicePopupMessage}
          onConfirm={OldDeviceConfirmLogin}
          onClose={() => setOldDevicePopupVisible(false)}
        />
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
