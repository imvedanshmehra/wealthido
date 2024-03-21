import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import BottomSheet from "react-native-raw-bottom-sheet";
import { ThemeContext } from "../Networking/themeContext";
import React, { useContext, useState } from "react";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { TextInput } from "react-native-paper";
import validation from "../RegisterScreen/validation";
import StarRating from "react-native-star-rating-widget";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import { CheckEligibiltyModel } from "./Model/CheckEligibiltyModel";
import { formatSSNNumber } from "../Utility";
import HTML from "react-native-render-html";

const CreditSheetContent = ({
  onClose,
  bottomSheetRef,
  setLoading,
  setLoadingFalse,
  popupmessage,
}: {
  onClose: () => void;
  bottomSheetRef: any;
  setLoading: (loading: boolean) => void;
  setLoadingFalse: () => void;
  popupmessage: (text: string) => void;
}) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [SSNno, setSSN] = useState("");
  const [SSNnoError, setSSNError] = useState("");
  const [isFocuseSSNno, setIsFocuseSSNno] = useState(false);
  const [checkEligibilty, setCheckEligibilty] =
    useState<CheckEligibiltyModel | null>(null);
  const percentage = checkEligibilty?.data?.percentage;
  const numberOfStars = percentage ? Math.ceil((percentage / 100) * 0.05) : 0;

  const handleCheckEligibity = async () => {
    const data = {
      ssn: formatSSNNumber(SSNno),
    };
    const errorSSN = validation.validateSSNno(SSNno);
    if (SSNno != "" && SSNnoError == "") {
      bottomSheetRef.current?.close();
      try {
        setLoading(true);
        await serverCommunication.postApi(
          URLConstants.checkEligibility,
          data,
          (statusCode: number, responseData: any, error: any) => {
            if (!error) {
              if (statusCode == HTTPStatusCode.ok) {
                bottomSheetRef?.current?.open();
                setCheckEligibilty(responseData);
              } else {
                popupmessage(responseData?.message ?? "");
              }
            } else {
              popupmessage(responseData?.message ?? "");
            }
          }
        );
      } catch (error) {
        console.error("Error object:", error);
      } finally {
        setLoadingFalse();
      }
    } else {
      setSSNError(errorSSN);
    }
  };

  const styles = StyleSheet.create({
    rowcontainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    SSNnoText: {
      color: colored.textColor,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    SSNsubTitle: {
      color: colors.dimGray,
      marginTop: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    closeButton: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioHeightBasedOniPhoneX(24),
      tintColor: colored.textColor,
    },
    input: {
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.searchBg,
      borderRadius: ratioHeightBasedOniPhoneX(5),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(20),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colors.black,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    error: {
      textAlign: "left",
      paddingTop: ratioHeightBasedOniPhoneX(3),
      color: colors.mainlyRED,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    durationRow: {
      flexDirection: "row",
      marginTop: ratioHeightBasedOniPhoneX(40),
      marginBottom: ratioHeightBasedOniPhoneX(24),
    },

    buttonTextColor: {
      color: colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },

    // Credit UI
    creditText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(18)),
      textAlign: "center",
      marginTop: ratioHeightBasedOniPhoneX(20),
    },
    starContainer: {
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(10),
      marginBottom: ratioHeightBasedOniPhoneX(20),
    },
    starStyle: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(8),
      height: ratioHeightBasedOniPhoneX(32),
    },
    starText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
      color: colored.textColor,
    },
    joinButton: {
      backgroundColor: colors.green,
      height: ratioHeightBasedOniPhoneX(48),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(37),
      marginTop: ratioHeightBasedOniPhoneX(39),
      marginBottom: ratioHeightBasedOniPhoneX(24),
    },
    popupText: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(16)),
      color: colored.textColor,
      textAlign: "center",
    },
    bottomParentContainer: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 0 },
          direction: "inherit",
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        android: {
          shadowColor: colors.black,
          elevation: 10,
          backgroundColor:
            theme === "light" ? colors.white : colored.cardBackGround,
        },
      }),
    },
    bottomContainer: {
      flexDirection: "row",
      gap: ratioHeightBasedOniPhoneX(9),
      backgroundColor: theme === "light" ? colors.white : "transparent",
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      paddingHorizontal: ratioHeightBasedOniPhoneX(20),
    },
    button: {
      backgroundColor: colors.lightGreen,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      marginVertical: ratioHeightBasedOniPhoneX(16),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
  });

  function generateMessage() {
    const percentage = checkEligibilty?.data?.auctionParticipantPercentage || 0; // Default to 0 if percentage is undefined
    return `
    
      <p style='text-align: left; "color:#3F3F3F;" font-size:18px; font-family: "Manrope-Medium"'>
        Your Credit Status is 
        <a style="color:#ff6200;" target="_blank" font-family: "Manrope-SemiBold">BAD</a>, 
        you can take part in auctions once
        <a style="color:#ff6200;" target="_blank">${percentage}% </a> 
         of the 
        <a style="color:#ff6200;" target="_blank"> chit is completed,</a>
        ensuring opportunity for all.
      </p>
    `;
  }

  function generateSuccessMessage() {
    return `
      <p style='text-align: justify;  "color:#3F3F3F;" font-size:18px; font-family: "Manrope-Medium"'>
      Your Credit Status is 
      <a style="color:#ff6200;" target="_blank" font-family: "Manrope-SemiBold">GOOD</a>, 
      so you can actively participate in auctions from their very
      <a style="color:#ff6200;" target="_blank" font-family: "Manrope-SemiBold">first month.</a> 
      </p>
    `;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      closeOnDragDown
      dragFromTopOnly
      onClose={() => {
        setSSN("");
        setSSNError("");
      }}
      customStyles={{
        draggableIcon: { backgroundColor: "transparent" },
        container: {
          backgroundColor:
            theme === "light" ? colored.FilterBg : colored.segementBackGround,
          height: "auto",
          // paddingHorizontal: ratioHeightBasedOniPhoneX(20),
          borderTopColor: colored.shadowcolor,
          borderTopWidth: ratioWidthBasedOniPhoneX(1),
        },
      }}
    >
      {checkEligibilty?.success === true ? (
        <View
          style={{
            flexDirection: "column",
          }}
        >
          <View style={{ paddingHorizontal: ratioHeightBasedOniPhoneX(20) }}>
            <View style={styles.rowcontainer}>
              <Text style={styles.SSNnoText}>Credit verification</Text>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.current?.close();
                }}
              >
                <Image
                  source={require("../assets/images/Close.png")}
                  style={styles.closeButton}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={[styles.creditText, { color: colors.mainlyBlue }]}>
                Credit Status
              </Text>
              <Text style={[styles.creditText, { color: colored.textColor }]}>
                {" "}
                - {checkEligibilty?.data?.status}
              </Text>
            </View>

            <StarRating
              maxStars={5}
              rating={numberOfStars}
              onChange={() => {}}
              starSize={ratioHeightBasedOniPhoneX(40)}
              enableHalfStar={false}
              style={styles.starContainer}
              starStyle={styles.starStyle}
              emptyColor={"#E4E4E7"}
              color="#F9C41C"
            />
            <HTML
              source={{
                html:
                  checkEligibilty?.data?.status !== "EXCELLENT"
                    ? generateMessage()
                    : generateSuccessMessage(),
              }}
              contentWidth={ratioWidthBasedOniPhoneX(375)}
              tagsStyles={{
                a: {
                  textDecorationLine: "none",
                },
              }}
              baseStyle={{
                color: theme === "light" ? "#3F3F3F" : "#A7A9AE",
              }}
              styles={styles.popupText}
            />
          </View>
          <View style={styles.bottomParentContainer}>
            <View style={styles.bottomContainer}>
              <TouchableOpacity onPress={onClose} style={styles.button}>
                <Text style={styles.buttonText}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View>
          <View
            style={{
              paddingHorizontal: ratioHeightBasedOniPhoneX(20),
              marginTop: ratioHeightBasedOniPhoneX(-10),
            }}
          >
            <View style={styles.rowcontainer}>
              <Text style={styles.SSNnoText}>Check Eligibility</Text>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.current?.close();
                }}
              >
                <Image
                  source={require("../assets/images/Close.png")}
                  style={styles.closeButton}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.SSNsubTitle}>
              Please enter your SSN number to verify.
            </Text>
            <TextInput
              label="SSN Number"
              mode="outlined"
              placeholder="Type here..."
              placeholderTextColor={colors.inactivegrey}
              value={formatSSNNumber(SSNno)}
              onChangeText={(text) => {
                setSSN(text);
                setSSNError(validation.validateSSNno(text));
              }}
              underlineColor={colored.textColor}
              keyboardType="number-pad"
              activeUnderlineColor={SSNnoError ? "red" : colors.black}
              style={[styles.input]}
              maxLength={11}
              selectionColor={colored.textColor}
              outlineColor={colors.inactivegrey}
              textColor={
                theme === "dark"
                  ? colors.white
                  : isFocuseSSNno
                  ? colors.lightGreen
                  : colors.black
              }
              outlineStyle={styles.outlineStyle}
              activeOutlineColor={colored.lightGreen}
              onFocus={() => setIsFocuseSSNno(true)}
              onBlur={() => setIsFocuseSSNno(false)}
            />
            {SSNnoError ? <Text style={styles.error}>{SSNnoError}</Text> : null}
          </View>
          <View style={styles.bottomParentContainer}>
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.current?.close();
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
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCheckEligibity}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </BottomSheet>
  );
};
export default CreditSheetContent;
