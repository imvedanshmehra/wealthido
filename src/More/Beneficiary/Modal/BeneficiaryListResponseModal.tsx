export interface BeneficiaryListResponseModal {
  message?: string;
  success?: boolean;
  status?: number;
  data?: Data[];
}

export interface Data {
  firstname?: string;
  fullName?: string;
  address?: string;
  dob?: string;
  percentage?: number;
  id?: number;
  relationship?: string;
  userId?: number;
  email?: string;
  phoneNo?: string;
  lastname?: string;
}
