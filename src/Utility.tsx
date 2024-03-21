import moment, { MomentInput } from "moment";
import React from "react";

class MyComponent extends React.Component {
  static referralCode: any;
}
export default MyComponent;

export const formatTimes = (inputTime: any) => {
  return moment(inputTime, "HH:mm:ss").format("h:mm A");
};

// Replaces the time component in a given date-time string with a new time value.
export const replaceTimeInDateTime = (
  dateTimeString: string,
  newTime: string
): string => {
  const datePart = dateTimeString.split("T")[0];
  const millisecondsIndex = dateTimeString.indexOf(".");
  const hasMilliseconds = millisecondsIndex !== -1;

  let newDateTimeString: string;

  if (hasMilliseconds) {
    newDateTimeString = `${datePart}T${newTime}${dateTimeString.substring(
      millisecondsIndex
    )}`;
  } else {
    newDateTimeString = `${datePart}T${newTime}`;
  }

  return newDateTimeString;
};

// Converts a duration in nanoseconds to minutes.
export const subtractNanoseconds = (duration: any) => {
  const nanosecondsToConvert = duration; // 60 billion nanoseconds (1 minute)
  const millisecondsPerNanosecond = 0.000001; // Convert nanoseconds to milliseconds
  const millisecondsToConvert =
    nanosecondsToConvert * millisecondsPerNanosecond;
  const minutesToConvert = millisecondsToConvert / (1000 * 60);
  return minutesToConvert;
};

// Calculates the remaining time in seconds until a given auction time.
export const calculateAuctionDuration = (
  auctionTimeString: string,
  minute: number,
  onPress?: (arg0: number) => void
) => {
  const currentDate = new Date();
  const auctionTimeMilliseconds = convertTimeToMilliseconds(auctionTimeString);
  const modifiedAuctionTime: any = new Date(
    auctionTimeMilliseconds + minute * 60 * 1000
  );
  const currentTimeMilliseconds = convertTimeToMilliseconds(
    separateTimeComponents(currentDate)
  );
  const timeDifference = modifiedAuctionTime - currentTimeMilliseconds;
  const timeInSeconds = Math.floor(timeDifference / 1000);

  if (timeInSeconds <= 0 && onPress) {
    onPress(timeInSeconds);
  }
  return timeInSeconds;
};

// Calculates the number of months completed based on the difference between a given date and the current date.
export const calculateDaysDifference = (
  fromDate: number | Date | any,
  duration: number | any
) => {
  const currentDate: any = new Date();
  const timeDifference = currentDate - fromDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const daysValues = Math.max((daysDifference as number) / 30, 0);
  const monthCompleted = `${Math.floor(daysValues)}/${duration}`;
  return monthCompleted;
};

// Capitalizes the first letter of a string.
export const capitalizeFirstLetter = (inputString: string) => {
  if (typeof inputString !== "string" || inputString.length === 0) {
    return inputString; // Return unchanged if the input is not a non-empty string
  }

  const lowercaseString = inputString.toLowerCase();
  const capitalizedString =
    lowercaseString.charAt(0).toUpperCase() + lowercaseString.slice(1);

  return capitalizedString;
};

// Formats a date string to a specific date format.
export const formatDate = (dateString: Date) => {
  const dateObject = new Date(dateString);
  const options: any = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = dateObject.toLocaleDateString(undefined, options);
  return formattedDate;
};

