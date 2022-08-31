import { expect, request } from '@playwright/test';
import { APIRequestContext } from 'playwright-core';
import config from '@root/playwright.config';

const throwPortalRequestError = (e) => {
  throw new Error(`Failed to execute portal request. Error: ${e}`);
};

const checkAndReturnResponse = (r) => {
  expect(r.ok()).toBeTruthy();

  return r.json();
};

export interface RequestParams {
  baseURL: string;
  path: string;
  data?: any;
  accessToken?: string;
}

export const getRequestContext = async ({
  accessToken,
}: {
  baseURL?: string;
  accessToken?: string;
}): Promise<APIRequestContext> => {
  const opts = {
    baseURL: config.use!.baseURL!,
    extraHTTPHeaders: undefined,
  };

  if (accessToken) opts.extraHTTPHeaders = { Authorization: `Bearer ${accessToken}` };

  return request.newContext(opts);
};

export const portalAPIHelper = {
  async post(params: RequestParams) {
    const ctx = await getRequestContext(params);

    return ctx
      .post(params.path, { data: params.data })
      .then(checkAndReturnResponse)
      .catch(throwPortalRequestError);
  },
  async put(params: RequestParams) {
    const ctx = await getRequestContext(params);

    return ctx
      .put(params.path, { data: params.data })
      .then(checkAndReturnResponse)
      .catch(throwPortalRequestError);
  },
  async get(params: RequestParams) {
    const ctx = await getRequestContext(params);

    return ctx.get(params.path).then(checkAndReturnResponse).catch(throwPortalRequestError);
  },
  async delete(params: RequestParams) {
    const ctx = await getRequestContext(params);

    return ctx.delete(params.path).then(checkAndReturnResponse).catch(throwPortalRequestError);
  },
};
