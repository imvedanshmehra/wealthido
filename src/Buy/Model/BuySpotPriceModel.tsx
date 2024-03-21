export interface BuySpotPriceModel {
    message?: string;
    success?: boolean;
    status?:  number;
    data?:    BuySpotPriceData;
}

export interface BuySpotPriceData {
    price?: number;
}

export interface BuyGoldSocketResponse {
    goldBid?:           number;
    goldChange?:        number;
    goldChangePercent?: number;
    goldAsk?:           number;
    timestamp?:         string;
}
