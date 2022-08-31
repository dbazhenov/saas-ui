import axios, { Method } from 'axios';

const https = require('https');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export const serviceNowRequest = async (method: Method = 'post', data = {}) => {
  const username = process.env.SERVICENOW_LOGIN || '';
  const password = process.env.SERVICENOW_PASSWORD || '';
  const devUrl = process.env.SERVICENOW_DEV_URL || '';
  let response;

  try {
    response = await axios.post(devUrl, data, {
      auth: {
        username,
        password,
      },
      httpsAgent,
    });

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error) {
    // If we have a response for the error, pull out the relevant parts
    if (error.response) {
      response = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      };
    } else {
      // If we get here something else went wrong, so throw
      throw error;
    }
  }

  return response;
};
