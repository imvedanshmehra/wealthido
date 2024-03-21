import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import HeaderView from "../ChitFundScreen/HeaderView";
import colors, { dark, light } from "../colors";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import LogoutPopupMessage from "../LogoutPopupMessage";
import StorageService from "../StorageService";
import Loader from "../Loader";
import BottomSheet from "react-native-raw-bottom-sheet";
import { TextInput } from "react-native-paper";
import validation from "../RegisterScreen/validation";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import PowerIcon from "../assets/images/logout_icon.svg";
import PasswordIcon from "../assets/images/more/password_pin.svg";
import TwoFactor from "../assets/images/more/two_factor.svg";
import ChangePin from "../assets/images/more/change_pin.svg";
import Notification from "../assets/images/more/notifications.svg";
import Wallet from "../assets/images/more/wallet.svg";
import Referral from "../assets/images/more/multi_user.svg";
import Document from "../assets/images/more/document.svg";
import Identity from "../assets/images/more/Identity.svg";
import Credit from "../assets/images/more/credit.svg";
import Ticket from "../assets/images/more/ticket.svg";
import Faq from "../assets/images/more/faq.svg";
import Contact from "../assets/images/more/Cus.svg";
import About from "../assets/images/more/about.svg";
import Tutorial from "../assets/images/more/tutorial.svg";
import Terms from "../assets/images/more/Terms_conditions.svg";
import Beneficiary from "../assets/images/beneficiary.svg";
import Payments from "../assets/images/payments.svg";
import ShowAlertMessage from "../Popup/showAlertMessage";
import ChangePasswordAlertView from "../Popup/ChangePasswordAlertView";
import CustomizeImage from "../assets/images/Customize.svg";
import FingerprintScanner from "react-native-fingerprint-scanner";
import { GenerateOtpModel } from "./Model/GenerateOtpModel";
import TokenManager from "../TokenManager";
import strings from "../Extension/strings";
import CreditSheetContent from "../ChitDetails/CreditBottomSheet";

