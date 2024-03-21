export interface DashboradResponseModel {
  message?: string;
  success?: boolean;
  status?:  number;
  data?:    Data;
}

export interface Data {
  wallet?:      Wallet;
  digitalGold?: DigitalGold;
  chitFunds?:   ChitFunds;
}

export interface ChitFunds {
  totalSubscriptionAmount?: number;
  totalDividendEarning?:    number;
  totalSaving?:             number;
}

export interface DigitalGold {
  investment?: number;
  holding?:    number;
  earned?:     number;
}

export interface Wallet {
  rewardBalance?:    number;
  walletBalance?:    number;
  transactionCount?: number;
}
