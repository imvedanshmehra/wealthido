import { Platform } from "react-native";
import MyComponent from "../../Utility";

export class SignupAuthRequestModel {
  firstName: string;
  lastName: string;
  password: string | undefined;
  gender: string | undefined;
  email: string | undefined;
  phoneNo: string | undefined;
  country: string | undefined;
  dob: string | undefined;
  deviceType: string;
  fcmToken: string;
  deviceId: string;
  referralCode: string;

  constructor(
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    phoneNo: string,
    country: string,
    dob: string,
    fcmToken: string,
    deviceId: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.email = email;
    this.phoneNo = phoneNo;
    this.country = country;
    this.dob = dob;
    this.fcmToken = fcmToken;
    this.deviceId = deviceId;
    this.referralCode = MyComponent.referralCode;
    this.deviceType = Platform.OS == "android" ? "android" : "iOS";
  }
}
