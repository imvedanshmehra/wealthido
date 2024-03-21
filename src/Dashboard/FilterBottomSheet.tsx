import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import BottomSheet from "react-native-raw-bottom-sheet";
import colors from "../colors";

interface BottomSheetExampleProps { }

import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Button } from "react-native-paper";
import strings from "../Extension/strings";

const BottomSheetExample = ({ navigation }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [value, setValue] = useState<number[]>([25, 75]);
  const [amount, setAmount] = useState<number[]>([25, 75]);
  const [duration, setDuration] = useState<boolean>(false);
  const [durationtwenty, setDurationtwenty] = useState<boolean>(false);
  const [durationfourty, setDurationfourty] = useState<boolean>(false);

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue);
  };
  const handleValueAmountChange = (newValue: number[]) => {
    setAmount(newValue);
  };

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={handleOpenBottomSheet}>
        <Text>Open Bottom Sheet</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        height={460} // Set the height of the bottom sheet
        closeOnDragDown // Allow users to close the bottom sheet by dragging it down
        dragFromTopOnly // Allow users to drag the bottom sheet from the top only
        customStyles={{
          draggableIcon: { backgroundColor: "transparent" },
        }}
      >
        {/* Add your content here */}
        <View style={styles.container}>
          <View style={styles.rowContainer}>
            <Text style={styles.filterText}> {strings.filter} </Text>
            <Text style={styles.resetText}> {strings.reset} </Text>
          </View>
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 14,
              color: colors.black,
              marginTop: 15,
            }}
          >
            Chit Value
          </Text>
          <View style={styles.rowContainer}>
            <Text style={styles.seekBarText}>${value[0]}</Text>
            <Text style={styles.seekBarText}>${value[1]}</Text>
          </View>
          <MultiSlider
            values={value}
            sliderLength={350} // Customize the slider length as needed
            onValuesChange={handleValueChange}
            trackStyle={styles.trackStyle}
            min={0}
            max={100}
            step={1}
            snapped
            allowOverlap
            customMarker={(e) => (
              <View>
                <Image
                  source={require("../assets/images/Ellipse.png")}
                  style={styles.image}
                />
              </View>
            )}
          />
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 14,
              color: colors.black,
              marginTop: 5,
            }}
          >
            Duration
          </Text>
          <View style={styles.durationRow}>
            <TouchableOpacity
              onPress={() => {
                setDuration(!duration);
              }}
              activeOpacity={1}
              style={
                duration === true
                  ? styles.durationContainerGreen
                  : styles.durationContainer
              }
            >
              <Text
                style={
                  duration === true ? styles.textViewGreen : styles.textView
                }
              >
                {strings.twelveMonths}
              </Text>
            </TouchableOpacity>
            <View style={styles.spacing}></View>
            <TouchableOpacity
              onPress={() => {
                setDurationtwenty(!durationtwenty);
              }}
              activeOpacity={1}
              style={
                durationtwenty === true
                  ? styles.durationContainerGreen
                  : styles.durationContainer
              }
            >
              <Text
                style={
                  durationtwenty === true
                    ? styles.textViewGreen
                    : styles.textView
                }
              >
                {strings.twentyFour}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              setDurationfourty(!durationfourty);
            }}
            activeOpacity={1}
            style={
              durationfourty === true
                ? styles.durationContainerGreen
                : styles.durationContainer
            }
          >
            <Text
              style={
                durationfourty === true ? styles.textViewGreen : styles.textView
              }
            >
              {strings.fourtyEight}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 14,
              color: colors.black,
              marginTop: 10,
            }}
          >
            {strings.monthlySubscription}
          </Text>
          <View style={styles.rowContainer}>
            <Text style={styles.seekBarText}>${amount[0]}</Text>
            <Text style={styles.seekBarText}>${amount[1]}</Text>
          </View>
          <MultiSlider
            values={amount}
            sliderLength={350} // Customize the slider length as needed
            onValuesChange={handleValueAmountChange}
            trackStyle={styles.trackStyle}
            min={0}
            max={100}
            step={1}
            snapped
            allowOverlap
            customMarker={(e) => (
              <View>
                <Image
                  source={require("../assets/images/Ellipse.png")}
                  style={styles.image}
                />
              </View>
            )}
          />
          <View style={styles.durationRow}>
            <Button
              onPress={() => {
                bottomSheetRef.current?.close();
              }}
              style={styles.backButton}
              labelStyle={styles.filterText}
            >
              {strings.cancel}
            </Button>
            <View style={styles.spacing}></View>
            <Button
              mode="contained"
              onPress={() => { }}
              style={styles.button}
              labelStyle={styles.buttonTextColor}
            >
              {strings.apply}
            </Button>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  image: {
    height: 25,
    width: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginTop: 10,
  },
  durationRow: {
    flexDirection: "row",
  },
  durationContainer: {
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginTop: 10,
    borderColor: colors.buttonGray,
    borderWidth: 1.5,
    width: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  textView: {
    fontSize: 14,
    color: colors.black,
    textAlign: "center",
    fontFamily: "Inter-Medium",
  },
  spacing: {
    marginHorizontal: 10,
  },
  durationContainerGreen: {
    flexDirection: "row",
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.green,
    marginTop: 10,
    width: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  textViewGreen: {
    fontSize: 14,
    color: colors.white,
    textAlign: "center",
    fontFamily: "Inter-Medium",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trackStyle: {
    height: 5,
    color: colors.green,
    borderRadius: 5,
  },
  pressedMarkerStyle: {
    width: 10,
    height: 10,
  },

  filterText: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: colors.black,
  },
  resetText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: colors.dimGray,
  },
  seekBarText: {
    fontFamily: "Inter-Bold",
    fontSize: 12,
    color: colors.dimGray,
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.green,
    height: 50,
    flex: 0.7,
    justifyContent: "center",
    borderRadius: 30,
    marginTop: 7,
  },
  backButton: {
    backgroundColor: colors.buttonGray,
    height: 50,
    flex: 0.3,
    justifyContent: "center",
    borderRadius: 30,
    marginTop: 7,
  },
  buttonTextColor: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
});

export default BottomSheetExample;
