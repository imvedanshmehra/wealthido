import React, { useContext } from "react";
import { TextInput } from "react-native-paper";
import { ThemeContext } from "../Networking/themeContext";
import colors, { dark, light } from "../colors";
import { StyleSheet } from "react-native";
import {
  ratioHeightBasedOniPhoneX,
  ratioWidthBasedOniPhoneX,
} from "../Extension/ScreenUtils";
import WealthidoFonts from "../Helpers/WealthidoFonts";

const renderTextInput = (
  label: string,
  value: string,
  onChangeText: (text: string) => void,
  error: string | null,
  keyboardType: string,
  maxLength?: number | undefined,
  editable: boolean = true,
  onPressIn?: () => void,
  secureTextEntry: boolean = false
) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const styles = StyleSheet.create({
    input: {
      backgroundColor: colored.headerColor,
      borderRadius: ratioHeightBasedOniPhoneX(14),
      height: ratioHeightBasedOniPhoneX(40),
      paddingHorizontal: ratioWidthBasedOniPhoneX(2),
      marginTop: ratioHeightBasedOniPhoneX(10),
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
    outlineStyle: {
      borderWidth: ratioWidthBasedOniPhoneX(0.5),
      color: colored.textColor,
      ...WealthidoFonts.mediumFont(ratioHeightBasedOniPhoneX(12)),
    },
  });

  return (
    <TextInput
      label={label}
      mode="outlined"
      value={value}
      onChangeText={onChangeText}
      underlineColor={colored.textColor}
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
      maxLength={maxLength}
      secureTextEntry={secureTextEntry}
      textColor={theme === "light" ? colors.black : colors.white}
    />
  );
};

export default renderTextInput;
