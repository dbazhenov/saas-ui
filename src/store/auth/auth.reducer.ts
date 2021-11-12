import { createAsyncAction, ActionType, getType } from 'typesafe-actions';
import { AuthState, UpdateProfilePayload } from 'store/types';
import { RequestError } from 'core/api/types';

const DEFAULT_STATE: AuthState = {
  authenticated: false,
  email: undefined,
  firstName: undefined,
  lastName: undefined,
  pending: false,
  authCheckCompleted: false,
};

export const authLoginAction = createAsyncAction(
  'LOGIN_USER_REQUEST',
  'LOGIN_USER_SUCCESS',
  'LOGIN_USER_FAILURE',
)<undefined, undefined, RequestError>();

export const authLogoutAction = createAsyncAction(
  'LOGOUT_USER_REQUEST',
  'LOGOUT_USER_SUCCESS',
  'LOGOUT_USER_FAILURE',
)<undefined, undefined, RequestError>();

export const authGetProfileAction = createAsyncAction(
  'GET_PROFILE_USER_REQUEST',
  'GET_PROFILE_USER_SUCCESS',
  'GET_PROFILE_USER_FAILURE',
)<undefined, Pick<AuthState, 'email' | 'firstName' | 'lastName'>, RequestError>();

export const authUpdateProfileAction = createAsyncAction(
  'UPDATE_PROFILE_USER_REQUEST',
  'UPDATE_PROFILE_USER_SUCCESS',
  'UPDATE_PROFILE_USER_FAILURE',
)<UpdateProfilePayload, UpdateProfilePayload, RequestError>();

export type AuthActions = (
  ActionType<typeof authLoginAction>
  | ActionType<typeof authLogoutAction>
  | ActionType<typeof authGetProfileAction>
  | ActionType<typeof authUpdateProfileAction>
);

export function authReducer(state: AuthState = DEFAULT_STATE, action: AuthActions): AuthState {
  switch (action.type) {
    // Login
    case getType(authLoginAction.request):
      return {
        ...state,
        pending: true,
      };
    case getType(authLoginAction.success):
      return {
        ...state,
        authenticated: true,
        pending: false,
      };
    case getType(authLoginAction.failure):
      return {
        ...state,
        authenticated: false,
        email: undefined,
        pending: false,
      };
    // Logout
    case getType(authLogoutAction.request):
      return {
        ...state,
        pending: true,
      };
    case getType(authLogoutAction.success):
      return {
        ...state,
        authenticated: false,
        email: undefined,
        pending: false,
      };
    case getType(authLogoutAction.failure):
      return {
        ...state,
        pending: false,
      };
    // Get Profile
    case getType(authGetProfileAction.request):
      return {
        ...state,
        pending: true,
      };
    case getType(authGetProfileAction.success):
      return {
        ...state,
        authenticated: true,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        pending: false,
        authCheckCompleted: true,
      };
    case getType(authGetProfileAction.failure):
      return {
        ...state,
        authenticated: false,
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        pending: false,
        authCheckCompleted: true,
      };
    // Update Profile
    case getType(authUpdateProfileAction.request):
      return {
        ...state,
        pending: true,
      };
    case getType(authUpdateProfileAction.success):
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        pending: false,
      };
    case getType(authUpdateProfileAction.failure):
      return {
        ...state,
        pending: false,
      };
    default:
      return state;
  }
}
