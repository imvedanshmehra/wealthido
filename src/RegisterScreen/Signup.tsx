import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import { TextInput } from "react-native-paper";
import colors from "../colors";
import strings from "../Extension/strings";
import validation from "./validation";
import { SignupAuthRequestModel } from "./Modal/SignupAuthRequestModel";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import Loader from "../Loader";
import { SignupResponseModel } from "./Modal/SignupResponseModel";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import DatePicker from "../Extension/DateTimePicker";
import { DateFormatType, DobDate } from "../Extension/DateFormatType";
import { formatUSPhoneNumber } from "../Utility";
import StorageService from "../StorageService";
import { countryCode } from "../enums";
import Flag from "../assets/images/flag1.svg";
import MainHeaderView from "../MainHeaderView";
import ShowAlertMessage from "../Popup/showAlertMessage";
import { KeyboardAvoidingView } from "native-base";

// Functional component for user signup.
const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation: any = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [customDate, setCustomDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [datedPickerVisible, setDatedPickerVisible] = useState(false);
  const alphanumericRegex = /^[a-zA-Z0-9]*$/;
  const isFocused = useIsFocused();
  const [deviceId, setDeviceId] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  // Toggle the visibility of the password field.
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Handle the date change event and update the selected date.
  const validateDate = (text: string) => {
    if (!text) {
      setDateError("DOB is required");
    } else {
      setDateError("");
    }
  };

  const showDatedPicker = () => {
    setDatedPickerVisible(true);
  };

  const hideDatedPicker = () => {
    setDatedPickerVisible(false);
  };

  // Handle date and time confirmation
  const handleConfirm = (date: any) => {
    if (date) {
      setCustomDate(
        DobDate(date.toString(), DateFormatType.birthDateFormatThree)
      );
      validateDate(date);
    }
    hideDatedPicker();
  };

  useEffect(() => {
    if (isFocused) {
      const getDeviceId = async () => {
        const deviceId = await StorageService.getIsDeviceId();
        setDeviceId(deviceId);
      };
      getDeviceId();
    }
    return () => {
      // Reset the state values when the component is unmounted
      setFirstName("");
      setErrorName("");
      setLastName("");
      setErrorLastName("");
      setEmail("");
      setEmailError("");
      setPassword("");
      setPasswordError("");
      setPhoneNumber("");
      setPhoneNumberError("");
      setSelectedDate(null);
      setCustomDate("");
    };
  }, [isFocused]);

  const signup = async (data: SignupAuthRequestModel) => {
    setLoading(true); // Set loading state to indicate signup process is in progress
    try {
      await serverCommunication.postApi(
        URLConstants.signup,
        data,
        (
          statusCode: number,
          responseData: SignupResponseModel,
          errors: any
        ) => {
          if (responseData.status == HTTPStatusCode.ok) {
            navigation.navigate("VerificationCodeScreen", {
              statusCode: responseData.status,
              blockTime: responseData.data?.blockTime,
              phoneNumber: responseData.data?.phoneNo,
              tag: 0,
              second: responseData.data?.second,
              password: password,
            });
          } else {
            showTextPopup(strings.error, responseData.message ?? "");
          }
        }
      );
    } catch (error) {
      console.error("Error object:", error); // Log any errors that occur during the signup process
    } finally {
      setLoading(false); // Set loading state to indicate that the signup process has completed
    }
  };

  // Handle the registration process by validating and submitting user data.
  const handleRegister = async () => {
    // Validate user input data
    const nameError = validation.validateFirstName(firstName);
    const lastNameError = validation.validateLastName(lastName);
    const emailError = validation.validateEmail(email);
    const phoneNumberError = validation.validatePhoneNumber(phoneNumber);
    const fcmtoken = await StorageService.getIsFcmtoken();

    // Set validation errors for user data
    setErrorName(nameError);
    setErrorLastName(lastNameError);
    setEmailError(emailError);
    validatePassword(password);
    validateDate(customDate);
    setPhoneNumberError(phoneNumberError);

    // Check if there are no validation errors
    if (
      nameError === "" &&
      lastNameError === "" &&
      emailError === "" &&
      passwordError === "" &&
      phoneNumberError === "" &&
      customDate !== ""
    ) {
      // Prepare the registration request
      const loginAuthRequest = new SignupAuthRequestModel(
        firstName.trim(),
        lastName.trim(),
        password,
        email.trim(),
        countryCode.Code + phoneNumber,
        "IN",
        customDate,
        fcmtoken,
        deviceId
      );
      // Submit the registration request
      signup(loginAuthRequest);
    }
  };

  const navigateToLogin = () => {
    navigation.goBack();
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const handleOpenDatePicker = (date: any) => {
    setShowDatePicker(true);
    setCustomDate(
      DobDate(date.toString(), DateFormatType.birthDateFormatThree)
    );
    validateDate(date);
  };

  const handleCloseDatePicker = (date: any) => {
    setShowDatePicker(false);
    setSelectedDate(date);
    setCustomDate(
      DobDate(date.toString(), DateFormatType.birthDateFormatThree)
    );
    validateDate(date);
  };

  const validatePassword = (text: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[!@#$%^&*])(?=.{8,})/;
    setPassword(text);
    if (!text) {
      setPasswordError("Create your Password");
    } else if (!passwordRegex.test(text)) {
      setPasswordError(
        "Password (should be at least 8 characters, with 1 Uppercase, 1 lowercase, 1 special character from [!@#$%^&*])"
      );
    } else {
      setPasswordError("");
    }
  };

  return (
    <View style={styles.container}>
      <MainHeaderView
        title={"Sign Up"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.mainContainer}>
            <Text style={styles.headerText}>Wealthido</Text>
            <TextInput
              label="First Name"
              mode="outlined"
              style={styles.textInput}
              textColor={colors.black}
              cursorColor={colors.lightGreen}
              value={firstName}
              outlineColor={colors.inactivegrey}
              outlineStyle={styles.outlineStyle}
              activeOutlineColor={colors.lightGreen}
              onChangeText={(text) => {
                if (alphanumericRegex.test(text)) {
                  setFirstName(text);
                  setErrorName(validation.validateFirstName(text));
                }
              }}
            />

            {errorName ? (
              <Text style={styles.errorText}>{errorName}</Text>
            ) : null}

            <TextInput
              label="Last Name"
              mode="outlined"
              style={styles.textInput}
              textColor={colors.black}
              cursorColor={colors.lightGreen}
              value={lastName}
              outlineColor={colors.inactivegrey}
              outlineStyle={styles.outlineStyle}
              activeOutlineColor={colors.lightGreen}
              onChangeText={(text) => {
                if (alphanumericRegex.test(text)) {
                  setLastName(text);
                  setErrorLastName(validation.validateLastName(text));
                }
              }}
            />
            {errorLastName ? (
              <Text style={styles.errorText}>{errorLastName}</Text>
            ) : null}

            <TextInput
              label="Email address"
              mode="outlined"
              style={styles.textInput}
              textColor={colors.black}
              cursorColor={colors.lightGreen}
              value={email}
              outlineColor={colors.inactivegrey}
              outlineStyle={styles.outlineStyle}
              activeOutlineColor={colors.lightGreen}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(validation.validateEmail(text));
              }}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
            <TextInput
              label="Password"
              mode="outlined"
              style={styles.textInput}
              secureTextEntry={!isPasswordVisible}
              textColor={colors.black}
              cursorColor={colors.lightGreen}
              value={password}
              outlineColor={colors.inactivegrey}
              outlineStyle={styles.outlineStyle}
              activeOutlineColor={colors.lightGreen}
              selectionColor={colors.lightGreen}
              onChangeText={validatePassword}
              right={
                <TextInput.Icon
                  color={colors.tabText}
                  size={20}
                  icon={isPasswordVisible ? "eye" : "eye-off"}
                  onPress={togglePasswordVisibility}
                  style={styles.eyeIcon}
                />
              }
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
            <TouchableOpacity onPress={showDatedPicker} activeOpacity={1}>
              <TextInput
                label="DOB"
                mode="outlined"
                style={styles.textInput}
                placeholder="DOB"
                textColor={colors.black}
                cursorColor={colors.black}
                value={customDate} // Set the formatted date here
                outlineColor={colors.inactivegrey}
                outlineStyle={styles.outlineStyle}
                activeOutlineColor={colors.lightGreen}
                onTouchStart={handleOpenDatePicker}
                editable={false}
              />
            </TouchableOpacity>
            {dateError ? (
              <Text style={styles.errorText}>{dateError}</Text>
            ) : null}
            <View style={styles.phoneNumberView}>
              <View style={styles.dropdownContainer}>
                <Flag />
                <Text style={{ color: colors.lightblack }}> +1 </Text>
              </View>
              <TextInput
                label="Phone Number"
                mode="outlined"
                style={styles.phoneNumbertextInput}
                textColor={colors.black}
                cursorColor={colors.lightGreen}
                value={formatUSPhoneNumber(phoneNumber)}
                outlineColor={colors.inactivegrey}
                outlineStyle={styles.outlineStyle}
                activeOutlineColor={colors.lightGreen}
                maxLength={14}
                keyboardType="phone-pad"
                returnKeyType={"done"}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setPhoneNumberError(validation.validatePhoneNumber(text));
                }}
              />
            </View>
            {phoneNumberError ? (
              <Text style={styles.errorText}>{phoneNumberError}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <View
              style={{
                marginTop: ratioHeightBasedOniPhoneX(16),
              }}
            />
            <View style={styles.termsPrivacyContaianer}>
              <Text style={styles.PrivacyPolicy}>
                By clicking Sign up, you agree to our
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://staging.wealthido.com/terms-and-conditions"
                  )
                }
              >
                <Text style={styles.orangeText}>Terms of Service,</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.termsPrivacyContaianer}>
              <Text style={styles.PrivacyPolicy}>and </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://staging.wealthido.com/privacy-policy"
                  )
                }
              >
                <Text style={styles.orangeText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>{strings.account}</Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.login}>{strings.login}</Text>
              </TouchableOpacity>
            </View>
            <ShowAlertMessage
              isVisible={popupVisible}
              title={popupTitle}
              message={popupMessage}
              onClose={() => setPopupVisible(false)}
            />
            <Loader loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {Platform.OS == "ios" ? (
        <DatePicker
          showDatePicker={showDatePicker}
          date={selectedDate}
          onClose={handleCloseDatePicker}
          onChange={handleDateChange}
          minimum={new Date()}
        />
      ) : (
        <DateTimePickerModal
          isVisible={datedPickerVisible}
          mode="date"
          display="spinner"
          onConfirm={handleConfirm}
          onCancel={hideDatedPicker}
          minimumDate={new Date(1900, 0, 1)}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainer: {
    paddingHorizontal: ratioHeightBasedOniPhoneX(20),
  },
  headerText: {
    marginTop: ratioHeightBasedOniPhoneX(25),
    marginBottom: ratioHeightBasedOniPhoneX(14),
    textAlign: "center",
    alignItems: "center",
    color: colors.lightGreen,
    ...WealthidoFonts.georgiaBold(ratioHeightBasedOniPhoneX(48)),
  },
  textInput: {
    textAlign: "left",
    backgroundColor: colors.white,
    paddingHorizontal: ratioHeightBasedOniPhoneX(2),
    marginTop: ratioHeightBasedOniPhoneX(16),
    height: ratioHeightBasedOniPhoneX(40),
    includeFontPadding: false,
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
  },
  outlineStyle: {
    borderWidth: ratioWidthBasedOniPhoneX(0.5),
    color: colors.black,
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
  },
  errorText: {
    color: colors.mainlyRED,
    textAlign: "left",
    paddingTop: ratioHeightBasedOniPhoneX(5),
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
  },
  phoneNumberView: {
    marginTop: ratioHeightBasedOniPhoneX(19),
    flexDirection: "row",
    alignItems: "center",
  },
  phoneNumbertextInput: {
    flex: 1,
    textAlign: "left",
    backgroundColor: colors.white,
    marginLeft: ratioHeightBasedOniPhoneX(10),
    height: ratioHeightBasedOniPhoneX(40),
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: ratioWidthBasedOniPhoneX(80),
    marginTop: ratioHeightBasedOniPhoneX(6),
    height: ratioHeightBasedOniPhoneX(42), // Match the height with phoneNumbertextInput
    borderWidth: ratioWidthBasedOniPhoneX(0.5),
    borderColor: colors.inactivegrey,
    borderRadius: ratioHeightBasedOniPhoneX(5),
    padding: ratioHeightBasedOniPhoneX(10),
  },
  button: {
    backgroundColor: colors.orange,
    height: ratioHeightBasedOniPhoneX(48),
    justifyContent: "center",
    borderRadius: ratioHeightBasedOniPhoneX(24),
    marginTop: ratioHeightBasedOniPhoneX(35),
    padding: ratioHeightBasedOniPhoneX(1), // Add padding
  },
  buttonText: {
    color: colors.white,
    textAlign: "center",
    ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: ratioHeightBasedOniPhoneX(43),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ratioHeightBasedOniPhoneX(16),
  },
  termsPrivacyContaianer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: ratioWidthBasedOniPhoneX(30),
  },
  signupText: {
    textAlign: "center",
    color: colors.mainlyBlue,
    ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
  },
  login: {
    color: colors.orange,
    padding: ratioHeightBasedOniPhoneX(5),
    ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
  },
  PrivacyPolicy: {
    color: colors.mainlyBlue,
    ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
  },
  orangeText: {
    ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    color: colors.orange,
  },
  eyeIcon: {
    paddingTop: ratioHeightBasedOniPhoneX(8),
  },
});

export default Signup;
