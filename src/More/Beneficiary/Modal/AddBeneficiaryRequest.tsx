export class AddBeneficiaryRequest {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phoneNo: string;
  address: string | undefined;
  splitPercentage: {
    id1: number | null;
    percentage1: number;
    id2: number | null;
    percentage2: number;
    id3: number | null;
    percentage3: number;
    id4: number | null;
    percentage4: number;
    id5: number | null;
    percentage5: number;
  };

  constructor(
    firstName: string,
    lastName: string,
    dob: string,
    email: string,
    phoneNo: string,
    address ?: string | undefined,
    splitPercentage: {
      id1: number | null;
      percentage1: number;
      id2: number | null;
      percentage2: number;
      id3: number | null;
      percentage3: number;
      id4: number | null;
      percentage4: number;
      id5: number | null;
      percentage5: number;
    }
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.dob = dob;
    this.email = email;
    this.phoneNo = phoneNo;
    if(address){
      this.address = address;
    }
    
    this.splitPercentage = splitPercentage;
  }
}
