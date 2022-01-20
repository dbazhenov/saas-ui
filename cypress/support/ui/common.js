import { popUp } from 'pages/common/selectors';

// Assert that previous element is visible
Cypress.Commands.add('isVisible', { prevSubject: 'element' }, ($element) => {
  cy.wrap($element).should('be.visible');
});

// Assert that previous element is disabled
Cypress.Commands.add('isDisabled', { prevSubject: 'element' }, ($element) => {
  cy.wrap($element).should('be.disabled');
});

// Assert that previous element is enabled
Cypress.Commands.add('isEnabled', { prevSubject: 'element' }, ($element) => {
  cy.wrap($element).should('be.enabled');
});

// Assert that previous element contains passed text
Cypress.Commands.add('hasText', { prevSubject: 'element' }, ($element, text) => {
  cy.wrap($element).should('have.text', text);
});

// Assert that previous element contains passed attribute and value
Cypress.Commands.add('hasAttr', { prevSubject: 'element' }, ($element, key, value) => {
  cy.wrap($element).should('have.attr', key, value);
});

// Assert that previous element contains passed attribute and value
Cypress.Commands.add('checkPopUpMessage', (message) => {
  popUp()
    .isVisible()
    .hasText(message)
    .then((element) => {
      element.next('button').click();
    });
});

Cypress.Commands.add('getTable', { prevSubject: true }, (subj, options = {}) => {
  // eslint-disable-next-line no-magic-numbers
  if (subj.get().length > 1) {
    throw new Error(`Selector "${subj.selector}" returned more than 1 element.`);
  }

  const tableElement = subj.get()[0];
  const tableHeaders = [...tableElement.querySelectorAll('thead th')].map((e) => e.textContent);
  const rows = [...tableElement.querySelectorAll('tbody tr')].map((row) =>
    [...row.querySelectorAll('td')].map((e) => e.textContent),
  );

  // return structured object from headers and rows variables
  return rows.map((row) =>
    row.reduce((acc, curr, idx) => {
      if (options.onlyColumns && !options.onlyColumns.includes(tableHeaders[idx])) {
        // don't include columns that are not present in onlyColumns
        return { ...acc };
      }

      return { ...acc, [tableHeaders[idx]]: curr };
    }, {}),
  );
});
