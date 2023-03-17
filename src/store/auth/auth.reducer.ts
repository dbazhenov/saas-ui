import { createReducer } from '@reduxjs/toolkit';
import { getUserRoleAction } from 'store/orgs';
import { AuthState } from 'store/types';
import { getUserCompanyAction, updateUserInfoAction } from '.';
import { getProfileAction, loginAction, updateProfileAction } from './auth.actions';

const DEFAULT_STATE: AuthState = {
  email: undefined,
  firstName: undefined,
  lastName: undefined,
  companyName: '',
  orgRole: '',
  pending: false,
};

export const authReducer = createReducer<AuthState>(DEFAULT_STATE, (builder) => {
  builder
    // Login
    .addCase(loginAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(loginAction.fulfilled, (state) => {
      state.pending = false;
    })
    .addCase(loginAction.rejected, (state) => {
      state.pending = false;
      state.email = undefined;
    })
    /* Logout Action is not present, since the state gets re-initialized due to a redirect
     **
     */
    // Get User - special sync actions for AuthMiddleware
    .addCase(updateUserInfoAction, (state, { payload }) => {
      state.email = payload.email;
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.pending = false;
    })
    // Get Profile
    .addCase(getProfileAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(getProfileAction.fulfilled, (state, { payload }) => {
      state.email = payload.email;
      state.firstName = payload.first_name;
      state.lastName = payload.last_name;
      state.pending = false;
    })
    .addCase(getProfileAction.rejected, (state) => {
      state.pending = false;
    })
    // Update Profile
    .addCase(updateProfileAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(updateProfileAction.fulfilled, (state, { payload }) => {
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.pending = false;
    })
    .addCase(updateProfileAction.rejected, (state) => {
      state.pending = false;
    })
    // User role
    .addCase(getUserRoleAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(getUserRoleAction.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.orgRole = payload;
    })
    .addCase(getUserRoleAction.rejected, (state) => {
      state.pending = false;
    })
    // User company
    .addCase(getUserCompanyAction.pending, (state) => {
      state.pending = true;
    })
    .addCase(getUserCompanyAction.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.companyName = payload;
    })
    .addCase(getUserCompanyAction.rejected, (state) => {
      state.pending = false;
      state.companyName = '';
    });
});
