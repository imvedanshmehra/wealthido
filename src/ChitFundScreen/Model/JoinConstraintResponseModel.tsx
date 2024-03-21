export type JoinConstraintResponseModel = {
  message?: string;
  success?: boolean;
  status?: number;
  data?: JoinConstraintResponseModelData;
};

export type JoinConstraintResponseModelData = {
  id?: number;
  userID?: number;
  investorProfileStatus?: boolean;
  kycStatus?: boolean;
  bankStatus?: boolean;
  checkEligibilityStatus?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
