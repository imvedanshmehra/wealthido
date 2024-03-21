export class SubscriptionCreateAuthRequestModel {
  amount: number;
  plan: string;
  paymentType: string;
  startDate?: string | undefined;
  paymentMethodId?: any;


  constructor(amount: number, plan: string, paymentType: string, startDate?: string | undefined, paymentMethodId?: any) {
    this.amount = amount;
    this.plan = plan;
    this.paymentType = paymentType;
    if (startDate) {
      this.startDate = startDate;
    }
    if (paymentMethodId) {
      this.paymentMethodId = paymentMethodId;
    }
  }
}
