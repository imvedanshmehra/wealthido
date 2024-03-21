export class PaymentAuthRequestModel {
  chitId?: number | undefined;
  wallet?: boolean | undefined;
  referral?: boolean | undefined;
  paymentMethodId?: string | undefined;
  amount?: number | undefined;
  contributionId?: number | undefined;

  constructor(
    chitId: number,
    wallet: boolean,
    referral: boolean,
    paymentMethodId: string,
    amount?: number,
    contributionId?: number
  ) {
    if (chitId) {
      this.chitId = chitId;
    }
    this.wallet = wallet;
    this.referral = referral;
    this.paymentMethodId = paymentMethodId;
    if (amount) {
      this.amount = amount;
    }
    if (contributionId) {
      this.contributionId = contributionId;
    }
  }
}
