import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";
import MainHeaderView from "../MainHeaderView";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import Chip from "../assets/images/Chip.svg";
import { Divider, TextInput } from "react-native-paper";
import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { BankListData } from "./Model/BankListData";
import { CardListData } from "./Model/CardListData";
import { AddBankResponseModel } from "./Model/AddBankResponseModel";
import { PaymentIcon } from "react-native-payment-icons";
import Loader from "../Loader";
import {
  setDefault,
  verifyBankAccount,
} from "./Controller/AddCard&AddBankController";
import ShowAlertMessage from "../Popup/showAlertMessage";
import BottomSheet from "react-native-raw-bottom-sheet";
import Popover from "react-native-popover-view";
import BankImage from "../assets/images/BankImage.svg";
import BankVerifyImage from "../assets/images/greenCheckImage.svg";
import BankUnVerifyImage from "../assets/images/cancleIcon.svg";
import ThreeDotsImage from "../assets/images/threeDotsVertical.svg";
import VerifyImage from "../assets/images/Verify.svg";
import DeleteImage from "../assets/images/mdi_delete.svg";
import DefaultImage from "../assets/images/mdi_edit.svg";
import SettingIcon from "../assets/images/setting-icon.svg";
import Close from "../assets/images/Close.svg";
import RedCloseImage from "../assets/images/redCloseImage.svg";
import { VerifyBankAccountAuthRequestModel } from "./Model/VerifyBankAccountAuthRequestModel";
import AddbankCardDetails from "./Addbank&CardDetails";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoIcon from "../assets/images/fluent_info-12-filled.svg";

