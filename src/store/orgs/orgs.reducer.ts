import { createReducer } from '@reduxjs/toolkit';
import { LOCATION_CHANGE } from 'connected-react-router';
import { ROLES } from 'pages/ManageOrganization/ManageOrganization.constants';
import { MemberRole } from 'pages/ManageOrganization/ManageOrganization.types';
import { OrgsState, OrganizationViewTabs } from 'store/types';
import {
  createOrganizationAction,
  deleteOrganizationAction,
  enterOrganizationEditing,
  exitOrganizationEditing,
  editOrganizationAction,
  editOrgMemberAction,
  getEntitlementsAction,
  getInventoryAction,
  getOrganizationAction,
  getOrgTicketsAction,
  createServiceNowOrganizationAction,
  inviteOrgMemberAction,
  removeOrgMemberAction,
  searchOrgMembersAction,
  searchOrgsAction,
  setOrgViewActiveTab,
  setOrgDetailsSeen,
  bulkInviteOrgMembersAction,
  clearBulkInvite,
  setOrgTicketsLoadingAction,
} from './org.actions';

const DEFAULT_STATE: OrgsState = {
  entitlements: [],
  inventory: null,
  isOrgFromPortal: false,
  members: [],
  orgs: [],
  currentOrg: {
    org: {
      id: '',
      name: '',
      created_at: 0,
      updated_at: 0,
      tier: '',
    },
    contacts: {
      customer_success: {
        email: '',
        name: '',
      },
      new_ticket_url: '',
    },
  },
  tickets: {
    list: [],
    pending: true,
  },
  pending: false,
  editing: false,
  viewActiveTab: OrganizationViewTabs.organization,
  orgDetailsSeen: false,
  invitedUsersResponse: {
    invitedUsers: [
      {
        username: '',
        role: ROLES.find((role) => role.value === MemberRole.technical)!.value,
        error: '',
      },
    ],
  },
};

export const orgsReducer = createReducer<OrgsState>(DEFAULT_STATE, (builder) => {
  builder
    // every time location changes
    .addCase(LOCATION_CHANGE, (state) => {
      state.isOrgFromPortal = !!state.currentOrg.org || !!state.orgs.length;
      state.viewActiveTab = state.orgDetailsSeen
        ? OrganizationViewTabs.members
        : OrganizationViewTabs.organization;
    })
    // Inventory
    .addCase(getInventoryAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(getInventoryAction.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.inventory = payload;
    })
    .addCase(getInventoryAction.rejected, (state) => {
      state.pending = false;
    })
    // Organizations
    .addCase(searchOrgsAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(searchOrgsAction.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.orgs = payload;
      state.isOrgFromPortal = !!payload.length;
    })
    .addCase(searchOrgsAction.rejected, (state) => {
      state.pending = false;
    })
    // CreateOrganization
    .addCase(createOrganizationAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(createOrganizationAction.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.currentOrg.org = payload;
      state.isOrgFromPortal = !!payload.id;
    })
    .addCase(createOrganizationAction.rejected, (state) => {
      state.pending = false;
    })
    // DeleteOrganization
    .addCase(deleteOrganizationAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(deleteOrganizationAction.fulfilled, () => ({
      ...DEFAULT_STATE,
    }))
    .addCase(deleteOrganizationAction.rejected, (state) => {
      state.pending = false;
    })
    // OrganizationDetailsSeen
    .addCase(setOrgDetailsSeen, (state) => {
      state.orgDetailsSeen = true;
    })
    // OrganizationViewSetActiveTab
    .addCase(setOrgViewActiveTab, (state, { payload }) => {
      state.viewActiveTab = payload;
      state.isOrgFromPortal = !!state.currentOrg.org || !!state.orgs.length;
    })
    // OrganizationEditingMode
    .addCase(enterOrganizationEditing, (state) => {
      state.editing = true;
    })
    .addCase(exitOrganizationEditing, (state) => {
      state.editing = false;
    })
    // EditOrganization
    .addCase(editOrganizationAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(editOrganizationAction.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.currentOrg.org = payload;
      state.isOrgFromPortal = !!payload.id;
    })
    .addCase(editOrganizationAction.rejected, (state) => {
      state.pending = false;
      state.isOrgFromPortal = false;
    })
    // GetOrganization
    .addCase(getOrganizationAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(getOrganizationAction.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.currentOrg = payload;
      state.isOrgFromPortal = !!payload.org.id;
    })
    .addCase(getOrganizationAction.rejected, (state) => {
      state.pending = false;
      state.isOrgFromPortal = false;
    })
    // createServiceNowOrganization
    .addCase(createServiceNowOrganizationAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(createServiceNowOrganizationAction.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.isOrgFromPortal = false;
      state.currentOrg.org = payload.org;
    })
    .addCase(createServiceNowOrganizationAction.rejected, (state) => {
      state.pending = false;
      state.isOrgFromPortal = false;
    })
    // Search OrgMembers
    .addCase(searchOrgMembersAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(searchOrgMembersAction.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.members = payload;
    })
    .addCase(searchOrgMembersAction.rejected, (state) => {
      state.pending = false;
    })
    // Invite OrgMember
    .addCase(inviteOrgMemberAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(inviteOrgMemberAction.fulfilled, (state) => {
      state.pending = false;
    })
    .addCase(inviteOrgMemberAction.rejected, (state) => {
      state.pending = false;
    })
    // Bulk Invite OrgMember
    .addCase(bulkInviteOrgMembersAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(bulkInviteOrgMembersAction.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.invitedUsersResponse = payload;
    })
    .addCase(bulkInviteOrgMembersAction.rejected, (state) => {
      state.pending = false;
    })
    .addCase(clearBulkInvite.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.invitedUsersResponse = payload;
    })
    // Remove OrgMember
    .addCase(removeOrgMemberAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(removeOrgMemberAction.fulfilled, (state) => {
      state.pending = false;
    })
    .addCase(removeOrgMemberAction.rejected, (state) => {
      state.pending = false;
    })
    // Edit OrgMember
    .addCase(editOrgMemberAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(editOrgMemberAction.fulfilled, (state) => {
      state.pending = false;
    })
    .addCase(editOrgMemberAction.rejected, (state) => {
      state.pending = false;
    })
    // Get Entitlements
    .addCase(getEntitlementsAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(getEntitlementsAction.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.entitlements = payload;
    })
    .addCase(getEntitlementsAction.rejected, (state) => {
      state.pending = false;
    })
    // Get Tickets
    .addCase(getOrgTicketsAction.pending, (state) => {
      state.tickets.pending = true;
    })
    .addCase(getOrgTicketsAction.fulfilled, (state, { payload }) => {
      state.tickets.pending = false;
      state.tickets.list = payload;
    })
    .addCase(getOrgTicketsAction.rejected, (state) => {
      state.tickets.pending = false;
    })
    .addCase(setOrgTicketsLoadingAction, (state, { payload }) => {
      state.tickets.pending = payload;
    });
});
