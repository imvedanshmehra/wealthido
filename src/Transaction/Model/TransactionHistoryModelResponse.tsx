export interface TransactionHistoryResponse {
  message?: string;
  success?: boolean;
  status?: number;
  data?: TransactionHistoryResponseDatum[];
}

export interface TransactionHistoryResponseDatum {
  id?: number;
  chitName?: string;
  amount?: number;
  transactionId?: null;
  paymentIntentStatus?: string;
  paymentStatus?: string;
  paymentId?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
