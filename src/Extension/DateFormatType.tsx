import { parse } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";

export const DateFormatType = {
  isoYear: "yyyy",
  isoDateMonthShortNameWithYear: "dd MMM, yyyy",
  isoYearMonth: "yyyy-MM",
  isoDate: "yyyy-MM-dd",
  isoDateTime: "yyyy-MM-dd'T'HH:mmXXX",
  isoDateTimeSec: "yyyy-MM-dd'T'HH:mm:ssXXX",
  isoDateTimeMilliSec: "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
  rss: "EEE, d MMM yyyy HH:mm:ss XXX",
  altRSS: "d MMM yyyy HH:mm:ss XXX",
  httpHeader: "EEE, dd MM yyyy HH:mm:ss XXX",
  standard: "EEE MMM dd HH:mm:ss Z yyyy",
  localDateTimeSec: "yyyy-MM-dd HH:mm:ss",
  localTimeWithNoon: "hh:mm a",
  localDate: "yyyy-MM-dd",
  localPhotoSave: "yyyyMMddHHmmss",
  messageRTetriveFormat: "yyyy-MM-dd'T'HH:mm:ssXXXXX",
  emailTimePreview: "dd MMM yyyy, h:mm a",
  monthYearSlashType: "MM/yyyy",
  dynamicFormat: (customFormat: any) => customFormat || DateFormatType.isoDate,
  birthDateFormatOne: "dd/MM/yyyy",
  birthDateFormatTwo: "dd-MM-yyyy",
  datePattern: "MM-dd-yyyy",
  birthDateFormatThree: "MM/dd/yyyy",
  emailTime: "MM/dd/yyyy, h:mm a",
  shortMonthDateFormat: "MMM dd,yyyy",
  dotDateFormate: "MM.dd.yyyy",
};

export function toDate(dateString: string, formate = DateFormatType.isoDate) {
  if (dateString) {
    try {
      const parsedDate = parse(
        dateString,
        "yyyy-MM-dd'T'HH:mm:ss.SSSSSSXXX",
        new Date()
      );
      const formattedDate = format(parsedDate, formate);
      return formattedDate;
    } catch (error) {
      return "";
    }
  } else {
    return "Date Missing";
  }
}

export function DobDate(dateString: string, formatString = "MM/dd/yyyy") {
  if (dateString) {
    try {
      const parsedDate = zonedTimeToUtc(
        utcToZonedTime(new Date(dateString), "UTC"),
        "UTC"
      );
      const formattedDate = format(parsedDate, formatString);
      return formattedDate;
    } catch (error) {
      return "";
    }
  } else {
    return "";
  }
}
