export interface ContextProps {
  controller: string;
}

export interface RegistrationData {
  activationToken: string;
  email: string;
  firstName: string;
  lastName: string;
  marketing: boolean;
  password: string;
  tos: boolean;
}

export interface OktaSignInWidgetProps {
  config: any;
  onSuccess: any;
  onError: any;
}
