export interface NotificationModelResponse {
  message: string;
  success: boolean;
  status: number;
  data: NotificationModelDatum[];
}

export interface NotificationModelDatum {
  id: number;
  title: Title;
  description: Description;
  imageUrl?: null | string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Description {
  InAndroid = "in android",
  InIOS = "in iOS",
}

export enum Title {
  LoginSuccess = "Login Success!",
}
