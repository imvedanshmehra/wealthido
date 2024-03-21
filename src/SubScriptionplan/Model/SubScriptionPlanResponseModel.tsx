export type SubScriptionPlanResponseModel = {
  message?: string;
  success?: boolean;
  status?: number;
  data?: SubScriptionPlanResponseModelData;
}

export type SubScriptionPlanResponseModelData = {
  subscription?: Subscription;
  transactinHistory?: TransactinHistory[];
  totalAmount?: number;
  totalGold?: number;
}

export type Subscription = {
  pauseStatus?: boolean;
  startDate?: Date;
  amount?: number;
  id?: number;
  userID?: number;
  plan?: string;
  updatedAt?: Date;
}

export type TransactinHistory = {
  id?: number;
  planType?: string;
  amount?: number;
  gold?: number;
  createdAt?: Date;
  updatedAt?: Date;
  confirmationNumber?: string;
  executePrice?:       number;
  paymentStatus?:      string;
  status?:             string;
  subscriptionId?:     string;
  subscriptionStatus: null;
   
}
