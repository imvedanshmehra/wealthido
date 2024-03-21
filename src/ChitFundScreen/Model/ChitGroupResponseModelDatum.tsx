export interface ChitGroupResponseModelDatum {
  terms_Condition?: null | string;
  id?: number;
  auctionId?: number;
  chitGroupName?: string;
  chitGroupId?: string;
  chitValue?: number;
  participantCount?: number;
  memberCount?: number;
  status?: boolean;
  chitStatus?: string;
  deleted?: boolean;
  eligibility?: string;
  contribution?: number;
  from?: Date;
  to?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  list: any;
  auctionStatus?: string;
  time?: string;
  auctionDate?: Date;
  chitduration?: number | any;
  auctionduration?: number;
  bidMax?: number;
  bidMin?: number;
  auctionMinBid?: number;
  chitId?: number;
  contributionStatus?: Boolean;
  userStatus?: string;
  exitStatus?: boolean;
  paymentStatus?: boolean;
  auctionWinnerStatus?: boolean;
  auctionEligibleStatus?: boolean;
  auctionAmountClaim?: boolean;
  latePaymentChargeStatus?: boolean;
  contributionAmount?: number;
  contributionId?: number;
  afterChitStart?: boolean;
  payAmount?: number;
}
