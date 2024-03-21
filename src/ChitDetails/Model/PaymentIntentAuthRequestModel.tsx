
export class GoldPaymentIntentAuthRequest {
  amount: number;
  price: number;
  qty: number;
  wallet: boolean | undefined;
  transactionType: string;
  paymentMethodId: any;

  constructor(
    amount: number,
    price: number,
    qty: number,
    wallet: boolean,
    paymentMethodId: any
  ) {
    this.amount = amount;
    this.price = price;
    this.qty = qty;
    this.wallet = wallet;
    this.transactionType = "buy";
    this.paymentMethodId = paymentMethodId;
  }
}

export class GoldWithdrawAuthRequest {
  amount: number;
  price: number;
  qty: number;
  paymentMethodId: any;
  transactionType: string


  constructor(
    amount: number,
    price: number,
    qty: number,
    paymentMethodId: any
  ) {
    this.amount = amount;
    this.price = price;
    this.qty = qty;
    this.paymentMethodId = paymentMethodId;
    this.transactionType = "sell";
  }
}
