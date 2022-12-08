export interface UserData {
  firstName: string;
  lastName: string;
  pending?: boolean;
  email?: string;
}

export interface UserDataError {
  firstName: boolean;
  lastName: boolean;
  firstNameError?: string;
  lastNameError?: string;
}
