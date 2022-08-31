import { Page } from '@playwright/test';

export const routeHelper = {
  async interceptBackEndCall(page: Page, interceptedRoute: string, data = {}) {
    await page.route(interceptedRoute, async (route) => {
      await route.fulfill({
        body: JSON.stringify(data),
        contentType: 'application/json',
        headers: {},
      });
    });
  },
  async getBackEndCallResponse(page: Page, interceptedRoute: string) {
    await page.route(interceptedRoute, async (route) => {
      const response = await page.request.fetch(route.request());

      return response.body;
    });
  },
};