const BankCardDetails = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [cardResponse, setCardResponse] = useState<CardListData[] | null>(null);
  const [bankResponse, setBankResponse] = useState<BankListData[] | null>(null);
  const [amount1, setAmount1] = useState("");
  const [amount1Error, setAmount1Error] = useState("");
  const [amount2, setAmount2] = useState("");
  const [amount2Error, setAmount2Error] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [popOverVisible, setPopOverVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetValue, setBottomSheetValue] = useState(0);
  const openPopover = (item: any) => {
    setSelectedItem(item);
    setPopOverVisible(true);
  };

  const closePopover = () => {
    setSelectedItem(null);
    setPopOverVisible(false);
  };

  const validateAmount1 = (text: string) => {
    setAmount1(text);
    if (text === "") {
      setAmount1Error("Amount is required");
    } else {
      setAmount1Error("");
    }
  };

  const validateAmount2 = (text: string) => {
    setAmount2(text);
    if (text === "") {
      setAmount2Error("Amount is required");
    } else {
      setAmount2Error("");
    }
  };

  const renderMenu = (data: any, card?: number) => (
    <View style={[styles.menuContainer]}>
      {(data.status || card == 1) && (
        <TouchableOpacity
          style={styles.popupView}
          onPress={() => {
            if (selectedItem !== null) {
              setPopOverVisible(false);
              handleMakeDefault(selectedItem);
            }
          }}
        >
          <SettingIcon />
          <Text style={styles.menuText}>Set Default</Text>
        </TouchableOpacity>
      )}

      {(data.status || card == 1) && (
        <TouchableOpacity
          style={[
            styles.popupView,
            { paddingTop: ratioHeightBasedOniPhoneX(16) },
          ]}
          onPress={() => {
            setPopOverVisible(false);
            deletePaymentMethod(selectedItem?.id);
          }}
        >
          <DeleteImage />
          <Text style={styles.menuText}>Remove</Text>
        </TouchableOpacity>
      )}

      {data.status == false && (
        <TouchableOpacity
          style={styles.popupView}
          onPress={() => {
            setPopOverVisible(false);
            setTimeout(() => {
              bottomSheetRef.current?.open();
            }, 600);
          }}
        >
          <VerifyImage />
          <Text style={styles.menuText}>Verify</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderMenuAndroid = (data: any, card?: number) => (
    <MenuOptions
      optionsContainerStyle={[
        styles.menuContainer,
        {
          backgroundColor: colors.white,
          marginTop: ratioHeightBasedOniPhoneX(24),
        },
      ]}
    >
      {(data.status || card == 1) && (
        <MenuOption
          onSelect={() => {
            if (selectedItem !== null) {
              handleMakeDefault(selectedItem);
            }
          }}
          style={[
            styles.popupView,
            { paddingVertical: ratioHeightBasedOniPhoneX(4) },
          ]}
        >
          <SettingIcon />
          <Text style={styles.menuText}>Set Default</Text>
        </MenuOption>
      )}

      {(data.status || card == 1) && (
        <MenuOption
          onSelect={() => {
            deletePaymentMethod(selectedItem?.id);
          }}
          style={styles.popupView}
        >
          <DeleteImage />
          <Text style={styles.menuText}>Remove</Text>
        </MenuOption>
      )}

      {data.status == false && (
        <MenuOption
          onSelect={() => {
            setTimeout(() => {
              bottomSheetRef.current?.open();
            }, 600);
          }}
          style={styles.popupView}
        >
          <VerifyImage />
          <Text style={styles.menuText}>Verify</Text>
        </MenuOption>
      )}
    </MenuOptions>
  );

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);

    return true;
  };

  useEffect(() => {
    if (isFocused) {
      getCardAndBank();
    }
  }, [isFocused]);

  const getCardAndBank = async () => {
    setLoading(true);
    try {
      await serverCommunication.postApi(
        URLConstants.getCardAndBank,
        null,
        (
          statusCode: number,
          responseData: AddBankResponseModel,
          error: any
        ) => {
          if (statusCode == HTTPStatusCode.ok) {
            setBankResponse(responseData.data?.bankList ?? null);
            setCardResponse(responseData.data?.cardList ?? null);
          }
        }
      );
    } catch (error) {
      console.error("Error object:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentMethod = async (PaymentMethodId: any) => {
    setLoading(true);
    try {
      await serverCommunication.deleteApi(
        `${URLConstants.deletePaymentMethod}${PaymentMethodId}`,
        async (statusCode: any, responseData: any, error: any) => {
          await getCardAndBank();
          showTextPopup(strings.success, responseData?.message ?? "");
        }
      );
    } catch (error) {}
  };

  const renderItem = (item: any) => {
    return (
      <ImageBackground
        source={require("../assets/images/CreditCard.png")}
        style={[styles.cardContainer]}
      >
        <View style={styles.rowView}>
          <View style={{ flex: 2 }}>
            <Chip />
          </View>
          <PaymentIcon type={item.card_brand} width={40} height={40} />
          <View style={{ marginLeft: ratioHeightBasedOniPhoneX(23) }}>
            {Platform.OS == "ios" ? (
              <>
                <TouchableOpacity
                  style={{ marginTop: 5 }}
                  onPress={() => openPopover(item)}
                >
                  <ThreeDotsImage />
                </TouchableOpacity>
                <Popover
                  isVisible={popOverVisible && selectedItem === item}
                  displayArea={{
                    x: 20,
                    y: 110,
                    width: ratioWidthBasedOniPhoneX(340),
                    height: ratioHeightBasedOniPhoneX(1500),
                  }}
                  from={
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    />
                  }
                  backgroundStyle={[{ backgroundColor: "transparent" }]}
                  popoverStyle={{
                    backgroundColor: colors.white,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                  placement="bottom"
                  onRequestClose={closePopover}
                >
                  {renderMenu(item, 1)}
                </Popover>
              </>
            ) : (
              <Menu>
                <MenuTrigger
                  onPress={() => {
                    setSelectedItem(item);
                  }}
                  text={<ThreeDotsImage />}
                  customStyles={{
                    triggerWrapper: {
                      backgroundColor: "transparent",
                      shadowOpacity: 0,
                    },
                  }}
                />
                {renderMenuAndroid(item, 1)}
              </Menu>
            )}
          </View>
        </View>
        <Text style={styles.CardNumberText}>
          **** **** **** {item.card_number}
        </Text>
        <View
          style={[styles.rowView, { marginTop: ratioHeightBasedOniPhoneX(15) }]}
        >
          <View style={styles.columnView}>
            <Text style={styles.cardNameText}>Cardholder Name</Text>
            <Text style={styles.cardText}>{item.card_holder_name}</Text>
          </View>
          <View style={styles.columnView}>
            <Text style={styles.cardNameText}>Expiry Date</Text>
            <Text
              style={{
                color: colors.black,
                ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(18)),
              }}
            >{`${item.exp_month}/${
              item.exp_year ? item.exp_year % 100 : "" // Using optional chaining to handle possible undefined
            }`}</Text>
          </View>
        </View>
      </ImageBackground>
    );
  };

  const handleMakeDefault = (selectedItem: BankListData) => {
    let paymentMethodID = selectedItem.id;
    setDefault(
      paymentMethodID,
      (responseData) => {
        showTextPopup(strings.success, responseData.message);
        getCardAndBank();
      },
      (error) => {},
      (loading) => {
        setLoading(loading);
      },
      () => setLoading(false)
    );
  };

  const bankRenderItem = (item: BankListData) => {
    return (
      <View style={[styles.selectedCardContainer]}>
        <View style={styles.row}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <View />
            <BankImage />
            <Text
              style={[
                styles.BankText,
                { paddingHorizontal: ratioWidthBasedOniPhoneX(4) },
              ]}
            >
              {item.bank_name}
            </Text>
            {item.status == true ? <BankVerifyImage /> : <BankUnVerifyImage />}
          </View>

          <View>
            {Platform.OS == "ios" ? (
              <>
                <TouchableOpacity onPress={() => openPopover(item)}>
                  <ThreeDotsImage />
                </TouchableOpacity>
                <Popover
                  isVisible={popOverVisible && selectedItem === item}
                  displayArea={{
                    x: 20,
                    y: 110,
                    width: ratioWidthBasedOniPhoneX(340),
                    height: ratioHeightBasedOniPhoneX(1500),
                  }}
                  from={
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    />
                  }
                  backgroundStyle={[{ backgroundColor: "transparent" }]}
                  popoverStyle={{
                    backgroundColor: colors.white,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                  placement="bottom"
                  onRequestClose={closePopover}
                >
                  {renderMenu(item, 0)}
                </Popover>
              </>
            ) : (
              <Menu>
                <MenuTrigger
                  onPress={() => {
                    setSelectedItem(item);
                  }}
                  text={<ThreeDotsImage />}
                  customStyles={{
                    triggerWrapper: {
                      backgroundColor: "transparent",
                      shadowOpacity: 0,
                    },
                  }}
                />
                {renderMenuAndroid(item, 0)}
              </Menu>
            )}
          </View>
        </View>

        {item.primary && (
          <View
            style={[
              styles.defaultView,
              { marginLeft: ratioWidthBasedOniPhoneX(1) },
            ]}
          >
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}

        {item.status == false && (
          <View
            style={[
              styles.verificationPendingView,
              { marginLeft: ratioWidthBasedOniPhoneX(1) },
            ]}
          >
            <Text style={styles.verificationPendingText}>
              Verification Pending
            </Text>
          </View>
        )}

        <Divider style={styles.divider} />
        <View style={styles.rowView}>
          <View style={styles.columnView}>
            <Text style={styles.BankNameText}>Account No</Text>
            <Text style={styles.BankCardText}>****{item.account_number}</Text>
          </View>
          <View style={styles.columnView}>
            <Text style={styles.BankNameText}>Bank Code</Text>
            <Text style={styles.BankCardText}>{item.routing_number}</Text>
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    titleText: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    selectedCardContainer: {
      height: "auto",
      backgroundColor: colored.cardBackGround,
      padding: ratioHeightBasedOniPhoneX(16),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      marginTop: ratioHeightBasedOniPhoneX(16),
      marginBottom: ratioHeightBasedOniPhoneX(8),
      marginHorizontal: ratioHeightBasedOniPhoneX(1),
      borderWidth: ratioHeightBasedOniPhoneX(1),
      borderColor: colors.lightGreen,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    defaultView: {
      marginTop: ratioHeightBasedOniPhoneX(4),
      backgroundColor: theme === "light" ? colors.lightBlue : "#061D4F",
      borderRadius: ratioHeightBasedOniPhoneX(15),
      width: ratioWidthBasedOniPhoneX(58),
      height: ratioHeightBasedOniPhoneX(22),
      justifyContent: "center",
    },
    defaultText: {
      color: theme === "light" ? colors.royalBlue : colors.royalBlue,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    verificationPendingView: {
      marginTop: ratioHeightBasedOniPhoneX(4),
      backgroundColor: theme === "light" ? colors.lightBeige : "#51492C",
      borderRadius: ratioHeightBasedOniPhoneX(15),
      maxWidth: ratioWidthBasedOniPhoneX(134),
      maxHeight: ratioHeightBasedOniPhoneX(22),
      paddingHorizontal: ratioWidthBasedOniPhoneX(4),
      paddingBottom: ratioWidthBasedOniPhoneX(3),
      justifyContent: "center",
    },
    verificationPendingText: {
      color: colors.goldenrod,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    column: {
      flexDirection: "column",
      justifyContent: "flex-start",
      flex: 2,
      marginLeft: ratioWidthBasedOniPhoneX(16),
    },
    bankViewContainer: {
      marginTop: ratioHeightBasedOniPhoneX(12),
      flexDirection: "row",
      alignItems: "center",
    },
    BankText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    BankSubTitle: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      color: "rgba(255, 255, 255, 0.70)",
    },
    cardContainer: {
      padding: ratioHeightBasedOniPhoneX(20),
      marginBottom: ratioHeightBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(195),
      width: ratioWidthBasedOniPhoneX(335),
      borderRadius: ratioHeightBasedOniPhoneX(10),
      overflow: "hidden",
      borderColor: colors.white,
      backgroundColor: colors.orange,
    },
    CardNumberText: {
      ...WealthidoFonts.ocrAExtended(ratioHeightBasedOniPhoneX(24)),
      color: colors.black,
      marginTop: ratioHeightBasedOniPhoneX(38),
      textShadowColor: "rgba(0, 0, 0, 0.25)",
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
    ButtonContainer: {
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
      alignItems: "center",
      gap: ratioHeightBasedOniPhoneX(9),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      paddingVertical: ratioWidthBasedOniPhoneX(12),
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      position: "absolute",
      bottom: 0,
      right: 0,
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
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 1 },
      direction: "inherit",
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    androidShadow: {
      shadowColor: colors.black,
      elevation: 10,
    },
    cardiosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 1 },
      direction: "inherit",
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    cardandroidShadow: {
      shadowColor: colors.black,
      elevation: 3,
    },
    circleButtonImage: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioHeightBasedOniPhoneX(24),
      borderRadius: ratioHeightBasedOniPhoneX(12),
    },
    divider: {
      marginVertical: ratioHeightBasedOniPhoneX(16),
      color: theme === "light" ? colored.cardLineColor : "#4C4C55",
      backgroundColor: theme === "light" ? colored.cardLineColor : "#4C4C55",
      height: ratioHeightBasedOniPhoneX(0.7),
    },
    BankNameText: {
      color: colors.mainlyBlue,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    BankCardText: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    orangeShadow: {
      shadowColor: colors.orange,
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 20,
    },
    popupline: {
      width: ratioWidthBasedOniPhoneX(180),
    },
    menuContainer: {
      width: ratioWidthBasedOniPhoneX(124),
      paddingHorizontal: ratioHeightBasedOniPhoneX(10),
      paddingVertical: ratioHeightBasedOniPhoneX(8),
      height: "auto",
    },
    popupView: {
      flexDirection: "row",
      gap: 3,
      justifyContent: "flex-start",
      alignContent: "center",
      alignItems: "center",
    },
    menuText: {
      color: theme === "light" ? colored.lightblack : colors.black,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
  });

  const bottomSheetstyles = StyleSheet.create({
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
    },
    accountVerificationText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
      color: theme === "light" ? colors.black : colors.white,
    },
    startVerifyText: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
      textAlign: "justify",
      color: theme === "light" ? colors.lightblack : colors.lightGreyColor,
      fontWeight: "500",
    },
    errorText: {
      color: "red",
      textAlign: "left",
      fontSize: ratioHeightBasedOniPhoneX(12),
      fontFamily: "Inter-Medium",
      paddingBottom: ratioHeightBasedOniPhoneX(7),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colors.black,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    textFieldView: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    depositText: {
      color: colors.white,
      textAlign: "center",
      padding: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    input: {
      height: ratioHeightBasedOniPhoneX(48),
      textAlign: "left",
      backgroundColor:
        theme === "light" ? colored.background : colored.darkheaderColor,
      color: colored.textColor,
      paddingHorizontal: ratioHeightBasedOniPhoneX(2),
      borderRadius: ratioHeightBasedOniPhoneX(14),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(13)),
    },
    buttonContainerBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: ratioHeightBasedOniPhoneX(15),
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
    },
    confirmbutton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.orange,
      flex: 1,
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    cancelbutton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        theme === "light" ? colored.buttonGray : colored.cancelButtonBg,
      flex: 1,
      marginRight: ratioWidthBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    cancelText: {
      color: colored.textColor,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
  });

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      {cardResponse?.length != 0 || bankResponse?.length != 0 ? (
        <View style={styles.container}>
          <MainHeaderView
            title={"Bank & Card details"}
            showImage={false}
            closeApp={false}
            bottomBorderLine={false}
            whiteTextColor={false}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {bankResponse?.length != 0 && (
              <View style={styles.bankViewContainer}>
                <Text
                  style={[
                    styles.titleText,
                    { paddingLeft: ratioWidthBasedOniPhoneX(16) },
                  ]}
                >
                  Bank
                </Text>
                <TouchableOpacity>
                  {bankResponse?.length != 0 && (
                    <InfoIcon
                      style={{
                        marginLeft: ratioWidthBasedOniPhoneX(4),
                        marginTop: ratioWidthBasedOniPhoneX(2),
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
            <FlatList
              data={bankResponse}
              renderItem={({ item }) => bankRenderItem(item)}
              showsVerticalScrollIndicator={false}
              style={{
                paddingHorizontal: ratioWidthBasedOniPhoneX(16),
              }}
              keyExtractor={(item: any) => item.id}
            />
            {cardResponse?.length != 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: ratioWidthBasedOniPhoneX(8),
                }}
              >
                <Text
                  style={[
                    styles.titleText,
                    { paddingLeft: ratioWidthBasedOniPhoneX(16) },
                  ]}
                >
                  Card
                </Text>
                <InfoIcon
                  style={{
                    marginLeft: ratioWidthBasedOniPhoneX(4),
                    marginTop: ratioWidthBasedOniPhoneX(2),
                  }}
                />
              </View>
            )}
            <FlatList
              data={cardResponse}
              renderItem={({ item }) => renderItem(item)}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item: any) => item.id}
              pagingEnabled
              contentContainerStyle={{
                paddingHorizontal: ratioWidthBasedOniPhoneX(16),
                paddingVertical: ratioHeightBasedOniPhoneX(16),
                gap: ratioHeightBasedOniPhoneX(16),
              }}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
            <View style={{ marginBottom: ratioHeightBasedOniPhoneX(28) }} />
          </ScrollView>
          <View style={styles.ButtonContainer}>
            <View style={styles.rowView}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AddCardScreen");
                }}
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      theme === "light"
                        ? colors.buttonGray
                        : colored.cancelButtonBg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color:
                        theme === "light" ? colors.lightblack : colors.white,
                    },
                  ]}
                >
                  Add Card
                </Text>
              </TouchableOpacity>
              <View style={{ marginLeft: ratioWidthBasedOniPhoneX(16) }} />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AddBank");
                }}
                style={[styles.button, { backgroundColor: colors.orange }]}
              >
                <Text style={[styles.buttonText]}>Add Bank</Text>
              </TouchableOpacity>
            </View>
          </View>

          <BottomSheet
            ref={bottomSheetRef}
            closeOnDragDown
            onClose={() => {
              setAmount1("");
              setAmount2("");
            }}
            dragFromTopOnly
            customStyles={{
              draggableIcon: { backgroundColor: "transparent" },
              container: {
                backgroundColor:
                  theme === "light"
                    ? colored.headerColor
                    : colored.darkheaderColor,
                borderTopWidth: ratioWidthBasedOniPhoneX(1),
                borderTopColor: colored.shadowColor,
                height: "auto",
              },
            }}
          >
            <View>
              <View style={[bottomSheetstyles.rowContainer]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {bottomSheetValue == 2 && <RedCloseImage />}
                  <Text style={bottomSheetstyles.accountVerificationText}>
                    Account Verification
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    bottomSheetRef.current?.close();
                  }}
                >
                  <Close />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  bottomSheetstyles.startVerifyText,
                  {
                    marginTop: ratioHeightBasedOniPhoneX(25),
                    marginHorizontal: ratioWidthBasedOniPhoneX(16),
                  },
                ]}
              >
                {bottomSheetValue == 1
                  ? "The micro-deposits will take 1-2 business days to show up on your statement. The statement description for these deposits will be Verification."
                  : bottomSheetValue == 2
                  ? "The amount you have entered is incorrect. Re - enter the correct amount or verification will be failed. "
                  : "We will send you amount to your account for verification. Are you sure for start verify your account."}
              </Text>
              {bottomSheetValue == 1 && (
                <View
                  style={[
                    bottomSheetstyles.textFieldView,
                    {
                      marginTop: ratioHeightBasedOniPhoneX(7),
                      marginHorizontal: ratioWidthBasedOniPhoneX(16),
                    },
                  ]}
                >
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <TextInput
                      label="Verification Amount 1"
                      placeholder="USD"
                      mode="outlined"
                      style={bottomSheetstyles.input}
                      selectionColor={"colors.black"}
                      cursorColor={colors.black}
                      keyboardType="number-pad"
                      returnKeyType={"done"}
                      value={amount1}
                      outlineColor={colors.inactivegrey}
                      outlineStyle={bottomSheetstyles.outlineStyle}
                      activeOutlineColor={colors.orange}
                      onChangeText={validateAmount1}
                      textColor={
                        theme === "light" ? colored.textColor : colors.white
                      }
                    />
                    {amount1Error ? (
                      <Text style={bottomSheetstyles.errorText}>
                        {amount1Error}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      label="Verification Amount 2"
                      placeholder="USD"
                      mode="outlined"
                      style={bottomSheetstyles.input}
                      selectionColor={colors.black}
                      cursorColor={colors.black}
                      keyboardType="number-pad"
                      returnKeyType={"done"}
                      value={amount2}
                      outlineColor={colors.inactivegrey}
                      outlineStyle={bottomSheetstyles.outlineStyle}
                      activeOutlineColor={colors.orange}
                      onChangeText={validateAmount2}
                      textColor={
                        theme === "light" ? colored.textColor : colors.white
                      }
                    />
                    {amount2Error ? (
                      <Text style={bottomSheetstyles.errorText}>
                        {amount2Error}
                      </Text>
                    ) : null}
                  </View>
                </View>
              )}
              <View
                style={{
                  marginTop: ratioHeightBasedOniPhoneX(15),
                  borderTopWidth:
                    theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
                  borderColor: "#222528",
                }}
              >
                <View style={bottomSheetstyles.buttonContainerBottom}>
                  <TouchableOpacity
                    style={bottomSheetstyles.cancelbutton}
                    onPress={() => {
                      bottomSheetRef.current?.close();
                    }}
                  >
                    <Text style={bottomSheetstyles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={bottomSheetstyles.confirmbutton}
                    onPress={async () => {
                      if (bottomSheetValue == 0) {
                        setBottomSheetValue(1);
                      } else if (bottomSheetValue == 1) {
                        const data = new VerifyBankAccountAuthRequestModel(
                          amount1,
                          amount2,
                          selectedItem?.id ?? ""
                        );
                        if (
                          amount1 != "" &&
                          amount2 != "" &&
                          amount1Error == "" &&
                          amount2Error == ""
                        ) {
                          bottomSheetRef.current?.close();
                          await verifyBankAccount(
                            data,
                            (response) => {
                              "=========================?>izidz123", response;
                              setBottomSheetValue(0);
                              if (response.status === HTTPStatusCode.ok) {
                                showTextPopup(
                                  strings.success,
                                  "The amount you entered is correct. So you’re Verification has success."
                                );
                              } else {
                                showTextPopup(
                                  strings.error,
                                  "You have entered the amount wrong three times. So you’re Verification has failed."
                                );
                              }
                            },
                            (error) => {
                              setBottomSheetValue(0);
                              showTextPopup(strings.error, error.message);
                              setTimeout(() => {
                                getCardAndBank();
                              }, 400);
                            },
                            (loading) => {
                              setLoading(loading);
                            },
                            () => setLoading(false)
                          );
                        } else {
                          validateAmount1(amount1);
                          validateAmount2(amount2);
                        }
                      }
                    }}
                  >
                    <Text style={bottomSheetstyles.depositText}>
                      {bottomSheetValue == 2 ? "Re-enter" : "Verify"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BottomSheet>

          <ShowAlertMessage
            isVisible={popupVisible}
            title={popupTitle}
            message={popupMessage}
            onClose={() => {
              setPopupVisible(false);
              getCardAndBank();
            }}
          />
          <Loader loading={loading} />
        </View>
      ) : (
        <AddbankCardDetails />
      )}
    </SafeAreaView>
  );
};

export default BankCardDetails;
