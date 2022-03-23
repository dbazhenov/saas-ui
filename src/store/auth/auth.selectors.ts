import { createSelector } from '@reduxjs/toolkit';
import { AppState } from 'store/types';

export const getAuth = (state: AppState) => state.auth;

export const getUserOrgRole = (state: AppState) => state.auth.orgRole;

export const getUserEmail = (state: AppState) => state.auth.email || '';

export const getUserCompanyName = (state: AppState) => state.auth.companyName || '';

export const getIsPerconaCustomer = createSelector(getUserCompanyName, (companyName) => !!companyName);

export const getIsUserPending = (state: AppState) => state.auth.pending;
