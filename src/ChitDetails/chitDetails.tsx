import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
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
import { ChitGroupResponseModelDatum } from "../ChitFundScreen/Model/ChitGroupResponseModelDatum";
import {
  calculateDaysDifference,
  getAuctionButtonEnable,
  subtractNanoseconds,
} from "../Utility";
import URLConstants from "../Networking/URLConstants";
import { LoginResponseModel } from "../LoginScreen/Modal/LoginResponseModel";
import { ThemeContext } from "../Networking/themeContext";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { DateFormatType, toDate } from "../Extension/DateFormatType";
import Loader from "../Loader";
import ChitDetailsLarge from "../assets/images/chitDetails_large.svg";
import ShowAlertMessage from "../Popup/showAlertMessage";
import BottomSheet from "react-native-raw-bottom-sheet";
import CreditSheetContent from "./CreditBottomSheet";
import {
  getUserInfo,
  joinConstraint,
} from "../ChitFundScreen/ChitFundController";
import { JoinConstraintResponseModel } from "../ChitFundScreen/Model/JoinConstraintResponseModel";
import ChitPdf from "./ChitPdf";
import ChitItem from "./ChitItem";
import serverCommunication from "../Networking/serverCommunication";
import OldDeviceLoginAlert from "../Popup/OldDeviceLoginAlert";
import { HttpStatusCode } from "axios";
import MainHeaderView from "../MainHeaderView";
import { paymentTypes } from "../enums";
import strings from "../Extension/strings";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderView from "../ChitFundScreen/HeaderView";
interface ChitDetailsParams {
  tag: any;
  data: ChitGroupResponseModelDatum;
  back: any;
}

