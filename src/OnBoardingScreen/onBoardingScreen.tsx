import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import Swiper from "react-native-swiper";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import colors from "../colors";
import strings from "../Extension/strings";
import StorageService from "../StorageService";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import Slide1 from "../assets/images/Slide1.svg";
import Slide2 from "../assets/images/Slide2.svg";
import Slide3 from "../assets/images/Slide3.svg";
import { ThemeContext } from "../Networking/themeContext";

const OnboardingScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const slides = [
    {
      headerText: strings.investments,
      subheaderText: strings.investmentplatform,
      imageSource: Slide1,
    },
    {
      headerText: strings.financialFreedom,
      subheaderText: strings.conventionalChit,
      imageSource: Slide2,
    },
    {
      headerText: strings.realGold,
      subheaderText: strings.lowCostAcquisition,
      imageSource: Slide3,
    },
  ];

  const navigateToLogin = async (navigation: any) => {
    await StorageService.setOnboarding(true);
    navigation.reset({
      index: 0,
      routes: [{ name: "Logins" }],
    });
  };

  const navigateToSignUp = async (navigation: {
    reset: (arg0: { index: number; routes: { name: string }[] }) => void;
  }) => {
    await StorageService.setOnboarding(true);
    navigation.reset({
      index: 1,
      routes: [{ name: "Logins" }, { name: "SignupScreen" }],
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    slide: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.white,
    },
    headerText: {
      marginTop: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? 60 : 40),
      textAlign: "center",
      alignItems: "center",
      ...WealthidoFonts.georgiaBold(ratioHeightBasedOniPhoneX(56)),
      color: colors.orange,
    },
    dot: {
      backgroundColor: "rgba(0,0,0,.2)",
      width: ratioHeightBasedOniPhoneX(10),
      height: ratioHeightBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(5),
      margin: ratioHeightBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(0),
    },
    activeDot: {
      backgroundColor: colors.orange,
      width: ratioHeightBasedOniPhoneX(10),
      height: ratioHeightBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(5),
      margin: ratioHeightBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(0),
    },
    slideheadertext: {
      marginTop: ratioHeightBasedOniPhoneX(24),
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      color: colors.veryDarkGrayishYellow,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(22)),
    },
    slidesubheadertext: {
      marginTop: ratioHeightBasedOniPhoneX(16),
      textAlign: "center",
      paddingHorizontal: ratioWidthBasedOniPhoneX(47),
      color: colors.veryDarkGrayishYellow,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    button: {
      backgroundColor: colors.lightGreen,
      height: ratioHeightBasedOniPhoneX(48),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(40),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
      marginTop: ratioHeightBasedOniPhoneX(16),
      padding: ratioHeightBasedOniPhoneX(1), // Add padding
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    signupContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: ratioHeightBasedOniPhoneX(16),
      marginBottom: ratioHeightBasedOniPhoneX(24),
    },
    signupText: {
      textAlign: "center",
      color: colors.mainlyBlue,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    login: {
      color: colors.lightGreen,
      padding: ratioHeightBasedOniPhoneX(2),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    buttonContainer: {
      backgroundColor: colors.white,
      height: ratioHeightBasedOniPhoneX(120),
      borderTopWidth:
        theme !== "light" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#EDEDED",
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 2, height: 2 },
      direction: "inherit",
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    androidShadow: {
      shadowColor: colors.black,
      elevation: 25,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={colors.white}
        translucent={false}
      />
      <Text style={styles.headerText}>{strings.wealthido}</Text>
      <Swiper
        loop
        showsPagination
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {slides.map((slide, index) => (
          <View style={styles.slide} key={index}>
            <Text style={styles.slideheadertext}>{slide.headerText}</Text>
            <Text style={styles.slidesubheadertext}>{slide.subheaderText}</Text>
            <View
              style={{
                marginTop:
                  index == 2
                    ? ratioHeightBasedOniPhoneX(55)
                    : ratioHeightBasedOniPhoneX(72),
              }}
            >
              <slide.imageSource />
            </View>
          </View>
        ))}
      </Swiper>
      <View
        style={[
          styles.buttonContainer,
          Platform.OS == "ios" ? styles.iosShadow : styles.androidShadow,
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateToSignUp(navigation)}
        >
          <Text style={styles.buttonText}>{strings.signUp}</Text>
        </TouchableOpacity>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>{strings.account}</Text>
          <TouchableOpacity onPress={() => navigateToLogin(navigation)}>
            <Text style={styles.login}>{strings.login}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;
