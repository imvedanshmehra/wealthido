export type ReferralResponseModelData = {
  referral?: Referral;
};

export type Referral = {
  completed?: number;
  createdAt?: Date;
  id?: number;
  pending?: number;
  referralCode?: string;
  referralLink?: string;
  rewardAmount?: number;
  updatedAt?: Date;
};
