export interface ChitStatusModelResponse {
  message?: string;
  success?: boolean;
  status?: number;
  data?: ChitStatusData;
}

export interface ChitStatusData {
  list?: ChitStatusDataList[];
  count?: number;
}

export interface ChitStatusDataList {
  id?: number;
  chitGroupName?: string;
  chitGroupId?: string;
  chitValue?: number;
  participantCount?: number;
  memberCount?: number;
  status?: boolean;
  chitStatus?: string;
  deleted?: boolean;
  eligibility?: string;
  contribution?: number;
  from?: Date;
  to?: Date;
  chitduration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
