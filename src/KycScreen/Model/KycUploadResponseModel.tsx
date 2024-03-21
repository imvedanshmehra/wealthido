import { KycResponseModelData } from "./KycResponseModelDatum";

export interface KycUploadResponseModel {
  message?: string;
  success?: boolean;
  status?: number;
  data?: KycResponseModelData;
}
