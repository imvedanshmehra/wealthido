export type SignupResponseModelDatum = {
  isVerified?: boolean;
  enable2FA?: boolean;
  setUpLater?: boolean;
  enablePinLock?: boolean;
  enable2FAEmail?: boolean;
  enable2FAPhoneNo?: boolean;
  blockTime?: Date;
  phoneNo?: number;
  second?: number;
};
