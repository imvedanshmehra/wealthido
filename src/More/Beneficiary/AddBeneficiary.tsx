import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors, { dark, light } from "../../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../../Extension/ScreenUtils";
import { ThemeContext } from "../../Networking/themeContext";
import Loader from "../../Loader";
import WealthidoFonts from "../../Helpers/WealthidoFonts";
import {
  DateFormatType,
  DobDate,
  toDate,
} from "../../Extension/DateFormatType";
import DatePicker from "../../Extension/DateTimePicker";
import MainHeaderView from "../../MainHeaderView";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatUSCountryCode } from "../../Utility";
import ShowAlertMessage from "../../Popup/showAlertMessage";
import { AddBeneficiaryRequest } from "./Modal/AddBeneficiaryRequest";
import {
  AddBeneficiaryItem,
  EditBeneficiaryItem,
} from "./Controller/BeneficiaryController";
import HTTPStatusCode from "../../Networking/HttpStatusCode";
import { Data } from "./Modal/BeneficiaryListResponseModal";
import BottomButtonsView from "../../BottomButtonsView";
import BottomSheet from "react-native-raw-bottom-sheet";
import PercentImg from "../../assets/images/percentImg.svg";
import validation from "../../RegisterScreen/validation";
import { subDays } from "date-fns";
import strings from "../../Extension/strings";

export type RouteParams = {
  editData: Data;
  data?: Data;
  index?: number;
  addIndex?: number;
  editIndex?: number;
  beneficiaryList?: Data;
};

