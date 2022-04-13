import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { logger } from '@percona/platform-core';
import { displayAndLogError } from 'core';
import { Messages } from 'core/api';
import * as OrgAPI from 'core/api/orgs';
import {
  AppState,
  EditMemberPayload,
  InviteMemberPayload,
  Organization,
  OrgMember,
  PmmInstance,
  RemoveMemberPayload,
  OrganizationViewTabs,
} from 'store/types';
import { GetOrganizationResponse, CreateOrganizationResponse, OrganizationEntitlement, OrganizationResponse } from 'core/api/types';
import { Messages as OrgMessages } from 'pages/ManageOrganization/ManageOrganization.messages';
import { OrgTicket } from 'pages/Dashboard/TicketList/TicketList.types';
import { mapOrgTickets } from 'pages/Dashboard/TicketList/TicketList.utils';
import { getCurrentUserRole, getFirstOrgId } from './orgs.selectors';
import { transformInventory, transformOrganizations, transformOrgMembers } from './orgs.utils';

export const getInventoryAction = createAsyncThunk<PmmInstance[], string>(
  'ORGS:INVENTORY/SEARCH',
  async (orgId, { rejectWithValue }) => {
    try {
      const { data } = await OrgAPI.searchOrgInventory(orgId);

      return transformInventory(data.inventory);
    } catch (err) {
      toast.error(Messages.getOrgsInventoryFailed);
      console.error(err);

      return rejectWithValue(err);
    }
  },
);

export const getEntitlementsAction = createAsyncThunk<OrganizationEntitlement[], string>(
  'ORGS:ENTITLEMENTS/SEARCH',
  async (orgId, { rejectWithValue }) => {
    try {
      const { data } = await OrgAPI.searchOrgEntitlements(orgId);

      return data.entitlements;
    } catch (err) {
      console.error(err);

      return rejectWithValue(err);
    }
  },
);

export const getOrganizationAction = createAsyncThunk<GetOrganizationResponse, string>(
  'ORGS:ORGANIZATION/GET',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await OrgAPI.getOrganization(payload);

      return data;
    } catch (err) {
      displayAndLogError(err);

      return rejectWithValue(err);
    }
  },
);

export const getServiceNowOrganizationAction = createAsyncThunk<
  CreateOrganizationResponse,
  string,
  { state: AppState; rejectValue: unknown }
>('ORGS:SN_ORGANIZATION/GET', async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await OrgAPI.getServiceNowOrganization(payload);

      await dispatch(getOrganizationAction(data.org.id));
      await dispatch(searchOrgMembersAction({ orgId: data.org.id }));

      toast.info(Messages.fromCustomerPortal, { autoClose: false });

      return data;
    } catch (err) {
      displayAndLogError(err);

      return rejectWithValue(err);
    }
  },
);

export const createOrganizationAction = createAsyncThunk<
  OrganizationResponse,
  string,
  { rejectValue: unknown }
>('ORGS:ORGANIZATION/CREATE', async (payload, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await OrgAPI.createOrganization(payload);

    await dispatch(searchOrgsAction());
    toast.success(OrgMessages.orgCreateSuccess);

    return data.org;
  } catch (err: any) {
    displayAndLogError(err);

    return rejectWithValue(err);
  }
});

export const enterOrganizationEditing = createAction('ORGS:ORGANIZATION/EDITING/on');
export const exitOrganizationEditing = createAction('ORGS:ORGANIZATION/EDITING/off');

export const setOrgViewActiveTab = createAction<OrganizationViewTabs>('ORGS:VIEW/SET_ACTIVE_TAB');

export const setOrgDetailsSeen = createAction('ORGS:DETAILS/SET_SEEN/true');

export const editOrganizationAction = createAsyncThunk<
  OrganizationResponse,
  { orgId: string, name: string },
  { rejectValue: unknown }
