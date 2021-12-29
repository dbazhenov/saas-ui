import { getUser } from 'pages/auth/getUser';

Cypress.Commands.add('generateServiceNowAccount', () => {
  cy.task('serviceNowRequest').then(({ data: { result } }) => {
    const { account, contacts } = result;
    const snAccount = {
      name: account.name,
      id: account.sys_id,
      admin1: undefined,
      admin2: undefined,
      technical: undefined,
    };

    contacts.forEach(({ email }) => {
      if (email.startsWith('admin')) {
        // eslint-disable-next-line chai-friendly/no-unused-expressions
        snAccount.admin1 ? (snAccount.admin2 = getUser(email)) : (snAccount.admin1 = getUser(email));
      } else {
        snAccount.technical = getUser(email);
      }
    });

    return cy.wrap(snAccount).as('snAccount');
  });
});
