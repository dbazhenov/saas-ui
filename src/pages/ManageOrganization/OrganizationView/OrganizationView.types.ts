export interface OrganizationViewProps {
  orgId: string;
  // whether org was created from customer info (e.g. ServiceNow)
  fromCustomerPortal?: boolean;
}
