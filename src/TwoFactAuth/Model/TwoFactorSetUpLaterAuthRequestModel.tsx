export class TwoFactorSetUpLaterAuthRequestModel {
  phoneNo: string;
  enable2FA: boolean;
  setUpLater: boolean;
  enable2FAEmail: boolean;
  enable2FAPhoneNo: boolean;

  constructor(phoneNo: string, enable2FA: boolean, setUpLater: boolean, enable2FAPhoneNo: boolean) {
    this.phoneNo = phoneNo;
    this.enable2FA = enable2FA;
    this.setUpLater = setUpLater;
    this.enable2FAEmail = false;
    this.enable2FAPhoneNo = enable2FAPhoneNo;
  }
}
