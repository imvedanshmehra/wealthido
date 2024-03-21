import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import colors, { dark, light } from "../colors";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { ThemeContext } from "../Networking/themeContext";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import HTML from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

interface MessageProps {
  firstButtonText?: string;
  secondButtonText: string;
  isVisible: boolean;
  message: string;
  firstButtonHide?: boolean;
  onLinkPress: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const ChangePasswordAlertView: React.FC<MessageProps> = React.memo(
  ({
    firstButtonText,
    secondButtonText,
    isVisible,
    message,
    onClose,
    onLinkPress,
    firstButtonHide,
    onOpen,
  }) => {
    const { theme } = useContext(ThemeContext);
    const colored = theme === "dark" ? dark : light;
    const navigation = useNavigation();
    const styles = useMemo(
      () =>
        StyleSheet.create({
          modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          androidShadow: {
            elevation: 2,
          },
          popupContainer: {
            backgroundColor:
              theme === "light" ? colored.headerColor : colored.darkheaderColor,
            borderRadius: ratioHeightBasedOniPhoneX(16),
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
          },
          popupText: {
            marginVertical: ratioHeightBasedOniPhoneX(5),
            ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(16)),
            color:
              theme === "light" ? colored.textColor : colors.lightGreyColor,
            textAlign: "center",
            paddingHorizontal: ratioWidthBasedOniPhoneX(20),
          },
          closeButton: {
            flex: 1,
            backgroundColor: colors.orange,
            borderRadius: ratioHeightBasedOniPhoneX(40),
            alignItems: "center",
            justifyContent: "center",
          },
          closeButtonText: {
            ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
            color: colors.white,
          },
          ImageStyle: {
            height: ratioHeightBasedOniPhoneX(74),
            width: "100%",
          },
          titleText: {
            ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
            color: theme === "light" ? colors.black : colors.white,
            marginTop: ratioHeightBasedOniPhoneX(15),
            paddingHorizontal: ratioWidthBasedOniPhoneX(20),
            textAlign: "center",
          },
          bottomContainer: {
            ...Platform.select({
              ios: {
                shadowColor: theme === "light" ? colors.black : colors.white,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
              },
              android: {
                elevation: 4,
              },
            }),
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor:
              theme === "light" ? colored.headerColor : colored.darkheaderColor,
            borderBottomLeftRadius: ratioHeightBasedOniPhoneX(16),
            borderBottomRightRadius: ratioHeightBasedOniPhoneX(16),
            borderTopWidth:
              theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
            borderColor: "#222528",
            height: ratioHeightBasedOniPhoneX(60),
            paddingVertical: ratioHeightBasedOniPhoneX(10),
            paddingHorizontal: ratioWidthBasedOniPhoneX(20),
            gap: ratioHeightBasedOniPhoneX(7),
          },
        }),
      [colored]
    );

    const handleLinkPress = useMemo(
      () => (event, href) => {
        const parts = href.split("///");
        const forgetScreenText = parts[parts.length - 1];

        if (onLinkPress) {
          onClose();
          navigation.navigate(forgetScreenText);
        }
      },
      [onLinkPress, onClose, navigation]
    );

    const renderersProps = useMemo(
      () => ({
        a: {
          onPress: handleLinkPress,
        },
      }),
      [handleLinkPress]
    );

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View
          style={[
            styles.modalContainer,
            Platform.OS === "ios" ? null : styles.androidShadow,
          ]}
        >
          <View
            style={[
              styles.popupContainer,
              Platform.OS === "ios" ? null : styles.androidShadow,
            ]}
          >
            <Image
              source={require("../assets/images/AlertBgOrange.png")}
              style={styles.ImageStyle}
            />
            <ScrollView style={{ maxHeight: 140 }}>
              <Text style={styles.titleText}>Are you Sure?</Text>
              <View style={styles.popupText}>
                <HTML
                  source={{ html: message }}
                  contentWidth={ratioWidthBasedOniPhoneX(375)}
                  renderersProps={renderersProps}
                  tagsStyles={{
                    a: {
                      textDecorationLine: "none",
                    },
                  }}
                  baseStyle={styles.popupText}
                />
              </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
              {firstButtonHide === false && (
                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.closeButton,
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
                      styles.closeButtonText,
                      { color: colored.lightblack },
                    ]}
                  >
                    {firstButtonText}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onOpen} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>{secondButtonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

export default ChangePasswordAlertView;
