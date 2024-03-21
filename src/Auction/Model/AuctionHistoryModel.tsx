export interface AuctionHistoryModelResponse {
  message: string;
  success: boolean;
  status: number;
  data: AuctionHistoryModelDatum[];
}

export interface AuctionHistoryModelDatum {
  winnerName: string;
  winningAmount: number;
  highestBid: number;
  chitName: string;
  auctionDate: Date;
}
