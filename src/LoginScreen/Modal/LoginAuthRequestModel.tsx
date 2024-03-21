import { Platform } from "react-native";

export class LoginAuthRequestModel {
  username: string;
  password: string;
  deviceType: string;
  fcmToken: string;
  deviceId:string;

  constructor(username: string, password: string, fcmToken: string,deviceId:string) {
    this.username = username;
    this.password = password;
    this.deviceType = Platform.OS == "android" ? "android" : "iOS";
    this.fcmToken = fcmToken;
    this.deviceId = deviceId;
  }
}
