import React, { useContext, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import colors, { dark, light } from "../colors";
import strings from "../Extension/strings";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import PasswordChangedController from "./passwordChangeController";
import { ChangePasswordAuthRequestModel } from "./Model/ChangePasswordAuthRequestModel";
import { ChangePasswordResponse } from "./Model/ChangePasswordResponse";
import { ThemeContext } from "../Networking/themeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import ShowAlertMessage from "../Popup/showAlertMessage";

const PasswordChanged = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  let initialChangePasswordResponse: ChangePasswordResponse = {};
  const [changePasswordData, setChangePasswordData] = useState(
    initialChangePasswordResponse
  );
  const [alertVisible, setAlertVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const { theme, setThemePreference, resetSwitch } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[!@#$%^&*])(?=.{8,})/;
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const validateOldPassword = (text: string) => {
    setOldPassword(text);
    if (text === "") {
      setOldPasswordError("Old password is required");
    } else {
      setOldPasswordError("");
    }
  };

  const validateNewPassword = (text: string) => {
    setNewPassword(text);

    if (text === "") {
      setNewPasswordError("New password is required");
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

  // Validates the confirm password field.
  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    if (text === "") {
      setConfirmPasswordError("Confirm password is required");
    } else if (text !== newPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Toggles the visibility of the password input field in the PasswordChanged component.
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  /**
   * Handles the press event of the confirm button.
   *
   * This function performs validation on the old password, new password, and confirm password fields.
   * If any of these fields are empty, it displays validation errors.
   * If all fields are filled, it creates a `ChangePasswordAuthRequestModel` object with the entered passwords
   * and calls the `changePassword` function from the `PasswordChangedController` module.
   * If the password change is successful, it sets the `changePasswordData` state and shows an alert.
   */
  const handleConfirmButtonPress = async () => {
    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      validateOldPassword(oldPassword);
      validateNewPassword(newPassword);
      validateConfirmPassword(confirmPassword);
      return;
    }

    const ChangePasswordAuthRequest = new ChangePasswordAuthRequestModel(
      oldPassword,
      newPassword,
      confirmPassword
    );
    const onSuccess = async (responseData: ChangePasswordResponse) => {
      setChangePasswordData(responseData);
      showTextPopup(strings.success, responseData?.message ?? "");
      setAlertVisible(true);
    };

    const onError = (error: any) => {
      showTextPopup(strings.error, error.message);
    };

    PasswordChangedController.changePassword(
      ChangePasswordAuthRequest,
      onSuccess,
      onError
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.background,
    },
    backGroundView: {
      flex: 1,
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      backgroundColor: colors.white,
    },
    changePasswordText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
      color: colors.black,
    },
    icon: {
      marginRight: 12,
      width: "10%",
      color: colors.lightGrey,
      alignSelf: "flex-start",
    },
    inputContainer: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    error: {
      marginTop: ratioHeightBasedOniPhoneX(2),
      width: "auto",
      color: colors.red,
      textAlign: "left",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
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
      backgroundColor:
        theme === "light" ? colors.white : colored.darkheaderColor,
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
      backgroundColor: colored.buttonGray,
      width: "auto",
      flex: 1,
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },

    buttonText: {
      color: colors.white,
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    cancelText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    textInput: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      height: ratioHeightBasedOniPhoneX(40),
      textAlign: "left",
      backgroundColor: colored.background,
      paddingHorizontal: ratioHeightBasedOniPhoneX(2),
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
    },
    eyeIcon: {
      paddingTop: ratioHeightBasedOniPhoneX(8),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"Change Password"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={styles.inputContainer}>
        <Text style={styles.changePasswordText}>Change Password</Text>

        <TextInput
          mode="outlined"
          value={oldPassword}
          onChangeText={validateOldPassword}
          label="Old Password"
          underlineColor={colored.textColor}
          selectionColor={colored.textColor}
          activeUnderlineColor={colored.black}
          outlineColor={colors.inactivegrey}
          activeOutlineColor={colors.orange}
          textColor={colored.textColor}
          style={styles.textInput}
          outlineStyle={styles.outlineStyle}
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
        />

        {oldPasswordError ? (
          <Text style={styles.error}>{oldPasswordError}</Text>
        ) : null}
        <TextInput
          mode="outlined"
          value={newPassword}
          onChangeText={validateNewPassword}
          label="New Password"
          underlineColor={colored.textColor}
          selectionColor={colored.textColor}
          outlineColor={colors.inactivegrey}
          activeOutlineColor={colors.orange}
          textColor={colored.textColor}
          secureTextEntry={!newVisible}
          activeUnderlineColor={colored.black}
          outlineStyle={styles.outlineStyle}
          style={styles.textInput}
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
          <Text style={styles.error}>{newPasswordError}</Text>
        ) : null}

        <TextInput
          mode="outlined"
          value={confirmPassword}
          onChangeText={validateConfirmPassword}
          label="Confirm Password"
          underlineColor={colored.textColor}
          textColor={colored.textColor}
          selectionColor={colored.textColor}
          outlineColor={colors.inactivegrey}
          activeOutlineColor={colors.orange}
          secureTextEntry={!confirmVisible}
          activeUnderlineColor={colored.black}
          outlineStyle={styles.outlineStyle}
          style={styles.textInput}
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
          <Text style={styles.error}>{confirmPasswordError}</Text>
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
        <TouchableOpacity
          style={styles.button}
          onPress={handleConfirmButtonPress}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <ShowAlertMessage
        isVisible={popupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => {
          if (alertVisible) {
            setPopupVisible(false);
            setAlertVisible(false);
            setThemePreference("light");
            resetSwitch();
            navigation.reset({ index: 0, routes: [{ name: "Logins" }] });
          } else {
            setPopupVisible(false);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default PasswordChanged;
