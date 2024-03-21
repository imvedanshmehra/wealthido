import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { ThemeContext } from "../Networking/themeContext";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import {
  GetSubscriptionPlanResponseModel,
  GetSubscriptionPlanResponseModelDatum,
} from "./Model.tsx/GetSubscriptionPlanResponseModel";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { Subscription } from "../SubScriptionplan/Model/SubScriptionPlanResponseModel";
import validation from "../RegisterScreen/validation";
import { TextInput } from "react-native-paper";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import GoldSubscrptionImage from "../assets/images/GoldSubscriptionImage.svg";
import ShowAlertMessage from "../Popup/showAlertMessage";
import Loader from "../Loader";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import strings from "../Extension/strings";
import MainHeaderView from "../MainHeaderView";
import DatePicker from "../Extension/DateTimePicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateFormatType, DobDate } from "../Extension/DateFormatType";
import { addDays } from "date-fns";

interface SubscriptionPlanDetailParams {
  data: Subscription;
}

// Renders a subscription plan detail screen and handles user interactions such as selecting a plan, entering an amount, and confirming the subscription.
const SubscriptionPlanDetail = () => {
  const navigation: NavigationProp<any> = useNavigation();
  const route = useRoute();
  const { data } = route.params as SubscriptionPlanDetailParams;
  const { theme } = useContext(ThemeContext);
  const isFocused = useIsFocused();
  const [subscriptionData, setGetSubscription] =
    useState<GetSubscriptionPlanResponseModel | null>(null);
  const colored = theme === "dark" ? dark : light;
  const [activeButton, setActiveButton] = useState<String | null>(
    data?.plan ?? null
  );
  const [AmountError, setAmountError] = useState("");
  const [amount, setAmount] = useState<string>(data?.amount?.toString() ?? "");
  const subscriptionPlan = subscriptionData?.data?.filter(
    (item) => item.plan === activeButton
  );

  const handleButtonClick = async (option: String) => {
    setActiveButton(option);
    setSubscrptionError("");
    setAmountError(validateAmountSub(amount, option));
  };
  const previousDate = DobDate(
    data?.startDate.toString(),
    DateFormatType.birthDateFormatThree
  );
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateError, setDateError] = useState("");
  const [isDatedPickerVisible, setDatedPickerVisibility] = useState(false);
  const [customDate, setCustomDate] = useState(previousDate ?? "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [subscriptionError, setSubscrptionError] = useState("");
  let subscriPtionKey: any;

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const validateDate = (text: string) => {
    if (!text) {
      setDateError("DOB is required");
    } else {
      setDateError("");
    }
  };

  const showDatedPicker = () => {
    setDatedPickerVisibility(true);
  };

  const hideDatedPicker = () => {
    setDatedPickerVisibility(false);
  };

  // Handle date and time confirmation
  const handleConfirm = (date: any) => {
    if (date) {
      setSelectedDate(date);
      setCustomDate(
        DobDate(date.toString(), DateFormatType.birthDateFormatThree)
      );
      validateDate(date);
    }
    hideDatedPicker();
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

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const handleDropDownPress = () => {
    if (Platform.OS == "android") {
      showDatedPicker();
    } else {
      handleOpenDatePicker;
    }
  };

  const validateAmountSub = (text: string, plan: any) => {
    const subscriptionPlan = subscriptionData?.data?.filter(
      (item) => item.plan === plan
    );
    const stringWithoutDollar = text.replace("$", "");
    if (text === "") {
      return "Amount is required";
    } else if (
      subscriptionPlan &&
      subscriptionPlan.length > 0 &&
      stringWithoutDollar < subscriptionPlan[0].minimumSubscription
    ) {
      return `Enter Amount minimum is ${subscriptionPlan[0].minimumSubscription}`;
    } else if (
      subscriptionPlan &&
      subscriptionPlan.length > 0 &&
      subscriptionPlan[0].maximumSubscription < stringWithoutDollar
    ) {
      return `Enter Amount maximum is ${subscriptionPlan[0].maximumSubscription}`;
    } else {
      return "";
    }
  };

  const enterAmountValidation = (text: string) => {
    if (/^\$?\d*\.?\d*$/.test(text)) {
      setAmount(text);
    }
    setAmountError(validateAmountSub(text, activeButton));
  };

  useEffect(() => {
    if (isFocused) {
      const getSubscriptionPlan = async () => {
        try {
          await serverCommunication.getApi(
            URLConstants.subscriptionPlan,
            (statusCode: any, responseData: any, error: any) => {
              if (!error) {
                setGetSubscription(responseData);
              } else {
              }
            }
          );
        } catch (error) {}
      };
      getSubscriptionPlan();
    }
  }, [isFocused]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    headerContainer: {
      marginTop: ratioHeightBasedOniPhoneX(8),
      flexDirection: "row",
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
      alignItems: "center",
    },
    backButtonImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      tintColor: colored.textColor,
    },
    centeredHeaderContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: {
      paddingLeft: ratioWidthBasedOniPhoneX(5),
      color: colors.black,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    image: {
      height: ratioHeightBasedOniPhoneX(47),
      width: ratioHeightBasedOniPhoneX(47),
      borderRadius: ratioHeightBasedOniPhoneX(32),
    },
    subscriptionPlanText: {
      marginTop: ratioHeightBasedOniPhoneX(6),
      textAlign: "center",
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    mainContainer: {
      flex: 1,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    amountPrefix: {
      marginTop: 12,
      color: theme === "dark" ? colors.white : colors.black,
    },
    textsub: {
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
      marginTop: ratioHeightBasedOniPhoneX(6),
      color: colored.textColor,
    },
    frequencyText: {
      marginTop: ratioHeightBasedOniPhoneX(15),
      marginBottom: ratioHeightBasedOniPhoneX(10),
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    noteText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },
    subTitleText: {
      color: theme == "light" ? colored.lightText : "#ABADB3",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },

    EnterAmountText: {
      marginTop: ratioHeightBasedOniPhoneX(27),
      color: colored.lightText,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },
    input: {
      backgroundColor: colored.headerColor,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colors.black,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    textInput: {
      textAlign: "left",
      backgroundColor: theme === "light" ? colors.white : colored.headerColor,
      paddingHorizontal: ratioHeightBasedOniPhoneX(2),
      height: ratioHeightBasedOniPhoneX(40),
      includeFontPadding: false,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    errorText: {
      color: colors.mainlyRED,
      textAlign: "left",
      paddingTop: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    button: {
      flex: 1,
      backgroundColor: colored.chitDetailContainer,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: ratioWidthBasedOniPhoneX(24),
      height: ratioHeightBasedOniPhoneX(36),
      marginRight: ratioWidthBasedOniPhoneX(10),
      borderWidth: ratioHeightBasedOniPhoneX(1),
      borderColor: colored.tabBarBorder,
      textAlign: "center",
    },
    buttonText: {
      color: colored.textColor,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    buttonContainer: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 8,
          shadowColor: colors.black,
        },
      }),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "auto",
      height: ratioHeightBasedOniPhoneX(62),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      gap: ratioWidthBasedOniPhoneX(9),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
    },
    Pausebutton: {
      flex: 1,
      height: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(20),
    },
    confirmbutton: {
      flex: 1,
      backgroundColor: colored.goldButton,
      height: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(20),
    },
    PausebuttonText: {
      color: colored.textColor,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    confirmButtonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    buttonActive: {
      backgroundColor: colored.goldButton,
    },
    buttonTextActive: {
      color: "#fff",
    },
    placeholdertext: {
      color: colored.lightblack,
    },
  });

  const renderItem = (item: GetSubscriptionPlanResponseModelDatum) => (
    <TouchableOpacity
      style={[
        styles.button,
        activeButton === item.plan ? styles.buttonActive : null,
      ]}
      onPress={() => handleButtonClick(item.plan)}
    >
      <Text
        style={[
          styles.buttonText,
          activeButton === item.plan ? styles.buttonTextActive : null,
        ]}
      >
        {item.plan == "DAILY"
          ? "Daily"
          : item.plan == "WEEKLY"
          ? "Weekly"
          : "Monthly"}
      </Text>
    </TouchableOpacity>
  );

  const userSubscriptionCreate = async () => {
    const dollorRemove = amount.replace("$", "");
    const amountError = validation.validateAmountSub(amount);
    if (activeButton !== null && amount != "" && amountError == "") {
      // Check if activeButton is not null
      const amountAsNumber = parseFloat(dollorRemove);
      navigation.navigate("GoldPaymentMethodScreen", {
        type: "Card",
        amount: amountAsNumber,
        startDate: selectedDate ? selectedDate : tomorrow,
        planType: activeButton,
        subscriptionID: subscriptionPlan[0].id,
        subscriptedDataID: data?.id,
        subscriPtionKey: "Plan",
        onGoBack: undefined,
      });
    } else {
      setSubscrptionError("Please select a subscription plan");
      setAmountError(amountError);
    }
  };

  const cancelSubscription = async () => {
    try {
      await serverCommunication.getApi(
        `${URLConstants.cancelSubscription}${subscriPtionKey}`,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            if (statusCode === HTTPStatusCode.ok) {
              showTextPopup(strings.success, responseData?.message ?? "");
            }
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    }
  };

  const handleConfirmButton = () => {
    userSubscriptionCreate();
  };

  const tomorrow = addDays(new Date(), 1);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <MainHeaderView
        title={"Subscription Plan"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={styles.mainContainer}>
        <View style={{ marginTop: ratioHeightBasedOniPhoneX(10) }}>
          <View style={{ alignItems: "center" }}>
            <GoldSubscrptionImage />
          </View>
          <Text style={styles.textsub}>Subscription Plan</Text>
          <TextInput
            label="Enter amount"
            mode="outlined"
            value={amount}
            left={<TextInput.Affix text="$" textStyle={styles.amountPrefix} />}
            onChangeText={enterAmountValidation}
            underlineColor={colored.textColor}
            keyboardType="number-pad"
            returnKeyType={"done"}
            textColor={colored.textColor}
            activeUnderlineColor={AmountError ? "red" : colored.textColor}
            style={[styles.input, { marginTop: ratioHeightBasedOniPhoneX(10) }]}
            selectionColor={colored.textColor}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colors.orange}
          />
          {AmountError ? (
            <Text style={styles.errorText}>{AmountError}</Text>
          ) : null}

          <Text style={styles.frequencyText}>Frequency</Text>
          <FlatList
            data={subscriptionData?.data}
            keyExtractor={(item: any) => item.id?.toString()} // Use the 'id' property as the key
            renderItem={({ item }) => renderItem(item)} // Pass the item to your renderItem function
            scrollEnabled={false}
            horizontal
          />
          {subscriptionError ? (
            <Text style={styles.errorText}>{subscriptionError}</Text>
          ) : null}
          {activeButton === "MONTHLY" || activeButton === "WEEKLY" ? (
            <TouchableOpacity
              onPress={showDatedPicker}
              activeOpacity={1}
              style={{ marginTop: ratioHeightBasedOniPhoneX(8) }}
            >
              <TextInput
                label={
                  activeButton === "MONTHLY"
                    ? "Monthly"
                    : activeButton === "WEEKLY"
                    ? "Weekly"
                    : ""
                }
                mode="outlined"
                style={[
                  styles.textInput,
                  { marginTop: ratioHeightBasedOniPhoneX(10) },
                ]}
                placeholder={
                  activeButton === "MONTHLY"
                    ? "Monthly"
                    : activeButton === "WEEKLY"
                    ? "Weekly"
                    : ""
                }
                textColor={colored.textColor}
                cursorColor={colors.black}
                value={customDate} // Set the formatted date here
                outlineColor={colors.inactivegrey}
                outlineStyle={styles.outlineStyle}
                activeOutlineColor={colors.lightGreen}
                onTouchStart={handleOpenDatePicker}
                editable={false}
                right={
                  <TextInput.Icon
                    color={colors.tabText}
                    size={35}
                    style={{
                      paddingTop: ratioHeightBasedOniPhoneX(8),
                      marginRight: ratioWidthBasedOniPhoneX(-15),
                    }}
                    icon={"menu-down"}
                    onPress={handleDropDownPress}
                  />
                }
              />
            </TouchableOpacity>
          ) : null}

          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

          <Text style={{ marginTop: ratioHeightBasedOniPhoneX(10) }}>
            <Text style={styles.noteText}>Note:</Text>
            <Text style={styles.subTitleText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={[
            styles.Pausebutton,
            { backgroundColor: colored.cancelButtonBg },
          ]}
        >
          <Text style={[styles.PausebuttonText]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleConfirmButton}
          style={styles.confirmbutton}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS == "ios" ? (
        <DatePicker
          showDatePicker={showDatePicker}
          date={selectedDate}
          onClose={handleCloseDatePicker}
          onChange={handleDateChange}
          minimum={tomorrow}
        />
      ) : (
        <DateTimePickerModal
          isVisible={isDatedPickerVisible}
          mode="date"
          display="spinner"
          minimumDate={tomorrow}
          onConfirm={handleConfirm}
          onCancel={hideDatedPicker}
        />
      )}
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

export default SubscriptionPlanDetail;
