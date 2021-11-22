export interface AuthState {
  email?: string;
  firstName?: string;
  lastName?: string;
  pending: boolean;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
}
