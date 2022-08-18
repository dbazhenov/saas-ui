export interface EditProfileError {
  status: number;
  data: {
    message: string;
    code: number;
    details: any[];
  };
}
