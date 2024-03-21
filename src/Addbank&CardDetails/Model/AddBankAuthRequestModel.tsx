export class AddBankAuthRequestModel {
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  setupIntentId: string;

  constructor(
    accountHolderName: string,
    accountNumber: string,
    routingNumber: string,
    setupIntentId: string
  ) {
    this.accountHolderName = accountHolderName;
    this.accountNumber = accountNumber;
    this.routingNumber = routingNumber;
    this.setupIntentId = setupIntentId;
  }
}
