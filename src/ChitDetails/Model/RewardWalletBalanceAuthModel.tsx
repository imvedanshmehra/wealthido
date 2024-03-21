export interface RewardAndWalletBalanceModel {
    message?: string;
    success?: boolean;
    status?:  number;
    data?:    RewardAndWalletBalanceDatum;
}

export interface RewardAndWalletBalanceDatum {
    rewardBalance?: number;
    walletBalance?: number;
}