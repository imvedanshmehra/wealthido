import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import Loader from "../Loader";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";
import ShowAlertMessage from "../Popup/showAlertMessage";
import CustomDropdown from "./CustomDropdown";
import BottomButtonsView from "../BottomButtonsView";
import { InvestorAuthRequest } from "./InvestorAuthRequest";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { getUserInfo } from "../ChitFundScreen/ChitFundController";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import { createInquiry } from "../More/inquiry";
import renderTextInput from "./RenderTextInput";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";

const InvestorProfile = ({ navigation, route }) => {
  const { onGoBack } = route.params;
  const [isFocus, setIsFocus] = useState(false);
  const [isFocuson, setIsFocuson] = useState(false);
  const [IncomeSource, setIncomeSource] = useState("");
  const [errorIncomeSource, setErrorIncomeSource] = useState("");
  const [address1, setAddress1] = useState("");
  const [errorAddress1, setErrorAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [errorAddress2, setErrorAddress2] = useState("");
  const [country, setCountry] = useState("");
  const [errorCountry, setErrorCountry] = useState("");
  const [yearlyIncome, setYearlyIncome] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [IncomeError, setIncomeError] = useState("");
  const [noOfDependents, setNoOfDependents] = useState("");
  const [dependentsError, setDependentError] = useState("");
  const [state, setState] = useState("");
  const [errorState, setErrorState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [zipcodeError, setZipcodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [isPopupVisible, setPopupVisible] = useState(false);

  const [getUserDetails, setUserDetails] = useState<LoginResponseModel | null>(
    null
  );
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [selectedEmploymentValue, setEmploymentSelectedValue] = useState({
    label: "Employed",
    value: "Employed",
  });
  const [selectedMartialStatus, setSelectedMartialStatus] = useState({
    label: "Yes",
    value: "YES",
  });

  const data = [
    { label: "Employed", value: "Employed" },
    { label: "Unemployed", value: "Unemployed" },
    { label: "Selfemployed", value: "Self employed" },
    { label: "Student", value: "Student" },
  ];

  const options = [
    { label: "Yes", value: "YES" },
    { label: "No", value: "NO" },
  ];

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const validateInput = (
    text: string,
    errorState: React.Dispatch<React.SetStateAction<string>>,
    errorMessage: string,
    input: string
  ) => {
    if (!text.trim()) {
      errorState(errorMessage);
    } else if (!/^\d+$/.test(text.trim())) {
      errorState("Enter with only numbers");
    } else if (text.length < 5 && input == "Zipcode") {
      errorState("Enter 5 digits only");
    } else if (!/^[0-5]+$/.test(text.trim()) && input === "Depent") {
      errorState("Enter numbers between 0 to 5 only");
    } else if (
      (!/^\d+$/.test(text.trim()) ||
        +text.trim() < 1000 ||
        +text.trim() > 1000000) &&
      input === "yearly_income"
    ) {
      errorState("Enter a number between 1000 to 1000000 only");
    } else {
      errorState("");
    }
    return text;
  };

  const validateInput2 = (
    text: string,
    errorState: React.Dispatch<React.SetStateAction<string>>,
    errorMessage: string,
    input: string
  ) => {
    if (!text.trim()) {
      errorState(errorMessage);
    } else if ((text.length < 3 || text.length > 100) && input === "Address1") {
      errorState("The address1 must be 3-100 characters");
    } else if (text.length > 100 && input === "Address2") {
      errorState("The address2 must be 100 characters only");
    } else if ((text.length < 3 || text.length > 50) && input === "Country") {
      errorState("The country must be 3-50 characters");
    } else if ((text.length < 3 || text.length > 50) && input === "State") {
      errorState("The state must be 3-50 characters");
    } else {
      errorState("");
    }
    return text;
  };

  const validateIncomeSource = (text: string): void => {
    setIncomeSource(text);
    if (!text) {
      setErrorIncomeSource("Income Source is required");
    } else if (text.length < 3 || text.length > 75) {
      setErrorIncomeSource("The Income Source must be 3-75 characters");
    } else {
      setErrorIncomeSource("");
    }
  };

  const validateAddress1 = (text: string) => {
    setAddress1(
      validateInput2(text, setErrorAddress1, "Address1 is required", "Address1")
    );
  };

  const validateAddress2 = (text: string) => {
    setAddress2(
      validateInput2(text, setErrorAddress2, "Address2 is required", "Address2")
    );
  };

  const validateZipcode = (text: string) => {
    setZipcode(
      validateInput(text, setZipcodeError, "Postal Code is required", "Zipcode")
    );
  };

  const validateState = (text: string) => {
    setState(validateInput2(text, setErrorState, "State is required", "State"));
  };

  const validateYearlyIncome = (text: string) => {
    setYearlyIncome(
      validateInput(
        text,
        setIncomeError,
        "Year Income is required",
        "yearly_income"
      )
    );
  };

  const validateNoOFDependents = (text: string) => {
    setNoOfDependents(
      validateInput(
        text,
        setDependentError,
        "Dependents are required",
        "Depent"
      )
    );
  };

  useEffect(() => {
    if (isFocused) {
      getUserInfo((userData) => {
        setUserDetails(userData);
      });
    }
  }, [isFocused]);

  const validateCountry = (text: string) => {
    setCountry(
      validateInput2(text, setErrorCountry, "Country is required", "Country")
    );
  };

  const validateCity = (text: string) => {
    setCity(text);
    if (text === "") {
      setCityError("City is required");
    } else {
      setCityError("");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    countContainer: {
      flexDirection: "row",
      gap: ratioHeightBasedOniPhoneX(12),
    },
    subContainer: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      paddingBottom: ratioHeightBasedOniPhoneX(20),
    },
    personalInfoText: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      color: theme === "light" ? colors.lightblack : colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
      marginBottom: ratioHeightBasedOniPhoneX(9),
    },
    errorText: {
      color: "red",
      textAlign: "left",
      fontSize: ratioHeightBasedOniPhoneX(12),
      fontFamily: "Inter-Medium",
    },
    addressInfoText: {
      marginTop: ratioHeightBasedOniPhoneX(20),
      color: theme === "light" ? colors.lightblack : colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
      marginBottom: ratioHeightBasedOniPhoneX(9),
    },
    buttonAndroid: {
      backgroundColor: colors.green,
      width: "auto",
      height: ratioHeightBasedOniPhoneX(48),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginTop: Platform.OS == "ios" ? "auto" : ratioHeightBasedOniPhoneX(90),
      marginBottom: ratioHeightBasedOniPhoneX(10),
    },
    buttonText: {
      color: colors.white,
      fontFamily: "Inter-Bold",
      fontSize: ratioHeightBasedOniPhoneX(16),
    },
    dropdown: {
      height: ratioHeightBasedOniPhoneX(48),
      borderColor: colors.inactivegrey,
      backgroundColor: colored.headerColor,
      padding: 0,
      marginTop: ratioHeightBasedOniPhoneX(24),
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
    },

    selectedTextStyle: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
      color: colored.textColor,
      marginHorizontal: ratioWidthBasedOniPhoneX(15),
    },

    dropDowncontainer: {
      marginTop: ratioHeightBasedOniPhoneX(15),
      backgroundColor: colored.background,
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
    cancelbutton: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(50),
      backgroundColor: colored.buttonGray,
      width: "auto",
      flex: 0.37,
      marginRight: ratioWidthBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },

    Cancelbutton: {
      flex: 1,
      height: ratioHeightBasedOniPhoneX(48),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      backgroundColor: colors.buttonGray,
      marginHorizontal: ratioHeightBasedOniPhoneX(16),
    },
    confirmbutton: {
      flex: 1,
      backgroundColor: colors.orange,
      height: ratioHeightBasedOniPhoneX(48),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginHorizontal: ratioHeightBasedOniPhoneX(16),
    },
    cancelText: {
      color: colors.black,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    confirmText: {
      color: colors.white,
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
  });

  const handleCancelPress = () => {
    navigation.goBack();
  };

  const startInvest = async () => {
    setLoading(true);
    const InvestorRequest = new InvestorAuthRequest(
      selectedEmploymentValue.value,
      selectedMartialStatus.value,
      yearlyIncome.trim(),
      noOfDependents.trim(),
      IncomeSource.trim(),
      address1.trim(),
      country.trim(),
      state.trim(),
      zipcode.trim(),
      address2.trim()
    );
    try {
      await serverCommunication.postApi(
        URLConstants.investorProfile,
        InvestorRequest,
        (statusCode: number, responseData: any, error: any) => {
          if (!error) {
            if (statusCode == HTTPStatusCode.ok) {
              createInquiry({
                onPressIn: async () => {
                  setLoading(false);
                  if (typeof onGoBack === "function") {
                    onGoBack();
                  }
                },
                inquiryId: getUserDetails?.data?.personaInquiryId,
                sessionToken: getUserDetails?.data?.personaSessionId,
              });
              navigation.goBack();
            }
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

  const handleSubmitPress = () => {
    if (
      yearlyIncome !== "" &&
      IncomeError == "" &&
      dependentsError == "" &&
      noOfDependents !== "" &&
      IncomeSource !== "" &&
      errorIncomeSource == "" &&
      address1 !== "" &&
      errorAddress1 == "" &&
      country !== "" &&
      errorCountry == "" &&
      state != "" &&
      errorState == "" &&
      zipcode !== "" &&
      zipcodeError == "" &&
      cityError == "" &&
      city !== ""
    ) {
      startInvest();
    } else {
      validateYearlyIncome(yearlyIncome);
      validateNoOFDependents(noOfDependents);
      validateIncomeSource(IncomeSource);
      validateAddress1(address1);
      validateCountry(country);
      validateState(state);
      validateZipcode(zipcode);
      validateCity(city);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <MainHeaderView
        title={"Investor Profile"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : ""}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ marginTop: ratioHeightBasedOniPhoneX(3) }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.subContainer}>
            <Text style={styles.personalInfoText}>Personal Info</Text>

            <CustomDropdown
              titleText="Employment status"
              categoryData={data}
              value={selectedEmploymentValue.value}
              onFocus={() => {
                setIsFocuson(true);
              }}
              onBlur={() => {
                setIsFocuson(false);
              }}
              onChangeText={(item: any) => {
                setIsFocuson(false);
                setEmploymentSelectedValue(item);
              }}
              isFocus={isFocuson}
              isDisabled={false}
            />
            <CustomDropdown
              titleText="Marital Status"
              categoryData={options}
              value={selectedMartialStatus.value}
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => {
                setIsFocus(false);
              }}
              onChangeText={(item: any) => {
                setIsFocus(false);
                setSelectedMartialStatus(item);
              }}
              isFocus={isFocus}
              isDisabled={false}
            />

            <View style={styles.countContainer}>
              <View style={{ flex: 1 }}>
                {renderTextInput(
                  "Yearly Income",
                  yearlyIncome,
                  validateYearlyIncome,
                  IncomeError,
                  "phone-pad",
                  undefined,
                  true
                )}
                {IncomeError ? (
                  <Text style={styles.errorText}>{IncomeError}</Text>
                ) : null}
              </View>
              <View style={{ flex: 1 }}>
                {renderTextInput(
                  "No.of dependents",
                  noOfDependents,
                  validateNoOFDependents,
                  dependentsError,
                  "phone-pad",
                  undefined,
                  true
                )}
                {dependentsError ? (
                  <Text style={styles.errorText}>{dependentsError}</Text>
                ) : null}
              </View>
            </View>

            {renderTextInput(
              "Source of Income",
              IncomeSource,
              validateIncomeSource,
              errorIncomeSource,
              "default",
              undefined,
              true
            )}
            {errorIncomeSource ? (
              <Text style={styles.errorText}>{errorIncomeSource}</Text>
            ) : null}
            <Text style={styles.addressInfoText}>Address Info</Text>
            {renderTextInput(
              "Address 1",
              address1,
              validateAddress1,
              errorAddress1,
              "default",
              undefined,
              true
            )}
            {errorAddress1 ? (
              <Text style={styles.errorText}>{errorAddress1}</Text>
            ) : null}

            {renderTextInput(
              "Address 2(Optional)",
              address2,
              validateAddress2,
              errorAddress2,
              "default",
              undefined,
              true
            )}
            {errorAddress2 ? (
              <Text style={styles.errorText}>{errorAddress2}</Text>
            ) : null}

            {renderTextInput(
              "Country",
              country,
              validateCountry,
              errorCountry,
              "default",
              undefined,
              true
            )}
            {errorCountry ? (
              <Text style={styles.errorText}>{errorCountry}</Text>
            ) : null}

            {renderTextInput(
              "City",
              city,
              validateCity,
              cityError,
              "default",
              undefined,
              true
            )}
            {cityError ? (
              <Text style={styles.errorText}>{cityError}</Text>
            ) : null}

            {renderTextInput(
              "State",
              state,
              validateState,
              errorState,
              "default",
              undefined,
              true
            )}
            {errorState ? (
              <Text style={styles.errorText}>{errorState}</Text>
            ) : null}

            {renderTextInput(
              "Postal Code",
              zipcode.toString(),
              validateZipcode,
              zipcodeError,
              "numeric",
              5,
              true
            )}
            {zipcodeError ? (
              <Text style={styles.errorText}>{zipcodeError}</Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomButtonsView
        firstText="Back"
        secondText="Submit"
        onPressSuccess={handleSubmitPress}
        onPressBack={handleCancelPress}
      />
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
      <Loader loading={loading} children={undefined} />
    </SafeAreaView>
  );
};

export default InvestorProfile;
