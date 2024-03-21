import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { ThemeContext } from "../Networking/themeContext";
import Modal from "react-native-modal";
import serverCommunication from "../Networking/serverCommunication";
import URLConstants from "../Networking/URLConstants";
import {
  SubScriptionPlanResponseModel,
  SubScriptionPlanResponseModelData,
  TransactinHistory,
} from "./Model/SubScriptionPlanResponseModel";
import { dateformate, formatNumberWithTwoDecimals } from "../Utility";
import HTTPStatusCode from "../Networking/HttpStatusCode";
import BottomSheet from "react-native-raw-bottom-sheet";
import validation from "../RegisterScreen/validation";
import { TextInput } from "react-native-paper";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import { DateFormatType, toDate } from "../Extension/DateFormatType";
import GoldImageSource from "../assets/images/Gold_fill.svg";
import BackImage from "../assets/images/back.svg";
import WhiteBackImage from "../assets/images/WhiteBack.svg";
import GoldSubscrptionImage from "../assets/images/GoldSubscriptionImage.svg";
import PriceTagSource from "../assets/images/Tagprice.svg";
import Loader from "../Loader";
import ShowAlertMessage from "../Popup/showAlertMessage";
import strings from "../Extension/strings";
import MainHeaderView from "../MainHeaderView";
import ChangePasswordAlertView from "../Popup/ChangePasswordAlertView";

interface SubscriptionPlanParams {
  data: SubScriptionPlanResponseModel;
}

/**
 * Renders a subscription plan screen with header, subscription details, transaction history table, and buttons.
 * Makes an API call to retrieve the subscription plan details and updates the state variable 'subscriptionResponse' with the response data.
 * Allows the user to pause/resume the subscription and edit the plan.
 *
 * @returns JSX elements representing the subscription plan screen.
 */
