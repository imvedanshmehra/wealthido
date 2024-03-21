export interface FeeChargeResponseModel {
    message?: string;
    success?: boolean;
    status?:  number;
    data?:    FeeChargeResponseModelDatam;
}

export interface FeeChargeResponseModelDatam {
    amount?: number;
    fee?:    number;
}