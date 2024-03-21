export interface GoldTransactionHistory {
    message?: string;
    success?: boolean;
    status?:  number;
    data?:    GoldTransactionHistoryDataum;
}

export interface GoldTransactionHistoryDataum {
    list?:  List[];
    count?: number;
}

export interface List {
    amount?:     number;
    quantity?:   number;
    created_at?: Date;
    type?:       string;
}
