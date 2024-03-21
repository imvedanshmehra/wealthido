import React, { ReactNode, useContext } from "react";
import { View, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import colors, { dark, light } from "./colors";
import { ThemeContext } from "./Networking/themeContext";

/**
 * Renders an activity indicator while a loading state is true.
 * Uses the `ThemeContext` to determine the theme and applies the corresponding styles.
 *
 * @param loading - Indicates whether the loading state is true or false.
 * @param children - The content to be rendered when the loading state is false.
 * @returns The rendered content or a container with a centered activity indicator.
 */
const Loader = ({
  loading,
  children,
}: {
  loading: boolean;
  children?: ReactNode;
}) => {
  const { theme } = useContext(ThemeContext);
  const colored = theme === "dark" ? dark : light;

  if (!loading) {
    return children; // Render the children directly if loading is false
  }

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: "transparent",
      height: "100%",
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colored.textColor} />
    </View>
  );
};

export default Loader;
