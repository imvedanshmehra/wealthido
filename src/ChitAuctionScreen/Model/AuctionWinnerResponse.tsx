export type AuctionWinnerResponse = {
  message?: string;
  success?: boolean;
  status?: number;
  data?: AuctionWinnerResponseData;
};

export type AuctionWinnerResponseData = {
  winnerText?: string;
  winnerDesc?: string;
  bidAmount?: string;
  priceText?: string;
  priceAmount?: string;
};
