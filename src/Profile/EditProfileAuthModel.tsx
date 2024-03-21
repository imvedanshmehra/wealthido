export class EditProfileAuthRequestModel {

  firstName: string;
  lastName: string;
  dob:string|undefined

  constructor(
   
    firstName: string,
    lastName: string,
    dob:string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.dob=dob
  }
}
