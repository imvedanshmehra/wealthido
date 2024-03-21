import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native";
import colors, { dark, light } from "../colors";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Divider } from "react-native-paper";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import StorageService from "../StorageService";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import ShowAlertkycMessage from "../showAlertkycverification";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import chitFundbanner from "../assets/images/homeImage/chitFundbanner.svg";
import illustration_1_ from "../assets/images/homeImage/illustration_1_.svg";
import totalSubscription from "../assets/images/DollorChit.svg";
import totalSavings from "../assets/images/homeImage/totalSavings.svg";
import dividendEarned from "../assets/images/Dividend.svg";
import totalSubscriptionGoldColor from "../assets/images/DollorGold.svg";
import totalSavingsGoldColor from "../assets/images/homeImage/totalSavingsGoldColor.svg";
import dividendEarnedGoldColor from "../assets/images/DividendGold.svg";
import RightArrow from "../assets/images/homeImage/RightArrow.svg";
import RightArrowYellowColor from "../assets/images/homeImage/RightArrowYellowColor.svg";
import { DashboradResponseModel } from "./Model/HomeResponseModel";
import { ScrollView } from "react-native-gesture-handler";
import DigitalGoldBlack from "../assets/images/homeImage/DigitalGold_black.svg";
import Notification from "../assets/images/homeImage/bell.svg";
import UserIcon from "../assets/images/homeImage/UserIcon.svg";
import WalletImage from "../assets/images/homeImage/walletImage.svg";
import ReferralIcon from "../assets/images/homeImage/ReferralIcon.svg";
import YellowReferralIcon from "../assets/images/homeImage/YellowReferralIcon.svg";
import WhiteReferralIcon from "../assets/images/homeImage/WhiteReferralIcon.svg";

