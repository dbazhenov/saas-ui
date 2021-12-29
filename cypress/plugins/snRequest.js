import dotenv from 'dotenv';

const axios = require('axios');

dotenv.config({ path: '.env.local' });
dotenv.config();

const username = process.env.SERVICENOW_LOGIN;
const password = process.env.SERVICENOW_PASSWORD;
const devUrl = process.env.SERVICENOW_DEV_URL;

export const serviceNowRequest = async (method = 'post', data = {}) => {
  let response;

  try {
    response = await axios({
      url: devUrl,
      auth: {
        username,
        password,
      },
      method,
      data,
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
