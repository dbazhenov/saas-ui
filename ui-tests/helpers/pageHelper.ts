import { Page } from 'playwright-core';

const pageHelper = {
  async getAccessToken(page: Page): Promise<string> {
    return page.evaluate(() => {
      const token = JSON.parse(localStorage.getItem('okta-token-storage'));

      return token.accessToken.accessToken;
    });
  },
};

export default pageHelper;