const SubscriptionPlan = () => {
  const route = useRoute();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [subscriptionResponse, setSubscriptionPlan] =
    useState<SubScriptionPlanResponseModel | null>(null);
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [ReasonNotes, setReasonNotes] = useState("");
  const [ReasonNotesError, setReasonNotesError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [isChangePopupVisible, setChangePopupVisible] = useState(false);

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const subscriptionViewPlan = async () => {
    try {
      await serverCommunication.getApi(
        URLConstants.subscriptionViewPlan,
        (
          statusCode: any,
          responseData: SubScriptionPlanResponseModel,
          error: any
        ) => {
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
      subscriptionViewPlan();
    }
  }, [isFocused]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    view: {
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
    },
    headerContainer: {
      marginTop: ratioHeightBasedOniPhoneX(20),
      flexDirection: "row",
      alignItems: "center",
    },
    backButtonImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      resizeMode: "contain",
      marginLeft: ratioWidthBasedOniPhoneX(10),
      tintColor: colored.black,
    },
    mainHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      marginBottom: ratioHeightBasedOniPhoneX(25),
    },
    SubscriptionPlanImg: {
      height: ratioHeightBasedOniPhoneX(48),
      width: ratioHeightBasedOniPhoneX(48),
    },
    headercontent: {
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    Textmain: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
      color: colored.textColor,
      marginVertical: ratioHeightBasedOniPhoneX(5),
    },
    Textsubs: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      color: colored.lightText,
    },
    Subscriptioncard: {
      backgroundColor:
        theme === "light" ? colors.blackChitColor : colored.darkheaderColor,
      height: ratioHeightBasedOniPhoneX(72),
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      color: colored.white,
    },
    backGroundView: {
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingHorizontal: ratioWidthBasedOniPhoneX(25),
      flex: 1,
    },
    tagImage: {
      marginTop: ratioHeightBasedOniPhoneX(5),
      width: ratioWidthBasedOniPhoneX(20),
      height: ratioHeightBasedOniPhoneX(20),
      alignItems: "stretch",
      tintColor: colored.white,
    },
    columnView: {
      flexDirection: "column",
      paddingVertical: ratioHeightBasedOniPhoneX(3),
      paddingLeft: ratioWidthBasedOniPhoneX(5),
    },
    chitValue: {
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      color: colors.white,
    },
    amount: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
      color: colors.white,
    },
    table: {
      flex: 1,
      marginBottom: ratioHeightBasedOniPhoneX(20),
      textAlign: "center",
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCell: {
      flex: 1,
      padding: ratioHeightBasedOniPhoneX(8),
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      fontSize: ratioHeightBasedOniPhoneX(12),
      fontFamily: "Monrope-Medium",
    },
    headerCell: {
      backgroundColor: colored.white,
    },
    headerText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
      color: theme === "light" ? colored.chitDetailTextColor : "#C1C3CB",
    },
    cellText: {
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(12)),
      color: theme === "light" ? colored.referralCodeText : colors.white,
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "auto",
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      paddingVertical: ratioWidthBasedOniPhoneX(20),
      gap: ratioWidthBasedOniPhoneX(9),
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    Pausebutton: {
      flex: 1,
      borderRadius: ratioHeightBasedOniPhoneX(20),
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      color: colored.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    Editbutton: {
      flex: 1,
      borderRadius: ratioHeightBasedOniPhoneX(37),
      alignItems: "center",
      paddingVertical: ratioWidthBasedOniPhoneX(12),
      marginHorizontal: ratioHeightBasedOniPhoneX(15),
      fontSize: ratioHeightBasedOniPhoneX(16),
      fontFamily: "Monrope-SemiBold",
    },
    PausebuttonText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    EditbuttonText: {
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    ModalContainer: {
      backgroundColor: colored.white,
      padding: ratioHeightBasedOniPhoneX(20),
    },
    ModalTitle: {
      color: colored.lightblack,
      fontSize: ratioHeightBasedOniPhoneX(16),
      marginBottom: ratioHeightBasedOniPhoneX(10),
      fontFamily: "Monrope-SemiBold",
      textAlign: "center",
    },
    ModalSubTitle: {
      color: colored.lightText,
      fontSize: ratioHeightBasedOniPhoneX(12),
      marginBottom: ratioHeightBasedOniPhoneX(10),
      fontFamily: "Monrope-Medium",
      textAlign: "center",
    },
    textArea: {
      height: 80,
      borderColor: colored.InputBorder,
      borderWidth: 1,
      marginVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 10,
      fontSize: ratioHeightBasedOniPhoneX(14),
      color: colored.black,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginBottom: ratioHeightBasedOniPhoneX(20),
      textAlignVertical: "top",
    },
    ModalFooterButton: {
      flexDirection: "row",
      marginHorizontal: ratioWidthBasedOniPhoneX(16),
      justifyContent: "space-between",
      marginLeft: 0,
    },
    ModalCancel: {
      backgroundColor: "#EBEBEB",
      paddingHorizontal: ratioWidthBasedOniPhoneX(50),
      paddingVertical: ratioHeightBasedOniPhoneX(14),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    ModalCancelText: {
      color: "#3F3F3F",
      fontSize: ratioHeightBasedOniPhoneX(16),
      fontFamily: "Monrope-SemiBold",
      textAlign: "center",
    },
    ModalSubmit: {
      backgroundColor: colored.lightGreen,
      paddingHorizontal: ratioWidthBasedOniPhoneX(50),
      paddingVertical: ratioHeightBasedOniPhoneX(14),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    ModalSubmitText: {
      color: "#FFFFFF",
      fontSize: ratioHeightBasedOniPhoneX(16),
      fontFamily: "Monrope-SemiBold",
      textAlign: "center",
    },
    //BottomSheet
    headerBottomTitle: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    headerBottomSubTitle: {
      marginTop: ratioHeightBasedOniPhoneX(12),
      color: colors.dimGray,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    error: {
      color: colors.red,
      textAlign: "left",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      paddingTop: ratioHeightBasedOniPhoneX(3),
    },
    closeImage: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioWidthBasedOniPhoneX(24),
      tintColor: colored.dimGray,
    },
    buttonContainerBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: ratioHeightBasedOniPhoneX(21),
      marginBottom: ratioHeightBasedOniPhoneX(11),
      marginHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    input: {
      backgroundColor: colored.cardBackGround,
      borderRadius: ratioHeightBasedOniPhoneX(5),
      height: ratioHeightBasedOniPhoneX(80),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(15),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    label: {
      color: colors.lightText,
      width: "auto",
      marginTop: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    errorText: {
      color: "red",
      textAlign: "left",
      fontSize: ratioHeightBasedOniPhoneX(12),
      fontFamily: "Inter-Medium",
    },
    confirmbutton: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      backgroundColor: colors.goldButton,
      width: "auto",
      flex: 1,
      borderRadius: ratioHeightBasedOniPhoneX(20),
    },
    cancelbutton: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      backgroundColor:
        theme === "light" ? colored.buttonGray : colored.cancelButtonBg,
      width: "auto",
      flex: 1,
      marginRight: ratioWidthBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(20),
    },
    cancelText: {
      color: colored.textColor,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },

    depositText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    bgPauseText: {
      color: colors.white,
      textAlign: "center",
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
  });

  const renderItem = (Data: TransactinHistory) => {
    return (
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.cellText}>{dateformate(Data?.updatedAt)}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.cellText}>{Data?.planType}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.cellText}>${Data?.amount}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.cellText}>{Data?.gold}g</Text>
        </View>
      </View>
    );
  };

  const RestartButtonProcess = async () => {
    const RequestNotes = {
      notes: ReasonNotes,
    };
    setLoading(true);
    try {
      await serverCommunication.patchApi(
        URLConstants.subscriptionPause +
          subscriptionResponse?.data?.subscription?.id,
        RequestNotes,
        (statusCode: number, responseData: any, error: any) => {
          if (statusCode === HTTPStatusCode.ok) {
            setSubscriptionPlan(responseData);
            subscriptionViewPlan();
            setChangePopupVisible(false);
          } else {
            showTextPopup(strings.error, responseData.message);
            setChangePopupVisible(false);
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
      setChangePopupVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const renderChitDetails = (
    chitTitle: string,
    chitSubTitle: number | undefined,
    ChitImageSource: any,
    durationTitle: string,
    durationSubTitle: number | undefined,
    durationImageSource: any
  ) => (
    <View
      style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}
    >
      <View style={styles.backGroundView}>
        <ChitImageSource style={styles.tagImage} />
        <View style={styles.columnView}>
          <Text style={styles.chitValue}>{chitTitle}</Text>
          <Text style={styles.amount}>
            {chitTitle == "No.of Participants"
              ? `${chitSubTitle}`
              : `${chitSubTitle}g`}
          </Text>
        </View>
      </View>
      <View style={styles.backGroundView}>
        <PriceTagSource style={styles.tagImage} />
        <View style={styles.columnView}>
          <Text style={styles.chitValue}>{durationTitle}</Text>
          <Text style={styles.amount}>
            {durationTitle === "Duration"
              ? `${durationSubTitle} Months`
              : `$ ${durationSubTitle}`}
          </Text>
        </View>
      </View>
    </View>
  );

  const handleConfirmReason = async () => {
    const notesError = validation.validateReasonNotes(ReasonNotes);
    setReasonNotesError(notesError);
    const RequestNotes = {
      notes: ReasonNotes.trim(),
    };

    if (subscriptionResponse?.data?.subscription?.pauseStatus === false) {
      if (ReasonNotes !== "" && ReasonNotesError === "") {
        setLoading(true);
        try {
          await serverCommunication.patchApi(
            URLConstants.subscriptionPause +
              subscriptionResponse?.data?.subscription?.id,
            RequestNotes,
            (statusCode: number, responseData: any, error: any) => {
              if (statusCode === HTTPStatusCode.ok) {
                setSubscriptionPlan(responseData);
                subscriptionViewPlan();
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
        bottomSheetRef.current?.close();
      }
    }
  };

  const renderBottomSheetContent = (
    ReasonNotes: string,
    setReasonNotes: (text: string) => void,
    setReasonNotesError: (error: string) => void,
    ReasonNotesError: string,
    bottomSheetRef: React.RefObject<BottomSheet> // Update with the correct type for BottomSheet
    // Update with the correct type for navigation
  ) => {
    return (
      <View
        style={{
          marginTop: ratioHeightBasedOniPhoneX(-8),
        }}
      >
        <View style={{ marginHorizontal: ratioWidthBasedOniPhoneX(20) }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.headerBottomTitle}>Reason</Text>
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.close();
              }}
            >
              <Image
                source={require("../assets/images/Close.png")}
                style={styles.closeImage}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerBottomSubTitle}>Reason for stop</Text>
          <TextInput
            label="Reasons"
            mode="outlined"
            placeholder="Type here..."
            multiline={true}
            numberOfLines={4}
            onSubmitEditing={() => Keyboard.dismiss()}
            blurOnSubmit={true}
            dense={true}
            textAlign={"left"}
            autoCorrect={false}
            value={ReasonNotes}
            onChangeText={(text) => {
              setReasonNotes(text);
              setReasonNotesError(validation.validateReasonNotes(text));
            }}
            activeUnderlineColor={ReasonNotesError ? "red" : colors.black}
            underlineColor={colors.black}
            keyboardType="email-address"
            style={styles.input}
            returnKeyType={"done"}
            selectionColor={colored.textColor}
            cursorColor={colored.textColor}
            textColor={colored.textColor}
            outlineColor={colors.inactivegrey}
            outlineStyle={styles.outlineStyle}
            activeOutlineColor={colored.textColor}
          />
          {ReasonNotesError ? (
            <Text style={styles.error}>{ReasonNotesError}</Text>
          ) : null}
        </View>
        <View
          style={{
            marginTop: ratioHeightBasedOniPhoneX(21),
            borderTopWidth:
              theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
            borderColor: "#222528",
          }}
        >
          <View style={styles.buttonContainerBottom}>
            <TouchableOpacity
              style={styles.cancelbutton}
              onPress={() => {
                bottomSheetRef.current?.close();
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmbutton}
              onPress={handleConfirmReason}
            >
              <Text style={styles.depositText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={
          theme === "light" ? colors.white : colored.darkheaderColor
        }
      />
      <MainHeaderView
        title={"Subscription Plan"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />

      <View style={styles.mainHeader}>
        <View style={styles.headercontent}>
          <GoldSubscrptionImage />
          <Text style={styles.Textmain}>Subscription Plan</Text>
          <Text style={styles.Textsubs}>
            ${subscriptionResponse?.data?.subscription?.amount}{" "}
            {subscriptionResponse?.data?.subscription?.plan} subscribed on{" "}
            {toDate(
              subscriptionResponse?.data?.subscription?.updatedAt?.toString() ??
                "",
              DateFormatType.shortMonthDateFormat
            ).toString()}
          </Text>
        </View>
      </View>

      <View style={styles.Subscriptioncard}>
        {renderChitDetails(
          "Gold",
          subscriptionResponse?.data?.totalGold,
          GoldImageSource,
          "Amount spent",
          subscriptionResponse?.data?.totalAmount,
          PriceTagSource
        )}
      </View>
      {subscriptionResponse?.data?.subscription?.pauseStatus == true && (
        <View
          style={{
            backgroundColor: colors.red,
            height: ratioHeightBasedOniPhoneX(24),
            justifyContent: "center",
          }}
        >
          <Text style={styles.bgPauseText}>Stopped</Text>
        </View>
      )}

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell]}>
            <Text style={styles.headerText}>Date</Text>
          </View>
          <View style={[styles.tableCell]}>
            <Text style={styles.headerText}>Plan</Text>
          </View>
          <View style={[styles.tableCell]}>
            <Text style={styles.headerText}>Amount</Text>
          </View>
          <View style={[styles.tableCell]}>
            <Text style={styles.headerText}>Gold</Text>
          </View>
        </View>
        <FlatList
          data={subscriptionResponse?.data?.transactionHistory}
          renderItem={({ item }) => renderItem(item)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />
      </View>

      <Modal
        isVisible={isModalVisible}
        style={{ justifyContent: "flex-end", margin: 0 }}
        onBackdropPress={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.ModalContainer}>
          <Text style={styles.ModalTitle}>subscription plan</Text>
          <Text style={styles.ModalSubTitle}>
            Please enter your reason to pause the subscription plan
          </Text>
          <TextInput
            style={styles.textArea}
            multiline={true} // Enable multiline input
            numberOfLines={4} // Set the number of visible lines
          />
          <View style={styles.ModalFooterButton}>
            <TouchableOpacity onPress={toggleModal}>
              <View style={styles.ModalCancel}>
                <Text style={styles.ModalCancelText}>Cancel</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.ModalSubmit}>
                <Text style={styles.ModalSubmitText}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            subscriptionResponse?.data?.subscription?.pauseStatus === true
              ? setChangePopupVisible(true)
              : bottomSheetRef.current?.open();
            setReasonNotes("");
          }}
          style={[
            styles.Pausebutton,
            { backgroundColor: colored.cancelButtonBg },
          ]}
        >
          <Text style={[styles.PausebuttonText, { color: colored.textColor }]}>
            {subscriptionResponse?.data?.subscription?.pauseStatus === true
              ? "Restart"
              : "Stop"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SubscriptionplanDetail", {
              data: subscriptionResponse?.data?.subscription,
            });
          }}
          style={[styles.Pausebutton, { backgroundColor: colors.borderYellow }]}
        >
          <Text style={[styles.PausebuttonText, { color: colors.white }]}>
            Edit Plan
          </Text>
        </TouchableOpacity>
      </View>
      <ShowAlertMessage
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />

      <BottomSheet
        ref={bottomSheetRef}
        closeOnDragDown
        dragFromTopOnly
        customStyles={{
          draggableIcon: { backgroundColor: "transparent" },
          container: {
            backgroundColor: colored.cardBackGround,
            height: "auto",
          },
        }}
      >
        {renderBottomSheetContent(
          ReasonNotes,
          setReasonNotes,
          setReasonNotesError,
          ReasonNotesError,
          bottomSheetRef
        )}
      </BottomSheet>
      <ChangePasswordAlertView
        firstButtonText={"Cancel"}
        secondButtonText={"Confirm"}
        firstButtonHide={false}
        isVisible={isChangePopupVisible}
        message={
          "Your Existing Subscription Plan will be Resumed, Are you sure you want to continue?"
        }
        onClose={() => setChangePopupVisible(false)}
        onOpen={RestartButtonProcess}
        onLinkPress={false}
      />
      <Loader loading={loading} />
    </SafeAreaView>
  );
};

export default SubscriptionPlan;
