export type GoldInvestmentResonseModel = {
  message?: string;
  success?: boolean;
  status?: number;
  data?: GoldInvestmentResonseModelData;
};

export type GoldInvestmentResonseModelData = {
  goldAsk?: number;
  goldChange?: number;
  goldChangePercent?: number;
  timestamp?: string;
};
