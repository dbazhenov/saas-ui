export interface CreateOrganizationPayload {
  organizationName: string;
}

export interface OrganizationCreateProps {
  onCreateOrgSubmit: ({ organizationName }: CreateOrganizationPayload) => Promise<void>;
  loading: boolean;
}
