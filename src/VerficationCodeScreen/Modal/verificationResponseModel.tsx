export interface VerificationResponseModel {
  message?: string;
  success?: boolean;
  status?: number;
  data?: VerificationResponseModelDatum;
}

export type VerificationResponseModelDatum = {
  kycsubmit?: string;
  country?: string;
  firstname?: string;
  role?: string;
  gender?: string;
  isVerified?: boolean;
  cardCount?: number;
  phoneNo?: number;
  lastname?: string;
  ssn?: string;
  createdAt?: Date;
  kycstatus?: string;
  blockTime?: string;
  id?: number;
  otpCount?: number;
  email?: string;
  username?: string;
  status?: boolean;
  updatedAt?: Date;
};
