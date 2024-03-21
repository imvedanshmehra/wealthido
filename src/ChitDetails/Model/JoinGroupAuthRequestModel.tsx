export class JoinGroupAuthRequestModel {
  chitId: number;
  chitStatus: string;

  constructor(chitId: number, chitStatus: string) {
    this.chitId = chitId;
    this.chitStatus = chitStatus;
  }
}
