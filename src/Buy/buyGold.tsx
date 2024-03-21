import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { ThemeContext } from "../Networking/themeContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import colors, { dark, light } from "../colors";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import validation from "../RegisterScreen/validation";
import { TextInput } from "react-native-paper";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import {
  GoldProductListResponseModel,
  GoldProductListResponseModelDatum,
} from "./Model/GoldProductListResponseModel";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import {
  BuyGoldSocketResponse,
  BuySpotPriceModel,
} from "./Model/BuySpotPriceModel";
import {
  formatNumberWithThreeDecimals,
  formatNumberWithTwoDecimals,
} from "../Utility";
import BottomSheet from "react-native-raw-bottom-sheet";
import ShowAlertMessage from "../Popup/showAlertMessage";
import Loader from "../Loader";
import MainHeaderView from "../MainHeaderView";
import GoldSubscrptionImage from "../assets/images/GoldSubscriptionImage.svg";
import { initializeWebSocket } from "./BuyGoldController";
import strings from "../Extension/strings";
import { SafeAreaView } from "react-native-safe-area-context";

const BuyGoldScreen = () => {
  const navigation: NavigationProp<any> = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [totalAmount, setTotalAmount] = useState<any>(0);
  const [type, setType] = useState(0);
  const [amountGold, setAmountGold] = useState("");
  const [amountGoldError, setAmountGoldError] = useState("");
  const [gramGold, setGramGold] = useState("");
  const [gramGoldError, setGramGoldError] = useState("");
  const isFocused = useIsFocused();
  const [goldSpotPrice, setGoldSpotPrice] = useState<BuySpotPriceModel | null>(
    null
  );
  const [goldSocketPrice, setGoldSocketPrice] =
    useState<BuyGoldSocketResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [socket, setSocket] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<any>("Connecting...");
  const [goldAsk, setGoldAsk] = useState(0);
  const [data, setData] =
    useState<GoldProductListResponseModel | null>(/* initial value or undefined */);

  useEffect(() => {
    if (isFocused) {
      const getGoldProductList = async () => {
        try {
          await serverCommunication.getApi(
            URLConstants.getGoldProductList,
            (
              statusCode: any,
              responseData: GoldProductListResponseModel,
              error: any
            ) => {
              if (!error) {
                setData(responseData);
              } else {
              }
            }
          );
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };

      getGoldProductList();
      BuyGoldSpotPrice();
    }
  }, [isFocused]);

  useEffect(() => {
    const newTotalAmount = data?.data?.reduce((total: any, item: any) => {
      if (item.selected) {
        return total + item.ask * item.count;
      }
      return total;
    }, 0);
    setTotalAmount(newTotalAmount);
  }, [data]);

  useEffect(() => {
    initializeWebSocket(
      (response) => {
        setGoldSocketPrice(response);
      },
      (onError) => {
        showTextPopup(strings.success, onError.message);
      },
      (webSocket) => {
        setSocket(webSocket);
      },
      (status) => {
        setConnectionStatus(status);
      }
    );

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connectionStatus]);

  const showTextPopup = async (title: string, message: string) => {
    setIsPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const closeModal = () => {
    bottomSheetRef.current?.close();
  };

  const handleItemSelection = (code: string) => {
    if (data) {
      const updatedDataSet = data?.data?.map((item: any) => {
        if (item.code === code) {
          return {
            ...item,
            selected: !item.selected,
            count: !item.selected ? (item.count ?? 0) + 1 : item.count,
          };
        } else {
          return item;
        }
      });
      setData({ ...data, data: updatedDataSet });
    }
  };

  const BuyGoldSpotPrice = async () => {
    try {
      await serverCommunication.getApi(
        URLConstants.getSpotPrice,
        (statusCode: any, responseData: BuySpotPriceModel, error: any) => {
          if (!error) {
            setGoldSpotPrice(responseData);
          } else {
          }
        }
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const increaseCount = (index: number) => {
    if (data) {
      const updatedData = [...data?.data];
      const selectedItem = updatedData[index];
      if (selectedItem) {
        selectedItem.count = (selectedItem.count || 0) + 1;
        setData({ ...data, data: updatedData });
      }
    }
  };

  const decreaseCount = (index: number) => {
    const updatedData = [...data?.data]; // Copy the data array
    const selectedItem = updatedData[index];
    if (selectedItem) {
      selectedItem.count = Math.max((selectedItem.count || 0) - 1, 0);
      if (selectedItem.count == 0) {
        selectedItem.selected = false;
      }
      setData({ ...data, data: updatedData });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.background,
    },
    view: {
      marginTop:
        Platform.OS == "android"
          ? ratioHeightBasedOniPhoneX(33)
          : ratioHeightBasedOniPhoneX(64),
      flexDirection: "row",
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
      alignItems: "center",
    },
    image: {
      height: ratioHeightBasedOniPhoneX(160),
    },
    backButtonImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      resizeMode: "contain",
    },
    headerTextContainer: {
      flex: 1,
      marginLeft: ratioWidthBasedOniPhoneX(-10),
      alignItems: "center",
    },
    Textmain: {
      color: theme === "light" ? colors.lightblack : colors.white,
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    Textsubs: {
      color: theme === "light" ? colored.textColor : colors.lightGreyColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    Textsubsgold: {
      color: colors.mainlyBlue,
      marginTop: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(12)),
    },
    amountText: {
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(15),
      textAlign: "center",
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(24)),
    },
    balanceText: {
      color: colors.mainlyBlue,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    chooseText: {
      color: colored.textColor,
      marginTop: ratioHeightBasedOniPhoneX(20),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    typeColoumn: {
      flexDirection: "column",
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      flex: 1,
    },
    typeRow: {
      flexDirection: "row",
      marginTop: ratioHeightBasedOniPhoneX(10),
      gap: ratioWidthBasedOniPhoneX(10),
    },
    typeContainerOrange: {
      borderRadius: ratioHeightBasedOniPhoneX(30),
      paddingHorizontal: ratioWidthBasedOniPhoneX(24),
      height: ratioHeightBasedOniPhoneX(36),
      backgroundColor: colors.goldButton,
      justifyContent: "center",
      alignItems: "center",
    },
    typeContainer: {
      borderRadius: ratioHeightBasedOniPhoneX(30),
      backgroundColor:
        theme === "light" ? colored.background : colored.darkheaderColor,
      borderColor:
        theme == "light" ? colored.tabBarBorder : colored.progressColor,
      borderWidth: ratioWidthBasedOniPhoneX(1),
      paddingHorizontal: ratioWidthBasedOniPhoneX(24),
      height: ratioHeightBasedOniPhoneX(36),
      justifyContent: "center",
      alignItems: "center",
    },
    textViewGreen: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    textView: {
      color: colored.textColor,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    listContainer: {
      height: ratioHeightBasedOniPhoneX(202),
      width: ratioWidthBasedOniPhoneX(168),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      marginTop: ratioHeightBasedOniPhoneX(34),
      backgroundColor: colored.cardBackGround,
      alignItems: "center",
    },
    goldImage: {
      height: ratioHeightBasedOniPhoneX(99),
      width: ratioHeightBasedOniPhoneX(99),
      resizeMode: "stretch",
      paddingHorizontal: ratioHeightBasedOniPhoneX(34),
      marginTop: ratioHeightBasedOniPhoneX(12),
    },
    goldtext: {
      color: colors.mainlyBlue,
      marginBottom: ratioHeightBasedOniPhoneX(8),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    listbutton: {
      backgroundColor: colors.blackChitColor,
      width: "100%",
      marginTop: "auto",
      borderBottomLeftRadius: ratioHeightBasedOniPhoneX(8),
      borderBottomRightRadius: ratioHeightBasedOniPhoneX(8),
      height: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
    },

    addButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: ratioHeightBasedOniPhoneX(4),
    },
    button: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioHeightBasedOniPhoneX(32),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(8),
      backgroundColor: colored.segementActiveColor,
      fontSize: ratioHeightBasedOniPhoneX(18),
    },
    buttonText: {
      color: colors.goldButton,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    addCardText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    payBackGround: {
      flexDirection: "row",
      backgroundColor: colored.cardBackGround,
      position: "absolute",
      padding: ratioHeightBasedOniPhoneX(16),
      bottom: ratioHeightBasedOniPhoneX(0),
      justifyContent: "space-between",
    },
    PayText: {
      color: colored.textColor,
      flex: 0.5,
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    greyText: {
      color: colors.mainlyBlue,
      textAlign: "left",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    Paybutton: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(50),
      backgroundColor: colors.goldButton,
      flex: 1,
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    input: {
      height: ratioHeightBasedOniPhoneX(40),
      textAlign: "left",
      backgroundColor: colored.background,
      color: colored.textColor,
      paddingHorizontal: ratioHeightBasedOniPhoneX(2),
      borderRadius: ratioHeightBasedOniPhoneX(14),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
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
    thirdHeader: {
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginTop: ratioHeightBasedOniPhoneX(5),
    },
    FooterTextsubs: {
      color: colors.tabText,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
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
      backgroundColor: colored.cardBackGround,
      marginTop: "auto",
      height: ratioHeightBasedOniPhoneX(62),
      marginHorizontal: ratioHeightBasedOniPhoneX(-20),
      alignItems: "center",
      justifyContent: "center",
    },
    nextbutton: {
      backgroundColor: colors.goldButton,
      borderRadius: ratioHeightBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(40),
      alignItems: "center",
      justifyContent: "center",
      width: ratioWidthBasedOniPhoneX(335),
    },
    NextbuttonText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
      color: colors.white,
      textAlign: "center",
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
      elevation: 6,
    },
    filterImage: {
      height: ratioHeightBasedOniPhoneX(36),
      width: ratioWidthBasedOniPhoneX(36),
      borderRadius: ratioHeightBasedOniPhoneX(36),
      backgroundColor: colors.white,
    },
    headercontent: {
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
  });

  const renderItem = (
    item: GoldProductListResponseModelDatum | any,
    index: number
  ) => {
    return (
      <View
        style={[
          styles.listContainer,
          Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
          index % 2 === 1 && { marginLeft: ratioWidthBasedOniPhoneX(8) },
        ]}
      >
        <Image source={{ uri: item.imgUrl }} style={styles.goldImage} />
        <Text style={styles.goldtext}>{item.purity}</Text>
        <Text style={styles.textView}>{item.weight}</Text>
        {item.selected ? (
          <View style={styles.listbutton}>
            <View style={styles.addButtonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => decreaseCount(index)}
              >
                <Text style={styles.buttonText}>{"-"}</Text>
              </TouchableOpacity>
              <Text style={styles.addCardText}>{item.count}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => increaseCount(index)}
              >
                <Text style={styles.buttonText}>{"+"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.listbutton}
            activeOpacity={1}
            onPress={() => handleItemSelection(item?.code ?? "")}
          >
            <Text style={styles.addCardText}>Add to cart</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const onGoBackBuy = () => {
    setAmountGold("");
    setGramGold("");
  };

  const goldValidation = (text: string) => {
    const goldAsk = goldSocketPrice?.goldAsk ?? goldSpotPrice?.data?.price ?? 0;

    // Set gram gold and validation error
    if (typeof text === "string") {
      setGramGold(text);
      setGramGoldError(validation.validateAmountGold(text));

      // Calculate amount gold
      const convertValue = Number(text) * goldAsk;
      const formattedAmountGold = isNaN(convertValue)
        ? ""
        : formatNumberWithTwoDecimals(convertValue).toString();

      // Set amount gold and clear error
      setAmountGold(formattedAmountGold);
      setAmountGoldError(validation.validateAmount(formattedAmountGold));
    }
  };

  const buyDigital = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.amountText}>
            $
            {goldSocketPrice?.goldAsk != undefined
              ? goldSocketPrice?.goldAsk
              : goldSpotPrice?.data?.price}
            /Oz
          </Text>
          <Text style={styles.balanceText}>Current gold buying price</Text>
          <Text style={styles.balanceText}>(inclusive of all taxes)</Text>
        </View>

        <View style={{ marginTop: ratioHeightBasedOniPhoneX(15) }}>
          <TextInput
            label="Enter Amount ($)"
            mode="outlined"
            value={amountGold}
            onChangeText={(text) => {
              const goldAsk: any =
                goldSocketPrice?.goldAsk != undefined
                  ? goldSocketPrice?.goldAsk
                  : goldSpotPrice?.data?.price;
              if (/^\d*\.?\d*$/.test(text)) {
                setAmountGold(text);
              }
              setAmountGoldError(validation.validateAmount(text));
              if (Number(text) >= 5) {
                const convertValue = parseInt(text, 10) / goldAsk;
                setGramGold(
                  formatNumberWithThreeDecimals(convertValue).toString()
                );
                setGramGoldError("");
                if (Number.isNaN(convertValue)) {
                  setGramGold("");
                }
              }
              if (text == "") {
                setGramGold("");
              }
            }}
            underlineColor={colored.textColor}
            keyboardType="number-pad"
            activeUnderlineColor={amountGoldError ? "red" : colors.black}
            style={styles.input}
            textColor={colored.textColor}
            selectionColor={colored.textColor}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colors.orange}
            returnKeyType={"done"}
          />
          {amountGoldError ? (
            <Text style={styles.errorText}>{amountGoldError}</Text>
          ) : null}
        </View>

        <View>
          <View style={{ marginTop: ratioHeightBasedOniPhoneX(10) }}>
            <TextInput
              label="Enter Gold (Oz)"
              mode="outlined"
              value={gramGold}
              onChangeText={goldValidation}
              underlineColor={colored.textColor}
              keyboardType="number-pad"
              activeUnderlineColor={gramGoldError ? "red" : colors.black}
              style={styles.input}
              textColor={colored.textColor}
              selectionColor={colored.textColor}
              outlineColor={colors.inactivegrey}
              outlineStyle={styles.outlineStyle}
              activeOutlineColor={colors.orange}
              returnKeyType={"done"}
            />
            {gramGoldError ? (
              <Text style={styles.errorText}>{gramGoldError}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.thirdHeader}>
          <Text style={styles.FooterTextsubs}>
            The amount of gold will vary depending on the convenience fee
            associated with the card details provided.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextbutton}
            onPress={() => {
              const amountError = validation.validateAmount(amountGold);
              const goldError = validation.validateAmountGold(gramGold);
              if (
                amountGold != "" &&
                gramGold != "" &&
                amountGoldError == "" &&
                gramGoldError == ""
              ) {
                let gramGoldStr = gramGold.toString();
                let decimalIndex = gramGoldStr.indexOf(".");
                let trimmedValue = gramGoldStr.substring(0, decimalIndex + 7);
                let gramGoldTrimmed = parseFloat(trimmedValue);
                navigation.navigate("GoldPaymentMethodScreen", {
                  type: "Card",
                  amount: amountGold, //amount
                  startDate: goldSocketPrice?.goldAsk, // Price
                  planType: "Digital Gold",
                  subscriptionID: gramGoldTrimmed, // Qty
                  subscriptedDataID: undefined,
                  subscriPtionKey: undefined,
                  onGoBack: onGoBackBuy,
                });
              } else {
                setAmountGoldError(amountError);
                setGramGoldError(goldError);
              }
            }}
          >
            <Text style={styles.NextbuttonText}>Proceed To Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <MainHeaderView
        title={"Buy Gold"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
        callback={() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
            console.log("websocket Close");
          }
        }}
      />
      <View style={styles.headercontent}>
        <GoldSubscrptionImage />
        <Text style={styles.Textmain}>Buy Gold</Text>
        <Text style={styles.Textsubsgold}>99.99% pure 24k gold</Text>
      </View>
      <View style={styles.typeColoumn}>
        <Text style={styles.chooseText}>Choose type</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={
              type == 0 ? styles.typeContainerOrange : styles.typeContainer
            }
            onPress={() => setType(0)}
          >
            <Text style={type == 0 ? styles.textViewGreen : styles.textView}>
              Buy Physical
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              type == 1 ? styles.typeContainerOrange : styles.typeContainer
            }
            onPress={() => setType(1)}
          >
            <Text style={type == 1 ? styles.textViewGreen : styles.textView}>
              Buy Digital
            </Text>
          </TouchableOpacity>
        </View>
        {type === 0 ? (
          <View
            style={{
              flex: 1,
              marginTop: ratioHeightBasedOniPhoneX(10),
              paddingBottom: ratioHeightBasedOniPhoneX(90),
            }}
          >
            <FlatList
              data={data?.data}
              renderItem={({ item, index }) => renderItem(item, index)}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item: any) => item?.code}
              numColumns={2}
            />
          </View>
        ) : (
          buyDigital()
        )}
      </View>
      {type === 0 && (
        <View
          style={[
            styles.payBackGround,
            Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
          ]}
        >
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={styles.PayText}>Pay ${totalAmount}</Text>
            <Text>
              <Text style={styles.greyText}>to buy </Text>
              <Text style={styles.Textsubs}>1 gram gold coin</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              totalAmount !== 0 ? closeModal() : null;
            }}
            style={styles.Paybutton}
          >
            <Text style={[styles.PayText, { color: colors.white }]}>Buy</Text>
          </TouchableOpacity>
        </View>
      )}
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => {
          setIsPopupVisible(false);
        }}
      />
      <Loader loading={loading} children={undefined} />
    </SafeAreaView>
  );
};

export default BuyGoldScreen;
