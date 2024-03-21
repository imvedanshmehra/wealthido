export interface ForgotPassword {
  message: string;
  success: boolean;
  status: number;
  data?: ForgotPasswordData;
}

export type ForgotPasswordData = {
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
  blockTime?: Date;
  id?: number;
  otpCount?: number;
  email?: string;
  username?: string;
  status?: boolean;
  updatedAt?: Date;
};
