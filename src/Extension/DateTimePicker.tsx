import React, { useState } from "react";
import {
  TouchableOpacity,
  Platform,
  Text,
  StyleSheet,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ratioHeightBasedOniPhoneX } from "./ScreenUtils";
import colors from "../colors";

const DatePicker = ({ showDatePicker, date, onClose, onChange , minimum }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const handleDateChange = (event: any, newDate: any) => {
    if (Platform.OS === "ios") {
      setSelectedDate(newDate);
      onChange(newDate);
    } else {
      setSelectedDate(newDate);
      onClose(newDate);
    }
  };

  return (
    showDatePicker && (
      <View style={styles.container}>
        {Platform.OS === "ios" && (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => onClose(selectedDate)}>
              <Text style={{ color: colors.blueColor }}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
        <DateTimePicker
          value={selectedDate} // Set the value prop to selectedDate
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          style={styles.picker}
          textColor={colors.black}
          maximumDate={minimum}
        />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    margin: 0,
    backgroundColor: Platform.OS === "ios" ? colors.lightGray : "transparent",
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
  },
  header: {
    padding: ratioHeightBasedOniPhoneX(16),
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  picker: {
    backgroundColor: "white",
    color: colors.black,
  },
});

export default DatePicker;
