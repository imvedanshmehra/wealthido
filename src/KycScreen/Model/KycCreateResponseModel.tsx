export interface KycCreateResponseModel {
  message?: string;
  success?: boolean;
  status?: number;
  data?: KycCreateResponseModelData;
}

export interface KycCreateResponseModelData {
  note?: string;
  deleted?: boolean;
  updated_at?: Date;
  back?: string;
  created_at?: Date;
  id?: number;
  front?: string;
  document_id?: number;
  document_type?: string;
  status?: string;
  selfie?: string;
}
