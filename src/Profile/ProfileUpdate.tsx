import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import colors, { dark, light } from "../colors";
import strings from "../Extension/strings";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HttpStatusCode from "../Networking/HttpStatusCode";
import ServerController from "../Networking/ServerController";
import StorageService from "../StorageService";
import { EditProfileAuthRequestModel } from "./EditProfileAuthModel";
import BottomSheet from "react-native-raw-bottom-sheet";
import { ThemeContext } from "../Networking/themeContext";
import Loader from "../Loader";
import validation from "../RegisterScreen/validation";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { DateFormatType, DobDate } from "../Extension/DateFormatType";
import DatePicker from "../Extension/DateTimePicker";
import MainHeaderView from "../MainHeaderView";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { formatUSCountryCode } from "../Utility";
import ShowAlertMessage from "../Popup/showAlertMessage";
import BottomButtonsView from "../BottomButtonsView";
import { ScrollView } from "react-native-gesture-handler";
import VerifyImg from "../assets/images/VerifyImg.svg";
import CrossImg from "../assets/images/CrossImg.svg";
import { subDays } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const navigation: any = useNavigation();
  const [Name, setName] = useState("");
  const [errorName, setNameError] = useState("");
  const [AccountName, SetAccountName] = useState("");
  const [errorAccountName, setAccountNameError] = useState("");
  const [LastName, setLastName] = useState("");
  const [errorLastName, setLastNameError] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [accountId, setAccount] = useState("");
  const [accountIdError, setAccountError] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [Password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const isFocused = useIsFocused();
  const [userInfo, setUserInfo] = useState<LoginResponseModel | null>(null);
  const { theme } = useContext(ThemeContext);
  const [tag, setTag] = useState<number>(4);
  const colored = theme === "dark" ? dark : light;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDatedTime, setSelectedDated] = useState(null);
  const [isDatedPickerVisible, setDatedPickerVisibility] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [emailVerified, setEmailVerified] = useState(Boolean);
  const [dataReceived, setIsDataReceived] = useState(false);
  const yesterday = subDays(new Date(), 1);
  const [isFocuseFirstName, setIsFocuseFirstName] = useState(false);
  const [isFocuseLastName, setIsFocuseLastName] = useState(false);
  const [isFocuseDOB, setIsFocuseDOB] = useState(false);
  const [isFocuseMobileNumber, setIsFocuseMobileNumber] = useState(false);
  const [isFocuseAccountName, setIsFocuseAccountName] = useState(false);
  const [isFocuseAccountID, setIsFocuseAccountID] = useState(false);
  const [isFocuseEmailORMobile, setIsFocuseEmailORMobile] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  // Toggle the visibility of the password field.
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    if (isFocused) {
      getUserInfo();
    }
  }, [isFocused]);

  const getUserInfo = async () => {
    setLoading(true);
    try {
      await serverCommunication.getApi(
        URLConstants.userInfo,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            setUserInfo(responseData);
            setName(responseData?.data?.firstname);
            setLastName(responseData?.data?.lastname);
            setEmail(responseData?.data?.email);
            setMobile(responseData?.data?.phoneNo);
            setAccount(responseData?.data?.accountId.toString());
            setCustomDate(responseData?.data?.dob);
            setEmailVerified(responseData?.data?.isEmailVerified);
            SetAccountName(
              `${responseData?.data?.firstname} ${responseData?.data?.lastname}`
            );
            setIsDataReceived(true);
          } else {
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    } finally {
      setLoading(false);
    }
  };

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const validateName = (text: string): void => {
    setName(text);

    if (!text) {
      setNameError("First Name is required");
    } else if (text.length < 3 || text.length > 20) {
      setNameError("The firstname must be from 3 to 20 characters");
    } else {
      setNameError("");
    }
  };

  const validateAccount = (text: string): void => {
    setAccount(text);
  };

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);

    if (text === "") {
      setEmailError("");
    } else if (!emailRegex.test(text)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  // Validates the input text for last name field.
  const validateLastName = (text: string) => {
    setLastName(text);

    if (!text) {
      setLastNameError(strings.lastNameRequired);
    } else if (text.length < 3 || text.length > 20) {
      setLastNameError("The lastname must be from 3 to 20 characters");
    } else {
      setLastNameError("");
    }
  };

  const validateDOB = (text: string) => {
    setSelectedDate(null);
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    setCustomDate(
      DobDate(date.toString(), DateFormatType.birthDateFormatThree)
    );
  };

  const handleCloseDatePicker = (date: any) => {
    setShowDatePicker(false);
    setSelectedDate(date);
    setCustomDate(
      DobDate(date.toString(), DateFormatType.birthDateFormatThree)
    );
  };

  const showDatedPicker = () => {
    setDatedPickerVisibility(true);
  };

  const hideDatedPicker = () => {
    setDatedPickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    if (date) {
      setSelectedDated(date);
      setCustomDate(
        DobDate(date.toString(), DateFormatType.birthDateFormatThree)
      );
    }
    hideDatedPicker();
  };

  const validateAccountName = (text: string): void => {
    SetAccountName(text);

    if (!text) {
      setAccountNameError("Account Name is required");
    } else if (text.trim().length !== text.length) {
      setAccountNameError("Enter Account Name without whitespaces");
    } else if (text.length < 3 || text.length > 50) {
      setAccountNameError("The Account must be from 3 to 50 characters");
    } else {
      setAccountNameError("");
    }
  };

  const handleRegister = async () => {
    if (
      (userInfo?.data?.firstname != Name &&
        errorName == "" &&
        errorLastName == "") ||
      (userInfo?.data?.lastname != LastName &&
        errorName == "" &&
        errorLastName == "") ||
      (userInfo?.data?.dob != customDate &&
        errorName == "" &&
        errorLastName == "")
    ) {
      const EditProfile = new EditProfileAuthRequestModel(
        Name.trim(),
        LastName.trim(),
        selectedDate ? DobDate(selectedDate) : customDate
      );
      setLoading(true);

      const onSuccess = async (responseData: LoginResponseModel) => {
        setLoading(false);
        setUserInfo(responseData);
        await StorageService.setIsLogin(responseData);

        if (responseData.status === HttpStatusCode.ok) {
          showTextPopup(strings.success, responseData.message ?? "");
        }
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      };
      const onError = (error: any) => {
        setLoading(false);
        console.log(error);
        showTextPopup(strings.error, error.message);
      };

      ServerController.EditProfile(EditProfile, onSuccess, onError);
    } else {
      validateName(Name);
      validateLastName(LastName);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.darkheaderColor,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioHeightBasedOniPhoneX(32),
      borderRadius: ratioHeightBasedOniPhoneX(32),
    },
    subContainer: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    titleContainer: {
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    titleText: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
      lineHeight: ratioHeightBasedOniPhoneX(25),
    },
    headerText: {
      paddingLeft: ratioWidthBasedOniPhoneX(5),
      alignItems: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    headerTextContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    backButtonImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      tintColor: colored.textColor,
    },
    emailContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    verifyImg: {
      paddingTop: ratioHeightBasedOniPhoneX(10),
    },
    label: {
      color: colors.lightText,
      marginTop: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    input: {
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(16),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    noteTextContainer: {
      marginTop: ratioHeightBasedOniPhoneX(5),
      flexDirection: "row",
      alignItems: "center",
    },
    noteText: {
      color: colors.red,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      lineHeight: ratioHeightBasedOniPhoneX(16),
    },
    emailText: {
      color: colors.dimGray,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      lineHeight: ratioHeightBasedOniPhoneX(16),
    },
    clickHereText: {
      color: colors.blue,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
      lineHeight: ratioHeightBasedOniPhoneX(16),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    errorText: {
      color: "red",
      textAlign: "left",
      fontSize: ratioHeightBasedOniPhoneX(12),
      fontFamily: "Inter-Medium",
    },

    //bottomsheet
    headerBottomTitle: {
      color: colored.textColor,
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    error: {
      color: colors.red,
      textAlign: "left",
      fontFamily: "Inter-Medium",
      fontSize: ratioHeightBasedOniPhoneX(12),
      paddingTop: ratioHeightBasedOniPhoneX(3),
    },
    closeImage: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioWidthBasedOniPhoneX(24),
      tintColor: colors.lightblack,
    },
    buttonContainerBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: ratioHeightBasedOniPhoneX(35),
    },
    cancelText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    depositText: {
      color: colors.white,
      textAlign: "center",
      padding: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    divider: {
      backgroundColor: colors.shadowcolor,
      marginTop: ratioHeightBasedOniPhoneX(3),
      borderBottomWidth: 0.2,
    },
    bottomContainer: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      flexDirection: "row",
      gap: ratioHeightBasedOniPhoneX(9),
      backgroundColor: theme === "light" ? colors.white : "transparent",
      height: ratioHeightBasedOniPhoneX(80),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
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
    },
    button: {
      backgroundColor: colors.lightGreen,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      marginVertical: ratioHeightBasedOniPhoneX(16),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    androidShadow: {
      shadowColor: "black",
      shadowOpacity: 0.6,
      shadowRadius: 0.6,
      elevation: 6,
    },
    eyeIcon: {
      paddingTop: ratioHeightBasedOniPhoneX(8),
    },
  });

  const renderTextInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    error: string | null,
    keyboardType: string,
    onFocus?: () => void,
    onBlur?: () => void,
    isFocuse?: boolean,
    editable: boolean = true,
    onPressIn?: () => void,
    secureTextEntry: boolean = false
  ) => {
    return (
      <TextInput
        label={label}
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        underlineColor={colored.textColor}
        textColor={colored.textColor}
        keyboardType={keyboardType}
        activeUnderlineColor={error ? "red" : colored.textColor}
        style={styles.input}
        selectionColor={colored.textColor}
        outlineColor={colors.inactivegrey}
        outlineStyle={styles.outlineStyle}
        activeOutlineColor={colors.lightGreen}
        onTouchStart={onPressIn}
        returnKeyType={"done"}
        editable={editable}
        secureTextEntry={secureTextEntry}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
  };

  const renderBottomSheetContent = (
    tag: number,
    Password: string,
    setPassword: (text: string) => void,
    setPasswordError: (error: string) => void,
    passwordError: string,
    bottomSheetRef: React.RefObject<BottomSheet>,
    navigation: any
  ) => {
    return (
      <View>
        <View
          style={{
            marginHorizontal: ratioWidthBasedOniPhoneX(20),
          }}
        >
          <View
            style={[styles.row, { marginTop: ratioHeightBasedOniPhoneX(-10) }]}
          >
            <Text style={styles.headerBottomTitle}>
              {tag === 1 ? "Edit Mobile Number" : "Edit Email"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.close();
              }}
            >
              <Image
                source={require("../assets/images/Close.png")}
                style={styles.closeImage}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>
            Enter your password to change the{" "}
            {tag === 1 ? "Mobile Number" : "e-mail address"}
          </Text>
          <TextInput
            label="Password"
            mode="outlined"
            value={Password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(validation.validatePassword(text));
            }}
            textColor={colored.textColor}
            underlineColor={colors.black}
            secureTextEntry={!isPasswordVisible}
            right={
              <TextInput.Icon
                color={colors.tabText}
                size={20}
                icon={isPasswordVisible ? "eye" : "eye-off"}
                onPress={togglePasswordVisibility}
                style={styles.eyeIcon}
              />
            }
            selectionColor={colors.lightGreen}
            activeUnderlineColor={passwordError ? "red" : colors.black}
            style={styles.input}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colors.lightGreen}
            onFocus={() => setIsFocuseEmailORMobile(true)}
            onBlur={() => setIsFocuseEmailORMobile(false)}
          />
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}
        </View>
        <View
          style={{
            borderTopWidth:
              theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
            borderColor: "#222528",
            marginTop: ratioHeightBasedOniPhoneX(10),
          }}
        >
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.close();
              }}
              style={[
                styles.button,
                {
                  backgroundColor:
                    theme === "light"
                      ? colored.buttonGray
                      : colored.cancelButtonBg,
                },
              ]}
            >
              <Text style={[styles.buttonText, { color: colored.lightblack }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const passwordError = validation.validatePassword(Password);
                if (Password != "" && passwordError == "") {
                  if (tag == 1) {
                    phoneNoPasswordVerify();
                  } else {
                    emailPasswordVerify();
                  }
                } else {
                  setPasswordError(passwordError);
                }
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const emailPasswordVerify = async () => {
    setLoading(true);
    const data = {
      password: Password,
    };
    bottomSheetRef.current?.close();
    try {
      await serverCommunication.postApi(
        URLConstants.verifyPassword,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (responseData.status == HTTPStatusCode.ok) {
            navigation.navigate("EmailEdit", {
              tag: tag,
              data: responseData.data,
              password: Password,
              phoneNumber: mobile,
            });
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        }
      );
    } catch (error) {
      console.error("Error object:", error);
    } finally {
      setLoading(false);
    }
  };

  const phoneNoPasswordVerify = async () => {
    setLoading(true);
    const data = {
      password: Password,
    };
    bottomSheetRef.current?.close();
    try {
      await serverCommunication.postApi(
        URLConstants.verifyPassword,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (responseData.status == HTTPStatusCode.ok) {
            navigation.navigate("EmailEdit", {
              tag: tag,
              data: responseData.data,
            });
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        }
      );
    } catch (error) {
      console.error("Error object:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPress = () => {
    navigation.goBack();
  };

  const handleEmailVerifyPress = async () => {
    setLoading(true);
    try {
      await serverCommunication.postApi(
        URLConstants.verifyEmail,
        {},
        (statusCode: number, responseData: any, error: any) => {
          if (responseData.status == HTTPStatusCode.ok) {
            showTextPopup(strings.success, responseData?.message ?? "");
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        }
      );
    } catch (error) {
      console.error("Error object:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={
          theme === "light" ? colors.white : colored.darkheaderColor
        }
        translucent={false}
      />
      <MainHeaderView
        title={"Edit "}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <Loader loading={loading}>
        <ScrollView
          style={styles.subContainer}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.titleContainer,
              {
                marginBottom: ratioHeightBasedOniPhoneX(-10),
              },
            ]}
          >
            <Text style={styles.titleText}>Personal Info</Text>
          </View>
          {renderTextInput(
            "First Name",
            Name,
            validateName,
            errorName,
            "default",
            () => setIsFocuseFirstName(true),
            () => setIsFocuseFirstName(false),
            isFocuseFirstName,
            true
          )}
          {errorName ? <Text style={styles.errorText}>{errorName}</Text> : null}

          {renderTextInput(
            "Last Name",
            LastName,
            validateLastName,
            errorLastName,
            "default",
            () => setIsFocuseLastName(true),
            () => setIsFocuseLastName(false),
            isFocuseLastName,
            true
          )}
          {errorLastName ? (
            <Text style={styles.errorText}>{errorLastName}</Text>
          ) : null}
          <TouchableOpacity onPress={showDatedPicker} activeOpacity={1}>
            {renderTextInput(
              "DOB",
              customDate,
              validateDOB,
              "",
              "number-pad",
              () => setIsFocuseDOB(true),
              () => setIsFocuseDOB(false),
              isFocuseDOB,
              false,
              () => {
                setShowDatePicker(true);
              },
              false
            )}
          </TouchableOpacity>
          <View
            style={[
              styles.titleContainer,
              {
                marginBottom: ratioHeightBasedOniPhoneX(-10),
              },
            ]}
          >
            <Text style={styles.titleText}>Contact Info</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              bottomSheetRef.current?.open();
              setTag(0);
              setPassword("");
            }}
            activeOpacity={1}
          >
            <View>
              <TextInput
                label="Email Address"
                mode="outlined"
                value={email}
                onChangeText={validateEmail}
                underlineColor={colored.textColor}
                textColor={colored.textColor}
                keyboardType="default"
                activeUnderlineColor={emailError ? "red" : colored.textColor}
                style={styles.input}
                right={
                  <TextInput.Icon
                    size={20}
                    icon={emailVerified ? VerifyImg : CrossImg}
                    style={styles.verifyImg}
                  />
                }
                selectionColor={colored.textColor}
                outlineColor={colors.inactivegrey}
                outlineStyle={styles.outlineStyle}
                activeOutlineColor={colored.textColor}
                editable={false}
                onTouchStart={() => {
                  bottomSheetRef.current?.open();
                  setTag(0);
                  setPassword("");
                }}
                returnKeyType={"done"}
                secureTextEntry={false}
              />
            </View>
          </TouchableOpacity>
          {emailVerified !== true ? (
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteText}>Note: </Text>
              <Text style={styles.emailText}>
                Your email has not verified yet.
              </Text>
              <TouchableOpacity onPress={handleEmailVerifyPress}>
                <Text style={styles.clickHereText}>Click here.</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              bottomSheetRef.current?.open();
              setTag(1);
              setPassword("");
            }}
            activeOpacity={1}
          >
            {renderTextInput(
              "Mobile Number",
              formatUSCountryCode(mobile),
              validation.validatePhoneNumber,
              null,
              "phone-pad",
              () => setIsFocuseMobileNumber(true),
              () => setIsFocuseMobileNumber(false),
              isFocuseMobileNumber,
              false,
              () => {
                bottomSheetRef.current?.open();
                setTag(1);
                setPassword("");
              },
              false
            )}
          </TouchableOpacity>
          <View
            style={[
              styles.titleContainer,
              {
                marginBottom: ratioHeightBasedOniPhoneX(-10),
              },
            ]}
          >
            <Text style={styles.titleText}>Account Info</Text>
          </View>
          {renderTextInput(
            "Account Name",
            AccountName,
            validateAccountName,
            errorAccountName,
            "default",
            () => setIsFocuseAccountName(true),
            () => setIsFocuseAccountName(false),
            isFocuseAccountName,
            false
          )}
          {errorAccountName ? (
            <Text style={styles.errorText}>{errorAccountName}</Text>
          ) : null}
          {renderTextInput(
            "Account ID",
            accountId,
            validateAccount,
            accountIdError,
            "number-pad",
            () => setIsFocuseAccountID(true),
            () => setIsFocuseAccountID(false),
            isFocuseAccountID,
            false
          )}
          <View style={{ height: ratioHeightBasedOniPhoneX(30) }}></View>
        </ScrollView>
        <BottomButtonsView
          firstText="Cancel"
          secondText="Save"
          onPressSuccess={handleRegister}
          onPressBack={handleCancelPress}
        />
      </Loader>

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
          isVisible={isDatedPickerVisible}
          mode="date"
          display="spinner"
          date={yesterday}
          maximumDate={yesterday}
          minimumDate={new Date(1900, 0, 1)}
          onConfirm={handleConfirm}
          onCancel={hideDatedPicker}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        closeOnDragDown
        dragFromTopOnly
        onClose={() => {
          setPasswordError("");
        }}
        customStyles={{
          draggableIcon: { backgroundColor: "transparent" },
          container: {
            height: "auto",
            backgroundColor:
              theme === "light" ? colored.headerColor : colored.darkheaderColor,
            borderTopWidth: ratioWidthBasedOniPhoneX(1),
            borderTopColor: colored.shadowColor,
          },
        }}
      >
        {renderBottomSheetContent(
          tag,
          Password,
          setPassword,
          setPasswordError,
          passwordError,
          bottomSheetRef,
          navigation
        )}
      </BottomSheet>
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

export default EditProfile;
