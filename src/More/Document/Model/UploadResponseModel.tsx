import { UploadResponseModelData } from "./UploadResponseModelData";

export type UploadResponseModel = {
  data?: UploadResponseModelData;
  message?: string;
  status?: number;
  success?: boolean;
};
