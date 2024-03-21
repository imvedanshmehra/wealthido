import { ChangePasswordResponseDatum } from "./ChangePasswordResponseDatum";

export interface ChangePasswordResponse {
  message?: string;
  success?: boolean;
  status?: number;
  data?: ChangePasswordResponseDatum;
}
