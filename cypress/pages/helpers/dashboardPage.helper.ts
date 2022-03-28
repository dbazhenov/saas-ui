import dashboardPage from 'pages/dashboard.page';
import { timeouts } from '../../fixtures/timeouts';

export const waitForDashboardToLoad = () => {
    cy.findAllByTestId(dashboardPage.locators.loadingOverlaySpinners, { timeout: timeouts.HALF_MIN }).should(
      'not.exist',
    );
};
