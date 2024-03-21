export interface DepositModelResponse {
  message?: string;
  success?: boolean;
  status?: number;
  data?: DepositModelResponseData;
}

export interface DepositModelResponseData {
  ephemeralKey?: string;
  customer?: string;
  paymentId?:string;
  client_Secret?: string;
}
