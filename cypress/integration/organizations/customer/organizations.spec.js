import { timeouts } from '../../../fixtures/timeouts';

context('Percona Customer', () => {
  beforeEach(() => {
    cy.generateServiceNowAccount();
    cy.get('@snAccount').then((account) => {
      cy.oktaCreateUser(account.admin1);
      cy.loginByOktaApi(account.admin1.email, account.admin1.password);
    });
  });

  it('organization is created automatically', () => {
    cy.contains('View Organization', { timeout: timeouts.HALF_MIN }).should('be.visible').click();
    cy.get('@snAccount').then((account) => {
      cy.contains('Organization Name').find('strong').should('have.text', account.name);
    });

    cy.findByTestId('info-wrapper').should(
      'have.text',
      'We found your organization on Percona Customer Portal and used it',
    );
  });
});
