export class VerificationAuthRequestModel {
  phoneNo: string;
  otp: string;

  constructor(phoneNo: string, otp: string) {
    this.phoneNo = phoneNo;
    this.otp = otp;
  }
}

export class ForgotAuthRequestModel {
  phoneNo: string;

  constructor(phoneNo: string) {
    this.phoneNo = phoneNo;
  }
}

export class ResetAuthRequestModel {
  phoneNo: string;
  password: string;
  confirmPassword: string;

  constructor(phoneNo: string, password: string, confirmPassword: string) {
    this.phoneNo = phoneNo;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }
}
