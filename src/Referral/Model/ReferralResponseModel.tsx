import { ReferralResponseModelData } from "./ReferralResponseModelData";

export type ReferralResponseModel = {
  data?: ReferralResponseModelData;
  message?: string;
  status?: number;
  success?: boolean;
};
