import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../Networking/themeContext";
import { dark, light } from "../colors";

export const CustomTooltip = ({ value, position }) => {
  const { x, y } = value;
  const { x: posX, y: posY } = position;
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  const styles = StyleSheet.create({
    tooltip: {
      position: "absolute",
      backgroundColor: colored.cardBackGround,
      padding: 8,
      borderRadius: 8,
      zIndex: 11111,
    },
  });

  return (
    <View style={[styles.tooltip, { left: posX, top: posY - 50 }]}>
      <Text style={{ color: colored.textColor }}>
        {new Date(x).toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </Text>
      <Text style={{ color: colored.textColor }}>${y}</Text>
    </View>
  );
};

export default CustomTooltip;
