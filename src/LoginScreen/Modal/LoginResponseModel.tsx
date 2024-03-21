import { LoginResponseModelDatum } from "./LoginResponseModelDatum";

export type LoginResponseModel = {
  message?: string;
  success?: boolean;
  status?: number;
  data?: LoginResponseModelDatum;
};