const Home = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const color = theme === "dark" ? dark : light;
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [userDashboard, setUserDashboard] = useState<DashboradResponseModel>();
  const isFocused = useIsFocused();
  const [dataReceived, setDataReceived] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const CARD_WIDTH = Dimensions.get("window").width * 0.9;
  const SPACING_FOR_CARD_INSET = Dimensions.get("window").width * 0.0 - 10;

  const colored = theme === "dark" ? dark : light;

  useEffect(() => {
    if (isFocused) {
      showPopUp();
      getUserInfo();
      getDashboardData();
    }
  }, [isFocused]);

  const slidesInvite = [
    {
      headerText:
        "Invite 10 friends & get $5 instantly. Plus \nget up to $50 with each referral!",
      backImage:
        theme === "light"
          ? require("../assets/images/homeImage/Orange.png")
          : require("../assets/images/home-banner-dark-1.png"),
      imageSource: ReferralIcon,
      borderColor: colors.orange,
    },
    {
      headerText:
        "Invite 10 friends & get $5 instantly.Plus \nget up to $50 with each referral!",
      backImage:
        theme === "light"
          ? require("../assets/images/homeImage/Yellow.png")
          : require("../assets/images/home-banner-2-dark.png"),
      imageSource: YellowReferralIcon,
      borderColor: colors.borderYellow,
    },
    {
      headerText:
        "Invite 10 friends & get $5 instantly.Plus \nget up to $50 with each referral!",
      backImage: require("../assets/images/home-banner-dark-3.png"),
      imageSource: WhiteReferralIcon,
      borderColor: colors.orange,
    },
  ];

  const setIndex = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (CARD_WIDTH + 10));
    setCurrentIndex(index);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: color.headerColor,
      flex: 1,
    },
    headerContent: {
      backgroundColor:
        theme === "light" ? color.headerColor : colored.darkheaderColor,
      height: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? 78 : 53),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      paddingTop: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? 36 : 0),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomColor: theme === "dark" ? "#222528" : colors.white,
      borderBottomWidth: theme === "dark" ? 1 : undefined,
      ...Platform.select({
        ios: {
          shadowColor: colors.silverGrayColor,
          shadowOffset: { width: 0, height: theme === "light" ? 2 : 1 },
          shadowOpacity: theme === "light" ? 0.4 : 0.3,
          shadowRadius: theme === "light" ? 0.5 : 0.1,
        },
        android: {
          elevation: theme === "light" ? 5 : 3,
          shadowColor: colors.silverGrayColor,
        },
      }),
    },
    headerImage: {
      height: ratioHeightBasedOniPhoneX(36),
      width: ratioHeightBasedOniPhoneX(36),
      backgroundColor: theme === "light" ? "#FFF3E6" : "#41464C",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ratioHeightBasedOniPhoneX(36),
    },
    notificationImage: {
      height: ratioHeightBasedOniPhoneX(36),
      width: ratioHeightBasedOniPhoneX(36),
      backgroundColor: colors.orange,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ratioHeightBasedOniPhoneX(36),
    },
    headerTitle: {
      color: colors.orange,
      textAlign: "center",
      ...WealthidoFonts.georgiaBold(ratioHeightBasedOniPhoneX(24)),
    },

    cardContainer: {
      borderRadius: ratioHeightBasedOniPhoneX(8),
      marginBottom: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? 10 : 15),
      backgroundColor: color.cardBackGround,
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
      borderColor: theme === "light" ? "#E2E1E1" : "#4C4C55",
      borderWidth: ratioWidthBasedOniPhoneX(1),
      paddingBottom: ratioHeightBasedOniPhoneX(5),
    },
    cardContainerWallet: {
      marginTop: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? -2 : 0),
      borderRadius: ratioHeightBasedOniPhoneX(10),
      paddingBottom: ratioHeightBasedOniPhoneX(15),
    },
    iosShadow: {
      shadowColor: colors.silverGrayColor,
      shadowOffset: { width: 0, height: 3.7 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    androidShadow: {
      elevation: 5,
      shadowColor: colors.silverGrayColor,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomColor: colors.inactivegrey,
      paddingHorizontal: ratioWidthBasedOniPhoneX(35),
    },
    headerText: {
      color: colors.orange,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    wealthidoWalletText: {
      color: theme === "light" ? colors.black : colors.white,
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? 5 : 0),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    headerTextWallet: {
      color: theme === "light" ? color.textColor : colors.lightblack,
      textAlign: "left",
      marginTop: ratioHeightBasedOniPhoneX(24),
      marginBottom: ratioHeightBasedOniPhoneX(27),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    image: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      tintColor: colors.orange,
      resizeMode: "contain",
    },
    walletImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      tintColor: colors.tabText,
      resizeMode: "contain",
    },
    digitalImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      tintColor: colors.borderYellow,
      resizeMode: "contain",
    },
    forwardArrow: {
      height: ratioHeightBasedOniPhoneX(22),
      width: ratioWidthBasedOniPhoneX(22),
      marginLeft: ratioWidthBasedOniPhoneX(72),
      marginTop: ratioWidthBasedOniPhoneX(4),
      tintColor: color.textColor,
    },
    textStyle: {
      color: color.darkgrey,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    textStyleWallet: {
      color: theme === "light" ? color.darkgrey : colors.darkgrey,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },

    walletTextstyle: {
      color: colors.black,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    backgorundView: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: ratioHeightBasedOniPhoneX(6),
      paddingVertical: ratioHeightBasedOniPhoneX(2),
      height: "auto",
    },
    backgorundView1: {
      flexDirection: "row",
      alignItems: "center",
      height: "auto",
      justifyContent: "flex-start",
      paddingHorizontal: ratioWidthBasedOniPhoneX(40),
      gap: ratioHeightBasedOniPhoneX(40),
    },
    textbackgroundContainer: {
      flex: 1,
      alignItems: "center",
      flexDirection: "column",
    },
    textContainer: {
      alignItems: "center",
      flexDirection: "column",
    },
    chitText: {
      color: colors.orange,
      textAlign: "center",
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    chitTextGold: {
      color: colors.borderYellow,
      textAlign: "center",
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    ContainerText: {
      color: color.black,
      textAlign: "left",
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    dot: {
      backgroundColor: theme === "light" ? "rgba(0,0,0,.2)" : "#404049",
      width: ratioHeightBasedOniPhoneX(8),
      height: ratioHeightBasedOniPhoneX(8),
      borderRadius: ratioHeightBasedOniPhoneX(7),
      margin: ratioHeightBasedOniPhoneX(2),
    },
    activeDot: {
      width: ratioHeightBasedOniPhoneX(8),
      height: ratioHeightBasedOniPhoneX(8),
      borderRadius: ratioHeightBasedOniPhoneX(7),
      marginHorizontal: ratioWidthBasedOniPhoneX(1.5),
      backgroundColor: colors.orange,
    },
    slidesBackImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(60),
    },
    innerBorder: {
      flex: 1,
      borderWidth: ratioHeightBasedOniPhoneX(1),
      borderRadius: ratioHeightBasedOniPhoneX(8),
      overflow: "hidden",
      justifyContent: "center",
    },

    rowContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    slideHeaderText: {
      color: theme === "light" ? colors.lightblack : colors.white,
      marginLeft: ratioWidthBasedOniPhoneX(10),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    slideHeaderTextSub: {
      color: colors.white,
      marginLeft: ratioWidthBasedOniPhoneX(10),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    learnMore: {
      borderWidth: ratioWidthBasedOniPhoneX(1),
      borderColor: colors.referralWhite,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      height: ratioHeightBasedOniPhoneX(30),
      width: ratioWidthBasedOniPhoneX(104),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(29),
      alignItems: "center",
    },
    learnText: {
      color: colors.black,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
    },
    swiperStyle: {
      height: ratioHeightBasedOniPhoneX(72),
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const slides = [
    {
      id: "1",
      title: "Digital Chits",
      titleStyle: styles.headerText,
      cardStyle: styles.cardContainer,
      bannerImage: chitFundbanner,
      subsImage: totalSubscription,
      subsImageStyle: styles.image,
      subscriptionText: "Total \n Subscription",
      subscriptionAmount: dataReceived
        ? "$ " + userDashboard?.data?.chitFunds?.totalSubscriptionAmount
        : 0,
      subscriptionAmountStyle: styles.chitText,
      savingsImage: totalSavings,
      savingsImageStyle: styles.image,
      savingText: "Total \n Savings",
      savingsAmount: dataReceived
        ? "$ " + userDashboard?.data?.chitFunds?.totalSaving
        : 0,
      savingsAmountStyle: styles.chitText,
      forwardArrow: RightArrow,
      dividendImage: dividendEarned,
      dividendImageStyle: styles.image,
      dividendText: "Dividend \n Earned",
      dividendAmount: dataReceived
        ? "$ " + userDashboard?.data?.chitFunds?.totalDividendEarning
        : 0,
      dividendAmountStyle: styles.chitText,
      onPress: () => {
        navigation.navigate("ChitFundScreen");
      },
    },

    {
      id: "2",
      title: "Digital Gold",
      titleStyle: [styles.headerText, { color: colors.borderYellow }],
      cardStyle: [styles.cardContainer],
      bannerImage: theme == "dark" ? DigitalGoldBlack : illustration_1_,
      subsImage: totalSubscriptionGoldColor,
      subsImageStyle: styles.digitalImage,
      subscriptionText: "Total \n Subscription",
      subscriptionAmount: dataReceived
        ? "$ " + userDashboard?.data?.digitalGold?.investment
        : 0,
      subscriptionAmountStyle: styles.chitTextGold,
      savingsImage: totalSavingsGoldColor,
      savingsImageStyle: styles.digitalImage,
      savingText: "Total \n Savings",
      savingsAmount: dataReceived
        ? userDashboard?.data?.digitalGold?.holding == 0
          ? "$ " + 0
          : "$ " + userDashboard?.data?.digitalGold?.holding?.toFixed(2)
        : 0,
      savingsAmountStyle: styles.chitTextGold,
      forwardArrow: RightArrowYellowColor,
      dividendImage: dividendEarnedGoldColor,
      dividendImageStyle: styles.digitalImage,
      dividendText: "Dividend \n Earned",
      dividendAmount: dataReceived
        ? userDashboard?.data?.digitalGold?.earned == 0
          ? "$ " + 0
          : "$ " + userDashboard?.data?.digitalGold?.earned?.toFixed(2)
        : 0,
      dividendAmountStyle: styles.chitTextGold,
      onPress: () => {
        navigation.navigate("GoldInvestmentScreen");
      },
    },
  ];

  const showPopUp = async () => {
    const kycPopShow = await StorageService.getIskycApproved();
    setIsAlertVisible(kycPopShow);
  };

  const onConfirm = async () => {
    await StorageService.setIskycApproved(false);
    await setIsAlertVisible(false);
  };

  const getUserInfo = async () => {
    try {
      await serverCommunication.getApi(
        URLConstants.userInfo,
        (statusCode: any, responseData: any, error: any) => {
          if (!error) {
            StorageService.setIsLogin(responseData);
          } else {
          }
        }
      );
    } catch (error) {}
  };

  const getDashboardData = async () => {
    setDataReceived(false);
    try {
      await serverCommunication.getApi(
        URLConstants.dashBoard,
        (statusCode: any, responseData: any, error: any) => {
          setDataReceived(true);
          if (!error) {
            setUserDashboard(responseData);
          } else {
          }
        }
      );
    } catch (error) {
      setDataReceived(true);
    }
  };

  const renderItem = (slides: any, index: number) => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={slides.onPress}>
        <View
          style={[
            slides.cardStyle,
            index == 0 && {
              marginTop: ratioHeightBasedOniPhoneX(
                Platform.OS == "android" ? 15 : 10
              ),
            },
            theme !== "dark" &&
              (Platform.OS == "android"
                ? styles.androidShadow
                : styles.iosShadow),
          ]}
        >
          <View
            style={[
              styles.headerContainer,
              {
                paddingHorizontal: ratioWidthBasedOniPhoneX(5),
                paddingBottom: ratioWidthBasedOniPhoneX(5),
              },
            ]}
          >
            <Text style={{ flex: 1 }}></Text>
            <Text style={[slides.titleStyle, { flex: 1 }]}>{slides.title}</Text>
            <View style={{ flex: 1 }}>
              <slides.forwardArrow style={[styles.forwardArrow]} />
            </View>
          </View>
          <Divider
            style={{
              borderWidth: ratioWidthBasedOniPhoneX(0.3),
              borderColor: theme === "light" ? colors.chartdata : "#4C4C55",
              backgroundColor: theme === "light" ? colors.chartdata : "#4C4C55",
            }}
          />
          <View style={styles.backgorundView}>
            <View style={styles.textbackgroundContainer}>
              <slides.subsImage />
              <Text style={styles.textStyle}>{slides.subscriptionText}</Text>
              <Text style={slides.subscriptionAmountStyle}>
                {slides.subscriptionAmount}
              </Text>
            </View>
            <View
              style={[
                styles.textbackgroundContainer,
                {
                  borderRightWidth: ratioWidthBasedOniPhoneX(1),
                  borderLeftWidth: ratioWidthBasedOniPhoneX(1),
                  borderColor: theme === "light" ? "#16110D" : "#4C4C55",
                  height: "auto",
                  alignSelf: "center",
                },
              ]}
            >
              <View style={styles.textbackgroundContainer}>
                <slides.savingsImage style={slides.savingsImageStyle} />
                <Text style={styles.textStyle}>{slides.savingText}</Text>
                <Text style={slides.savingsAmountStyle}>
                  {slides.savingsAmount}
                </Text>
              </View>
            </View>
            <View style={styles.textbackgroundContainer}>
              <slides.dividendImage style={slides.dividendImageStyle} />
              <Text style={styles.textStyle}>{slides.dividendText}</Text>
              <View>
                <Text style={slides.dividendAmountStyle}>
                  {slides.dividendAmount}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const Card = ({ item, index }) => {
    const borderStyle = {
      overflow: "hidden",
      marginRight: index === 2 ? ratioHeightBasedOniPhoneX(20) : 0,
      width: CARD_WIDTH,
      marginLeft:
        index === 1 || index === 2
          ? ratioWidthBasedOniPhoneX(10)
          : index == 0
          ? ratioWidthBasedOniPhoneX(20)
          : ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(60),
    };
    return (
      <ImageBackground
        source={item.backImage}
        style={[styles.slidesBackImage, borderStyle]}
      >
        <View
          style={[
            styles.innerBorder,
            Platform.OS == "ios"
              ? { alignItems: "center" }
              : { paddingHorizontal: ratioHeightBasedOniPhoneX(20) },
            { borderColor: index !== 2 ? item.borderColor : "transparent" },
          ]}
        >
          <View style={styles.rowContainer}>
            <item.imageSource />
            <Text
              style={
                index === 2 ? styles.slideHeaderTextSub : styles.slideHeaderText
              }
            >
              {item.headerText}
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  };

  const _renderCards = () => {
    return slidesInvite.map((card, index) => (
      <Card key={index} item={card} index={index} />
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? colored.darkheaderColor : "white"}
        translucent={false}
      />
      <View style={[styles.headerContent]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("EditProfile");
          }}
        >
          <View style={styles.headerImage}>
            <UserIcon />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Wealthido"}</Text>
        <TouchableOpacity
          onPress={() => {
            {
              navigation.navigate("notification", { tag: "1" });
            }
          }}
        >
          <View style={styles.notificationImage}>
            <Notification />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: ratioHeightBasedOniPhoneX(15) }} />
      <View>
        <ScrollView
          horizontal={true}
          showsVerticalScrollIndicator={false}
          pagingEnabled
          decelerationRate={0}
          snapToInterval={CARD_WIDTH + ratioWidthBasedOniPhoneX(20)}
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={setIndex}
          contentContainerStyle={{
            paddingHorizontal:
              Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0, // Horizontal spacing before and after the ScrollView
          }}
        >
          {_renderCards()}
        </ScrollView>
      </View>
      <View style={styles.dotsContainer}>
        {slidesInvite.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentIndex && styles.activeDot]}
          />
        ))}
      </View>
      <View>
        <Text style={styles.ContainerText}>Investments Portfolio</Text>
        <FlatList
          data={slides}
          scrollEnabled={false}
          renderItem={({ item, index }) => renderItem(item, index)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        ></FlatList>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("WalletScreen");
          }}
        >
          <View>
            <Text style={styles.wealthidoWalletText}>Wealthido Wallet</Text>

            <ImageBackground
              source={
                theme === "light"
                  ? require("../assets/images/Chits_groups.png")
                  : require("../assets/images/Chits_groups-dark.png")
              }
              style={styles.cardContainerWallet}
            >
              <View
                style={[
                  styles.headerContainer,
                  {
                    paddingHorizontal: ratioHeightBasedOniPhoneX(40),
                    paddingTop: ratioHeightBasedOniPhoneX(15),
                  },
                ]}
              >
                <Text style={[styles.headerTextWallet]}>Wealthido</Text>
                <WalletImage />
              </View>
              <View style={styles.backgorundView1}>
                <View style={[styles.textContainer]}>
                  <Text style={styles.walletTextstyle}>
                    {dataReceived
                      ? userDashboard?.data?.wallet?.walletBalance == 0
                        ? "$ " + 0
                        : "$ " +
                          userDashboard?.data?.wallet?.walletBalance?.toFixed(2)
                      : "$" + 0}
                  </Text>
                  <Text style={[styles.textStyleWallet]}>Wallet Balance</Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.walletTextstyle}>
                    {dataReceived
                      ? "$ " + userDashboard?.data?.wallet?.rewardBalance
                      : 0}
                  </Text>
                  <Text style={[styles.textStyleWallet]}>Rewards Balance</Text>
                </View>
              </View>
              <View
                style={{
                  alignItems: "flex-start",
                  paddingHorizontal: ratioWidthBasedOniPhoneX(40),
                  marginTop: ratioHeightBasedOniPhoneX(20),
                  paddingBottom: ratioHeightBasedOniPhoneX(20),
                }}
              >
                <TouchableOpacity style={[styles.learnMore]}>
                  <Text style={styles.learnText}>Learn More</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      </View>

      <ShowAlertkycMessage
        isVisible={isAlertVisible}
        message={
          "Please update the below details for participating in a chit group & Auction"
        }
        onConfirm={onConfirm}
        descriptionMessage={undefined}
      />
    </View>
  );
};

export default Home;
