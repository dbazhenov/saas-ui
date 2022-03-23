import { Api, ENDPOINTS } from 'core/api';
import { GetProfileResponse, RequestBody, UpdateProfileRequest } from './types';

const { Auth, Org } = ENDPOINTS;

export const signOut = () => Api.post<RequestBody>(Auth.SignOut, {});

export const getProfile = () => Api.post<RequestBody, GetProfileResponse>(Auth.GetProfile, {});

export const updateProfile = ({ firstName, lastName }: UpdateProfileRequest) =>
  Api.post<UpdateProfileRequest, UpdateProfileRequest>(Auth.UpdateProfile, { firstName, lastName });

export const getUserCompany = () => Api.post<RequestBody, { name: string }>(Org.getUserCompany);