const AddBeneficiary = () => {
  const navigation: any = useNavigation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const route = useRoute();
  const params = route?.params as RouteParams | undefined;
  const listData = params?.data as Data | undefined;
  const index = params?.index as number | undefined;
  const editData = params?.editData as Data | undefined;
  const editBeneficiaryList = params?.beneficiaryList as Data | undefined;
  const firstName = editData?.firstname ?? "";
  const [name, setName] = useState(firstName ?? "");
  const [nameError, setNameError] = useState("");
  const [address, setAddress] = useState(editData?.address ?? "");
  const [errorAddress, setErrorAddress] = useState("");
  const [lastName, setLastName] = useState(editData?.lastname ?? "");
  const [lastNameError, setLastNameError] = useState("");
  const [mobile, setMobile] = useState(editData?.phoneNo ?? "");
  const [mobileError, setMobileError] = useState("");
  const [email, setEmail] = useState(editData?.email ?? "");
  const [emailError, setEmailError] = useState("");
  const [isFocuseFirstName, setIsFocuseFirstName] = useState(false);
  const [isFocuseLastName, setIsFocuseLastName] = useState(false);
  const [isFocuseDOB, setIsFocuseDOB] = useState(false);
  const [isFocuseEmail, setIsFocuseEmail] = useState(false);
  const [isFocuseMobileNo, setIsFocuseMobileNo] = useState(false);
  const [isFocuseAddress, setIsFocuseAddress] = useState(false);
  const [isFocusePercentage, setIsFocusePercentage] = useState(false);
  const [focusedInputs, setFocusedInputs] = useState(new Set<number>());
  const editPercentage = editData?.percentage
    ? editData?.percentage.toString()
    : index == 0
    ? "100"
    : "";
  const [percentage, setPercentage] = useState(editPercentage);
  const [percentageError, setPercentageError] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState(editData?.dob ?? "");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateError, setDateError] = useState("");
  const [datedPickerVisible, setDatedPickerVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const yesterday = subDays(new Date(), 1);
  const [splitPercentages, setSplitPercentages] = useState({
    id1: null,
    percentage1: null,
    id2: null,
    percentage2: null,
    id3: null,
    percentage3: null,
    id4: null,
    percentage4: null,
    id5: null,
    percentage5: null,
  } as { [key: number]: any });
  const [editSplitPercentages, setEditSplitPercentages] = useState({
    id1: null,
    percentage1: null,
    id2: null,
    percentage2: null,
    id3: null,
    percentage3: null,
    id4: null,
    percentage4: null,
    id5: null,
    percentage5: null,
  } as { [key: string]: any });
  const [splitPercentageError, setSplitPercentageError] = useState({
    errorText1: "",
    errorText2: "",
    errorText3: "",
    errorText4: "",
    errorText5: "",
  } as { [key: string]: string });
  const [percentageChange, setPercentageChange] = useState(false);
  const [tag, setTag] = useState<number>(0);

  useEffect(() => {
    const updatedState = { ...editSplitPercentages };

    if (editBeneficiaryList && index !== 1) {
      editBeneficiaryList?.forEach((beneficiary: any, index: number) => {
        updatedState[`id${index + 1}`] = beneficiary.id;
        updatedState[`percentage${index + 1}`] = beneficiary.percentage;
      });

      setEditSplitPercentages(updatedState);
    }
  }, [editBeneficiaryList]);

  const showTextPopup = async (title: string, message: string) => {
    setPopupVisible(true);
    setPopupTitle(title);
    setPopupMessage(message);
    return true;
  };

  const validateName = (text: string) => {
    setName(text);
    if (!text) {
      setNameError("First Name is required");
    } else if (text.trim().length !== text.length) {
      setNameError("Enter First Name without whitespaces");
    } else if (text !== text.replace(/\s/g, "")) {
      setNameError("Enter without whitespaces");
    } else if (text.length < 3 || text.length > 15) {
      setNameError("The Firstname must be from 3 to 15 characters");
    } else {
      setNameError("");
    }
  };

  const validateLastName = (text: string) => {
    setLastName(text);
    if (!text) {
      setLastNameError("Last Name is required");
    } else if (text.trim().length !== text.length) {
      setLastNameError("Enter Last Name without whitespaces");
    } else if (text !== text.replace(/\s/g, "")) {
      setLastNameError("Enter without whitespaces");
    } else if (text.length < 3 || text.length > 15) {
      setLastNameError("The Lastname must be from 3 to 15 characters");
    } else {
      setLastNameError("");
    }
  };

  const validateAddress = (text: string): void => {
    setAddress(text);
    if (!text) {
      setErrorAddress("");
    } else if (text.length < 20 || text.length > 50) {
      setErrorAddress("Enter Address must be 20 to 50 characters");
    } else {
      setErrorAddress("");
    }
  };

  const validatePercentage = (text: string): void => {
    setPercentage(text);
    editData !== undefined && setPercentageChange(true);

    if (text === "") {
      setPercentageError("Percentage is required");
    } else if (+text > 90) {
      setPercentageError("Percentage should be less than 90%");
    } else if (+text < 10) {
      setPercentageError("Percentage should more than 10%");
    } else if (+text % 1 !== 0) {
      setPercentageError("Invalid number");
    } else if (isNaN(+text)) {
      setPercentageError("Enter Percentage in correct format");
    } else {
      setPercentageError("");
    }
  };

  const validateEmail = (text: string): void => {
    setEmail(text);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(text)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  function validatePhoneNumber(text: string) {
    setMobile(text);

    if (text === "") {
      setMobileError("Phone number is required");
    } else if (text.length !== 10) {
      setMobileError("Enter a valid 10-digit phone number");
    } else {
      setMobileError("");
    }
  }

  const validateDate = (text: string) => {
    if (!text) {
      setDateError("DOB is required");
    } else {
      setDateError("");
    }
  };

  const validateDOB = (text: string) => {
    setSelectedDate(null);
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);

    setCustomDate(date);
  };

  const handleCloseDatePicker = (date: any) => {
    setShowDatePicker(false);
    setSelectedDate(date);
    setCustomDate(
      DobDate(date.toString(), DateFormatType.birthDateFormatThree)
    );
  };

  const showDatedPicker = () => {
    setDatedPickerVisible(true);
  };

  const hideDatedPicker = () => {
    setDatedPickerVisible(false);
  };

  const handleConfirm = (date: any) => {
    if (date) {
      setCustomDate(
        DobDate(date.toString(), DateFormatType.birthDateFormatThree)
      );
      validateDate(date);
    }
    hideDatedPicker();
  };

  const validateFields = () => {
    validateName(name);
    if (nameError) {
      return;
    }
    validateLastName(lastName);
    if (lastNameError) {
      return;
    }

    validateDate(customDate);
    if (dateError) {
      return;
    }

    validateEmail(email);
    if (emailError) {
      return;
    }

    validatePhoneNumber(mobile);
    if (mobileError) {
      return;
    }
  };

  const handleAddBeneficiary = async () => {
    validateFields();
    try {
      if (
        name &&
        lastName &&
        customDate &&
        email &&
        mobile &&
        nameError == "" &&
        lastNameError == "" &&
        dateError == "" &&
        emailError == "" &&
        mobileError == "" &&
        errorAddress == ""
      ) {
        bottomSheetRef.current?.close();
        setLoading(true);
        const Beneficiaryrequest = new AddBeneficiaryRequest(
          name,
          lastName,
          customDate,
          email,
          mobile,
          address,
          splitPercentages
        );
        AddBeneficiaryItem(
          Beneficiaryrequest,
          async (response) => {
            if (response.status === HTTPStatusCode.ok) {
              await showTextPopup(strings.success, response?.message ?? "");
              setTimeout(() => {
                navigation.navigate("BeneficiaryListScreen");
              }, 2000);
            } else {
              showTextPopup(strings.error, response?.message ?? "");
            }
            setLoading(false);
          },
          (error) => {
            showTextPopup(strings.error, error?.message ?? error.Error);
            setLoading(false);
          }
        );
      }
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    }
  };

  const handleAddBeneficiaryPress = async () => {
    if (index === 0) {
      handleAddBeneficiary();
    } else {
      validateFields();
      if (
        name &&
        lastName &&
        email &&
        nameError == "" &&
        lastNameError == "" &&
        dateError == "" &&
        emailError == "" &&
        mobileError == "" &&
        errorAddress == ""
      ) {
        bottomSheetRef.current?.open();
      }
    }
  };
  const handleEditChangingPercentage = async () => {
    try {
      if (
        name &&
        lastName &&
        customDate &&
        email &&
        mobile &&
        nameError == "" &&
        lastNameError == "" &&
        errorAddress == "" &&
        dateError == "" &&
        errorAddress == ""
      ) {
        bottomSheetRef.current?.close();
        setLoading(true);
        const Beneficiaryrequest = new AddBeneficiaryRequest(
          name,
          lastName,
          customDate,
          email,
          mobile,
          address,
          editSplitPercentages
        );
        EditBeneficiaryItem(
          editData?.id,
          Beneficiaryrequest,
          async (response) => {
            if (response.status === HTTPStatusCode.ok) {
              await showTextPopup(strings.success, response?.message ?? "");
              setTimeout(() => {
                navigation.navigate("BeneficiaryListScreen");
              }, 2000);
            } else {
              showTextPopup(strings.error, response?.message ?? "");
            }
            setLoading(false);
          },
          (error) => {
            showTextPopup(strings.error, error?.message ?? error.Error);
            setLoading(false);
          }
        );
      }
    } catch (error) {
      showTextPopup(strings.error, strings.defaultError);
    }
  };

  const handleEditBeneficiary = async () => {
    if (
      editBeneficiaryList?.length >= 2 &&
      name &&
      lastName &&
      customDate &&
      email &&
      mobile &&
      nameError == "" &&
      lastNameError == "" &&
      errorAddress == "" &&
      dateError == "" &&
      errorAddress == ""
    ) {
      bottomSheetRef.current?.open();
      setTag(1);
    } else {
      handleEditChangingPercentage();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    headerContainer: {
      flexDirection: "row",
      paddingHorizontal: ratioWidthBasedOniPhoneX(16),
      alignItems: "center",
      height: ratioHeightBasedOniPhoneX(60),
      backgroundColor: colored.headerColor,
    },
    rowView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: ratioHeightBasedOniPhoneX(20),
      elevation: 5,
    },
    image: {
      height: ratioHeightBasedOniPhoneX(32),
      width: ratioHeightBasedOniPhoneX(32),
      borderRadius: ratioHeightBasedOniPhoneX(32),
    },
    subContainer: {
      flex: 1,
      paddingHorizontal: ratioWidthBasedOniPhoneX(20),
    },
    headerText: {
      paddingLeft: ratioWidthBasedOniPhoneX(5),
      color: colored.textColor,
      alignItems: "center",
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    headerTextContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    backButtonImage: {
      height: ratioHeightBasedOniPhoneX(20),
      width: ratioWidthBasedOniPhoneX(20),
      tintColor: colored.textColor,
    },
    label: {
      color: colors.lightText,
      marginTop: ratioHeightBasedOniPhoneX(5),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    personalInfoText: {
      marginTop: ratioHeightBasedOniPhoneX(10),
      color: theme === "light" ? colors.lightblack : colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    contactInfoText: {
      marginTop: ratioHeightBasedOniPhoneX(15),
      color: theme === "light" ? colors.lightblack : colors.white,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(16)),
    },
    input: {
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.FilterBg,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(15),
      marginBottom: ratioHeightBasedOniPhoneX(3),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    bottomSheetInput: {
      backgroundColor:
        theme === "light" ? colored.headerColor : colored.darkheaderColor,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(15),
      marginBottom: ratioHeightBasedOniPhoneX(3),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
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
    buttonAndroid: {
      backgroundColor: colors.green,
      width: "auto",
      height: ratioHeightBasedOniPhoneX(48),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
      marginTop: Platform.OS == "ios" ? "auto" : ratioHeightBasedOniPhoneX(90),
      marginBottom: ratioHeightBasedOniPhoneX(10),
    },
    buttonText: {
      color: colors.white,
      fontFamily: "Inter-Bold",
      fontSize: ratioHeightBasedOniPhoneX(16),
    },

    //bottomsheet
    headerBottomTitle: {
      color: colored.textColor,
      ...WealthidoFonts.semiBoldFont(ratioHeightBasedOniPhoneX(18)),
    },
    bottomsheetRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    row: {
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
      alignItems: "center",
      paddingVertical: ratioHeightBasedOniPhoneX(15),
    },
    cancelbutton: {
      alignItems: "center",
      justifyContent: "center",
      height: ratioHeightBasedOniPhoneX(40),
      width: ratioWidthBasedOniPhoneX(163),
      backgroundColor:
        theme === "light" ? colored.buttonGray : colored.cancelButtonBg,
      marginRight: ratioWidthBasedOniPhoneX(10),
      borderRadius: ratioHeightBasedOniPhoneX(37),
    },
    depositText: {
      color: colors.white,
      textAlign: "center",
      padding: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.boldFont(ratioHeightBasedOniPhoneX(16)),
    },
    divider: {
      backgroundColor: colors.shadowcolor,
      marginTop: ratioHeightBasedOniPhoneX(3),
      borderBottomWidth: 0.2,
    },
    beneficiaryText: {
      color: colors.mainlyBlue,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
      marginTop: ratioHeightBasedOniPhoneX(5),
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.white,
      width: "auto",
      height: ratioHeightBasedOniPhoneX(80),
      marginTop: ratioHeightBasedOniPhoneX(20),
      shadowColor: colors.black,
      elevation: 20,
    },
    confirmbutton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.orange,
      width: ratioHeightBasedOniPhoneX(163),
      borderRadius: ratioHeightBasedOniPhoneX(24),
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
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    androidShadow: {
      shadowColor: "black",
      shadowOpacity: 0.6,
      shadowRadius: 0.6,
      elevation: 6,
    },
    bottomSheetTextContainer: {
      flexDirection: "column",
    },
    percentImg: {
      paddingTop: ratioHeightBasedOniPhoneX(10),
    },
  });

  /**
   * Renders a TextInput component with the specified props.
   */
  const renderTextInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    error: string | null,
    keyboardType: string,
    onFocus?: () => void,
    onBlur?: () => void,
    isFocuse?: boolean,
    editable: boolean = true,
    onPressIn?: () => void,
    secureTextEntry: boolean = false
  ) => {
    return (
      <TextInput
        label={label}
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        underlineColor={colored.textColor}
        textColor={colored.textColor}
        keyboardType={keyboardType}
        activeUnderlineColor={error ? "red" : colored.textColor}
        style={styles.input}
        selectionColor={colored.textColor}
        outlineColor={colors.inactivegrey}
        outlineStyle={styles.outlineStyle}
        activeOutlineColor={colors.lightGreen}
        onTouchStart={onPressIn}
        returnKeyType={"done"}
        editable={editable}
        secureTextEntry={secureTextEntry}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
  };

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
          value={value}
          onChangeText={onChangeText}
          activeUnderlineColor={nameError ? "red" : colors.black}
          underlineColor={colors.black}
          keyboardType={keyboardType}
          returnKeyType={"done"}
          style={styles.bottomSheetInput}
          textColor={colored.textColor}
          selectionColor={colors.orange}
          cursorColor={colors.orange}
          outlineColor={colors.inactivegrey}
          outlineStyle={styles.outlineStyle}
          activeOutlineColor={colors.lightGreen}
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

  const handleCancelPress = () => {
    navigation.goBack();
  };

  const handleTextChange = (index: any, text: any) => {
    const percentageKey = `percentage${index}`;
    const idKey = `id${index}`;

    if (editData !== undefined && tag === 1) {
      setEditSplitPercentages((prev) => ({
        ...prev,
        [percentageKey]: text,
      }));
    } else {
      setSplitPercentages((prev) => ({
        ...prev,
        [idKey]: (listData && listData[index - 1]?.id) ?? null,
        [percentageKey]: text,
      }));
    }
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

    const renderInput = (i: number) => {
      const label =
        editData !== undefined && tag === 1
          ? editBeneficiaryList?.[i - 1]?.fullName ?? ""
          : (listData && listData[i - 1]?.fullName) ??
            (index + 1 === i ? `${firstName} ${lastName}` : "") ??
            "";

      const value =
        editData !== undefined && tag === 1
          ? editSplitPercentages[`percentage${i}`]?.toString() ?? ""
          : splitPercentages[`percentage${i}`] ?? "";

      const onChangeText = (text: string) => {
        handleTextChange(i, text);
        handleValidatePercentage(i, text);
      };

      // Determine if this input is focused
      const isFocused = focusedInputs.has(i);

      return (
        <View key={i}>
          {renderBottomsheetTextInput(
            label,
            value,
            onChangeText,
            splitPercentageError[`errorText${i}`],
            "numeric",
            () => handleFocus(i), // Call handleFocus on focus
            () => handleBlur(i), // Call handleBlur on blur
            isFocused // Pass the focus status
          )}
        </View>
      );
    };

    if (editData !== undefined && tag === 1) {
      for (let i = 1; i <= index; i++) {
        inputs.push(renderInput(i));
      }
    } else {
      for (let i = 1; i <= index + 1; i++) {
        inputs.push(renderInput(i));
      }
    }

    return inputs;
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <MainHeaderView
        title={editData === undefined ? "Add Beneficiary" : "Edit Beneficiary"}
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={styles.subContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <Text style={styles.personalInfoText}>Personal Info</Text>

            {renderTextInput(
              "First Name",
              name,
              validateName,
              nameError,
              "default",
              () => setIsFocuseFirstName(true),
              () => setIsFocuseFirstName(false),
              isFocuseFirstName,
              true
            )}
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}

            {renderTextInput(
              "Last Name",
              lastName,
              validateLastName,
              lastNameError,
              "default",
              () => setIsFocuseLastName(true),
              () => setIsFocuseLastName(false),
              isFocuseLastName,
              true
            )}
            {lastNameError ? (
              <Text style={styles.errorText}>{lastNameError}</Text>
            ) : null}
            <TouchableOpacity onPress={showDatedPicker} activeOpacity={1}>
              {renderTextInput(
                "Date of Birth",
                customDate,
                validateDOB,
                dateError,
                "number-pad",
                () => setIsFocuseDOB(true),
                () => setIsFocuseDOB(false),
                isFocuseDOB,
                false,
                () => {
                  setShowDatePicker(true);
                },
                false
              )}
            </TouchableOpacity>
            {dateError ? (
              <Text style={styles.errorText}>{dateError}</Text>
            ) : null}
            <Text style={styles.contactInfoText}>Contact Info</Text>
            {renderTextInput(
              "Email*",
              email,
              validateEmail,
              emailError,
              "default",
              () => setIsFocuseEmail(true),
              () => setIsFocuseEmail(false),
              isFocuseEmail,
              true
            )}
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
            {renderTextInput(
              "Mobile No",
              formatUSCountryCode(mobile),
              validatePhoneNumber,
              mobileError,
              "phone-pad",
              () => setIsFocuseMobileNo(true),
              () => setIsFocuseMobileNo(false),
              isFocuseMobileNo,
              true
            )}
            {mobileError ? (
              <Text style={styles.errorText}>{mobileError}</Text>
            ) : null}
            {renderTextInput(
              "Address(Optional)",
              address,
              validateAddress,
              errorAddress,
              "default",
              () => setIsFocuseAddress(true),
              () => setIsFocuseAddress(false),
              isFocuseAddress,
              true
            )}
            {errorAddress ? (
              <Text style={styles.errorText}>{errorAddress}</Text>
            ) : null}
            {index === 0 ? (
              <>
                <TextInput
                  label="Percentage"
                  mode="outlined"
                  value={percentage.toString()}
                  onChangeText={validatePercentage}
                  underlineColor={colored.textColor}
                  textColor={
                    theme === "dark"
                      ? colored.lightblack
                      : isFocusePercentage
                      ? colors.lightGreen
                      : colors.black
                  }
                  keyboardType="numeric"
                  activeUnderlineColor={
                    percentageError ? "red" : colored.textColor
                  }
                  style={styles.input}
                  right={
                    <TextInput.Icon
                      size={20}
                      icon={PercentImg}
                      style={styles.percentImg}
                    />
                  }
                  selectionColor={colored.textColor}
                  outlineColor={colors.inactivegrey}
                  outlineStyle={styles.outlineStyle}
                  activeOutlineColor={colored.textColor}
                  returnKeyType={"done"}
                  editable={index == 0 ? false : true}
                  onFocus={() => setIsFocusePercentage(true)}
                  onBlur={() => setIsFocusePercentage(false)}
                />
                {percentageError ? (
                  <Text style={styles.errorText}>{percentageError}</Text>
                ) : null}
                <Text style={styles.beneficiaryText}>
                  Total percentage of all the beneficiaries should be 100%.
                </Text>
              </>
            ) : null}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>

      <BottomButtonsView
        firstText="Cancel"
        secondText="Save"
        onPressSuccess={
          editData === undefined
            ? handleAddBeneficiaryPress
            : handleEditBeneficiary
        }
        onPressBack={handleCancelPress}
      />

      {Platform.OS == "ios" ? (
        <DatePicker
          showDatePicker={showDatePicker}
          date={selectedDate}
          onClose={handleCloseDatePicker}
          onChange={handleDateChange}
          minimum={new Date()}
        />
      ) : (
        <DateTimePickerModal
          isVisible={datedPickerVisible}
          mode="date"
          display="spinner"
          date={yesterday}
          maximumDate={yesterday}
          minimumDate={new Date(1900, 0, 1)}
          onConfirm={handleConfirm}
          onCancel={hideDatedPicker}
        />
      )}
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
            flexDirection: "column",
            alignItems: "center",
            backgroundColor:
              theme === "light"
                ? colored.headerColor
                : colored.segementBackGround,
            paddingHorizontal: ratioWidthBasedOniPhoneX(20),
          },
        }}
      >
        <View>
          <View style={styles.bottomsheetRow}>
            <Text style={styles.headerBottomTitle}>Split your Percentages</Text>
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
            Please enter the Percentage for Beneficiary.
          </Text>
          {renderMultipleTextInputs(index)}

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
              onPress={
                tag === 1 ? handleEditChangingPercentage : handleAddBeneficiary
              }
              style={styles.confirmbutton}
            >
              <Text style={styles.depositText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
      <Loader loading={loading} children={undefined} />
    </View>
  );
};

export default AddBeneficiary;
