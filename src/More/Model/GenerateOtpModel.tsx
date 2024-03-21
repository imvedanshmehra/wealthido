export type GenerateOtpModel = {
  message?: string;
  success?: boolean;
  status?: number;
  data?: GenerateOtpModelData;
};

export type GenerateOtpModelData = {
  second?: number;
  block_regenerate_time?: Date;
  phone_no?: string;
  id?: number;
};
