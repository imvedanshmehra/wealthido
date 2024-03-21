export class VerifyBankAccountAuthRequestModel {
  amount1: string;
  amount2: string;
  paymentMethodId: string;

  constructor(amount1: string, amount2: string, paymentMethodId: string) {
    this.amount1 = amount1;
    this.amount2 = amount2;
    this.paymentMethodId = paymentMethodId;
  }
}
