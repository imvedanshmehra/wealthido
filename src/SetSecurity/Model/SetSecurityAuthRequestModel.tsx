export class SetSecurityAuthRequestModel {
  phoneNo: number;
  pinLockPassword: number;
  enablePinLock: boolean;
  pinLockDigit: number;
  password: string;

  constructor(
    phoneNo: number,
    pinLockPassword: number,
    pinLockDigit: number,
    password: string
  ) {
    this.phoneNo = phoneNo;
    this.pinLockPassword = pinLockPassword;
    this.pinLockDigit = pinLockDigit;
    this.enablePinLock = true;
    this.password = password;
  }
}

export class SetWithdrawAuthRequestModel {
  password: string;
  amount: number;

  constructor(password: string, amount: number) {
    this.password = password;
    this.amount = amount;
  }
}
