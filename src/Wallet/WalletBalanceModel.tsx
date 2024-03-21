export interface WalletBalanceModelResponse {
  message: string;
  success: boolean;
  status: number;
  data: Data;
}

export interface Data {
  id: number;
  walletBalance: number;
  createdAt: Date;
  updatedAt: Date;
}
