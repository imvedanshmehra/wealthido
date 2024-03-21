import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { ThemeContext } from "../../Networking/themeContext";
import colors, { dark, light } from "../../colors";
import MainHeaderView from "../../MainHeaderView";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../../Extension/ScreenUtils";
import WealthidoFonts from "../../Helpers/WealthidoFonts";
import ThreeDots from "../../assets/images/threeDots.svg";
import { Divider, TextInput } from "react-native-paper";
import BottomSheet from "react-native-raw-bottom-sheet";
import PercentImg from "../../assets/images/percentImg.svg";
import serverCommunication from "../../Networking/serverCommunication";
import URLConstants from "../../Networking/URLConstants";
import HTTPStatusCode from "../../Networking/HttpStatusCode";
import {
  BeneficiaryListResponseModal,
  Data,
} from "./Modal/BeneficiaryListResponseModal";
import BeneficiaryImg from "../../assets/images/beneficiary.svg";
import RightArrow from "../../assets/images/chevron-left.svg";
import Loader from "../../Loader";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { deleteBeneficiary } from "./Controller/BeneficiaryController";
import ShowAlertMessage from "../../Popup/showAlertMessage";
import Popover from "react-native-popover-view";
import validation from "../../RegisterScreen/validation";
import DeleteImg from "../../assets/images/DeleteImg.svg";
import EditImg from "../../assets/images/EditImg.svg";
import strings from "../../Extension/strings";
import { StatusBar } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