// Formats a time in seconds into a string representation of minutes and seconds.
export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// Separates the hours, minutes, and seconds components from a given date and time string.
export const separateTimeComponents = (
  dateTimeString: string | number | Date
) => {
  const dateTime = new Date(dateTimeString);
  const hours = String(dateTime.getUTCHours()).padStart(2, "0");
  const minutes = String(dateTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(dateTime.getUTCSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

// Formats a timestamp into a 12-hour time format with AM/PM.
export const dateFormatTime = (
  timestamp: string | number | Date | undefined | any
) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// Calculates the number of months that have passed between a given date and the current date.
export const monthsCompleted = (from: Date) => {
  const date = new Date(from);
  const currentDate = new Date();

  const previousMonthDate = new Date(currentDate);
  previousMonthDate.setMonth(date.getMonth() + 12);
};

// Converts a time string in the format "HH:mm:ss" to milliseconds.
export const convertTimeToMilliseconds = (timeString: string) => {
  const [hoursStr, minutesStr, secondsStr] = timeString.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);

  const millisecondsInHour = 60 * 60 * 1000;
  const millisecondsInMinute = 60 * 1000;
  const millisecondsInSecond = 1000;

  const totalMilliseconds =
    hours * millisecondsInHour +
    minutes * millisecondsInMinute +
    seconds * millisecondsInSecond;

  return totalMilliseconds;
};

/**
 * Calculates the number of days that have passed between a given date and the current date.
 *
 * @param fromDate - The starting date from which to calculate the days difference.
 * @returns The number of days that have passed between the fromDate and the current date.
 *
 * @example
 * const fromDate = new Date("2021-01-01");
 * const daysDifference = ProgressDaysDifference(fromDate);
 * console.log(daysDifference); // Output: 100
 */
export const ProgressDaysDifference = (fromDate: number | Date) => {
  const currentDate = new Date();
  const timeDifference =
    currentDate.getTime() -
    (fromDate instanceof Date ? fromDate.getTime() : fromDate);
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const monthsDifference = Math.max(daysDifference / 30, 0);
  const roundedMonths = Math.floor(monthsDifference);
  const days = Math.floor(roundedMonths * 100);
  return days;
};

/**
 * Subtracts two numbers.
 *
 * @param a - The first number to subtract.
 * @param b - The second number to subtract.
 * @returns The difference between the two input numbers.
 *
 * @example
 * const result = subtract(5, 3);
 * console.log(result); // Output: 2
 */
export const subtract = (a: number, b: number) => {
  return a - b;
};

/**
 * Calculates the progress ratio of a given number of days difference compared to a chit duration.
 *
 * @param {number} daysDifference - The number of days difference between two dates.
 * @param {number} chitDuration - The duration of the chit in months.
 * @returns {number} The progress ratio, which is a decimal value representing the percentage of progress towards completing the chit.
 *
 * @example
 * const daysDifference = 50;
 * const chitDuration = 12;
 * const progressRatio = calculateProgressRatio(daysDifference, chitDuration);
 * console.log(progressRatio); // Output: 0.041666666666666664
 */
export const calculateProgressRatio = (
  daysDifference: number,
  chitDuration: number | any
) => {
  return daysDifference / 100 / chitDuration;
};

/**
 * Calculates the number of days left between the current date and a target date.
 *
 * @param targetDate - The target date to calculate the days left.
 * @returns The number of days left between the current date and the target date.
 *
 * @example
 * const targetDate = "2022-12-31";
 * const daysLeft = calculateDaysLeft(targetDate);
 * console.log(daysLeft); // Output: 365
 */
export const calculateDaysLeft = (targetDate: string | number | Date | any) => {
  const currentDate = new Date();
  const timeDifference = +new Date(targetDate) - +currentDate;
  const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysLeft;
};

/**
 * Adds a specified number of minutes to a given UTC time and returns the updated time in ISO 8601 format.
 *
 * @param {string | number | Date} utcTimeString - The UTC time to which minutes need to be added.
 * @param {number} minutesToAdd - The number of minutes to add to the UTC time.
 * @returns {string} - Updated UTC time in ISO 8601 format.
 *
 * @example
 * const utcTime = "2022-01-01T12:00:00Z";
 * const minutesToAdd = 30;
 * const updatedTime = addMinutesToUtcTime(utcTime, minutesToAdd);
 * console.log(updatedTime); // Output: "2022-01-01T12:30:00Z"
 */
export const addMinutesToUtcTime = (
  utcTimeString: string | number | Date,
  minutesToAdd: number
) => {
  const dateTime = new Date(utcTimeString);
  dateTime.setTime(dateTime.getTime() + minutesToAdd * 60 * 1000);
  return dateTime.toISOString(); // Convert back to ISO 8601 format
};

export const getAuctionButtonEnable = (
  specifiedDateTime: MomentInput,
  auctionduration: number
): string | boolean => {
  const targetDate = moment(specifiedDateTime);
  const thirtyMinutesAfterTarget = targetDate
    .clone()
    .add(auctionduration, "minutes");
  const currentMoment = moment();

  if (
    currentMoment.isBetween(
      targetDate,
      thirtyMinutesAfterTarget,
      "minute",
      "[]"
    )
  ) {
    return true;
  } else {
    return false;
  }
};

export const formatDateMonth = (dateString: any) => {
  // Create a Date object from the input date string
  const date = new Date(dateString);

  // Define an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract day, month, and year from the Date object
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const month = monthNames[monthIndex];
  const year = date.getFullYear();

  // Construct the formatted date string
  const formattedDate = `${day} ${month}`;

  return formattedDate;
};

export const formatUtcTimeTo12Hour = (
  utcTimeString: string | number | Date
) => {
  const dateTime = new Date(utcTimeString);
  const options: any = { hour: "numeric", minute: "2-digit", hour12: true };
  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
    dateTime
  );
  return formattedTime;
};

// Returns the current time in the format "HH:mm:ss".
export const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return formattedTime;
};

