import { BankListData } from "./BankListData";
import { CardListData } from "./CardListData";

export type AddBankResponseModelData = {
  cardList?: CardListData[];
  bankList?: BankListData[];
};
