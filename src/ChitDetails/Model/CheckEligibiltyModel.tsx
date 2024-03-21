export interface CheckEligibiltyModel {
  message?: string;
  success?: boolean;
  status?: number;
  data?: CheckEligibiltyModelDatum;
}

export interface CheckEligibiltyModelDatum {
  auctionParticipantPercentage?: number;
  createdAt?: Date;
  crsCreditCheckDate?: Date;
  id?: number;
  percentage?: number;
  status?: string;
  updatedAt?: Date;
  userID?: number;
}
