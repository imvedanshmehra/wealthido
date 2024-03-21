export interface ChangePasswordResponseDatum {
  id?: number;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  phoneNo?: number;
  gender?: string;
  password?: string;
  country?: string;
  role?: string;
  status?: boolean;
  tokenStatus?: null;
  kycstatus?: string;
  kycsubmit?: string;
  createdAt?: Date;
  updatedAt?: Date;
  enabled?: boolean;
  authorities?: Authority[];
  verified?: boolean;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
}

export interface Authority {
  authority?: string;
}
