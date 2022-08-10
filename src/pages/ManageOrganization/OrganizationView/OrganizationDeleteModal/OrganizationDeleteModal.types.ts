export interface OrganizationDeleteModalProps {
  orgId: string;
  orgName: string;
  isVisible: boolean;
  onSubmit: () => void;
  onClose: () => void;
}
