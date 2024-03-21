import { ChitGroupResponseModelDatum } from "./ChitGroupResponseModelDatum";

export interface UserJoinedChitGroupResponseModel {
  message?: string;
  success?: boolean;
  status?: number;
  data?: UserJoinedChitGroupResponseModelData;
}

export interface UserJoinedChitGroupResponseModelData {
  list?: ChitGroupResponseModelDatum[];
  count?: number;
}
