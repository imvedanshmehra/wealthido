import React, { useContext, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "./Extension/ScreenUtils";
import colors, { dark, light } from "./colors";
import { useNavigation } from "@react-navigation/native";
import WealthidoFonts from "./Helpers/WealthidoFonts";
import BackImage from "./assets/images/back.svg";
import CircleArrowIcon from "./assets/images/circleArrowIcon.svg";
import RNExitApp from "react-native-exit-app";
import WhiteBackImage from "./assets/images/WhiteBack.svg";
import { ThemeContext } from "./Networking/themeContext";

interface MainHeaderViewProps {
  title: string;
  showImage: boolean;
  closeApp: boolean;
  bottomBorderLine: boolean;
  whiteTextColor: boolean;
  callback?: () => void;
}

const MainHeaderView: React.FC<MainHeaderViewProps> = ({
  title,
  showImage,
  closeApp,
  bottomBorderLine,
  whiteTextColor,
  callback,
}) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [pressed, setPressed] = useState(false);
  const marginPercentage = 0.2;
  const centerPercentage = 0.7;
  const marginWidth = ratioWidthBasedOniPhoneX(marginPercentage * 100);

  const onPressHandle = () => {
    if (!pressed) {
      setPressed(true);
      if (closeApp) {
        RNExitApp.exitApp();
      } else {
        if (callback) {
          callback();
        }
        navigation.goBack();
      }
    }else{
      if(bottomBorderLine){
        navigation.goBack();      
      }
     
    }
  };
  const styles = StyleSheet.create({
    headerContent: {
      ...Platform.select({
        ios: {
          shadowColor: theme !== "dark" ? colors.silverGrayColor : undefined,
          shadowOffset: { width: 0, height: 3.7 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          elevation: theme !== "dark" ? 5 : undefined,
          shadowColor: theme !== "dark" ? colors.black : undefined,
        },
      }),
      height: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? 78 : 48),
      paddingHorizontal: marginWidth,
      backgroundColor: colored.darkheaderColor,
      borderBottomWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      paddingTop: ratioHeightBasedOniPhoneX(Platform.OS == "ios" ? 36 : 0),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    leftContainer: {
      flex: centerPercentage,
    },
    centerContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    rightContainer: {
      flex: centerPercentage,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
    },
    headerTitle: {
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(18)),
    },
    iconImage: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioHeightBasedOniPhoneX(32),
      borderRadius: ratioHeightBasedOniPhoneX(32),
    },
  });

  return (
    <View
      style={[
        styles.headerContent,
        {
          backgroundColor: colored.darkheaderColor,
        },
      ]}
    >
      <View style={styles.leftContainer}>
        <TouchableOpacity
          style={{
            height: ratioHeightBasedOniPhoneX(20),
            width: ratioWidthBasedOniPhoneX(20),
          }}
          onPress={onPressHandle}
        >
          {whiteTextColor ? (
            <WhiteBackImage style={styles.image} />
          ) : theme === "dark" ? (
            <WhiteBackImage style={styles.image} />
          ) : (
            <BackImage style={styles.image} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.centerContainer}>
        {showImage && <CircleArrowIcon style={styles.iconImage} />}
        <Text
          style={[
            styles.headerTitle,
            whiteTextColor
              ? { color: colors.white }
              : { color: colored.lightGreen },
          ]}
        >
          {title}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.headerTitle}></Text>
      </View>
    </View>
  );
};

export default MainHeaderView;
