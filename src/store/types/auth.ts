export interface AuthState {
  email?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  orgRole?: string;
  pending: boolean;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
}
