import { useNavigation } from "@react-navigation/native";
import React, { useState, useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import colors, { dark, light } from "../colors";
import { ThemeContext } from "../Networking/themeContext";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import { Dropdown } from "react-native-element-dropdown";
import { TextInput } from "react-native-paper";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import MainHeaderView from "../MainHeaderView";

const ContactInformation = () => {
  const navigation = useNavigation();

  const [selectedItem, setSelectedItem] = useState<string>("Option 1");
  const data: { label: string; value: string }[] = [
    { label: "United States of America", value: "United States of America" },
    { label: "India", value: "India" },
  ];

  const { theme } = useContext(ThemeContext);

  const colored = theme === "dark" ? dark : light;
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [address1, setAddress1] = useState("");
  const [address1Error, setAddress1Error] = useState("");
  const [address2, setAddress2] = useState("");
  const [address2Error, setAddress2Error] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactNoError, setContactNoError] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colored.headerColor,
    },
    view: {
      marginHorizontal: ratioWidthBasedOniPhoneX(10),
      marginVertical: ratioHeightBasedOniPhoneX(27),
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
      tintColor: colored.lightblack,
    },
    mainHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      flex: 1,
    },
    headercontent: {
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    Textmain: {
      fontSize: ratioHeightBasedOniPhoneX(16),
      color: colored.black,
      fontFamily: "Inter-SemiBold",
      textAlign: "center",
    },
    rowcontainer: {
      flex: 1,
      justifyContent: "space-between",
      paddingVertical: ratioHeightBasedOniPhoneX(1),
      marginVertical: ratioHeightBasedOniPhoneX(15),
      paddingHorizontal: ratioWidthBasedOniPhoneX(1),
      marginHorizontal: ratioWidthBasedOniPhoneX(15),
    },
    formcontainer: {
      marginVertical: ratioHeightBasedOniPhoneX(10),
    },
    Inputrow: {
      marginBottom: ratioHeightBasedOniPhoneX(24),
    },
    labelBold: {
      fontSize: ratioHeightBasedOniPhoneX(12),
      marginBottom: ratioHeightBasedOniPhoneX(5),
      color: colored.lightText,
      fontFamily: "Inter-SemiBold",
      flexDirection: "row",
    },
    ButtonNextRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: Platform.OS == "ios" ? "auto" : ratioHeightBasedOniPhoneX(120),
      marginBottom: ratioHeightBasedOniPhoneX(10),
    },
    nextbutton: {
      backgroundColor: colored.goldButton,
      textAlign: "centers",
      flex: 1,
      height: ratioHeightBasedOniPhoneX(48),
      justifyContent: "center",
      borderRadius: ratioHeightBasedOniPhoneX(24),
    },
    NextbuttonText: {
      fontSize: ratioWidthBasedOniPhoneX(16),
      fontFamily: "Inter-SemiBold",
      color: "#FFFFFF",
      textAlign: "center",
    },
    InfoText: {
      fontSize: ratioHeightBasedOniPhoneX(12),
      marginTop: ratioHeightBasedOniPhoneX(24),
      fontFamily: "Inter-Medium",
      color: colored.lightText,
    },
    dropdown: {
      marginTop: ratioHeightBasedOniPhoneX(24),
      height: ratioHeightBasedOniPhoneX(48),
      borderColor: colors.inactivegrey,
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      borderRadius: ratioHeightBasedOniPhoneX(5),
      paddingHorizontal: ratioWidthBasedOniPhoneX(8),
      color: colors.lightGreyColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    selectedTextStyle: {
      fontSize: ratioHeightBasedOniPhoneX(14),
      fontFamily: "Inter-Medium",
      color: colored.lightText,
    },
    placeholderStyle: {
      fontSize: ratioHeightBasedOniPhoneX(14),
      fontFamily: "Inter-Medium",
      color: colored.lightText,
    },
    inputSearchStyle: {
      color: colored.gold,
    },
    placeholdertext: {
      color: colored.lightblack,
    },
    input: {
      backgroundColor: colored.headerColor,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(48),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(24),
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
  });

  const validateName = (text: string): void => {
    setName(text);

    if (!text) {
      setNameError("Name is required");
    } else if (text.trim().length !== text.length) {
      setNameError("Enter Name without whitespaces");
    } else if (text.length < 3 || text.length > 50) {
      setNameError("The name must be from 3 to 50 characters");
    } else {
      setNameError("");
    }
  };

  const validateAddress1 = (text: string): void => {
    setAddress1(text);

    if (!text) {
      setAddress1Error("Address 1 is required");
    } else if (text.trim().length !== text.length) {
      setAddress1Error("Enter Address 1 without whitespaces");
    } else if (text.length < 3 || text.length > 50) {
      setAddress1Error("The Address 1 must be from 3 to 50 characters");
    } else {
      setAddress1Error("");
    }
  };
  const validateAddress2 = (text: string): void => {
    setAddress2(text);

    if (!text) {
      setAddress2Error("Address 2 is required");
    } else if (text.trim().length !== text.length) {
      setAddress2Error("Enter Address 2 without whitespaces");
    } else if (text.length < 3 || text.length > 50) {
      setAddress2Error("The Address 2 must be from 3 to 50 characters");
    } else {
      setAddress2Error("");
    }
  };

  const validateContactNo = (text: string): void => {
    setContactNumber(text);

    if (!text) {
      setContactNoError("Contact No is required");
    } else if (text.trim().length !== text.length) {
      setContactNoError("Enter Contact No without whitespaces");
    } else if (text.length < 3 || text.length > 50) {
      setContactNoError("The Contact No must be from 3 to 50 characters");
    } else {
      setContactNoError("");
    }
  };

  const renderTextInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    error: string | null,
    keyboardType: string,
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
        activeOutlineColor={colored.textColor}
        onTouchStart={onPressIn}
        returnKeyType={"done"}
        editable={editable}
        secureTextEntry={secureTextEntry}
      />
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <MainHeaderView
        title="Contact Information"
        showImage={false}
        closeApp={false}
        bottomBorderLine={false}
        whiteTextColor={false}
      />
      <View style={{ paddingHorizontal: ratioWidthBasedOniPhoneX(20) }}>
        {renderTextInput(
          "Name",
          name,
          validateName,
          nameError,
          "default",
          true
        )}
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        {renderTextInput(
          "Address 1",
          address1,
          validateAddress1,
          address1Error,
          "default",
          true
        )}
        {address1Error ? (
          <Text style={styles.errorText}>{address1Error}</Text>
        ) : null}
        {renderTextInput(
          "Address 2",
          address2,
          validateAddress2,
          address2Error,
          "default",
          true
        )}
        {address2Error ? (
          <Text style={styles.errorText}>{address2Error}</Text>
        ) : null}
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          placeholderStyle={styles.placeholderStyle}
          data={data}
          labelField="label"
          valueField="value"
          value={selectedItem}
          maxHeight={100}
          onChangeText={(item) => setSelectedItem(item)}
          onChange={() => {}}
          itemTextStyle={{ fontSize: 14, color: colored.black }}
          // listStyle={{ backgroundColor: 'black' }}
          containerStyle={{
            backgroundColor: colored.cardBackGround,
            borderColor: colored.InputBorder,
          }}
        />
        {renderTextInput(
          "Contact No",
          contactNumber,
          validateContactNo,
          contactNoError,
          "default",
          true
        )}
        {contactNoError ? (
          <Text style={styles.errorText}>{contactNoError}</Text>
        ) : null}
        <Text style={styles.InfoText}>
          Make sure your name and contact information are correct.
        </Text>

        <View style={styles.ButtonNextRow}>
          <TouchableOpacity
            style={styles.nextbutton}
            onPress={() => {
              navigation.navigate("orderView");
            }}
          >
            <Text style={styles.NextbuttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ContactInformation;
