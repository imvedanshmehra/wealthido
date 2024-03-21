export interface WalletHistoryModelResponse {
  message: string;
  success: boolean;
  status: number;
  data: WalletHistoryModelResponseDatum[];
}

export interface WalletHistoryModelResponseDatum {
  id: number;
  totalAmount: number;
  amount: number;
  status: Status;
  paymentIntentStatus: PaymentIntentStatus;
  paymentStatus: PaymentStatus;
  paymentId: string;
  transactionId: null;
  createdAt: Date;
  updatedAt: Date;

}

export enum PaymentIntentStatus {
  Processing = "processing",
  RequiresPaymentMethod = "requires_payment_method",
}

export enum PaymentStatus {
  Deposit = "DEPOSIT",
}

export enum Status {
  Pending = "PENDING",
}
