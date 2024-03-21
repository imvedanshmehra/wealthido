export class InvestorAuthRequest {
    emp_status: string;
    martial_status: string;
    yearly_income: string;
    no_of_Dependent: string;
    source_of_income: string;
    investor_address: {
      address1: string;
      address2?: string;
      country: string;
      state: string;
      zipcode: string;
    };
  
    constructor(
      emp_status: string,
      martial_status: string,
      yearly_income: string,
      no_of_Dependent: string,
      source_of_income: string,
      address1: string,
      country: string,
      state: string,
      zipcode: string,
      address2?: string,
    ) {
      this.emp_status = emp_status;
      this.martial_status = martial_status;
      this.yearly_income = yearly_income;
      this.no_of_Dependent = no_of_Dependent;
      this.source_of_income = source_of_income;
      this.investor_address = {
        address1,
        country,
        state,
        zipcode,
      };
  
      
      if (address2) {
        this.investor_address.address2 = address2;
      }
    }
  }