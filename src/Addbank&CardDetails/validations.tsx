import moment from "moment";

export function stripeCardNumberValidation(cardNumber: string): string {
  const regexPattern = {
    MASTERCARD: /^5[1-5][0123456789]{1,}|^2[2-7][0123456789]{1,}$/,
    VISA: /^4[0123456789]{2,}$/,
    AMERICAN_EXPRESS: /^3[47][0123456789]{5,}$/,
    DISCOVER: /^6(?:011|5[0123456789]{2})[0123456789]{3,}$/,
    DINERS_CLUB: /^3(?:0[0-5]|[68][0123456789])[0123456789]{4,}$/,
    JCB: /^(?:2131|1800|35[0123456789]{3})[0123456789]{3,}$/,
  };

  for (const card in regexPattern) {
    if (cardNumber.replace(/[^\d]/g, "").match(regexPattern[card])) {
      if (cardNumber) {
        return /^[123456]{1}[0123456789]{14,15}$/i.test(
          cardNumber.replace(/[^\d]/g, "").trim()
        )
          ? ""
          : "Enter a valid Card";
      }
    }
  }
  return "Enter a valid Card";
}

export const validateStripeCardExpiry = (value: any): string | undefined => {
  if (!value) {
    return "Please enter a date";
  }

  const isValidFormat = /^(0[1-9]|1[0-2])\/[0123456789]{2}$/i.test(
    handleInputChange(value).trim()
  );

  if (isValidFormat) {
    const today = moment();
    const currentMonthEnd = moment(today).endOf("month");

    const [month, year] = value.split("/");
    const cardExpiry = moment(`20${year}-${month}`, "YYYY-MM").endOf("month");

    return currentMonthEnd.isBefore(cardExpiry)
      ? ""
      : "Please enter a valid date";
  } else {
    return "Invalid date format";
  }
};

export const handleInputChange = (text: string) => {
  const formattedInput = text.replace(/[0123456789]/g, "").slice(0, 4);
  const formattedExpiryDate = formattedInput.replace(/^(..)(..)$/, "$1/$2");
  return formattedExpiryDate;
};

export const formatCardNumber = (input: string): string => {
  const cleanedInput = input.replace(/[^\d]/g, "");
  const formattedInput = cleanedInput.replace(/(.{4})/g, "$1 ");

  return formattedInput.trim();
};

export const getCardType = (cardNumber: string) => {
  const regexPatterns = {
    MASTERCARD: /^5[1-5][0123456789]{1,}|^2[2-7][0123456789]{1,}$/,
    VISA: /^4[0123456789]{2,}$/,
    AMERICAN_EXPRESS: /^3[47][0123456789]{5,}$/,
    DISCOVER: /^6(?:011|5[0123456789]{2})[0123456789]{3,}$/,
    DINERS_CLUB: /^3(?:0[0-5]|[68][0123456789])[0123456789]{4,}$/,
    JCB: /^(?:2131|1800|35[0123456789]{3})[0123456789]{3,}$/,
  };

  for (const cardType in regexPatterns) {
    if (cardNumber.replace(/[^\d]/g, "").match(regexPatterns[cardType])) {
      return cardType;
    }
  }
  return "UNKNOWN";
};

export const getCardImageSource = (cardType: any) => {
  switch (cardType) {
    case "MASTERCARD":
      return "mastercard";
    case "VISA":
      return "visa";
    case "AMERICAN_EXPRESS":
      return "american-express";
    case "DISCOVER":
      return "discover";
    case "DINERS_CLUB":
      return "diners";
    case "JCB":
      return "jcb";
    default:
      return "default"; // Provide a default image or null if not found
  }
};

export const textWithSpacesOnly = (value: string): string | undefined => {
  if (value) {
    return /^[a-zA-Z ]*$/i.test(value) ? undefined : "Only alphabets";
  } else {
    return undefined;
  }
};

export const minLength =
  (min: number) =>
  (value: string): string | undefined =>
    value && value.length < min
      ? `Must be ${min} characters or more`
      : undefined;

export const validateExpiryDate = (expiryDate: string) => {
  const numericExpiryDate = expiryDate.replace(/\D/g, "");

  if (numericExpiryDate.length === 4) {
    const month = parseInt(numericExpiryDate.substring(0, 2), 10);
    const year = parseInt(numericExpiryDate.substring(2, 4), 10);

    if (month >= 1 && month <= 12) {
      const currentYear = new Date().getFullYear() % 100;
      if (year >= currentYear) {
        return "";
      } else {
        return "Please enter a valid future year.";
      }
    } else {
      return "Please enter a valid month (1-12).";
    }
  } else {
    return "Please enter a valid MMYY expiry date.";
  }
};
