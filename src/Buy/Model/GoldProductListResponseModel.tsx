export type GoldProductListResponseModel = {
  message?: string;
  success?: boolean;
  status?: number;
  data?: GoldProductListResponseModelDatum[];
};

export type GoldProductListResponseModelDatum = {
  imgUrl?: string;
  code?: string;
  purity?: Purity;
  ask?: number;
  weight?: string;
  selected?: boolean;
  count?: number;
};

export type Purity =
  | ".9999 FINE GOLD"
  | ".9167 FINE GOLD"
  | ".999 FINE GOLD"
  | ".99999 FINE GOLD"
  | ".900 FINE GOLD"
  | ".9166 FINE GOLD"
  | "Test"
  | "Test2";
