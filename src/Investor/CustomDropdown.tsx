import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import colors, { dark, light } from "../colors";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";
import LeftDropdown from "../assets/images/caret-down-fill.svg";
import { ThemeContext } from "../Networking/themeContext";

interface CustomDropdownProps {
  titleText: string;
  categoryData: any;
  value: string;
  onFocus: () => void;
  onBlur: () => void;
  onChangeText: (item: string) => void;
  isFocus: boolean; // Assuming isFocus is a boolean
  isDisabled: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  titleText,
  categoryData,
  value,
  onFocus,
  onBlur,
  onChangeText,
  isFocus,
  isDisabled,
}) => {
  const { theme } = useContext(ThemeContext);

  const colored = theme === "dark" ? dark : light;

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          style={[
            styles.label,
            isFocus && {
              color: colors.lightGreen,
            },
          ]}
        >
          {titleText}
        </Text>
      );
    }
    return null;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme === "light" ? colors.white : colored.FilterBg,
      marginTop: ratioHeightBasedOniPhoneX(15),
    },
    dropdown: {
      height: ratioHeightBasedOniPhoneX(40),
      borderColor: colors.inactivegrey,
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      borderRadius: ratioHeightBasedOniPhoneX(5),
      paddingHorizontal: ratioWidthBasedOniPhoneX(8),
      color: colors.lightGreyColor,
      backgroundColor: theme === "light" ? colors.white : colored.FilterBg,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    icon: {
      marginRight: ratioWidthBasedOniPhoneX(5),
    },
    label: {
      position: "absolute",
      backgroundColor: theme === "light" ? colors.white : colored.FilterBg,
      left: ratioWidthBasedOniPhoneX(10),
      top: ratioHeightBasedOniPhoneX(-10),
      zIndex: 999,
      paddingHorizontal: ratioWidthBasedOniPhoneX(4),
      color: colors.lightGreyColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    placeholderStyle: {
      fontSize: ratioHeightBasedOniPhoneX(14),
    },
    itemTextStyle: {
      color: theme === "light" ? colors.black : colors.white,
      padding: 0,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    selectedTextStyle: {
      color: theme === "light" ? colors.black : colors.white,
      paddingHorizontal: ratioHeightBasedOniPhoneX(6),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(14)),
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
  });

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: colors.lightGreen }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={categoryData}
        showsVerticalScrollIndicator={false}
        maxHeight={100}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select item" : ""}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChangeText}
        containerStyle={{
          padding: 0,
          backgroundColor: theme === "light" ? colors.white : colored.FilterBg,
          borderColor: colors.lightblack,
        }}
        activeColor={theme === "light" ? colors.white : colored.FilterBg}
        itemTextStyle={styles.itemTextStyle}
        disable={isDisabled}
        renderRightIcon={() => <LeftDropdown />}
      />
    </View>
  );
};

export default CustomDropdown;