const BeneficiaryListScreen = () => {
  const isFocused = useIsFocused();
  const navigation: any = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [beneficiaryList, setBeneficiaryList] =
    useState<BeneficiaryListResponseModal | null>(null);
  const [dataReceived, setDataReceived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [popOverVisible, setPopOverVisible] = useState(false);
  const [itemsCount, setItemsCount] = useState(0);
  const [deleteItem, setDeleteItem] = useState({} as Data);
  const [focusedInputs, setFocusedInputs] = useState(new Set<number>());
  const [splitPercentages, setSplitPercentages] = useState(
    {} as { [key: string]: string }
  );
  const [splitPercentageError, setSplitPercentageError] = useState({
    errorText1: "",
    errorText2: "",
    errorText3: "",
    errorText4: "",
    errorText5: "",
  } as { [key: string]: string });

  const [labelNames, setLabelNames] = useState({
    name1: "",
    name2: "",
    name3: "",
    name4: "",
    name5: "",
  } as { [key: string]: string });

  const openPopover = (item: any) => {
    setSelectedItem(item);
    setPopOverVisible(true);
  };

  const closePopover = () => {
    setSelectedItem(null);
    setPopOverVisible(false);
  };

  const renderMenu = (item: any, index: any) => (
    <View
      style={{
        width: ratioWidthBasedOniPhoneX(180),
        padding: ratioHeightBasedOniPhoneX(10),
      }}
    >
      <TouchableOpacity
        style={{
          marginBottom: ratioHeightBasedOniPhoneX(5),
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          handleEditBeneficiary(item, index);
          closePopover();
        }}
      >
        <EditImg />
        <Text
          style={{
            ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
            textAlign: "center",
            marginLeft: ratioHeightBasedOniPhoneX(8),
          }}
        >{`Edit Beneficiary`}</Text>
      </TouchableOpacity>
      <Divider></Divider>
      <TouchableOpacity
        style={{
          marginTop: ratioHeightBasedOniPhoneX(5),
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          handleDeleteBeneficiary(item);
          closePopover();
        }}
      >
        <DeleteImg />
        <Text
          style={{
            ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
            textAlign: "center",
            marginLeft: ratioHeightBasedOniPhoneX(8),
          }}
        >{`Delete Beneficiary`}</Text>
      </TouchableOpacity>
    </View>
  );

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const getBeneficiaryList = async () => {
    try {
      setLoading(true);
      await serverCommunication.getApi(
        URLConstants.getBeneficiaryList,
        (statusCode: any, responseData: any, error: any) => {
          if (statusCode === HTTPStatusCode.ok) {
            setBeneficiaryList(responseData);
            setItemsCount(responseData?.data?.length);
            setDataReceived(true);
          } else {
            showTextPopup(strings.error, responseData?.message ?? "");
            setLoading(false);
          }
        }
      );
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getBeneficiaryList();
    }
  }, [isFocused]);

  const handleDeleteBeneficiaryItem = (item: any) => {
    setLoading(true);
    if (
      splitPercentageError.errorText1 == "" &&
      splitPercentageError.errorText2 == "" &&
      splitPercentageError.errorText3 == "" &&
      splitPercentageError.errorText4 == "" &&
      splitPercentageError.errorText5 == ""
    ) {
      bottomSheetRef.current?.close();
      try {
        deleteBeneficiary(
          itemsCount === 1 ? item?.id : deleteItem.id,
          splitPercentages,
          (response: any) => {
            showTextPopup(strings.success, response?.message ?? "");
            getBeneficiaryList();
          },
          (error: any) => {
            showTextPopup(strings.error, error?.message ?? "");
          }
        );
      } catch (error) {
        showTextPopup(strings.error, strings.defaultError);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteBeneficiary = async (item: Data) => {
    setDeleteItem(item);
    const updatedBeneficiaryList = beneficiaryList?.data?.filter(
      (beneficiary) => beneficiary.id !== item.id
    );

    setLabelNames((prevLabelNames) => {
      const updatedLabelNames: any = {};
      updatedBeneficiaryList?.forEach((beneficiary, index) => {
        updatedLabelNames[`name${index + 1}`] = beneficiary.fullName;
      });
      return updatedLabelNames;
    });

    const deleteItemId: any = item.id;

    const remainingIds: any =
      beneficiaryList?.data &&
      beneficiaryList?.data
        .map((beneficiary) => beneficiary.id)
        .filter((id) => id !== deleteItemId);

    let stateObject: any = {};
    for (let i = 1; i <= remainingIds?.length; i++) {
      stateObject[`id${i}`] = remainingIds[i - 1];
      stateObject[`percentage${i}`] = null;
    }
    setSplitPercentages(stateObject);

    if (itemsCount === 1) {
      handleDeleteBeneficiaryItem(item);
    } else {
      setTimeout(() => {
        bottomSheetRef.current?.open();
      }, 400);
    }
  };

  const handleEditBeneficiary = (item: Data, index: number) => {
    navigation.navigate("AddBeneficiary", {
      editData: item,
      index: beneficiaryList?.data?.length ?? 0,
      editIndex: index ?? 0,
      beneficiaryList: beneficiaryList?.data,
    });
  };

  const handleNavigateBeneficiary = () => {
    navigation.navigate("AddBeneficiary", {
      data: beneficiaryList?.data,
      index: beneficiaryList?.data?.length ?? 0,
    });
  };

  const renderItem = (item: Data, index: number) => {
    const increasedValue = index + 1;
    return (
      <View
        style={[
          styles.cardContainer,
          index == 0 && { marginTop: ratioHeightBasedOniPhoneX(10) },
          Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
        ]}
      >
        <View style={{ marginTop: ratioHeightBasedOniPhoneX(15) }} />
        <View style={styles.rowView}>
          <View style={styles.rowSubView}>
            <View style={styles.circleView}>
              <Text
                style={{
                  color: colors.white,
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
                }}
              >
                {increasedValue}
              </Text>
            </View>

            <Text
              style={styles.cardNameText}
            >{`${item.firstname} ${item.lastname}`}</Text>
          </View>
          {Platform.OS === "ios" ? (
            <View style={{ marginLeft: ratioHeightBasedOniPhoneX(23) }}>
              <TouchableOpacity onPress={() => openPopover(item)}>
                <ThreeDots />
              </TouchableOpacity>
              <Popover
                isVisible={popOverVisible && selectedItem === item}
                displayArea={{
                  x: 20,
                  y: 110,
                  width: ratioWidthBasedOniPhoneX(340),
                  height: ratioHeightBasedOniPhoneX(1500),
                }}
                from={
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                }
                backgroundStyle={[{ backgroundColor: "transparent" }]}
                popoverStyle={{
                  backgroundColor: colors.white,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3,
                  elevation: 5,
                }}
                placement="bottom"
                onRequestClose={closePopover}
              >
                {renderMenu(item, index)}
              </Popover>
            </View>
          ) : (
            <Menu>
              <MenuTrigger
                text={<ThreeDots />}
                customStyles={{
                  triggerWrapper: {
                    backgroundColor:
                      theme === "light" ? colors.white : "transparent",
                    borderRadius: ratioHeightBasedOniPhoneX(8),
                    shadowOpacity: 0,
                  },
                }}
              />
              <MenuOptions
                optionsContainerStyle={{
                  borderRadius: ratioHeightBasedOniPhoneX(8),
                  opacity: 1,
                  maxWidth: "97%",
                  marginTop: 24,
                }}
              >
                <MenuOption
                  onSelect={() => handleEditBeneficiary(item, index)}
                  style={{
                    padding: ratioHeightBasedOniPhoneX(10),
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <EditImg />
                  <Text
                    style={{
                      color: colors.black,
                      ...WealthidoFonts.mediumFont(
                        ratioHeightBasedOniPhoneX(14)
                      ),
                      marginLeft: ratioHeightBasedOniPhoneX(8),
                    }}
                  >
                    Edit Beneficiary
                  </Text>
                </MenuOption>

                <MenuOption
                  onSelect={() => handleDeleteBeneficiary(item)}
                  style={{
                    padding: ratioHeightBasedOniPhoneX(10),
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <DeleteImg />
                  <Text
                    style={{
                      color: colors.black,
                      ...WealthidoFonts.mediumFont(
                        ratioHeightBasedOniPhoneX(14)
                      ),
                      marginLeft: ratioHeightBasedOniPhoneX(12),
                    }}
                  >
                    Delete Beneficiary
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          )}
        </View>
        <View>
          <Divider style={styles.line} />
        </View>
        <View style={{ marginBottom: ratioHeightBasedOniPhoneX(15) }}>
          <View style={styles.rowView}>
            <View style={styles.columnView}>
              <Text style={styles.cardEmailText}>Email</Text>
              <Text style={styles.cardText}>{item.email}</Text>
            </View>
            <View style={styles.columnView}>
              <Text style={styles.cardEmailText}>Percentage</Text>
              <Text style={[styles.cardText, { alignSelf: "flex-end" }]}>
                {`${item.percentage}%`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.white,
    },
    subContainer: {
      height: ratioHeightBasedOniPhoneX(750),
      backgroundColor: theme === "light" ? "transparent" : colored.FilterBg,
    },
    titleText: {
      marginTop: ratioHeightBasedOniPhoneX(24),
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    popupline: {
      width: ratioWidthBasedOniPhoneX(180),
    },
    row: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    rowView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignContent: "center",
    },
    rowSubView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignContent: "center",
    },
    circleView: {
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioWidthBasedOniPhoneX(32),
      backgroundColor: colors.orange,
      borderRadius: ratioHeightBasedOniPhoneX(50),
    },
    cardContainer: {
      height: "auto",
      width: ratioWidthBasedOniPhoneX(340),
      borderRadius: ratioHeightBasedOniPhoneX(10),
      backgroundColor:
        theme === "light" ? colors.white : colored.cardBackGround,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
      marginBottom: ratioHeightBasedOniPhoneX(22),
      marginLeft: ratioHeightBasedOniPhoneX(18),
      opacity: ratioHeightBasedOniPhoneX(1.2),
      elevation: ratioHeightBasedOniPhoneX(15),
      borderWidth: theme === "light" ? 0 : 1,
      borderColor: theme === "light" ? "transparent" : colored.progressColor,
    },
    CardNumberText: {
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(24)),
      color: colors.white,
      marginTop: ratioHeightBasedOniPhoneX(23),
      textShadowColor: "rgba(0, 0, 0, 0.25)",
    },
    columnView: {
      flexDirection: "column",
      justifyContent: "flex-start",
    },
    cardNameText: {
      alignContent: "center",
      alignItems: "center",
      color: theme === "light" ? colors.lightblack : colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
      maxWidth: ratioHeightBasedOniPhoneX(250),
      marginLeft: ratioHeightBasedOniPhoneX(5),
    },
    cardEmailText: {
      color: colors.lightGreyColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
      marginTop: ratioHeightBasedOniPhoneX(10),
    },
    line: {
      height: ratioHeightBasedOniPhoneX(0.8),
      width: "100%",
      color: colors.cardLineColor,
      backgroundColor:
        theme === "light" ? colored.borderBottomColor : colored.progressColor,
      alignSelf: "center",
      marginTop: ratioHeightBasedOniPhoneX(15),
    },
    cardText: {
      color: theme === "light" ? colors.black : colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(14)),
    },
    ButtonContainer: {
      height: ratioHeightBasedOniPhoneX(80),
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      borderTopWidth:
        theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
      borderColor: "#222528",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "auto",
      position: "absolute",
      bottom: 0,
      right: 0,
      width: "100%",
    },
    Cancelbutton: {
      flex: 1,
      height: ratioHeightBasedOniPhoneX(48),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      backgroundColor: colors.buttonGray,
      marginHorizontal: ratioHeightBasedOniPhoneX(16),
    },
    savebutton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.orange,
      height: ratioHeightBasedOniPhoneX(48),
      width: ratioHeightBasedOniPhoneX(163),
      borderRadius: ratioHeightBasedOniPhoneX(24),
    },
    confirmbutton: {
      flex: 1,
      backgroundColor: colors.orange,
      height: ratioHeightBasedOniPhoneX(40),
      width: ratioHeightBasedOniPhoneX(215),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginHorizontal: ratioHeightBasedOniPhoneX(20),
    },
    disableButton: {
      flex: 1,
      backgroundColor: colors.buttonGray,
      height: ratioHeightBasedOniPhoneX(48),
      width: ratioHeightBasedOniPhoneX(215),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginHorizontal: ratioHeightBasedOniPhoneX(16),
    },
    cancelText: {
      color: theme === "light" ? colors.black : colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    confirmText: {
      color: colors.white,
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    iosShadow: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 0 },
      direction: "inherit",
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    androidShadow: {
      shadowColor: colors.black,
      elevation: 10,
      backgroundColor:
        theme === "light" ? colors.white : colored.cardBackGround,
    },
    androidShadow1: {
      elevation: 10,
    },
    depositText: {
      color: colors.white,
      textAlign: "center",
      padding: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    noDataContainer: {
      marginTop: ratioHeightBasedOniPhoneX(16),
    },
    noDataSubContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: ratioWidthBasedOniPhoneX(342),
      borderRadius: ratioHeightBasedOniPhoneX(10),
      backgroundColor:
        theme === "light" ? colors.white : colored.darkheaderColor,
      paddingHorizontal: ratioWidthBasedOniPhoneX(15),
      paddingVertical: ratioWidthBasedOniPhoneX(8),
      marginLeft: ratioHeightBasedOniPhoneX(18),
      opacity: ratioHeightBasedOniPhoneX(1.2),
      elevation: ratioHeightBasedOniPhoneX(3),
      borderColor: colors.orange,
      borderWidth: ratioHeightBasedOniPhoneX(1),
    },
    noDataTextContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    noDataText: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    noDataSubText: {
      color: colored.dimGray,
      ...WealthidoFonts.regularFont(ratioHeightBasedOniPhoneX(12)),
      paddingTop: ratioHeightBasedOniPhoneX(5),
    },

    //bottomsheet
    headerBottomTitle: {
      color: colored.textColor,
      ...WealthidoFonts.extraBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    bottomsheetRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    error: {
      color: colors.red,
      textAlign: "left",
      fontFamily: "Inter-Medium",
      fontSize: ratioHeightBasedOniPhoneX(12),
      paddingTop: ratioHeightBasedOniPhoneX(3),
    },
    closeImage: {
      height: ratioHeightBasedOniPhoneX(24),
      width: ratioWidthBasedOniPhoneX(24),
      tintColor: colors.lightblack,
    },
    buttonContainerBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: ratioHeightBasedOniPhoneX(16),
      paddingHorizontal: ratioWidthBasedOniPhoneX(15),
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    cancelbutton: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(48),
      width: ratioWidthBasedOniPhoneX(163),
      backgroundColor:
        theme === "light" ? colored.buttonGray : colored.cancelButtonBg,
      marginRight: ratioWidthBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    label: {
      color: colors.lightText,
      marginTop: ratioHeightBasedOniPhoneX(20),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    textContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    input: {
      width: "auto",
      backgroundColor: colored.headerColor,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(24),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    bottomSheetInput: {
      width: "auto",
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(24),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    percentImg: {
      paddingTop: ratioHeightBasedOniPhoneX(10),
    },
    errorText: {
      color: "red",
      textAlign: "left",
      fontSize: ratioHeightBasedOniPhoneX(12),
      fontFamily: "Inter-Medium",
    },
    fivebeneficiaryText: {
      color: colors.lightGreyColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(16)),
    },
    bottomSheetTextContainer: {
      flexDirection: "column",
    },
  });

  const renderBottomsheetTextInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    nameError: string,
    keyboardType: string,
    onFocus?: () => void,
    onBlur?: () => void,
    isFocuse?: boolean
  ) => {
    return (
      <View style={styles.bottomSheetTextContainer}>
        <TextInput
          label={label}
          mode="outlined"
          value={itemsCount == 2 ? "100" : value}
          onChangeText={onChangeText}
          activeUnderlineColor={nameError ? "red" : colors.black}
          underlineColor={colors.black}
          keyboardType={keyboardType}
          style={styles.bottomSheetInput}
          textColor={
            theme === "dark"
              ? colors.white
              : isFocuse
              ? colors.lightGreen
              : colors.black
          }
          selectionColor={colors.orange}
          cursorColor={colors.orange}
          outlineColor={colors.inactivegrey}
          outlineStyle={styles.outlineStyle}
          activeOutlineColor={colors.lightGreen}
          disabled={itemsCount == 2 ? true : false}
          placeholder="Type here..."
          right={
            <TextInput.Icon
              size={20}
              icon={PercentImg}
              style={styles.percentImg}
            />
          }
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
      </View>
    );
  };

  const handleTextChange = (index: any, text: any) => {
    const percentageKey = `percentage${index}`;

    setSplitPercentages((prev) => ({
      ...prev,
      [percentageKey]: text,
    }));
  };

  const handleValidatePercentage = (index: any, text: any) => {
    const errorTextKey = `errorText${index}`;

    setSplitPercentageError((prev) => ({
      ...prev,
      [errorTextKey]: validation.validateBeneficiaryNumber(text),
    }));
  };

  const renderMultipleTextInputs = (index: number) => {
    const inputs = [];
    const id = deleteItem?.id ?? "";

    const handleFocus = (inputIndex: number) => {
      const updatedSet = new Set<number>(focusedInputs);
      updatedSet.add(inputIndex);
      setFocusedInputs(updatedSet);
    };

    const handleBlur = (inputIndex: number) => {
      const updatedSet = new Set<number>(focusedInputs);
      updatedSet.delete(inputIndex);
      setFocusedInputs(updatedSet);
    };

    for (let i = 1; i < index; i++) {
      const label = `${labelNames[`name${i}`]}`;
      const value = splitPercentages[`percentage${i}`] ?? "";
      const onChangeText = (text: string) => {
        handleTextChange(i, text);
        handleValidatePercentage(i, text);
      };

      // Determine if this input is focused
      const isFocused = focusedInputs.has(i);

      inputs.push(
        renderBottomsheetTextInput(
          label,
          value,
          onChangeText,
          splitPercentageError[`errorText${i}`],
          "numeric",
          () => handleFocus(i), // Call handleFocus on focus
          () => handleBlur(i), // Call handleBlur on blur
          isFocused // Pass the focus status
        )
      );
    }
    return inputs;
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar
        backgroundColor={
          theme === "light" ? colors.white : colored.darkheaderColor
        }
      />
      <MainHeaderView
        title={"Beneficiary List"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={styles.subContainer}>
        {beneficiaryList?.data?.length ?? 0 > 0 ? (
          <FlatList
            data={beneficiaryList?.data}
            renderItem={({ item, index }) => renderItem(item, index)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: ratioHeightBasedOniPhoneX(120),
            }}
            keyExtractor={(item) => item?.id.toString()}
          />
        ) : (
          dataReceived &&
          (!beneficiaryList?.data || beneficiaryList?.data?.length === 0) && (
            <View
              style={[
                styles.noDataContainer,
                Platform.OS == "android"
                  ? styles.androidShadow1
                  : styles.iosShadow,
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  handleNavigateBeneficiary();
                }}
                activeOpacity={1}
              >
                <View style={styles.noDataSubContainer}>
                  <View style={styles.noDataTextContainer}>
                    <View
                      style={{ marginBottom: ratioHeightBasedOniPhoneX(5) }}
                    >
                      <BeneficiaryImg />
                    </View>
                    <View style={{ marginLeft: ratioHeightBasedOniPhoneX(10) }}>
                      <Text style={styles.noDataText}>Add Beneficiary</Text>
                      <Text style={styles.noDataSubText}>
                        Add a beneficiary for future purposes
                      </Text>
                    </View>
                  </View>
                  <View>
                    <RightArrow />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>

      {beneficiaryList?.data?.length ?? 0 > 0 ? (
        <View
          style={[
            styles.ButtonContainer,
            Platform.OS == "android" ? styles.androidShadow : styles.iosShadow,
          ]}
        >
          <View style={styles.buttonContainer}>
            {itemsCount !== 5 ? (
              <TouchableOpacity
                style={[
                  styles.confirmbutton,
                  itemsCount == 5 && styles.disableButton,
                ]}
                onPress={() => {
                  handleNavigateBeneficiary();
                }}
                disabled={itemsCount == 5 ? true : false}
              >
                <Text style={styles.confirmText}>Add Beneficiary</Text>
              </TouchableOpacity>
            ) : (
              <Text>
                <Text
                  style={[
                    styles.fivebeneficiaryText,
                    { color: colors.crimsonRed },
                  ]}
                >
                  Note : {""}
                </Text>
                <Text style={styles.fivebeneficiaryText}>
                  You can add only five beneficiary.{" "}
                </Text>
              </Text>
            )}
          </View>
        </View>
      ) : null}
      <ShowAlertMessage
        isVisible={popupVisible}
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
            height: "auto",
            backgroundColor:
              theme === "light" ? colored.headerColor : colored.darkheaderColor,
            borderTopLeftRadius:
              theme == "light" ? ratioWidthBasedOniPhoneX(10) : 0,
            borderTopRightRadius:
              theme == "light" ? ratioWidthBasedOniPhoneX(10) : 0,
            borderTopWidth: ratioWidthBasedOniPhoneX(1),
            borderTopColor: colored.shadowColor,
          },
        }}
      >
        <View
          style={{
            marginTop: ratioHeightBasedOniPhoneX(5),
          }}
        >
          <View style={{ paddingHorizontal: ratioWidthBasedOniPhoneX(15) }}>
            <View style={styles.bottomsheetRow}>
              <Text style={styles.headerBottomTitle}>
                Split Your Percentages
              </Text>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.current?.close();
                }}
              >
                <Image
                  source={require("../../assets/images/Close.png")}
                  style={styles.closeImage}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>
              Split the Percentage for remaining beneficiary .
            </Text>
            {renderMultipleTextInputs(itemsCount)}
          </View>
          <View
            style={{
              borderTopWidth:
                theme !== "dark" ? undefined : ratioHeightBasedOniPhoneX(1),
              borderColor: "#222528",
              marginTop: ratioHeightBasedOniPhoneX(16),
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
                style={styles.savebutton}
                onPress={handleDeleteBeneficiaryItem}
              >
                <Text style={styles.depositText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheet>

      <Loader loading={loading} children={undefined} />
    </SafeAreaView>
  );
};
export default BeneficiaryListScreen;
