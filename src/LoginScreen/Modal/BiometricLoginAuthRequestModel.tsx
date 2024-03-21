export class BiometricLoginAuthRequestModel {
  userId: number;
  username: string;
  signature: string;
  deviceId: string;

  constructor(
    userId: number,
    username: string,
    signature: string,
    deviceId: string
  ) {
    this.userId = userId;
    this.username = username;
    this.signature = signature;
    this.deviceId = deviceId;
  }
}
