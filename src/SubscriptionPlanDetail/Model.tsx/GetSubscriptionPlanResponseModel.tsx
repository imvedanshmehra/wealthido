export type GetSubscriptionPlanResponseModel = {
  message?: string;
  success?: boolean;
  status?: number;
  data?: GetSubscriptionPlanResponseModelDatum[];
};

export type GetSubscriptionPlanResponseModelDatum = {
  createdAt?: Date;
  deleted?: boolean;
  id?: number;
  maximumSubscription?: number;
  minimumSubscription?: number;
  plan?: string;
  status?: boolean;
  updatedAt?: Date;
};
