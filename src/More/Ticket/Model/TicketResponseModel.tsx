import { TicketResponseData } from "./TicketResponseData";

export type TicketResponseModel = {
  message?: string;
  success?: boolean;
  status?: number;
  data?: TicketResponseData;
};
