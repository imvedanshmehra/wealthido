import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
} from "react-native";
import HeaderView from "../ChitFundScreen/HeaderView";
import colors, { dark, light } from "../colors";
import { ThemeContext } from "../Networking/themeContext";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { GoldInvestmentResonseModel } from "./Model/GoldInvestmentResponseModel";
import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";
import Loader from "../Loader";
import ChitFundsExplore from "../ChitFundsExplore/ChitFundsExplore";
import StorageService from "../StorageService";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { SubScriptionPlanResponseModel } from "../SubScriptionplan/Model/SubScriptionPlanResponseModel";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { LineChart } from "react-native-gifted-charts";
import Slide3 from "../assets/images/Slide3.svg";
import illustrationDarkImage from "../assets/images/illustrationDarkImage.svg";
import Gold from "../assets/images/gold.svg";
import SubscribeNow from "../assets/images/Subscribe_now.svg";
import SubscribeSuccess from "../assets/images/Subscribe_success.svg";
import SubscribeSucessDark from "../assets/images/SubscribeSuc_dark.svg";
import { Divider } from "react-native-paper";
import { formatDateMonth } from "../Utility";
import {
  getUserInfo,
  joinConstraint,
} from "../ChitFundScreen/ChitFundController";
import { JoinConstraintResponseModel } from "../ChitFundScreen/Model/JoinConstraintResponseModel";
import { createInquiry } from "../More/inquiry";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import { ScrollView } from "react-native-gesture-handler";

export interface LineChartData {
  date: Date;
  value: number;
}