>('ORGS:ORGANIZATION/EDIT', async (payload, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await OrgAPI.editOrganization(payload.orgId, payload.name);

    await dispatch(searchOrgsAction());
    dispatch(exitOrganizationEditing());
    toast.success(OrgMessages.orgEditSuccess);

    return data.org;
  } catch (err: any) {
    displayAndLogError(err);

    return rejectWithValue(err);
  }
});

export const searchOrgsAction = createAsyncThunk<Organization[], void>(
  'ORGS:ORGANIZATIONS/SEARCH',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await OrgAPI.searchOrgs();

      return transformOrganizations(data.orgs);
    } catch (err) {
      toast.error(Messages.getUserOrgsFailed);
      logger.error(err);

      return rejectWithValue(err);
    }
  },
);

export const searchOrgMembersAction = createAsyncThunk<OrgMember[], { orgId: string; username?: string }>(
  'ORGS:MEMBERS/SEARCH',
  async (searchBy, { rejectWithValue }) => {
    try {
      const { data } = await OrgAPI.searchOrgMembers(searchBy.orgId, searchBy.username);

      return transformOrgMembers(data.members);
    } catch (err) {
      toast.error(Messages.getOrgMembersFailed);
      logger.error(err);

      return rejectWithValue(err);
    }
  },
);

export const getUserRoleAction = createAsyncThunk<
  string | undefined,
  string | undefined,
  { state: AppState; rejectValue: unknown }
>('ORGS:MEMBERS/GET_CURRENT_USER_ROLE', async (_, { rejectWithValue, getState, dispatch }) => {
  try {
    let orgId = getFirstOrgId(getState());

    // If no orgs found in the store, then fetch
    if (!orgId) {
      await dispatch(searchOrgsAction());
      orgId = getFirstOrgId(getState());
    }

    // The user is not part of any organization
    if (!orgId) {
      return undefined;
    }

    /**
     * This was used before to get a current user's role, but turned out to be redundant,
     * since we have to fetch all users anyway and we can retrieve the current user's role from the state
     */
    // const { email: username } = getAuth(getState());
    // await dispatch(searchOrgMembersAction({ orgId: orgId!, username }));

    await dispatch(searchOrgMembersAction({ orgId }));

    return getCurrentUserRole(getState());
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const inviteOrgMemberAction = createAsyncThunk<void, InviteMemberPayload>(
  'ORGS:MEMBER/INVITE',
  async (payload, { dispatch }) => {
    try {
      await OrgAPI.inviteOrgMember(payload);
      toast.success(OrgMessages.inviteMemberSuccess);

      await dispatch(searchOrgMembersAction({ orgId: payload.orgId }));
    } catch (err: any) {
      displayAndLogError(err);
    }
  },
);

export const removeOrgMemberAction = createAsyncThunk<void, RemoveMemberPayload>(
  'ORGS:MEMBER/REMOVE',
  async (payload, { dispatch }) => {
    try {
      await OrgAPI.removeOrgMember(payload);
      toast.success(OrgMessages.removeMemberSuccess);

      await dispatch(searchOrgMembersAction({ orgId: payload.orgId }));
    } catch (err) {
      displayAndLogError(err);
    }
  },
);

export const editOrgMemberAction = createAsyncThunk<void, EditMemberPayload>(
  'ORGS:MEMBER/EDIT',
  async (payload, { dispatch }) => {
    try {
      await OrgAPI.editOrgMember(payload);
      toast.success(OrgMessages.editMemberSuccess);

      dispatch(searchOrgMembersAction({ orgId: payload.orgId }));
    } catch (err) {
      displayAndLogError(err);
    }
  },
);

export const getOrgTicketsAction = createAsyncThunk<
  OrgTicket[],
  void,
  { state: AppState; rejectValue: unknown }
>('ORGS:TICKETS/SEARCH', async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    let orgId = getFirstOrgId(getState());

    if (!orgId) {
      await dispatch(searchOrgsAction());
      orgId = getFirstOrgId(getState());
    }

    const { data } = await OrgAPI.searchOrgTickets(orgId);

    return mapOrgTickets(data.tickets);
  } catch (err) {
    displayAndLogError(err);

    return rejectWithValue(err);
  }
});
