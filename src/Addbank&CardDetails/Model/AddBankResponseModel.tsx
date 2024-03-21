import { AddBankResponseModelData } from "./AddBankResponseModelData";

export type AddBankResponseModel = {
  message?: string;
  success?: boolean;
  status?: number;
  data?: AddBankResponseModelData;
};