const GoldInvestment = () => {
  const [activeButton, setActiveButton] = useState("1w");
  const [currentPrice, setCurrentPrice] = useState<
    GoldInvestmentResonseModel | any
  >({});

  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [firstTime, setFirstTime] = useState(false);
  const navigation: any = useNavigation();
  const [loading, setLoading] = useState(false);
  const [subscriptionResponse, setSubscriptionPlan] =
    useState<SubScriptionPlanResponseModel | null>(null);
  const isFocused = useIsFocused();
  const [LiveData, setLiveData] = useState<LineChartData[]>([]);
  const [lowerValue, setLowerValue] = useState(null);
  const [xAxisSpace, setxAxisSpace] = useState(57);
  const [dataReceived, setDataReceived] = useState(false);
  const [joinData, setjoinConstraint] = useState<
    JoinConstraintResponseModel | any
  >(null);
  const [getUserDetails, setUserDetails] = useState<LoginResponseModel | null>(
    null
  );
  const [LiveDatasort, setLiveDatasort] = useState<string[]>([]);

  const color = theme === "dark" ? dark : light;

  const featchData = async () => {
    const firstTime = await StorageService.getFirstTimeLogin();
    if (firstTime !== null) {
      setFirstTime(firstTime);
    }
  };
  const subscriptionViewPlan = async () => {
    try {
      setLoading(true);
      await serverCommunication.getApi(
        URLConstants.subscriptionViewPlan,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            if (statusCode === HTTPStatusCode.ok) {
              setSubscriptionPlan(responseData);
            }
          } else {
          }
        }
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getUserInfo((userData) => {
        setUserDetails(userData);
      }),
        joinConstraint(
          (value) => {
            setDataReceived(value);
          },
          (joinConstraintData) => {
            setjoinConstraint(joinConstraintData);
          }
        ),
        subscriptionViewPlan();
    }
  }, [isFocused]);

  useEffect(() => {
    featchData();
    getGoldCurrentPrice();
    let active = activeButton ? activeButton : "1w";
    getChartData(active);
  }, []);

  const getGoldCurrentPrice = async () => {
    try {
      setLoading(true);
      await serverCommunication.getApi(
        URLConstants?.getGoldCurrentPrice,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            setCurrentPrice(responseData?.data);
          } else {
          }
        }
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getChartData = async (val: string) => {
    setLoading(true);
    try {
      await serverCommunication.getApi(
        URLConstants?.getChartData + val,
        (statusCode: any, responseData: any, error: any) => {
          const result1 =
            responseData?.data?.map(
              ({ ask, date }: { ask: any; date: any }) => ({
                value: ask,
                date,
              })
            ) || [];

          const datesOnly = responseData?.data?.map((item: any) => item.date);

          const lowestValue = result1.reduce(
            (min: number, currentValue: any) => {
              if (currentValue.value < min) {
                return currentValue.value;
              } else {
                return min;
              }
            },
            result1[0].value
          );

          const getRandomItems = (array: Array<[]>, count: number) => {
            if (!Array.isArray(array)) {
              console.error("Invalid array:", array);
              return [];
            }
            const shuffled = array.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
          };

          const randomXAxisItems = getRandomItems(datesOnly, 7);
          const randomXAxisLabels = randomXAxisItems.map((item) =>
            formatDateMonth(item)
          );

          // Sort the selected dates
          const sortedRandomXAxisLabels = randomXAxisLabels.sort((a, b) => {
            const dateA: any = new Date(a);
            const dateB: any = new Date(b);
            return dateA - dateB;
          });

          if (val == "1w") {
            setxAxisSpace(ratioWidthBasedOniPhoneX(56));
          } else if (val == "1m") {
            setxAxisSpace(ratioWidthBasedOniPhoneX(12));
          } else if (val == "3m") {
            setxAxisSpace(ratioWidthBasedOniPhoneX(3.7));
          } else {
            setxAxisSpace(ratioWidthBasedOniPhoneX(0.93));
          }
          setLowerValue(lowestValue);
          setLiveData(result1);
          setLoading(false);
          setLiveDatasort(sortedRandomXAxisLabels);
        }
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colored.headerColor,
      flex: 1,
    },
    chartcontainer: {
      backgroundColor: theme === "light" ? colored.white : colors.black,
      marginTop: ratioHeightBasedOniPhoneX(10),
      paddingBottom: ratioHeightBasedOniPhoneX(12),
    },
    pricePercentage: {
      flexDirection: "row",
    },
    textBold: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(18)),
    },
    textLight: {
      paddingLeft: ratioWidthBasedOniPhoneX(20),
      color: colored.lightGreen,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    textRed: {
      paddingLeft: ratioWidthBasedOniPhoneX(20),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
      color: colored.lightRed,
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      paddingVertical: ratioHeightBasedOniPhoneX(16),
      marginTop: ratioHeightBasedOniPhoneX(8),
    },
    buttonContainer: {
      backgroundColor:
        theme === "light" ? colors.chartdata : colored.cardBackGround,
      borderRadius: ratioHeightBasedOniPhoneX(5),
      alignItems: "center",
      paddingVertical: ratioHeightBasedOniPhoneX(8),
      height: ratioHeightBasedOniPhoneX(29),
      padding: ratioWidthBasedOniPhoneX(15),
    },
    buttonContainerActive: {
      backgroundColor: colored.goldButton,
      borderRadius: ratioHeightBasedOniPhoneX(5),
      alignItems: "center",
      paddingVertical: ratioHeightBasedOniPhoneX(8),
      marginHorizontal: ratioWidthBasedOniPhoneX(4),
      height: ratioHeightBasedOniPhoneX(29),
      padding: ratioWidthBasedOniPhoneX(15),
    },
    buttonTextActive: {
      color: theme === "light" ? colored.textColor : colors.lightblack,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(10)),
    },
    subscribtionContainer: {
      backgroundColor: colored.headerColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      paddingTop: ratioHeightBasedOniPhoneX(10),
    },
    SubscribtionCard: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: ratioHeightBasedOniPhoneX(15),
      height: ratioHeightBasedOniPhoneX(85),
      borderRadius: ratioHeightBasedOniPhoneX(15),
    },
    SubscribtionSucess: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: ratioHeightBasedOniPhoneX(15),
      height: ratioHeightBasedOniPhoneX(85),
    },
    subscribtionImage: {
      marginRight: ratioWidthBasedOniPhoneX(7),
    },
    SubscripbeText: {
      color: colors.white,
      marginBottom: ratioHeightBasedOniPhoneX(2),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    SubscribedText: {
      color: theme === "light" ? colored.textColor : colors.white,
      marginBottom: ratioHeightBasedOniPhoneX(2),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    SubscripbedTextSmall: {
      width: ratioWidthBasedOniPhoneX(260),
      color: theme === "light" ? colored.textColor : "#C1C3CB",
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(14)),
    },
    SubscripbeTextSmall: {
      width: ratioWidthBasedOniPhoneX(260),
      color: "#FFF5E0",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    SubscribtionLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    rowContainerButton: {
      backgroundColor: colored.headerColor,
      marginTop: ratioHeightBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(150),
      paddingBottom: ratioHeightBasedOniPhoneX(120),
      paddingTop: ratioHeightBasedOniPhoneX(16),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    withdrawbutton: {
      backgroundColor:
        theme === "light" ? colors.buttonGray : colored.withdrawButtonBg,
      borderRadius: ratioHeightBasedOniPhoneX(28),
      alignItems: "center",
      textAlign: "center",
      height: ratioHeightBasedOniPhoneX(48),
      justifyContent: "center",
      marginRight: ratioWidthBasedOniPhoneX(16),
      paddingHorizontal: ratioWidthBasedOniPhoneX(44),
    },
    Buybutton: {
      backgroundColor: colored.goldButton,
      borderRadius: ratioHeightBasedOniPhoneX(28),
      height: ratioHeightBasedOniPhoneX(48),
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      paddingHorizontal: ratioWidthBasedOniPhoneX(44),
    },

    buttonTextChart: {
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(11)),
    },

    buttonText: {
      color: theme === "light" ? colors.black : colors.white,
      textAlign: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    viewText: {
      color: colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },
    viewSubscribedText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(12)),
    },

    buttonTextDark: {
      textAlign: "center",
      flexDirection: "row",
      alignItems: "center",
      color: colors.white,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    chart: {
      width: ratioHeightBasedOniPhoneX(400),
      height: ratioHeightBasedOniPhoneX(200),
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
      shadowOpacity: 0.1,
      elevation: 4,
    },
  });

  const Button = ({
    type,
    text,
    onPress,
  }: {
    type: string;
    text: string;
    onPress: () => void;
  }) => {
    const buttonStyles =
      type === "withdraw" ? styles.withdrawbutton : styles.Buybutton;
    const textStyles =
      type === "withdraw" ? styles.buttonText : styles.buttonTextDark;
    const buttonText =
      type === "withdraw" ? (
        text
      ) : (
        <>
          <Gold /> {text}
        </>
      );

    return (
      <TouchableOpacity style={buttonStyles} onPress={onPress}>
        <Text style={textStyles}>{buttonText}</Text>
      </TouchableOpacity>
    );
  };

  function findValue(dates: Date) {
    for (let i = 0; i < LiveData.length; i++) {
      const dateValue = LiveData[i].date;
      if (dates == dateValue) {
        return LiveData[i].value;
      }
    }
  }

  const onInvestorPress = async () => {
    setLoading(true);
    // You can perform any actions you want here
    await joinConstraint(
      (value) => {
        setDataReceived(value);
      },
      (joinConstraintData) => {
        setjoinConstraint(joinConstraintData);
        setLoading(false);
      }
    );
  };

  return (
    <View style={{ backgroundColor: color.headerColor, flex: 1 }}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "black" : "white"}
        translucent={false}
      />
      <ScrollView style={{ flex: 1 }}>
        <Loader loading={loading}>
          {joinData?.data?.kycStatus == true ? (
            <View style={styles.container}>
              <HeaderView
                title="Gold Investment"
                onPress={() => {
                  navigation.navigate("orderView");
                }}
              />
              <View style={styles.chartcontainer}>
                <Text style={styles.textBold}>
                  $
                  {currentPrice?.goldAsk?.toFixed(2)
                    ? currentPrice?.goldAsk?.toFixed(2)
                    : "-"}{" "}
                  / Oz
                </Text>
                <View style={styles.pricePercentage}>
                  <Text
                    style={
                      (currentPrice?.goldChange
                        ? currentPrice?.goldChange
                        : 0) >= 0
                        ? styles.textLight
                        : styles.textRed
                    }
                  >
                    $
                    {currentPrice?.goldChange
                      ? currentPrice?.goldChange?.toFixed(2)
                      : "-"}
                  </Text>
                  <Text
                    style={
                      (currentPrice?.goldChangePercent
                        ? currentPrice?.goldChangePercent
                        : 0) >= 0
                        ? [styles.textLight, { paddingLeft: 5 }]
                        : [styles.textRed, { paddingLeft: 5 }]
                    }
                  >
                    {currentPrice?.goldChangePercent
                      ? currentPrice?.goldChangePercent
                      : "-"}
                    %
                  </Text>
                </View>

                {loading ? (
                  <View
                    style={{
                      height: ratioHeightBasedOniPhoneX(350),
                      width: "100%",
                    }}
                  >
                    <Loader loading={loading} />
                  </View>
                ) : (
                  <View style={{ marginTop: ratioHeightBasedOniPhoneX(10) }}>
                    <LineChart
                      areaChart
                      data={LiveData}
                      width={Dimensions.get("window").width}
                      height={ratioHeightBasedOniPhoneX(293)}
                      hideDataPoints
                      spacing={xAxisSpace}
                      color={colors.white}
                      thickness={0.1}
                      startFillColor1="#FFBE2E"
                      endFillColor1={
                        theme === "light" ? colors.white : colored.FilterBg
                      }
                      startOpacity={0.4}
                      endOpacity={0.4}
                      initialSpacing={0}
                      xAxisType="solid"
                      noOfSections={6}
                      yAxisColor="#EBEBEB"
                      yAxisTextStyle={{
                        color:
                          theme === "light" ? colored.textColor : "#878F9D",
                        ...WealthidoFonts.mediumFont(
                          ratioHeightBasedOniPhoneX(10)
                        ),
                      }}
                      yAxisSide="right"
                      yAxisOffset={lowerValue}
                      yAxisThickness={0.5}
                      xAxisThickness={2}
                      rulesType="solid"
                      showVerticalLines
                      verticalLinesColor={"#EBEBEB"}
                      rulesColor="#EBEBEB"
                      verticalLinesSpacing={30}
                      xAxisColor="#EBEBEB"
                      xAxisLabelTextStyle={{
                        color:
                          theme === "light" ? colored.textColor : "#878F9D",
                        ...WealthidoFonts.mediumFont(
                          ratioHeightBasedOniPhoneX(10)
                        ),
                      }}
                      xAxisLabelTexts={LiveDatasort.sort(
                        (a: any, b: any) => a - b
                      )}
                      scrollEnabled={false}
                      pointerConfig={{
                        pointerStripColor: "#BABABA",
                        pointerStripWidth: 2,
                        // activatePointersOnLongPress,
                        // activatePointersDelay: true,
                        strokeDashArray: [5, 5],
                        pointerColor: "#FFBE2E",
                        radius: 5,
                        pointerLabelWidth: ratioWidthBasedOniPhoneX(100),
                        pointerLabelHeight: ratioHeightBasedOniPhoneX(55),
                        activatePointersOnLongPress: false,
                        autoAdjustPointerLabelPosition: true,
                        pointerVanishDelay: 4000,

                        pointerLabelComponent: (items: any) => {
                          return (
                            <View
                              style={{
                                height: ratioHeightBasedOniPhoneX(55),
                                width: ratioWidthBasedOniPhoneX(100),
                              }}
                            >
                              <View
                                style={{
                                  paddingVertical: 6,
                                  borderRadius: 8,
                                  backgroundColor: colors.borderYellow,
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "left",
                                    paddingHorizontal:
                                      ratioHeightBasedOniPhoneX(10),
                                    color:
                                      theme === "light"
                                        ? colored.textColor
                                        : colors.black,
                                    ...WealthidoFonts.mediumFont(
                                      ratioHeightBasedOniPhoneX(12)
                                    ),
                                  }}
                                >
                                  {"$" +
                                    Math.floor(findValue(items[0]?.date)) +
                                    " / Oz"}
                                </Text>
                                <Text
                                  style={{
                                    textAlign: "left",
                                    color: colors.white,
                                    paddingHorizontal:
                                      ratioHeightBasedOniPhoneX(10),
                                    ...WealthidoFonts.semiBoldFont(
                                      ratioHeightBasedOniPhoneX(8)
                                    ),
                                  }}
                                >
                                  {items[0].date}
                                </Text>
                              </View>
                            </View>
                          );
                        },
                      }}
                    />
                  </View>
                )}
                <View style={styles.rowContainer}>
                  {/* <TouchableOpacity style={[styles.buttonContainer, activeButton === '1 D' ? styles.buttonContainerActive : null,]} onPress={() => handleButtonClick('1 D')}>
            <Text style={[styles.buttonTextChart, activeButton === '1 D' ? styles.buttonTextActive : null,]}>1 D</Text >
          </TouchableOpacity> */}

                  <TouchableOpacity
                    style={[
                      styles.buttonContainer,
                      activeButton === "1w"
                        ? styles.buttonContainerActive
                        : null,
                    ]}
                    onPress={() => {
                      getGoldCurrentPrice();
                      getChartData("1w");
                      setActiveButton("1w");
                    }}
                  >
                    <Text
                      style={[
                        styles.buttonTextChart,
                        activeButton === "1w" ? styles.buttonTextActive : null,
                      ]}
                    >
                      1 Week
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.buttonContainer,
                      activeButton === "1m"
                        ? styles.buttonContainerActive
                        : null,
                    ]}
                    onPress={() => {
                      getGoldCurrentPrice();
                      getChartData("1m");
                      setActiveButton("1m");
                    }}
                  >
                    <Text
                      style={[
                        styles.buttonTextChart,
                        activeButton === "1m" ? styles.buttonTextActive : null,
                      ]}
                    >
                      1 Month
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.buttonContainer,
                      activeButton === "3m"
                        ? styles.buttonContainerActive
                        : null,
                    ]}
                    onPress={() => {
                      getGoldCurrentPrice();
                      getChartData("3m");
                      setActiveButton("3m");
                    }}
                  >
                    <Text
                      style={[
                        styles.buttonTextChart,
                        activeButton === "3m" ? styles.buttonTextActive : null,
                      ]}
                    >
                      3 Months
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.buttonContainer,
                      activeButton === "1y"
                        ? styles.buttonContainerActive
                        : null,
                    ]}
                    onPress={() => {
                      getGoldCurrentPrice();
                      getChartData("1y");
                      setActiveButton("1y");
                    }}
                  >
                    <Text
                      style={[
                        styles.buttonTextChart,
                        activeButton === "1y" ? styles.buttonTextActive : null,
                      ]}
                    >
                      1 Year
                    </Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity style={[styles.buttonContainer, activeButton === 'More' ? styles.buttonContainerActive : null,]} onPress={() => handleButtonClick('More')}>
            <Text style={[styles.buttonTextChart, activeButton === 'More' ? styles.buttonTextActive : null,]}>More</Text>
          </TouchableOpacity> */}
                </View>
                <Divider
                  style={{
                    height: ratioHeightBasedOniPhoneX(1),
                    backgroundColor:
                      theme === "light"
                        ? colors.tabBarBorder
                        : "rgba(135, 143, 157, 0.15)",
                  }}
                />
              </View>
              <View style={styles.subscribtionContainer}>
                {subscriptionResponse?.data?.subscription == null ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("SubscriptionplanDetail", {
                        data: undefined,
                      });
                    }}
                    activeOpacity={1}
                  >
                    <ImageBackground
                      source={require("../assets/images/BannerWithicon.png")}
                      style={styles.SubscribtionCard}
                      borderRadius={ratioWidthBasedOniPhoneX(10)}
                    >
                      <SubscribeNow />
                      <View style={styles.SubscribtionLeft}>
                        <View style={styles.subscribtionImage}></View>
                        <View>
                          <Text style={styles.SubscripbeText}>
                            Subscribe now!
                          </Text>
                          <Text style={styles.SubscripbeTextSmall}>
                            Learn here to subscribe gold by daily, weekly or
                            monthly
                          </Text>
                        </View>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("SubScriptionplan", {
                        data: subscriptionResponse,
                      });
                    }}
                    activeOpacity={1}
                  >
                    <ImageBackground
                      style={[styles.SubscribtionSucess]}
                      source={
                        theme === "light"
                          ? require("../assets/images/Yellow.png")
                          : require("../assets/images/Dark_G.png")
                      }
                      resizeMode="stretch"
                    >
                      <View style={styles.SubscribtionLeft}>
                        <View style={styles.subscribtionImage}>
                          {theme == "dark" ? (
                            <SubscribeSucessDark />
                          ) : (
                            <SubscribeSuccess />
                          )}
                        </View>
                        <View>
                          <Text style={styles.SubscribedText}>
                            Subscribed{" "}
                            {subscriptionResponse?.data?.subscription?.plan}!
                          </Text>
                          <Text style={styles.SubscripbedTextSmall}>
                            Stay updated with our weekly subscription for
                            exclusive content.
                          </Text>
                        </View>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.rowContainerButton}>
                <Button
                  type="withdraw"
                  text="Withdraw"
                  onPress={() => {
                    navigation.navigate("withdrawScreen");
                  }}
                />
                <Button
                  type="buy"
                  text="Buy Now"
                  onPress={() => {
                    navigation.navigate("buyGold");
                  }}
                />
              </View>
            </View>
          ) : (
            <ChitFundsExplore
              onPress={async (value) => {
                if (joinData?.data?.investorProfileStatus == false) {
                  return navigation.navigate("InvestorProfile", {
                    onGoBack: onInvestorPress,
                  });
                }
                if (getUserDetails?.data?.kycstatus === "REJECTED") {
                  navigation.navigate("KycUpload");
                } else if (joinData?.data?.kycStatus == false) {
                  createInquiry({
                    onPressIn: async () => {
                      await joinConstraint(
                        (value) => {
                          setDataReceived(value);
                        },
                        (joinConstraintData) => {
                          setjoinConstraint(joinConstraintData);
                        }
                      ),
                        setLoading(false);
                      return;
                    },
                    inquiryId: getUserDetails?.data?.personaInquiryId,
                    sessionToken: getUserDetails?.data?.personaSessionId,
                  });
                  setLoading(true);
                }
              }}
              buttonBackGroundColor={colors.borderYellow}
              HeaderImage={theme === "dark" ? illustrationDarkImage : Slide3}
              title={
                "Digital gold: Empowering you to invest in the world's most enduring asset, effortlessly."
              }
              description={
                "Invest in Gold with our Auto Save: A hassle-free way to invest in gold, saving a little every day for a golden future."
              }
              theme={theme}
            />
          )}
        </Loader>
      </ScrollView>
    </View>
  );
};

export default GoldInvestment;
