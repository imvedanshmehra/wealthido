import { ChitGroupResponseModelDatum } from "./ChitGroupResponseModelDatum";

export interface ChitGroupResponseModel {
  message?: string;
  success?: boolean;
  status?: number;
  data?: ChitGroupResponseModelDatum[];
}
