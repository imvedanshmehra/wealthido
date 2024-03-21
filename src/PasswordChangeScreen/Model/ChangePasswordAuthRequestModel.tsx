export class ChangePasswordAuthRequestModel {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  constructor(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }
}
