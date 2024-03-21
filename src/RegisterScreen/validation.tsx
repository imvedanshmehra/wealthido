const validation = {
  /**
   * Validates the first name.
   *
   * @param text - The first name to be validated.
   * @returns An error message if the input is invalid, otherwise an empty string.
   * @example
   * const firstName = "John";
   * const errorMessage = validateFirstName(firstName);
   * console.log(errorMessage); // Output: ""
   */
  validateFirstName: (text: string) => {
    if (text === "") {
      return "First Name is required";
    } else if (text.trim().length !== text.length) {
      return "Enter Firstname without whitespaces";
    } else if (text.length < 3 || text.length > 20) {
      return "The firstname must be 3-20 characters";
    }

    return "";
  },

  /**
   * Validates the last name input by checking if it is empty, contains any whitespace, or has a length outside the range of 3 to 50 characters.
   *
   * @param text - The last name to be validated.
   * @returns An error message if the input is invalid, otherwise an empty string.
   *
   * @example
   * const lastName = "Smith";
   * const errorMessage = validateLastName(lastName);
   * console.log(errorMessage); // Output: ""
   */
  validateLastName: (text: string) => {
    if (text === "") {
      return "Last Name is required";
    } else if (text.trim().length !== text.length) {
      return "Enter Lastname without whitespaces";
    } else if (text.length < 3 || text.length > 20) {
      return "The Lastname must be 3-20 characters";
    }

    return "";
  },

  /**
   * Validates the input text for the "Reason Notes" field.
   *
   * @param text - The reason notes to be validated.
   * @returns An error message if the input is invalid. An empty string if the input is valid.
   *
   * @example
   * const reasonNotes = "Some reason notes";
   * const errorMessage = validateReasonNotes(reasonNotes);
   * console.log(errorMessage); // Output: ""
   */
  validateReasonNotes: (text: string) => {
    if (/^\s*$/.test(text)) {
      return "Reasons is required";
    }
    return "";
  },

  validateDescriptionNotes: (text: string) => {
    if (text === "") {
      return "Description is required";
    } else if (text.length < 3) {
      return "Description required minimum 3 characters";
    } else if (text.length > 1000) {
      return "Description maximum 1000 characters only";
    } else {
      return "";
    }
  },

  /**
   * Validates a password by checking if it meets certain criteria.
   *
   * @param text - The password to be validated.
   * @returns An error message if the password is invalid. An empty string if the password is valid.
   *
   * @example
   * const password = "Abc123!@#";
   * const errorMessage = validatePassword(password);
   * console.log(errorMessage); // Output: ""
   */
  validatePassword: (text: string) => {
    if (text === "") {
      return "Enter your Password";
    } else if (text.trim().length !== text.length) {
      return "Enter your Password without whitespaces";
    } else {
      return "";
    }
  },

  /**
   * Validates an email address by checking if it meets certain criteria.
   *
   * @param text - The email address to be validated.
   * @returns An error message if the email address is invalid. An empty string if the email address is valid.
   *
   * @example
   * const email = "example@example.com";
   * const errorMessage = validateEmail(email);
   * console.log(errorMessage); // Output: ""
   */
  validateEmail: (text: string) => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    if (text === "") {
      return "Email is required";
    } else if (!emailRegex.test(text)) {
      return "Enter a valid email address";
    } else {
      return "";
    }
  },

  /**
   * Validates a phone number by checking if it is not empty and has a length of 10 digits.
   * @param text - The phone number to be validated.
   * @returns An error message if the phone number is invalid, otherwise an empty string.
   *
   * @example
   * const phoneNumber = "1234567890";
   * const errorMessage = validatePhoneNumber(phoneNumber);
   * console.log(errorMessage); // Output: ""
   */
  validatePhoneNumber: (text: string) => {
    if (text === "") {
      return "Phone number is required";
    } else if (text.length != 10) {
      return "Enter a valid 10-digit phone number";
    } else {
      return "";
    }
  },

  /**
   * Validates the input text for the "DOB" (Date of Birth) field.
   *
   * @param text - The date of birth to be validated.
   * @returns An error message if the input is empty, otherwise an empty string.
   *
   * @example
   * const dob = "1990-01-01";
   * const errorMessage = validateDob(dob);
   * console.log(errorMessage); // Output: ""
   */
  validateDob: (text: string) => {
    if (text === "") {
      return "DOB is required";
    }
    return "";
  },

  /**
   * Validates the input text for the "Amount" field.
   *
   * @param text - The amount to be validated.
   * @returns An error message if the input is invalid. Otherwise, returns an empty string.
   *
   * @example
   * const amount = "100";
   * const errorMessage = validateAmount(amount);
   * console.log(errorMessage); // Output: ""
   */
  validateAmount: (text: string) => {
    if (text === "") {
      return "Amount is required";
    } else if (text.trim().length !== text.length) {
      return "Enter Amount without whitespaces";
    } else if (Number(text) < 5) {
      return "Enter Amount minimum is 5";
    } else if (Number(text) > 100) {
      return "Enter Amount maximum is 100";
    }

    return "";
  },

  validateAmountSub: (text: string) => {
    if (text === "") {
      return "Amount is required";
    } else if (Number(text) < 5) {
      return "Enter Amount minimum is 5";
    }
    return "";
  },

  /**
   * Validates the input text for the "AmountGold" field.
   *
   * @param text - The amount of gold to be validated.
   * @returns An error message if the input is empty, otherwise an empty string.
   *
   * @example
   * const amountGold = "50";
   * const errorMessage = validateAmountGold(amountGold);
   * console.log(errorMessage); // Output: ""
   */
  validateAmountGold: (text: string) => {
    if (text === "") {
      return "Gold is required";
    } else {
      return "";
    }
  },

  /**
   * Validates the input text for the "GramGold" field.
   *
   * @param text - The input text to be validated.
   * @returns An error message if the input text is empty, otherwise an empty string.
   *
   * @example
   * const amountGold = "50";
   * const errorMessage = validateGramGold(amountGold);
   * console.log(errorMessage); // Output: ""
   */
  validateGramGold: (text: string) => {
    if (text === "") {
      return "GramGold is required";
    } else {
      return "";
    }
  },

  /**
   * Validates the input text for the OTP (One-Time Password) field.
   *
   * @param text - The OTP to be validated.
   * @returns An error message if the input is empty, otherwise an empty string.
   *
   * @example
   * const otp = "123456";
   * const errorMessage = handleOTPVerification(otp);
   * console.log(errorMessage); // Output: ""
   */
  handleOTPVerification: (text: string) => {
    if (text === "") {
      return "Enter Your OTP";
    } else if (text.length != 6) {
      return "Enter Valid OTP";
    } else {
      return "";
    }
  },

  validateTitle: (text: string) => {
    if (text === "") {
      return "Title is required";
    } else if (text.length < 3) {
      return "Title required minimum 3 characters";
    } else if (text.length > 30) {
      return "Title maximum 30 characters only";
    } else {
      return "";
    }
  },
  validateSSNno: (text: string) => {
    if (text === "") {
      return "SSN Number is required";
    } else if (text.trim().length !== text.length) {
      return "SSN Number without whitespaces";
    } else {
      return "";
    }
  },
  validateCategory: (text: string) => {
    if (text === "") {
      return "Category is required";
    } else if (text.length < 3) {
      return "Category required minimum 3 characters";
    } else if (text.length > 30) {
      return "Category maximum 30 characters only";
    } else {
      return "";
    }
  },

  validateBeneficiaryNumber: (text: string) => {
    if (text === "") {
      return "Percentage is required";
    } else if (parseInt(text) > 90) {
      return "Percentage should be maximum of  90";
    } else if (parseInt(text) < 10) {
      return "Percentage should be minimum of 10";
    }

    return "";
  },
};

export default validation;
