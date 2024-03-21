import { Platform } from "react-native";

export class TwoFactorAuthRequestModel {
  otp: string;
  username: string;
  password: string;
  fcmToken: string;
  deviceType: string;
  deviceId: string;

  constructor(
    otp: string,
    username: string,
    password: string,
    fcmToken: string,
    deviceId: string
  ) {
    this.otp = otp;
    this.username = username;
    this.password = password;
    this.fcmToken = fcmToken;
    this.deviceType = Platform.OS == "android" ? "android" : "iOS";
    this.deviceId = deviceId;
  }
}
