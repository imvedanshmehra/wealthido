export interface KycResponseModelDatum {
  id?: number;
  documentName?: string;
  documentRequired?: string[];
  status?: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  view_url?: string;
  image?: string;
}

export interface KycResponseModelData {
  view_url?: string;
  image?: string;
}