const ChitDetails = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const Params = route.params as ChitDetailsParams;
  const fromDate = new Date(Params?.data?.from ?? "");
  const duration = Params?.data.chitduration;
  const [joinData, setjoinData] = useState<JoinConstraintResponseModel | null>(
    null
  );
  const [userDetails, setUserDetails] = useState<LoginResponseModel | null>(
    null
  );
  const isFocused = useIsFocused();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [loading, setLoading] = useState(false);
  const [navigate, setNavigate] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const bottomSheetRefCredit = useRef<BottomSheet>(null);
  const [isOldDevicePopupVisible, setOldDevicePopupVisible] = useState(false);
  const [OldDevicepopupMessage, setOldDevicePopupMessage] = useState("");
  const action: any = getAuctionButtonEnable(
    Params.data.auctionDate,
    subtractNanoseconds(Params?.data.auctionduration)
  );
  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchData();
    }
  }, [isFocused]);

  const fetchData = async () => {
    try {
      Promise.all([
        getUserInfo((userData) => {
          setUserDetails(userData);
        }),
        joinConstraint(
          (value) => {},
          (joinConstraintData) => {
            setjoinData(joinConstraintData);
          }
        ),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showTextPopup = async (
    title: string,
    message: string,
    navigate?: boolean
  ) => {
    setIsPopupVisible(true);
    setNavigate(navigate ?? false);
    setPopupTitle(title);
    setPopupMessage(message);

    return true;
  };

  const showOldDeviceTextPopup = async (message: string) => {
    setOldDevicePopupVisible(true);
    return setOldDevicePopupMessage(message);
  };

  const digitalChit = async () => {
    setLoading(true);
    setOldDevicePopupVisible(false);
    try {
      await serverCommunication.postApi(
        `${URLConstants.digitalChit}${Params.data.id}`,
        null,
        async (statusCode: number, responseData: any, error: any) => {
          if (responseData.status == HttpStatusCode.Ok) {
            showTextPopup(strings.success, responseData.message, true);
          } else {
            showTextPopup(strings.error, responseData.message);
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    } finally {
      setLoading(false);
    }
  };

  const onPress = () => {
    if (!joinData?.data?.checkEligibilityStatus) {
      bottomSheetRefCredit.current?.open();
    } else if (Params.data.auctionEligibleStatus && action) {
      navigation.navigate("chitAuction", {
        data: Params?.data,
        userId: userDetails?.data?.id,
        back: Params?.back,
      });
    } else if (Params.data.latePaymentChargeStatus) {
      navigation.navigate("TotalPayableScreen", {
        amount: Params?.data.contribution,
        data: Params?.data,
        type: paymentTypes.dueAmount,
      });
    } else if (Params.data.auctionAmountClaim) {
      navigation.navigate("UploadAllDocumentScreen");
    } else if (
      !Params?.data.exitStatus &&
      Params?.data.exitStatus != undefined
    ) {
      if (Params.data.paymentStatus) {
        showOldDeviceTextPopup(
          "Are you sure you want to exit the chit group? A processing fee of 5% will be deducted from the payment you have made."
        );
      } else {
        showOldDeviceTextPopup("Are you sure you want to exit the chit group?");
      }
    } else {
      navigation.navigate("TotalPayableScreen", {
        amount: Params?.data.contribution,
        data: Params?.data,
        type: paymentTypes.chitJoin,
      });
    }
  };

  const getButtonText = () => {
    if (!joinData?.data?.checkEligibilityStatus && joinData?.data != null) {
      return "Check Eligibility";
    } else if (Params.data.latePaymentChargeStatus) {
      return "Pay Due Amount";
    } else if (Params.data.auctionEligibleStatus && action) {
      return "Join Auction";
    } else if (Params.data.auctionAmountClaim) {
      return "Claim Now";
    } else if (
      !Params?.data.exitStatus &&
      Params?.data.exitStatus != undefined
    ) {
      return "Exit Chit";
    } else {
      return "Join Now";
    }
  };
  const styles = StyleSheet.create({
    main: {
      backgroundColor: colored.blackColor,
      flex: 1,
    },
    container: {
      flex: 1,
    },
    mainContainer: {
      paddingHorizontal: ratioHeightBasedOniPhoneX(20),
      alignItems: "center",
      flexDirection: "column",
    },
    chitFund: {
      textAlign: "center",
      color: colored.lightblack,
      marginTop: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    eligible: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(12)),
      textAlign: "center",
      color: colored.chitDetailTextColor,
      marginTop: ratioHeightBasedOniPhoneX(5),
    },
    chitView: {
      marginTop: ratioHeightBasedOniPhoneX(25),
      backgroundColor: colors.orange,
      paddingVertical: ratioHeightBasedOniPhoneX(15),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    columnView: {
      flexDirection: "column",
      paddingLeft: ratioWidthBasedOniPhoneX(5),
    },
    backGroundView: {
      paddingHorizontal: ratioWidthBasedOniPhoneX(35),
      flexDirection: "row",
    },
    tagImage: {
      width: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(20),
      alignItems: "stretch",
    },
    chitValue: {
      color: colors.white,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    amount: {
      color: colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    actionView: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    auctionAfterView: {
      width: "100%",
      paddingVertical: ratioHeightBasedOniPhoneX(3),
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: colors.goldenyellow,
      alignItems: "center",
    },
    auctionAfterText: {
      color: colors.almostblack,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    auctionDate: {
      color: colors.white,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    date: {
      color: colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(14)),
    },
    sampleView: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      gap: ratioHeightBasedOniPhoneX(11),
      flexDirection: "row",
    },
    contributionTextColor: {
      color: colored.textColor,
      textAlign: "left",
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    contributionChart: {
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: { width: 0.3, height: 0.3 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
        },
        android: {
          elevation: 13,
          shadowColor: colors.black,
        },
      }),
      marginVertical: ratioHeightBasedOniPhoneX(10),
      width: ratioWidthBasedOniPhoneX(335),
      backgroundColor: colored.chitDetailContainer,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: ratioWidthBasedOniPhoneX(15),
      paddingVertical: ratioHeightBasedOniPhoneX(15),
      borderRadius: ratioHeightBasedOniPhoneX(8),
    },
    viewButton: {
      height: ratioHeightBasedOniPhoneX(36),
      width: ratioWidthBasedOniPhoneX(81),
      backgroundColor: colored.buttonGray,
      borderRadius: ratioHeightBasedOniPhoneX(30),
      paddingVertical: ratioHeightBasedOniPhoneX(7),
    },
    viewText: {
      textAlign: "center",
      color: colored.textColor,
      alignContent: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
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
          elevation: 4,
        },
      }),
      marginTop: "auto",
      width: "100%",
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      backgroundColor: colored.darkheaderColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      position: "absolute",
      bottom: 0,
    },
    button: {
      marginVertical: ratioHeightBasedOniPhoneX(16),
      backgroundColor: colored.lightGreen,
      height: ratioHeightBasedOniPhoneX(40),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
    },
    buttonText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    backButton: {
      position: "absolute",
      top: ratioHeightBasedOniPhoneX(68),
      left: ratioWidthBasedOniPhoneX(20),
      zIndex: 1,
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 0.3, height: 0.3 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
    },
    androidShadow: {
      elevation: 4,
    },
  });
  return (
    <SafeAreaView edges={["bottom"]} style={styles.main}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? colored.darkheaderColor : "white"}
        translucent={false}
      />
      <MainHeaderView
        title={"Chit Details"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.mainContainer}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: ratioHeightBasedOniPhoneX(10),
              }}
            >
              <ChitDetailsLarge />
              <Text style={styles.chitFund}>{Params?.data.chitGroupName}</Text>
              <Text style={styles.eligible}>Eligible for all auctions</Text>
            </View>
          </View>
          <View style={styles.chitView}>
            <View style={styles.backGroundView}>
              <Image
                source={require("../assets/images/chitDetails/solar_tag-price-bold.png")}
                style={styles.tagImage}
              />
              <View style={styles.columnView}>
                <Text style={styles.chitValue}>Chit Value</Text>
                <Text style={styles.amount}>${Params?.data.chitValue}</Text>
              </View>
            </View>
            <View
              style={[
                styles.backGroundView,
                { marginRight: ratioHeightBasedOniPhoneX(40) },
              ]}
            >
              <Image
                source={require("../assets/images/chitDetails/calendar-all-fill.png")}
                style={styles.tagImage}
              />
              <View style={styles.columnView}>
                <Text style={styles.chitValue}>Duration</Text>
                <Text style={styles.amount}>{duration} Months</Text>
              </View>
            </View>
          </View>

          {Params?.data.from && (
            <View
              style={[
                styles.actionView,
                {
                  backgroundColor: colors.greyColorBg,
                },
              ]}
            >
              <Text style={styles.auctionDate}>Chit Started on </Text>
              <Text style={styles.date}>
                {toDate(
                  Params?.data?.from?.toString() ?? "",
                  DateFormatType.datePattern
                ).toString()}
              </Text>
            </View>
          )}
          <View style={styles.auctionAfterView}>
            <Text style={styles.auctionAfterText}>Auction After 3 months </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: colored.headerColor,
              alignItems: "center",
              marginBottom: ratioHeightBasedOniPhoneX(40),
            }}
          >
            <View
              style={[
                styles.sampleView,
                { marginTop: ratioHeightBasedOniPhoneX(15) },
              ]}
            >
              <ChitItem
                title="Subscription Amount"
                description={"$" + Params?.data.contribution}
                month="/month"
              />
              <ChitItem
                title="Months Completed"
                description={calculateDaysDifference(fromDate, duration)}
                month=""
              />
            </View>
            <View style={styles.sampleView}>
              <ChitItem
                title="First Auction Date"
                description={
                  Params?.data.auctionDate == undefined
                    ? "----"
                    : toDate(
                        Params?.data.auctionDate?.toString(),
                        DateFormatType.birthDateFormatTwo
                      ).toLocaleString()
                }
                month=""
              />
              <ChitItem
                title="Chit No."
                description={Params?.data.chitGroupId}
                month=""
              />
            </View>
            <View style={styles.sampleView}>
              <ChitItem
                title="Next Auction Bid"
                description={
                  Params?.data.auctionMinBid == undefined
                    ? "----"
                    : `$${Params?.data.auctionMinBid}`
                }
                month=""
              />
              <ChitItem
                title="Members"
                description={`${Params?.data.memberCount}/${Params?.data.participantCount}`}
                month=""
              />
            </View>
            <View style={styles.sampleView}>
              <ChitPdf
                description={"Terms & Condition"}
                onPress={() => {
                  if (
                    Params?.data.terms_Condition != null &&
                    Params?.data.terms_Condition != undefined
                  ) {
                    const params = {
                      url:
                        URLConstants.Image_URL + Params?.data.terms_Condition,
                      title: "Terms & Condition",
                    };
                    navigation.navigate("PdfViewer", params);
                  }
                }}
              />
              <ChitPdf
                description={"Eligibility Criteria"}
                onPress={() => {
                  if (
                    Params?.data.eligibility != null &&
                    Params?.data.eligibility != undefined
                  ) {
                    const params = {
                      url: URLConstants.Image_URL + Params?.data.eligibility,
                      title: "Eligibility Criteria",
                    };
                    navigation.navigate("PdfViewer", params);
                  }
                }}
              />
            </View>

            {Params?.data.contributionStatus !== false &&
              Params?.data.contributionStatus !== undefined && (
                <View style={styles.contributionChart}>
                  <Text style={styles.contributionTextColor}>
                    Contribution Chart
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("contribution", {
                        contributionId: Params?.data,
                        tag: Params?.tag,
                      })
                    }
                    style={styles.viewButton}
                  >
                    <Text style={styles.viewText}>View</Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </View>
      </ScrollView>

      {(!Params?.data.auctionWinnerStatus ||
        Params.data.auctionAmountClaim) && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={[styles.buttonText]}>{getButtonText()}</Text>
          </TouchableOpacity>
        </View>
      )}

      <CreditSheetContent
        onClose={() => {
          fetchData();
          bottomSheetRefCredit?.current?.close();
          navigation.navigate("TotalPayableScreen", {
            amount: Params?.data.contribution,
            data: Params?.data,
            type: paymentTypes.chitJoin,
          });
        }}
        bottomSheetRef={bottomSheetRefCredit}
        setLoading={(loading: boolean | ((prevState: boolean) => boolean)) => {
          setLoading(loading);
        }}
        setLoadingFalse={() => {
          setLoading(false);
        }}
        popupmessage={(text: string) => {
          showTextPopup("", text);
        }}
      />
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => {
          setIsPopupVisible(false);
          if (popupMessage == "Chit group joined successfully" || navigate) {
            if (Params?.tag == "1") {
              navigation.goBack();
              navigation.goBack();
            } else {
              navigation.goBack();
            }
          }
        }}
      />
      <OldDeviceLoginAlert
        isVisible={isOldDevicePopupVisible}
        message={OldDevicepopupMessage}
        onConfirm={digitalChit}
        onClose={() => setOldDevicePopupVisible(false)}
      />
      <Loader loading={loading} children={undefined} />
    </SafeAreaView>
  );
};

export default ChitDetails;
