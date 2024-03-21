import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { ThemeContext } from "../Networking/themeContext";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import Loader from "../Loader";
import MainHeaderView from "../MainHeaderView";
import serverCommunication from "../Networking/serverCommunication";
import { BankListData } from "../Addbank&CardDetails/Model/BankListData";
import ShowAlertMessage from "../Popup/showAlertMessage";
import BankImage from "../assets/images/BankImage.svg";
import CardImage from "../assets/images/CardImage.svg";
import InfoIcon from "../assets/images/fluent_info-12-filled.svg";
import BankVerifyImage from "../assets/images/greenCheckImage.svg";
import BankUnVerifyImage from "../assets/images/cancleIcon.svg";
import HttpStatusCode from "../Networking/HttpStatusCode";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCardAndBank } from "../Payment/TotalPayableController";
import { CardListData } from "../Addbank&CardDetails/Model/CardListData";
import AddItemComponent from "./AddItemComponent";
import Radio from "../assets/images/radioButton.svg";
import UnRadio from "../assets/images/UnRadio.svg";
import { DepositPaymentAuthRequestModel } from "./Model/DepositPaymentAuthRequestModel";
import URLConstants from "../Networking/URLConstants";
import { Tooltip } from "react-native-paper";

export type RouteParams = {
  amount?: any;
};

