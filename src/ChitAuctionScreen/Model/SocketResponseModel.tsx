export interface SocketResponseModel {
  message?: string;
  success?: boolean;
  status?: number;
  data?: SocketResponseModelDatum[];
}

export interface SocketResponseModelDatum {
  id?: string;
  message?: string;
  participantCounts?: number;
  participantStatus?: boolean;
  bidAmount?: number;
  time?: Date;
  userId?: number;
}
