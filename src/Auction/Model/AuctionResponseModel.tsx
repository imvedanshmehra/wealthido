import { AuctionResponseModelData } from "./AuctionResponseModelData";

export interface AuctionResponseModel {
  message?: string;
  success?: boolean;
  status?: number;
  data?: AuctionResponseModelData;
}
