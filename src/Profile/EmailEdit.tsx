import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ratioWidthBasedOniPhoneX,
  ratioHeightBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";
import validation from "../RegisterScreen/validation";
import { Button, TextInput } from "react-native-paper";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import Loader from "../Loader";
import { countryCode } from "../enums";
import { formatUSPhoneNumber } from "../Utility";
import ShowAlertMessage from "../Popup/showAlertMessage";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";

export type RouteParams = {
  data: any;
  phoneNo: string;
};

const EmailEdit = () => {
  const navigation: any = useNavigation();
  const { theme } = useContext(ThemeContext);
  const route = useRoute();
  const { tag, phoneNumber } = route.params as {
    tag: any;
    phoneNumber: any;
  };
  const colored = theme === "dark" ? dark : light;
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusEmailORMobile, setFocusEmailORMobile] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.background,
    },
    subContainer: {
      flex: 1,
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    mainText: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    subText: {
      color: colored.lightText,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    input: {
      backgroundColor: colored.background,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(24),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    errorText: {
      color: "red",
      textAlign: "left",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
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
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      paddingVertical: ratioWidthBasedOniPhoneX(20),
      justifyContent: "center",
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    button: {
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

  const handleMobile = (text: any) => {
    setMobile(text);
    setMobileError(validation.validatePhoneNumber(text));
  };

  const handleEmail = (text: any) => {
    setEmail(text);
    setEmailError(validation.validateEmail(text));
  };

  const editPhoneNoValidate = async () => {
    setLoading(true);
    const data = {
      phoneNo: countryCode.Code + mobile,
    };
    try {
      await serverCommunication.postApi(
        URLConstants.editPhoneNo,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (responseData.status == HTTPStatusCode.ok) {
            navigation.navigate("VerificationCodeEmailEdit", {
              phoneNumber: countryCode.Code + mobile,
              tag: tag,
              blockTime: responseData.data.block_regenerate_time,
              second: responseData?.data?.second,
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

  const editEmailIdValidate = async () => {
    setLoading(true);
    const data = {
      email: email,
      phoneNo: phoneNumber,
    };
    try {
      await serverCommunication.postApi(
        URLConstants.emailPasswordVerify,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (responseData.status == HTTPStatusCode.ok) {
            navigation.navigate("VerificationCodeEmailEdit", {
              email: responseData?.data?.email,
              newEmail: email,
              isEmailVerified: responseData?.data?.isEmailVerified,
              blockTime: responseData?.data?.isEmailVerified
                ? responseData?.data?.emailAccountBlockTime
                : responseData?.data?.block_regenerate_time,
              phoneNumber: responseData?.data?.phone_no,
              tag: tag,
              second: responseData?.data?.second,
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

  const handleNext = () => {
    const phoneNoError = validation.validatePhoneNumber(mobile);
    const EmailError = validation.validateEmail(email);
    if (tag == 1) {
      if (mobile !== "" && mobileError === "") {
        editPhoneNoValidate();
      } else {
        setMobileError(phoneNoError);
      }
    } else {
      if (email !== "" && emailError == "") {
        editEmailIdValidate();
      } else {
        setEmailError(EmailError);
      }
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={tag == 1 ? "Edit Mobile Number" : "Edit Email"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={styles.subContainer}>
        <Text style={styles.mainText}>
          {tag == 1 ? "Mobile Number" : "Email"}
        </Text>
        <Text style={styles.subText}>
          Please enter your new {tag == 1 ? "Mobile number" : "Email Address"}
        </Text>

        <TextInput
          label={tag == 1 ? "Mobile Number" : "Email Address"}
          mode="outlined"
          value={tag == 1 ? formatUSPhoneNumber(mobile) : email}
          onChangeText={(text) => {
            tag == 1 ? handleMobile(text) : handleEmail(text);
          }}
          underlineColor={colored.textColor}
          textColor={colored.textColor}
          keyboardType={tag == 1 ? "phone-pad" : "email-address"}
          activeUnderlineColor={emailError ? "red" : colored.textColor}
          style={[styles.input]}
          selectionColor={colored.textColor}
          outlineColor={colors.inactivegrey}
          outlineStyle={styles.outlineStyle}
          maxLength={tag === 1 ? 14 : 500}
          activeOutlineColor={colors.lightGreen}
          returnKeyType={"done"}
          onFocus={() => setFocusEmailORMobile(true)}
          onBlur={() => setFocusEmailORMobile(false)}
        />
        {tag == 1 ? (
          mobileError ? (
            <Text style={styles.errorText}>{mobileError}</Text>
          ) : null
        ) : emailError ? (
          <Text style={styles.errorText}>{emailError}</Text>
        ) : null}
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={[styles.button]} onPress={handleNext}>
          <Text style={[styles.buttonText]}>Next</Text>
        </TouchableOpacity>
      </View>
      <Loader loading={loading} children={undefined} />
      <ShowAlertMessage
        isVisible={popupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};
export default EmailEdit;
