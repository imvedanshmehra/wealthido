import { SignupResponseModelDatum } from "./SignupResponseModelDatum";

export type SignupResponseModel = {
  message?: string;
  success?: boolean;
  status?: number;
  data?: SignupResponseModelDatum;
};
