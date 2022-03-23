import { createSelector } from '@reduxjs/toolkit';
import { MemberRole } from 'pages/ManageOrganization/ManageOrganization.types';
import { getUserEmail } from 'store/auth/auth.selectors';
import { AppState } from 'store/types';

export const getOrgState = (state: AppState) => state.orgs;

export const getIsOrgPending = (state: AppState) => state.orgs.pending;

export const getIsOrgEditing = (state: AppState) => state.orgs.editing;

export const getOrgs = (state: AppState) => state.orgs.orgs;

// FIXME: there should just me a getOrgId selector, fix this logic of "current org" vs "orgs" (list)
export const getFirstOrgId = (state: AppState) => state.orgs.orgs[0]?.id || state.orgs.currentOrg?.org?.id;

export const getOrgInventory = (state: AppState) => state.orgs.inventory;

export const getOrgEntitlements = (state: AppState) => state.orgs.entitlements;

export const getOrgMembers = (state: AppState) => state.orgs.members;

export const getOrgTickets = (state: AppState) => state.orgs.tickets;

export const getIsOrgFromPortal = (state: AppState) => state.orgs.isOrgFromPortal;

export const getCurrentOrg = (state: AppState) => state.orgs.currentOrg?.org || {};

export const getCurrentOrgId = (state: AppState) => state.orgs.currentOrg?.org?.id;

export const getCurrentOrgContacts = (state: AppState) => state.orgs.currentOrg?.contacts || {};

export const getOrgViewActiveTab = (state: AppState) => state.orgs.viewActiveTab;

export const getOrgDetailsSeen = (state: AppState) => state.orgs.orgDetailsSeen;

export const getCustomerSuccessContact = createSelector(
  getCurrentOrgContacts,
  (contacts) => contacts.customer_success || {},
);

export const getTicketUrl = createSelector(
  getCurrentOrgContacts,
  (contacts) => contacts.new_ticket_url || '',
);

export const getCurrentOrgName = createSelector(getCurrentOrg, (currentOrg) => currentOrg?.name ?? '');

export const getCurrentOrgCreationDate = createSelector(getCurrentOrg, (currentOrg) => {
  if (currentOrg?.created_at) {
    return new Date(currentOrg.created_at).toLocaleDateString();
  }

  return null;
});

export const getCurrentUserRole = createSelector(getUserEmail, getOrgMembers, (email, members) => {
  if (!email) {
    return '';
  }

  const member = members.find((m) => m.email === email);

  return !member ? '' : member.role;
});

export const getIsUserAdmin = createSelector(getCurrentUserRole, (role) => role === MemberRole.admin);
