import { KycResponseModelDatum } from "./KycResponseModelDatum";

export interface KycResponseModel {
  message?: string;
  success?: boolean;
  status?: number;
  data?: KycResponseModelDatum[];
}
