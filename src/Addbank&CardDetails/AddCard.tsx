import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Text,
  ImageBackground,
} from "react-native";
import {
  CardField,
  CardFormView,
  confirmSetupIntent,
} from "@stripe/stripe-react-native";
import MainHeaderView from "../MainHeaderView";
import colors, { dark, light } from "../colors";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import { useNavigation } from "@react-navigation/native";
import Loader from "../Loader";
import strings from "../Extension/strings";
import ShowAlertMessage from "../Popup/showAlertMessage";
import { TextInput } from "react-native-paper";
import Chip from "../assets/images/Chip.svg";
import { PaymentIcon } from "react-native-payment-icons";
import { AddCardResponseModel } from "./Model/AddCardResponseModel";
import EmptyCard from "../assets/images/Mastercard.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoIcon from "../assets/images/fluent_info-12-filled.svg";

const AddCard = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [inputDisabled, setInputDisabled] = useState(false);
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardHolderNameError, setCardHolderNameError] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardField, setCardField] = useState(false);
  const [addCardDetails, setAddCardDetails] =
    useState<AddCardResponseModel | null>(null);

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const handlePayPress = async () => {
    if (cardHolderNameError === "" && cardHolderName != "") {
      setInputDisabled(true);
      try {
        setLoading(true);
        const clientSecret = await createSetupLater("card");
        const billingDetails = {
          name: cardHolderName,
        };
        const { error, setupIntent } = await confirmSetupIntent(clientSecret, {
          paymentMethodType: "Card",
          paymentMethodData: { billingDetails },
        });

        if (error) {
          showTextPopup(strings.error, error.message);
        } else if (setupIntent) {
          Alert.alert("Success", `Your Card Has Been Added Successfully`, [
            {
              text: "OK",
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
        }
      } catch (error) {
        showTextPopup(strings.error, error.message);
      } finally {
        setInputDisabled(false);
        setLoading(false);
      }
    } else {
      validateCardHolderName(cardHolderName);
    }
  };

  const createSetupLater = async (
    paymentMethodType: string
  ): Promise<string> => {
    try {
      return new Promise((resolve, reject) => {
        serverCommunication.postApi(
          `${URLConstants.createSetupIntent}${paymentMethodType}`,
          null,
          (statusCode: number, responseData: any, error: any) => {
            if (!error) {
              resolve(responseData.data.client_Secret);
            } else {
              reject(error.message);
            }
          }
        );
      });
    } catch (error) {
      return showTextPopup(strings.error, strings.defaultError);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    mainContainer: {
      paddingHorizontal: ratioHeightBasedOniPhoneX(20),
    },
    addCardText: {
      color: theme === "light" ? colors.black : colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },

    rowView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardContainer: {
      padding: ratioHeightBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(10),
      marginBottom: ratioHeightBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(195),
      width: ratioWidthBasedOniPhoneX(335),
      borderRadius: ratioHeightBasedOniPhoneX(10),
      overflow: "hidden",
      borderColor: colors.white,
      backgroundColor: colors.orange,
    },
    CardNumberText: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(24)),
      color: colors.black,
      marginTop: ratioHeightBasedOniPhoneX(37),
    },
    columnView: {
      flexDirection: "column",
      justifyContent: "flex-start",
    },
    cardNameText: {
      color: colors.black,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(10)),
    },
    cardText: {
      color: colors.black,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(18)),
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
      flexDirection: "row",
      justifyContent: "space-between",
      gap: ratioHeightBasedOniPhoneX(9),
      alignItems: "center",
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(62),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    button: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    buttonText: {
      color: colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    cardFieldContainer: {
      borderRadius: ratioHeightBasedOniPhoneX(4),
      borderColor: cardField ? colors.orange : colors.inactivegrey,
      borderWidth: ratioWidthBasedOniPhoneX(1),
      paddingVertical: ratioWidthBasedOniPhoneX(4),
      paddingHorizontal: ratioWidthBasedOniPhoneX(8),
    },
    cardField: {
      height: ratioHeightBasedOniPhoneX(32),
      borderRadius: ratioHeightBasedOniPhoneX(4),
      borderColor: colors.white,
      borderWidth: ratioWidthBasedOniPhoneX(1),
      backgroundColor: colors.white,
    },
    cardInfoText: {
      marginTop: ratioHeightBasedOniPhoneX(15),
      color: colors.lightgrey,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      marginBottom: ratioHeightBasedOniPhoneX(7),
    },
    input: {
      backgroundColor: theme === "light" ? colors.white : colors.black,
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
    errorText: {
      color: "red",
      textAlign: "left",
      fontSize: ratioHeightBasedOniPhoneX(12),
      fontFamily: "Inter-Medium",
      paddingVertical: ratioHeightBasedOniPhoneX(4),
    },
  });

  const inputStyles: CardFormView.Styles = {
    textColor: theme === "light" ? colored.textColor : colors.black,
    borderColor: cardField ? colors.orange : colors.inactivegrey,
    borderRadius: ratioWidthBasedOniPhoneX(8),
    borderWidth:
      theme === "light"
        ? ratioWidthBasedOniPhoneX(0)
        : ratioWidthBasedOniPhoneX(1),
    cursorColor: "#000000",
    ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    placeholderColor: colors.gray44,
    textErrorColor: "#ff0000",
  };

  const validateCardHolderName = (text: string) => {
    setCardHolderName(text);
    if (!text) {
      setCardHolderNameError("CardHolderName is required");
    } else {
      setCardHolderNameError("");
    }
  };

  let modifiedValue =
    (addCardDetails?.brand ?? "").charAt(0).toLowerCase() +
    (addCardDetails?.brand ?? "").slice(1);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title={"Add Card"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={styles.mainContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: ratioHeightBasedOniPhoneX(10),
          }}
        >
          <Text style={styles.addCardText}>Card</Text>
          <InfoIcon
            style={{
              marginLeft: ratioWidthBasedOniPhoneX(4),
            }}
          />
        </View>
        <ImageBackground
          source={require("../assets/images/CreditCard.png")}
          style={[styles.cardContainer]}
        >
          <View style={styles.rowView}>
            <Chip />
            {modifiedValue == "" || modifiedValue == "unknown" ? (
              <EmptyCard />
            ) : (
              <PaymentIcon type={modifiedValue} width={40} height={40} />
            )}
          </View>
          <Text style={styles.CardNumberText}>
            **** **** **** {addCardDetails?.last4}
          </Text>
          <View
            style={[
              styles.rowView,
              { marginTop: ratioHeightBasedOniPhoneX(15) },
            ]}
          >
            <View style={styles.columnView}>
              <Text style={styles.cardNameText}>Cardholder Name</Text>
              <Text style={styles.cardText}>
                {cardHolderName == "" ? "XXXXXX" : cardHolderName}
              </Text>
            </View>
            <View style={styles.columnView}>
              <Text style={styles.cardNameText}>Expiry Date</Text>
              <Text
                style={{
                  color: colors.black,
                  ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(18)),
                }}
              >
                {addCardDetails?.expiryMonth === undefined ||
                addCardDetails?.expiryYear === undefined
                  ? "0/0"
                  : `${addCardDetails.expiryMonth}/${addCardDetails.expiryYear}`}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <TextInput
          label="Card Holder Name"
          mode="outlined"
          value={cardHolderName}
          onChangeText={validateCardHolderName}
          underlineColor={colors.black}
          keyboardType="email-address"
          activeUnderlineColor={colors.black}
          style={styles.input}
          selectionColor={colors.black}
          maxLength={20}
          outlineColor={colors.inactivegrey}
          outlineStyle={styles.outlineStyle}
          textColor={theme === "light" ? colors.black : colors.white}
          cursorColor={theme === "light" ? colors.black : colors.white}
          activeOutlineColor={colors.lightGreen}
        />
        {cardHolderNameError ? (
          <Text style={styles.errorText}>{cardHolderNameError}</Text>
        ) : null}
        <Text style={styles.cardInfoText}>Card Info</Text>
        <View style={styles.cardFieldContainer}>
          <CardField
            postalCodeEnabled={false}
            autofocus
            placeholders={{
              number: "1234 1234 1234 1234",
              postalCode: "12345",
              cvc: "CVC",
              expiration: "MM|YY",
            }}
            onCardChange={(cardDetails) => {
              setAddCardDetails(cardDetails);
            }}
            cardStyle={inputStyles}
            style={styles.cardField}
            onBlur={() => setCardField(false)}
            onFocus={() => setCardField(true)}
          />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.orange }]}
          onPress={handlePayPress}
        >
          <Text style={styles.buttonText}>Add Card</Text>
        </TouchableOpacity>
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

export default AddCard;
