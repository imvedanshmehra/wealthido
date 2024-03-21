export class DepositPaymentAuthRequestModel {
  amount?: number | undefined;
  paymentMethodId?: string | undefined;

  constructor(amount: number, paymentMethodId: string) {
    this.amount = amount;
    this.paymentMethodId = paymentMethodId;
  }
}
