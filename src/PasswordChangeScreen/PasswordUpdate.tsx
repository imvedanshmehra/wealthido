import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Platform,
  StatusBar,
} from "react-native";
import colors, { dark, light } from "../colors";
import strings from "../Extension/strings";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import ServerController from "../Networking/ServerController";
import React from "react";
import { ResetAuthRequestModel } from "../VerficationCodeScreen/Modal/VerificationAuthRequestModel";
import { ForgotPassword } from "../ForgetScreen/Model/ForgetPassordResponseModel";
import HttpStatusCode from "../Networking/HttpStatusCode";
import Loader from "../Loader";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import ShowAlertMessage from "../Popup/showAlertMessage";
import MainHeaderView from "../MainHeaderView";
import { ThemeContext } from "../Networking/themeContext";

export type RouteParams = {
  phoneNumber?: number;
};

/**
 * Summary:
 * This code is a TypeScript-React component called `PasswordUpdate` that handles the functionality of resetting a user's password. It includes input fields for the new password and confirm password, as well as validation logic and a confirmation button.
 *
 * Example Usage:
 * <PasswordUpdate />
 *
 * Code Analysis:
 * Inputs:
 * - None
 *
 * Flow:
 * 1. The component initializes state variables for loading, new password, new password error, confirm password, confirm password error, and visibility of the new and confirm password fields.
 * 2. The component uses hooks like `useRoute`, `useNavigation`, and `useIsFocused` to access route parameters, navigation functions, and screen focus status.
 * 3. The component defines a regular expression for password validation.
 * 4. The component sets up event listeners for the hardware back button and screen focus.
 * 5. The component defines functions for validating the new password and confirm password inputs.
 * 6. The component handles the confirmation button press by validating the inputs and making a server request to reset the password.
 * 7. The component renders a UI with input fields, error messages, and a confirmation button.
 *
 * Outputs:
 * - A React component that handles the functionality of resetting a user's password.
 */