const More = () => {
  const navigation: any = useNavigation();
  const { theme, setThemePreference, resetSwitch } = useContext(ThemeContext);
  const isFocused = useIsFocused();
  const [response, setResponse] = useState<LoginResponseModel | null>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRefCredit = useRef<BottomSheet>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const showImage = true;
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [isRegularAlert, setIsRegularAlert] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [changePopupMessage, setChangePopupMessage] = useState("");
  const [isChangePopupVisible, setIsChangePopupVisible] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  let colored: any;

  if (theme === "dark") {
    colored = dark;
  } else {
    colored = light;
  }

  const showTextPopup = async (
    title: string,
    message: string,
    isRegularAlert: boolean = false
  ) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    setIsRegularAlert(isRegularAlert);
    return true;
  };

  const showChangeTextPopup = async (message: string) => {
    setIsChangePopupVisible(true);
    return setChangePopupMessage(message);
  };

  function getKYCStatusText(
    isPendingNotSubmit: any,
    kycStatus: string | undefined
  ) {
    if (isPendingNotSubmit) {
      return "KYC Not Verified";
    }
    return kycStatus === "APPROVED" ? "Verified" : kycStatus;
  }
  const showAlert = () => setIsAlertVisible(true);
  const hideAlert = () => setIsAlertVisible(false);
  const handleLogoutButtonPress = async () => {
    setIsAlertVisible(false);
    TokenManager.setToken(null);
    setThemePreference("light");
    resetSwitch();
    navigation.reset({ index: 0, routes: [{ name: "BiometricLoginScreen" }] });
  };

  const kycStatus = response?.data?.kycstatus;
  const kycSubmit = response?.data?.kycsubmit;
  const isPendingNotSubmit =
    kycStatus === "PENDING" && kycSubmit === "NOT_SUBMIT";
  const textContent = getKYCStatusText(isPendingNotSubmit, kycStatus);

  const backgroundColor = (() => {
    switch (kycStatus) {
      case "PENDING":
        return kycSubmit === "NOT_SUBMIT" ? colors.red : colors.orange;
      case "REJECTED":
        return colors.red;
      default:
        return colors.ligtgreen;
    }
  })();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getUserInfo = async () => {
    try {
      await serverCommunication.getApi(
        URLConstants.userInfo,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            StorageService.setIsLogin(responseData);
            setResponse(responseData);
          }
        }
      );
    } catch (error) {}
  };

  const fetchData = async () => {
    if (isFocused) {
      try {
        const type = await FingerprintScanner.isSensorAvailable();
        setBiometryType(type);
      } catch (error) {
        // Handle error, e.g., log or set a default value for biometryType
        console.error("Error checking fingerprint sensor availability:", error);
      }
    }
  };

  useEffect(() => {
    if (isFocused) getUserInfo();
    fetchData();
  }, [isFocused]);

  const styles = StyleSheet.create({
    main: {
      backgroundColor: colored.blackColor,
      flex: 1,
    },
    container: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0.2, height: 0.2 },
          shadowOpacity: 0.12,
          shadowRadius: 3,
        },
        android: {
          shadowColor: colors.black,
          elevation: 4,
        },
      }),
      backgroundColor: colored.cardBackGround,
      flex: 1,
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
      marginVertical: ratioHeightBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(10),
    },
    content: {
      flex: 1,
    },
    titleContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: ratioHeightBasedOniPhoneX(15),
    },
    title: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    kycText: {
      color: colors.white,
      borderRadius: ratioHeightBasedOniPhoneX(15),
      overflow: "hidden",
      justifyContent: "center",
      textAlign: "center",
      paddingVertical: ratioHeightBasedOniPhoneX(4),
      paddingHorizontal: ratioHeightBasedOniPhoneX(6),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    settingsOptions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginBottom: ratioHeightBasedOniPhoneX(24),
      marginLeft: ratioWidthBasedOniPhoneX(8),
    },
    settingsOptionstwo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: ratioWidthBasedOniPhoneX(-9),
    },
    card: {
      textAlign: "center",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    cardTwo: {
      textAlign: "center",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    cardCircle: {
      width: ratioHeightBasedOniPhoneX(48),
      height: ratioHeightBasedOniPhoneX(48),
      borderRadius: ratioHeightBasedOniPhoneX(48),
      textAlign: "center",
      backgroundColor: colored.black,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    icon: {
      width: ratioWidthBasedOniPhoneX(48),
      height: ratioHeightBasedOniPhoneX(48),
      textAlign: "center",
    },
    iconDark: {
      width: ratioWidthBasedOniPhoneX(48),
      height: ratioHeightBasedOniPhoneX(48),
      resizeMode: "contain",
    },
    circletext: {
      color: colored.lightblack,
      textAlign: "center",
      marginTop: ratioHeightBasedOniPhoneX(5),
      marginBottom: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    //BottomSheet
    headerBottomTitle: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
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
      tintColor: colors.dimGray,
    },
    buttonContainerBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: ratioHeightBasedOniPhoneX(15),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    input: {
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(15),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    label: {
      color: colors.lightText,
      marginTop: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    eyeIcon: {
      paddingTop: ratioHeightBasedOniPhoneX(8),
    },
    confirmbutton: {
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
      backgroundColor:
        theme === "light" ? colored.buttonGray : colored.cancelButtonBg,
      width: "auto",
      flex: 1,
      marginRight: ratioWidthBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    cancelText: {
      color: colored.textColor,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    depositText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    popupText: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(16)),
      color: colored.textColor,
      textAlign: "center",
      marginBottom: ratioHeightBasedOniPhoneX(20),
    },
  });

  const handleChangePin = async () => {
    bottomSheetRef.current?.close();
    const passwordError = validation.validatePassword(password);
    setPasswordError(passwordError);
    const verifyPassword = {
      password: password,
    };
    if (passwordError === "" && password !== "") {
      setLoading(false);
      try {
        await serverCommunication.postApi(
          URLConstants.verifyPassword,
          verifyPassword,
          (statusCode: number, responseData: any, error: any) => {
            if (!error) {
              if (responseData.status == HTTPStatusCode.ok) {
                bottomSheetRef.current?.close();
                navigation.navigate("ChangePinScreen");
              } else {
                showTextPopup(strings.error, responseData?.message ?? "");
              }
            }
          }
        );
      } catch (error) {
        showTextPopup(strings.error, strings.defaultError);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderNavigationItem = (onPressIn?: () => void, showImage, text) => (
    <View style={{ flex: 1 }}>
      <View
        style={{
          marginTop:
            text == "Terms &\nCondition" ? ratioHeightBasedOniPhoneX(12) : null,
        }}
      >
        <TouchableOpacity style={[styles.cardTwo]} onPress={onPressIn}>
          <View
            style={[
              styles.cardCircle,
              {
                backgroundColor: text ? colored.lightestOrange : "transparent",
              },
            ]}
          >
            {showImage}
          </View>
          <Text style={styles.circletext}>{text}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBottomSheetContent = (
    Password: string,
    setPassword: (text: string) => void,
    setPasswordError: (error: string) => void,
    PasswordError: string,
    bottomSheetRef: React.RefObject<BottomSheet> // Update with the correct type for BottomSheet
    // Update with the correct type for navigation
  ) => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: ratioHeightBasedOniPhoneX(-10),
            marginHorizontal: ratioWidthBasedOniPhoneX(20),
          }}
        >
          <Text style={styles.headerBottomTitle}>{"Change Pin"}</Text>
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
        <View style={{ marginHorizontal: ratioWidthBasedOniPhoneX(20) }}>
          <Text style={styles.label}>
            Enter your password to change the pin
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
            activeUnderlineColor={PasswordError ? "red" : colors.black}
            style={styles.input}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colors.lightGreen}
          />
          {PasswordError ? (
            <Text style={styles.error}>{PasswordError}</Text>
          ) : null}
        </View>
        <View
          style={{
            marginTop: ratioHeightBasedOniPhoneX(15),
            borderTopWidth:
              theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
            borderColor: "#222528",
          }}
        >
          <View style={styles.buttonContainerBottom}>
            <TouchableOpacity
              style={styles.cancelbutton}
              onPress={() => {
                bottomSheetRef.current?.close();
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmbutton}
              onPress={handleChangePin}
            >
              <Text style={styles.depositText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const ProceedButtonPress = async () => {
    if (!pressed) {
      setPressed(true);
      try {
        await serverCommunication.getApi(
          URLConstants.generateOTP,
          async (
            statusCode: any,
            responseData: GenerateOtpModel,
            error: any
          ) => {
            setIsChangePopupVisible(false);
            setPressed(false);
            if (responseData.status === HTTPStatusCode.ok) {
              navigation.navigate("OtpVerificationScreen", {
                second: responseData.data?.second,
                blockRegenerateTime: responseData.data?.block_regenerate_time,
                phoneNo: responseData.data?.phone_no,
              });
            } else {
              showTextPopup(strings.error, responseData.message ?? "");
            }
          }
        );
      } catch (error) {
        showTextPopup(strings.error, strings.defaultError);
      }
    }
  };

  return (
    <View style={styles.main}>
      <HeaderView title="More" onPress={undefined} />
      <Loader loading={loading}>
        <ScrollView
          style={[styles.content, { marginTop: ratioHeightBasedOniPhoneX(3) }]}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.container,
              Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
              { padding: ratioHeightBasedOniPhoneX(15) },
            ]}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Settings</Text>
              <Text
                style={[styles.kycText, { backgroundColor: backgroundColor }]}
              >
                {textContent}
              </Text>
            </View>
            <View style={styles.settingsOptionstwo}>
              {renderNavigationItem(
                () => {
                  const mobileNumber = response?.data?.phoneNo;
                  const changeTextPopupMessage = `<p style='text-align:justify; font-size:16px; font-family: "Manrope-Regular"'> To proceed with the password change, an OTP will be sent to the mobile number <a style="color:#ff6200;"target="_blank">${mobileNumber}.</a> Please confirm if you wish to continue with this action.</p>`;
                  showChangeTextPopup(changeTextPopupMessage);
                },
                <PasswordIcon />,
                "Password"
              )}

              {renderNavigationItem(
                () => {
                  showTextPopup(
                    "Two-factor authentication",
                    "Two-factor authentication is enabled by default for account safety measures.",
                    true
                  );
                },
                <TwoFactor />,
                "Two Factor"
              )}

              {renderNavigationItem(
                () => {
                  bottomSheetRef.current?.open();
                  setPassword("");
                },
                <ChangePin />,
                "Change Pin"
              )}

              {renderNavigationItem(
                () => {
                  navigation.navigate("notification", { tag: "1" });
                },
                <Notification />,
                "Notifications"
              )}
            </View>

            <View
              style={[
                styles.settingsOptionstwo,
                { marginBottom: ratioHeightBasedOniPhoneX(0) },
              ]}
            >
              {renderNavigationItem(
                () => {
                  navigation.navigate("CustomizeScreen", {
                    data: response,
                    type: biometryType,
                  });
                },
                <CustomizeImage />,
                "Customize"
              )}
              {renderNavigationItem(
                () => {
                  navigation.navigate("EditProfile");
                },
                <Identity />,
                "Profile"
              )}
              {renderNavigationItem(() => null, null, null)}
              {renderNavigationItem(() => null, null, null)}
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Digital Amount</Text>
            </View>
            <View style={styles.settingsOptionstwo}>
              {renderNavigationItem(
                () => {
                  navigation.navigate("WalletScreen");
                },
                <Wallet />,
                "Wallet"
              )}

              {renderNavigationItem(
                () => {
                  navigation.navigate("Referral");
                },
                <Referral />,
                "Referral"
              )}

              {renderNavigationItem(
                () => {
                  navigation.navigate("BeneficiaryListScreen");
                },
                <Beneficiary />,
                "Beneficiary"
              )}

              {renderNavigationItem(
                () => {
                  navigation.navigate("BankCardDetailsScreen");
                },
                <Payments />,
                "Payments"
              )}
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Verification</Text>
            </View>

            <View style={styles.settingsOptionstwo}>
              {renderNavigationItem(
                () => {
                  navigation.navigate("UploadAllDocumentScreen");
                },
                <Document />,
                "Document"
              )}

              {renderNavigationItem(
                () =>
                  showTextPopup(
                    "Identity",
                    "Your identity has been successfully verified"
                  ),
                <Identity />,
                "Identity"
              )}

              {renderNavigationItem(
                () => bottomSheetRefCredit?.current?.open(),
                <Credit />,
                "Credit"
              )}
              {renderNavigationItem(() => null, null, null)}
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Support</Text>
            </View>
            <View
              style={[
                styles.settingsOptionstwo,
                { marginBottom: ratioHeightBasedOniPhoneX(0) },
              ]}
            >
              {renderNavigationItem(
                () => {
                  navigation.navigate("TicketScreen");
                },
                <Ticket />,
                "Ticket"
              )}
              {renderNavigationItem(
                () => {
                  navigation.navigate("FaqScreen");
                },
                <Faq />,
                "Faq"
              )}
              {renderNavigationItem(() => null, <Contact />, "Contact")}
              {renderNavigationItem(() => {}, <About />, "About")}
            </View>

            <View
              style={[
                styles.settingsOptionstwo,
                { marginBottom: ratioHeightBasedOniPhoneX(0) },
              ]}
            >
              {renderNavigationItem(
                () => {
                  navigation.navigate("Tutorials");
                },
                showImage && <Tutorial />,
                "Tutorial"
              )}
              {renderNavigationItem(
                () => null,
                <Terms />,
                "Terms &\nCondition"
              )}
              {renderNavigationItem(() => null, null, null)}
              {renderNavigationItem(() => null, null, null)}
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Mode</Text>
            </View>
            <View style={styles.settingsOptionstwo}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={styles.cardTwo}
                  onPress={() => {
                    setThemePreference("dark");
                  }}
                >
                  <Image
                    source={
                      theme === "dark"
                        ? require("../assets/images/dark_active.png")
                        : require("../assets/images/dark_inactive.png")
                    }
                    style={styles.iconDark}
                  />
                  <Text style={styles.circletext}>Dark</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={styles.cardTwo}
                  onPress={() => {
                    setThemePreference("light");
                  }}
                >
                  <Image
                    source={
                      theme === "light"
                        ? require("../assets/images/more/light_active.png")
                        : require("../assets/images/light_inactive.png")
                    }
                    style={styles.iconDark}
                  />
                  <Text style={styles.circletext}>Light</Text>
                </TouchableOpacity>
              </View>
              {renderNavigationItem(() => null, null, null)}
              {renderNavigationItem(() => null, null, null)}
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Logout</Text>
            </View>
            <View style={[styles.settingsOptionstwo]}>
              {renderNavigationItem(
                () => {
                  showAlert();
                },
                <PowerIcon />,
                "Logout"
              )}
              {renderNavigationItem(() => null, null, null)}
              {renderNavigationItem(() => null, null, null)}
              {renderNavigationItem(() => null, null, null)}
            </View>
          </View>
        </ScrollView>
      </Loader>

      <LogoutPopupMessage
        isVisible={isAlertVisible}
        message="Are you sure you want to Logout?"
        onClose={hideAlert}
        onConfirm={handleLogoutButtonPress}
        tag={2}
      />
      <BottomSheet
        ref={bottomSheetRef}
        closeOnDragDown
        dragFromTopOnly
        customStyles={{
          draggableIcon: { backgroundColor: "transparent" },
          container: {
            backgroundColor:
              theme === "light" ? colored.headerColor : colored.darkheaderColor,
            height: "auto",
            borderTopColor:
              theme == "dark" ? colored.shadowColor : "transparent",
            borderTopWidth:
              theme == "dark" ? ratioHeightBasedOniPhoneX(1.5) : 0,
          },
        }}
      >
        {renderBottomSheetContent(
          password,
          setPassword,
          setPasswordError,
          passwordError,
          bottomSheetRef
        )}
      </BottomSheet>
      <CreditSheetContent
        onClose={() => {
          fetchData();
          bottomSheetRefCredit?.current?.close();
        }}
        bottomSheetRef={bottomSheetRefCredit}
        setLoading={(loading: boolean | ((prevState: boolean) => boolean)) => {
          setLoading(loading);
        }}
        setLoadingFalse={() => {
          setLoading(false);
        }}
        popupmessage={(text: string) => {
          showTextPopup("", text);
        }}
      />
      <ShowAlertMessage
        isVisible={popupVisible}
        title={popupTitle}
        message={popupMessage}
        isRegularAlert={isRegularAlert}
        onClose={() => setPopupVisible(false)}
      />
      <ChangePasswordAlertView
        firstButtonText={"Cancel"}
        secondButtonText={"Proceed"}
        firstButtonHide={false}
        isVisible={isChangePopupVisible}
        message={changePopupMessage}
        onClose={() => setIsChangePopupVisible(false)}
        onOpen={ProceedButtonPress}
        onLinkPress={false}
      />
    </View>
  );
};

export default More;