// Returns the current time with a specified number of seconds added to it.
export const getCurrentAddedSecond = (second: number) => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + second);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return formattedTime;
};

// Converts a time string in the format "HH:MM:SS" to milliseconds.
export const timeStringToMilliseconds = (timeString: string) => {
  // Check if timeString is null or undefined
  if (timeString === null || timeString === undefined) {
    return 0; // Return 0 or handle the error as needed
  }

  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
};

// Formats a phone number into a standard US phone number format.
export const formatUSPhoneNumber = (input: string) => {
  // Remove all non-numeric characters from the input
  const ph = `${input}`;
  const cleaned = ph.replace(/\D/g, "");
  // Check if the cleaned input has 10 digits (a valid US phone number)
  if (cleaned.length === 10) {
    // Use string interpolation to format the phone number
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  } else {
    return cleaned;
  }
};

export const formatSSNNumber = (input: string) => {
  // Remove all non-numeric characters from the input
  const ph = `${input}`;
  const cleaned = ph.replace(/\D/g, "");
  // Check if the cleaned input has 10 digits (a valid US phone number)
  if (cleaned.length === 9) {
    // Use string interpolation to format the phone number
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  } else {
    return cleaned;
  }
};

export const formatUSCountryCode = (input: string) => {
  // Remove all non-numeric characters from the input
  const ph = `${input}`;
  const cleaned = ph.replace(/\D/g, "");
  // Check if the cleaned input has 10 digits (a valid US phone number)
  const formattedNumber = cleaned.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})/,
    "+$1 ($2) ($3)-$4"
  );
  return formattedNumber;
};

export const add30Seconds = (
  inputDateString: string | number | Date,
  second: any
) => {
  const inputDate = new Date(inputDateString);
  inputDate.setSeconds(inputDate.getSeconds() + second);
  return inputDate.toISOString();
};

/**
 * Extracts the time components (hours, minutes, seconds) from a given timestamp and returns a formatted time string in the format "HH:MM:SS".
 *
 * @param timestamp - A timestamp in the format "YYYY-MM-DDTHH:MM:SSZ".
 * @returns A formatted time string in the format "HH:MM:SS".
 *
 * @example
 * const timestamp = "2022-01-01T12:34:56Z";
 * const formattedTime = extractTimeFromTimestamp(timestamp);
 * console.log(formattedTime); // Output: "12:34:56"
 */
export const extractTimeFromTimestamp = (timestamp: string) => {
  // Parse the timestamp as a Date object
  const dateObj = new Date(timestamp);
  // Extract the time components (hours, minutes, seconds)
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getUTCSeconds();

  // Create a formatted time string (HH:MM:SS)
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return formattedTime;
};

/**
 * Formats a Date object into a string representation of the date in the format "MM.DD.YYYY".
 *
 * @param originalDate - The original date to be formatted.
 * @returns The formatted date string in the format "MM.DD.YYYY".
 */
export const dateformate = (originalDate: Date) => {
  const date = new Date(originalDate);
  const options: any = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .replace(/\//g, ".");
  return formattedDate;
};

// Formats a Date object into a string representing the date in the format "MM/DD/YYYY".
export const dateformat = (originalDate: Date) => {
  const date = new Date(originalDate);
  const options: any = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
};

// Returns a formatted string representing the date in the format "MMM DD, YYYY".
export const getParsedDate = (originalDate: Date) => {
  const date = new Date(originalDate);

  const options: Object = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return formattedDate;
};
export const formatNumberWithThreeDecimals = (number: number) => {
  return number.toFixed(3);
};
export const formatNumberWithTwoDecimals = (number: number) => {
  return number.toFixed(2);
};

export const trimAmount = (value: any) => {
  let amountStr = value.toString();
  let decimalIndex = amountStr.indexOf(".");
  let trimmedValue = amountStr.substring(0, decimalIndex + 7);
  let amountTrimmed = parseFloat(trimmedValue);
  return amountTrimmed;
};
