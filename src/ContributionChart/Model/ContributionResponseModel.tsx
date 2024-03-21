export interface ContributionResponseModel {
  message?: string;
  success?: boolean;
  status?: number;
  data?: ContributionResponseModelData;
}

export interface ContributionResponseModelData {
  list?: ContributionResponseModelList[];
}

export interface ContributionResponseModelList {
  month?: number;
  dueAmount?: number;
  bidAmount?: number;
  dividend?: number;
  id?: number;
}
