import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { oktaAuth } from 'core';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const axiosConfig = {
  withCredentials: true,
  headers,
};

const getConfig = (config?: AxiosRequestConfig) => {
  const authState = oktaAuth?.authStateManager.getAuthState();

  const accessToken = authState?.accessToken?.accessToken;

  if (!accessToken) {
    return { ...axiosConfig, ...config };
  }

  return {
    ...axiosConfig,
    headers: { ...headers, Authorization: `Bearer ${accessToken}` },
  };
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      oktaAuth.signOut({ revokeAccessToken: true, revokeRefreshToken: true });
    }

    return error;
  },
);

export const Api = {
  axios,

  get: function get<T = any, R = AxiosResponse<T>>(path: string, config?: AxiosRequestConfig) {
    return axios.get<T, R extends void ? AxiosResponse<R> : AxiosResponse<R>>(path, getConfig(config));
  },

  post: function post<T = any, R = AxiosResponse<T>>(path: string, data?: any, config?: AxiosRequestConfig) {
    return axios.post<T, R extends void ? AxiosResponse<R> : AxiosResponse<R>>(path, data, getConfig(config));
  },

  put: function put<T = any, R = AxiosResponse<T>>(path: string, data?: any, config?: AxiosRequestConfig) {
    return axios.put<T, R extends void ? AxiosResponse<R> : AxiosResponse<R>>(path, data, getConfig(config));
  },

  del: function del<T = any, R = AxiosResponse<T>>(path: string, config?: AxiosRequestConfig) {
    return axios.delete<T, R extends void ? AxiosResponse<R> : AxiosResponse<R>>(path, getConfig(config));
  },
};