const PasswordUpdate = ({}) => {
  const route = useRoute();
  const params = route?.params as RouteParams | undefined;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [newVisible, setNewVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[!@#$%^&*])(?=.{8,})/;
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const { theme } = useContext(ThemeContext);

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const validateNewPassword = (text: string) => {
    /**
     * Validates a new password entered by the user.
     *
     * @param {string} text - The new password entered by the user.
     * @returns {void} - None. Updates the state variables based on the validation results.
     */
    setNewPassword(text);
    if (text === "") {
      setNewPasswordError(strings.passwordRequired);
    } else if (!passwordRegex.test(text)) {
      setNewPasswordError(strings.passwordLeastCharacters);
    } else {
      if (confirmPassword !== "" && confirmPassword !== text) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
      setNewPasswordError("");
    }
  };

  const validateConfirmPassword = (text: string) => {
    /**
     * Validates the confirm password input field.
     *
     * @param {string} text - The value entered in the confirm password input field.
     * @returns {void} - None. The function only updates the state variables.
     */
    setConfirmPassword(text);
    if (text === "") {
      setConfirmPasswordError(strings.passwordRequired);
    } else if (text != newPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirm = async () => {
    /**
     * Handles the confirmation process when a user clicks on the confirm button.
     * If the newPassword and confirmPassword variables are not empty and there are no errors associated with them,
     * it creates a new instance of the ResetAuthRequestModel class with the phoneNumber, newPassword, and confirmPassword values.
     * Then, it sets the loading state to true and defines two callback functions: onSuccess and onError.
     * The onSuccess function displays a toast message with the response message, sets the loading state to false,
     * and if the response status is HttpStatusCode.ok, it resets the navigation to the "Logins" route.
     * The onError function displays a toast message with the error message and sets the loading state to false.
     * Finally, it calls the ServerController.ResetPassword function with the otpVerify object, onSuccess callback, and onError callback.
     * If the newPassword and confirmPassword variables are empty or there are errors associated with them,
     * it calls the validateNewPassword and validateConfirmPassword functions to validate the newPassword and confirmPassword variables.
     */

    if (
      newPassword &&
      confirmPassword &&
      newPasswordError === "" &&
      confirmPasswordError === ""
    ) {
      const otpVerify = new ResetAuthRequestModel(
        params?.phoneNumber,
        newPassword.trim(),
        confirmPassword.trim()
      );
      setLoading(true);

      const onSuccess = async (response: ForgotPassword) => {
        setLoading(false);
        if (response.status === HttpStatusCode.ok) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Logins" }],
          });
        }
      };

      const onError = (error: any) => {
        setLoading(false);
        showTextPopup(strings.error, error.message);
      };

      ServerController.ResetPassword(otpVerify, onSuccess, onError);
    } else {
      validateNewPassword(newPassword);
      validateConfirmPassword(confirmPassword);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.referralWhite}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
      >
        <MainHeaderView
          title="Reset Password"
          showImage={false}
          closeApp={false}
          bottomBorderLine={false}
          whiteTextColor={false}
        />
        <View style={{ paddingHorizontal: ratioWidthBasedOniPhoneX(20) }}>
          <Text style={styles.resetPasswordText}>Reset Password</Text>
          <Text style={styles.subTitleText}>
            Enter the new password. The password must contain at least 8
            characters.
          </Text>
          <View style={{ marginTop: ratioHeightBasedOniPhoneX(10) }}>
            <TextInput
              label="New Password"
              mode="outlined"
              outlineColor={colors.inactivegrey}
              activeOutlineColor={colors.orange}
              activeUnderlineColor={
                newPasswordError != "" ? "red" : colors.dimGray
              }
              underlineColor={colors.dimGray}
              style={styles.textInput}
              secureTextEntry={!newVisible}
              placeholderTextColor={colors.placeholder}
              outlineStyle={styles.outlineStyle}
              cursorColor={colors.black}
              value={newPassword}
              onChangeText={validateNewPassword}
              right={
                <TextInput.Icon
                  color={colors.tabText}
                  size={20}
                  icon={newVisible ? "eye" : "eye-off"}
                  onPress={() => {
                    setNewVisible(!newVisible);
                  }}
                  style={styles.eyeIcon}
                />
              }
            />
            {newPasswordError ? (
              <Text style={styles.errorText}>{newPasswordError}</Text>
            ) : null}
          </View>
          <TextInput
            label="Confirm Password"
            mode="outlined"
            outlineColor={colors.inactivegrey}
            activeUnderlineColor={
              confirmPasswordError != "" ? "red" : colors.dimGray
            }
            underlineColor={colors.dimGray}
            style={styles.textInput}
            placeholderTextColor={colors.placeholder}
            cursorColor={colors.black}
            value={confirmPassword}
            secureTextEntry={!confirmVisible}
            activeOutlineColor={colors.orange}
            outlineStyle={styles.outlineStyle}
            onChangeText={validateConfirmPassword}
            right={
              <TextInput.Icon
                color={colors.tabText}
                size={20}
                icon={confirmVisible ? "eye" : "eye-off"}
                onPress={() => {
                  setConfirmVisible(!confirmVisible);
                }}
                style={styles.eyeIcon}
              />
            }
          />
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelbutton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.cancelText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  label: {
    color: colors.mainlyBlue,
    fontSize: ratioHeightBasedOniPhoneX(12),
    fontFamily: "Inter-Bold",
    marginTop: ratioHeightBasedOniPhoneX(10),
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: ratioHeightBasedOniPhoneX(20),
    alignItems: "center",
  },
  resetPasswordText: {
    marginTop: ratioHeightBasedOniPhoneX(10),
    ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(24)),
    color: colors.black,
  },
  subTitleText: {
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    color: colors.dimGray,
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
    flexDirection: "row",
    marginTop: "auto",
    alignItems: "center",
    height: ratioHeightBasedOniPhoneX(62),
    gap: ratioHeightBasedOniPhoneX(9),
    backgroundColor: colors.white,
    paddingHorizontal: ratioWidthBasedOniPhoneX(20),
  },
  button: {
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
    backgroundColor: colors.buttonGray,
    width: "auto",
    flex: 1,
    borderRadius: ratioHeightBasedOniPhoneX(37),
  },
  buttonText: {
    color: colors.white,
    ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
  },
  cancelText: {
    color: colors.black,
    ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  placeHolerColor: {
    color: colors.placeholder,
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
  errorText: {
    color: "red",
    textAlign: "left",
    fontSize: ratioHeightBasedOniPhoneX(12),
    fontFamily: "Inter-Medium",
    paddingBottom: ratioHeightBasedOniPhoneX(7),
  },
  headerText: {
    fontFamily: "Inter-Bold",
    fontSize: ratioHeightBasedOniPhoneX(16),
    color: colors.black,
  },
  backButtonImage: {
    height: ratioHeightBasedOniPhoneX(20),
    width: ratioWidthBasedOniPhoneX(20),
    alignItems: "stretch",
  },
  labels: {
    color: colors.mainlyBlue,
    fontSize: ratioHeightBasedOniPhoneX(12),
    fontFamily: "Inter-Medium",
    marginTop: ratioHeightBasedOniPhoneX(15),
  },
  textInput: {
    height: ratioHeightBasedOniPhoneX(40),
    textAlign: "left",
    backgroundColor: colors.white,
    paddingHorizontal: ratioHeightBasedOniPhoneX(2),
    marginTop: ratioHeightBasedOniPhoneX(10),
    ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
  },
  buttonAndroid: {
    backgroundColor: colors.green,
    width: ratioWidthBasedOniPhoneX(219),
    height: ratioHeightBasedOniPhoneX(48),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: ratioHeightBasedOniPhoneX(24),
    marginTop: ratioHeightBasedOniPhoneX(320),
  },
  buttonTextConfirm: {
    fontFamily: "Inter-Medium",
    fontSize: ratioHeightBasedOniPhoneX(16),
    color: colors.white,
  },
  confirmButton: {
    backgroundColor: colors.orange,
  },
  logoContainer: {
    marginTop: ratioHeightBasedOniPhoneX(46),
    flexDirection: "row",
    height: ratioHeightBasedOniPhoneX(50),
    justifyContent: "center",
  },
  textinputcontainer: {
    marginTop: ratioHeightBasedOniPhoneX(40),
  },
  outlineStyle: {
    borderWidth: ratioWidthBasedOniPhoneX(0.5),
    color: colors.textColor,
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
  },
  headerLine: {
    borderBottomColor: "#ECECEC",
    borderBottomWidth: 1,
    marginTop: ratioHeightBasedOniPhoneX(10),
    width: "150%",
  },
  eyeIcon: {
    paddingTop: ratioHeightBasedOniPhoneX(8),
  },
});

export default PasswordUpdate;
