import React from 'react';
import { ManageOrganizationContext } from './ManageOrganization.types';

export const ManageOrganizationProvider = React.createContext<ManageOrganizationContext>(
  {} as ManageOrganizationContext,
);
