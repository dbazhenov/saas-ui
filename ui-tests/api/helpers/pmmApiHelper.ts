import { APIRequestContext, APIResponse, expect, request } from '@playwright/test';

export const pmmAddress = process.env.PMM_ADDRESS || 'http://pmm.local';

interface RequestParams {
  path: string;
  data?: any;
}

const pmmApiHelper = {
  async post(params: RequestParams) {
    const ctx = await getRequestContext();

    return ctx
      .post(params.path, { data: params.data })
      .then((response: APIResponse) => checkAndReturnResponse(response))
      .catch(throwRequestError);
  },
};

export const getToken = (username = 'admin', password = 'admin') =>
  Buffer.from(`${username}:${password}`).toString('base64');

const getRequestContext = async (): Promise<APIRequestContext> => {
  const opts = {
    baseURL: pmmAddress,
    extraHTTPHeaders: { Authorization: `Basic ${getToken()}` },
  };

  return request.newContext(opts);
};

const throwRequestError = (e) => {
  throw new Error(`Failed to execute request. Error: ${e}`);
};

const checkAndReturnResponse = async (r: APIResponse) => {
  if (r.ok() === true) {
    return r.json();
  }

  expect(r.status(), `Received response code: ${r.status()} with message: ${r.statusText()}`).toEqual(200);

  return null;
};

export default pmmApiHelper;
