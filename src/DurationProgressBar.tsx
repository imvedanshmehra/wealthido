import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Svg, Line } from "react-native-svg";
import colors from "./colors";
import { replaceTimeInDateTime } from "./Utility";

/**
 * Renders a progress bar that represents the elapsed time of an auction.
 *
 * @param {number} duration - The duration of the auction in minutes.
 * @param {string} auctionDate - The date of the auction in the format "YYYY-MM-DD".
 * @param {string} auctionTime - The time of the auction in the format "HH:MM:SS".
 * @returns {JSX.Element} - The rendered progress bar component.
 */
const DurationProgressBar = ({ duration, auctionDate, auctionTime }) => {
  const progressBarHeight = 4;
  const animationDuration = duration * 60 * 1000; // Convert seconds to milliseconds
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = new Date(
      replaceTimeInDateTime(auctionDate, auctionTime)
    ).getTime();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / animationDuration) * 100;
      if (newProgress <= 100) {
        setProgress(newProgress);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [duration]);

  return (
    <View style={styles.container}>
      <Svg width="100%" height={progressBarHeight}>
        <Line
          x1="0"
          y1={progressBarHeight / 2}
          x2={`${progress}%`}
          y2={progressBarHeight / 2}
          stroke={colors.red}
          strokeWidth={progressBarHeight}
        />
      </Svg>
    </View>
  );
};

/**
 * Defines a StyleSheet object with a single style rule for a container.
 * The container has a width of "100%" and a background color of 'colors.lightGray'.
 *
 * @example
 * ```typescript-react
 * import { StyleSheet } from "react-native";
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     width: "100%",
 *     backgroundColor: colors.lightGray,
 *   },
 * });
 * ```
 */
const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.lightGray,
  },
});

export default DurationProgressBar;
