import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CachePolicies, UseFetchArgs } from 'use-http';
import { oktaAuth } from 'core';

const headers = {
  'Accept': 'application/json',
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

export function getUseHttpConfig(...args: UseFetchArgs): UseFetchArgs {

  const config: UseFetchArgs = [];
  const firstArg = args[0];
  const secondArg = args[1];
  const thirdArg = args[2];

  // NOTE: this dance with types is only dictated by a very unstraightforward interface of UseFetchArgs
  if (typeof firstArg === 'string') {
    config.push(firstArg);
  }

  if ((secondArg !== null && typeof secondArg === 'object') || secondArg === undefined) {
    config.push({
      cachePolicy: CachePolicies.NO_CACHE,
      interceptors: {
        request: async ({ options }: {
          // eslint-disable-next-line no-undef
          options: RequestInit;
          url?: string;
          path?: string;
          route?: string;
        }) => {
          const authState = oktaAuth?.authStateManager.getAuthState();
          const accessToken = authState?.accessToken?.accessToken;

          const opts = {
            ...options,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          };

          return opts;
        },
      },
      ...secondArg,
    });
  }

  if (Array.isArray(thirdArg)) {
    config.push(thirdArg);
  }

  return config;
};

export const Api = {
  axios,

  get: function get<T = any, R = AxiosResponse<T>>(
    path: string, config?: AxiosRequestConfig,
  ) {
    return axios.get<T, R extends void ? AxiosResponse<R> : AxiosResponse<R>>(path, getConfig(config));
  },

  post: function post<T = any, R = AxiosResponse<T>>(
    path: string, data?: any, config?: AxiosRequestConfig,
  ) {
    return axios.post<T, R extends void ? AxiosResponse<R> : AxiosResponse<R>>(path, data, getConfig(config));
  },

  put: function put<T = any, R = AxiosResponse<T>>(
    path: string, data?: any, config?: AxiosRequestConfig,
  ) {
    return axios.put<T, R extends void ? AxiosResponse<R> : AxiosResponse<R>>(path, data, getConfig(config));
  },

  del: function del<T = any, R = AxiosResponse<T>>(path: string, config?: AxiosRequestConfig) {
    return axios.put<T, R extends void ? AxiosResponse<R> : AxiosResponse<R>>(path, getConfig(config));
  },
};
