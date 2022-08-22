export interface MembersListStatusError {
  status: number;
  data: {
    message: string;
    code: number;
    details: any[];
  };
}

export interface ResendEmailData {
  organizationId: string;
  memberId: string;
}