const PaymentMethodScreen = () => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const navigation = useNavigation();
  const route = useRoute();
  const params = route?.params as RouteParams | undefined;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [bankResponse, setBankDetails] = useState<BankListData[] | null>(null);
  const [cardResponse, setCardDetails] = useState<CardListData[] | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [navigat, setNavigation] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [showBankAll, setShowBankAll] = useState(false);
  const [showCardAll, setShowCardAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      Promise.all([
        getCardAndBank(
          (response) => {
            setBankDetails(response);
          },
          (rsponse) => {
            setCardDetails(rsponse);
          }
        ),
      ]).finally(() => {
        setLoading(false);
      });
    }
    return () => {
      setPaymentMethodId(null);
    };
  }, [isFocused]);

  const showTextPopup = async (
    title: string,
    message: string,
    navigate?: boolean
  ) => {
    setPopupVisible(true);
    setNavigation(navigate ?? false);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const bankRenderItem = (item: BankListData) => {
    const handlePress = (id: string) => {
      setSelectedId(id === selectedId ? null : id);
    };
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          item.status && handlePress(item?.id ?? "");
          setPaymentMethodId(item?.id ?? "");
        }}
      >
        <View
          style={[
            styles.rowContainer,
            {
              backgroundColor: colored.cardBackGround,
              marginHorizontal: ratioHeightBasedOniPhoneX(20),
              marginTop: ratioHeightBasedOniPhoneX(16),
              margin: ratioHeightBasedOniPhoneX(4),
              borderRadius: ratioHeightBasedOniPhoneX(12),
              padding: ratioHeightBasedOniPhoneX(16),
            },
            Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <BankImage />
            <View
              style={{
                marginLeft: ratioWidthBasedOniPhoneX(8),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.balanceText]}>{item.bank_name}</Text>

                <View
                  style={{ paddingHorizontal: ratioWidthBasedOniPhoneX(7) }}
                >
                  {item.status == true ? (
                    <BankVerifyImage />
                  ) : (
                    <BankUnVerifyImage />
                  )}
                </View>

                {item.status == false && (
                  <View style={styles.verificationPendingView}>
                    <Text style={styles.verificationPendingText}>Pending</Text>
                  </View>
                )}
              </View>
              <Text style={styles.availableBalanceText}>
                ************{item.account_number}
              </Text>
            </View>
          </View>
          {item.status && (item.id === selectedId ? <Radio /> : <UnRadio />)}
        </View>
      </TouchableOpacity>
    );
  };

  const CardRenderItem = (item: CardListData) => {
    const handlePress = (id: string) => {
      setSelectedId(id === selectedId ? null : id);
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          handlePress(item?.id ?? "");
          setPaymentMethodId(item?.id ?? "");
        }}
      >
        <View
          style={[
            styles.rowContainer,
            {
              backgroundColor: colored.cardBackGround,
              marginHorizontal: ratioHeightBasedOniPhoneX(20),
              marginTop: ratioHeightBasedOniPhoneX(16),
              margin: ratioHeightBasedOniPhoneX(4),
              borderRadius: ratioHeightBasedOniPhoneX(12),
              padding: ratioHeightBasedOniPhoneX(16),
            },
            Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <CardImage />
            <View
              style={{
                marginLeft: ratioWidthBasedOniPhoneX(8),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.balanceText]}>{item.card_brand}</Text>

                <View
                  style={{ paddingHorizontal: ratioWidthBasedOniPhoneX(7) }}
                >
                  {<BankVerifyImage />}
                </View>
              </View>
              <Text style={styles.availableBalanceText}>
                ************{item.card_number}
              </Text>
            </View>
          </View>
          {item.id === selectedId ? <Radio /> : <UnRadio />}
        </View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    bankText: {
      marginTop: ratioHeightBasedOniPhoneX(24),
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    viewAllText: {
      color: colors.orange,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    selectedCardContainer: {
      height: "auto",
      backgroundColor: colored.cardBackGround,
      padding: ratioHeightBasedOniPhoneX(16),
      marginHorizontal: ratioWidthBasedOniPhoneX(4),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      marginTop: ratioHeightBasedOniPhoneX(16),
      marginBottom: ratioHeightBasedOniPhoneX(8),
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
      backgroundColor: colors.lightBlue,
      borderRadius: ratioHeightBasedOniPhoneX(15),
      width: ratioWidthBasedOniPhoneX(58),
      height: ratioHeightBasedOniPhoneX(22),
      justifyContent: "center",
    },
    defaultText: {
      color: colors.royalBlue,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    verificationPendingView: {
      marginTop: ratioHeightBasedOniPhoneX(4),
      backgroundColor: colors.lightBeige,
      borderRadius: ratioHeightBasedOniPhoneX(15),
      marginLeft: ratioWidthBasedOniPhoneX(46),
      width: ratioWidthBasedOniPhoneX(62),
      height: ratioHeightBasedOniPhoneX(22),
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
    BankText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    columnView: {
      flexDirection: "column",
      justifyContent: "flex-start",
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
    },
    button: {
      marginVertical: ratioHeightBasedOniPhoneX(16),
      backgroundColor: colored.lightGreen,
      height: ratioHeightBasedOniPhoneX(40),
      width: "100%",
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
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
      elevation: 2,
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

    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    totalPayableText: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    addBank: {
      color: colors.orange,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    closeButtonImage: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioHeightBasedOniPhoneX(24),
    },
    closeButton: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioHeightBasedOniPhoneX(24),
      tintColor: colored.textColor,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioHeightBasedOniPhoneX(32),
    },
    balanceText: {
      color: colored.romanSilver,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    availableBalanceText: {
      color: colored.chitDetailTextColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    totalAmountTitle: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    error: {
      color: colors.red,
      textAlign: "left",
      fontFamily: "Inter-Medium",
      fontSize: ratioHeightBasedOniPhoneX(12),
      paddingTop: ratioHeightBasedOniPhoneX(3),
    },
    rewardBalanceTitle: {
      color: colored.chitDetailTextColor,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    convenient: {
      color: colored.chitDetailTextColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    noteContainer: {
      justifyContent: "flex-start",
      marginBottom: ratioHeightBasedOniPhoneX(8),
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    convientView: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: ratioHeightBasedOniPhoneX(24),
    },
  });

  const renderAllBanks = () => {
    return (
      <FlatList
        data={bankResponse}
        renderItem={({ item }) => bankRenderItem(item)}
        keyExtractor={(item: any) => item.id}
      />
    );
  };

  const renderLimitedBanks = () => {
    return (
      <FlatList
        data={bankResponse?.slice(0, 2)} // Render only the first two items if showAll is false
        renderItem={({ item }) => bankRenderItem(item)}
        keyExtractor={(item: any) => item.id}
      />
    );
  };

  const renderAllCards = () => {
    return (
      <FlatList
        data={cardResponse}
        renderItem={({ item }) => CardRenderItem(item)}
        keyExtractor={(item: any) => item.id}
      />
    );
  };

  const renderLimitedCards = () => {
    return (
      <FlatList
        data={cardResponse?.slice(0, 2)} // Render only the first two items if showAll is false
        renderItem={({ item }) => CardRenderItem(item)}
        keyExtractor={(item: any) => item.id}
      />
    );
  };

  const walletDeposite = async (
    url: string,
    data: DepositPaymentAuthRequestModel
  ) => {
    setLoading(true);
    try {
      await serverCommunication.postApi(
        url,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (responseData.status == HttpStatusCode.ok) {
            showTextPopup(strings.success, responseData?.message ?? "", true);
          } else {
            showTextPopup(strings.error, responseData?.message ?? "", false);
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    } finally {
      setLoading(false);
    }
  };

  const walletDepositeButtonpress = () => {
    if (selectedId != null) {
      const PaymentAuthRequest = new DepositPaymentAuthRequestModel(
        params?.amount,
        paymentMethodId ?? ""
      );
      walletDeposite(URLConstants.walletDeposit, PaymentAuthRequest);
    } else {
      showTextPopup(
        strings.error,
        "Please select any bank or card to add your amount"
      );
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <Loader loading={loading}>
        <MainHeaderView
          title={"Payment Method"}
          showImage={false}
          closeApp={false}
          bottomBorderLine={false}
          whiteTextColor={false}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {bankResponse?.length == 0 && cardResponse?.length == 0 ? (
            <View>
              <View
                style={[
                  styles.rowContainer,
                  {
                    marginTop: ratioHeightBasedOniPhoneX(10),
                    marginHorizontal: ratioHeightBasedOniPhoneX(20),
                  },
                ]}
              >
                <View style={styles.rowContainer}>
                  <Text style={styles.totalPayableText}>Payment Method</Text>
                </View>
                {bankResponse?.length != 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("AddBank");
                    }}
                  >
                    <Text style={styles.addBank}>+Add Bank</Text>
                  </TouchableOpacity>
                )}
              </View>
              {bankResponse?.length === 0 && (
                <AddItemComponent
                  IconComponent={BankImage}
                  text="Add Bank"
                  action={() => navigation.navigate("AddBank")}
                  colorBackground={colors.orange}
                />
              )}
              {cardResponse?.length === 0 && bankResponse?.length === 0 && (
                <AddItemComponent
                  IconComponent={CardImage}
                  text="Add Card"
                  action={() => navigation.navigate("AddCardScreen")}
                  colorBackground={colors.orange}
                />
              )}
            </View>
          ) : (
            <View>
              <View
                style={[
                  styles.rowContainer,
                  {
                    marginTop: ratioHeightBasedOniPhoneX(10),
                    marginHorizontal: ratioHeightBasedOniPhoneX(20),
                  },
                ]}
              >
                <View style={styles.rowContainer}>
                  <Text style={styles.totalPayableText}>
                    {bankResponse?.length === 0 ? "Payment Method" : "Bank"}
                  </Text>
                  <TouchableOpacity>
                    {bankResponse?.length != 0 && (
                      <InfoIcon
                        style={{ marginLeft: ratioWidthBasedOniPhoneX(2) }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                {bankResponse?.length != 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("AddBank");
                    }}
                  >
                    <Text style={styles.addBank}>+Add Bank</Text>
                  </TouchableOpacity>
                )}
              </View>
              {bankResponse?.length === 0 && (
                <AddItemComponent
                  IconComponent={BankImage}
                  text="Add Bank"
                  action={() => navigation.navigate("AddBank")}
                  colorBackground={colors.orange}
                />
              )}
              {showBankAll ? renderAllBanks() : renderLimitedBanks()}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: ratioHeightBasedOniPhoneX(15),
                }}
              >
                {bankResponse && bankResponse.length > 2 && (
                  <TouchableOpacity
                    onPress={() => setShowBankAll(!showBankAll)}
                  >
                    <Text style={styles.viewAllText}>
                      {showBankAll ? "View Less" : "View All"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View
                style={[
                  styles.rowContainer,
                  {
                    marginTop: ratioHeightBasedOniPhoneX(25),
                    marginHorizontal: ratioHeightBasedOniPhoneX(20),
                  },
                ]}
              >
                {
                  <View style={styles.rowContainer}>
                    <Text style={styles.totalPayableText}>Card</Text>
                    <Tooltip title="Please note that a nominal fee will be applied for payments made via bank transfer.">
                      <TouchableOpacity>
                        <InfoIcon
                          style={{ marginLeft: ratioWidthBasedOniPhoneX(2) }}
                        />
                      </TouchableOpacity>
                    </Tooltip>
                  </View>
                }

                {
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("AddCardScreen");
                    }}
                  >
                    <Text style={styles.addBank}>+Add Card</Text>
                  </TouchableOpacity>
                }
              </View>
              {cardResponse?.length === 0 && bankResponse?.length != 0 && (
                <AddItemComponent
                  IconComponent={CardImage}
                  text="Add Card"
                  action={() => navigation.navigate("AddCardScreen")}
                  colorBackground={colors.orange}
                />
              )}
              {showCardAll ? renderAllCards() : renderLimitedCards()}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: ratioHeightBasedOniPhoneX(15),
                }}
              >
                {cardResponse && cardResponse.length > 2 && (
                  <TouchableOpacity
                    onPress={() => setShowCardAll(!showCardAll)}
                  >
                    <Text
                      style={[
                        styles.viewAllText,
                        { marginBottom: ratioHeightBasedOniPhoneX(40) },
                      ]}
                    >
                      {showCardAll ? "View Less" : "View All"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.rowView}>
            <TouchableOpacity
              onPress={walletDepositeButtonpress}
              style={[styles.button, { backgroundColor: colors.orange }]}
            >
              <Text style={[styles.buttonText]}>Proceed to pay</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ShowAlertMessage
          isVisible={isPopupVisible}
          title={popupTitle}
          message={popupMessage}
          onClose={() => {
            if (navigat) {
              setPopupVisible(false);
              navigation.goBack();
            } else {
              setPopupVisible(false);
            }
          }}
        />
      </Loader>
    </SafeAreaView>
  );
};

export default PaymentMethodScreen;
