import { OrganizationEntitlement } from 'core/api/types';

export interface EntitlementsModalProps {
  entitlements: OrganizationEntitlement[];
  onClose: () => void;
}

export type CollapseMap = { [key: string]: boolean };
